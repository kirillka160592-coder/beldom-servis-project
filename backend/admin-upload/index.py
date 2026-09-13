import json
import os
import base64
import uuid

import psycopg2
import psycopg2.extras
import boto3


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}

ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def check_auth(cur, event) -> bool:
    token = (event.get('headers') or {}).get('X-Authorization') or (event.get('headers') or {}).get('x-authorization') or ''
    token = token.replace('Bearer ', '').strip()
    if not token:
        return False
    cur.execute("SELECT 1 FROM admin_sessions WHERE token = %s AND expires_at > NOW()", (token,))
    return cur.fetchone() is not None


def handler(event: dict, context) -> dict:
    """Загрузка изображений в файловое хранилище и медиабиблиотека сайта.
    GET — список сохранённых изображений (требует авторизации).
    POST — загрузить новое изображение (base64), сохранить в S3 и в библиотеку, вернуть CDN-ссылку.
    DELETE — удалить запись из библиотеки (сам файл в S3 не удаляется).
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    headers = {**CORS_HEADERS, 'Content-Type': 'application/json'}
    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if not check_auth(cur, event):
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

        if method == 'GET':
            cur.execute("SELECT id, url, filename, label, created_at FROM media_library ORDER BY created_at DESC")
            rows = cur.fetchall()
            result = [
                {
                    'id': r['id'],
                    'url': r['url'],
                    'filename': r['filename'],
                    'label': r['label'],
                    'createdAt': r['created_at'].isoformat(),
                }
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            content_type = body.get('contentType', 'image/jpeg')
            data_b64 = body.get('data', '')
            filename = body.get('filename', '')
            label = body.get('label', '')

            ext = ALLOWED_TYPES.get(content_type)
            if not ext:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недопустимый тип файла'})}

            try:
                raw = base64.b64decode(data_b64)
            except Exception:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Некорректные данные файла'})}

            key = f"media/{uuid.uuid4().hex}.{ext}"

            s3 = boto3.client(
                's3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            )
            s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

            cur.execute(
                "INSERT INTO media_library (url, filename, label) VALUES (%s, %s, %s) RETURNING id, created_at",
                (cdn_url, filename, label),
            )
            row = cur.fetchone()
            conn.commit()

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'id': row['id'],
                    'url': cdn_url,
                    'filename': filename,
                    'label': label,
                    'createdAt': row['created_at'].isoformat(),
                }),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            media_id = params.get('id')
            if not media_id:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Не указан id'})}
            cur.execute("DELETE FROM media_library WHERE id = %s", (media_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Метод не поддерживается'})}
    finally:
        conn.close()
