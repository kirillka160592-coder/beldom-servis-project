import json
import os
import base64
import uuid

import psycopg2
import boto3


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}

ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}


def check_auth(event) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization') or (event.get('headers') or {}).get('x-authorization') or ''
    token = token.replace('Bearer ', '').strip()
    if not token:
        return False
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM admin_sessions WHERE token = %s AND expires_at > NOW()", (token,))
        return cur.fetchone() is not None
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """Загрузка изображения (base64) в файловое хранилище, возвращает публичную CDN-ссылку."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    headers = {**CORS_HEADERS, 'Content-Type': 'application/json'}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

    body = json.loads(event.get('body') or '{}')
    content_type = body.get('contentType', 'image/jpeg')
    data_b64 = body.get('data', '')

    ext = ALLOWED_TYPES.get(content_type)
    if not ext:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недопустимый тип файла'})}

    try:
        raw = base64.b64decode(data_b64)
    except Exception:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Некорректные данные файла'})}

    key = f"news/{uuid.uuid4().hex}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'url': cdn_url})}
