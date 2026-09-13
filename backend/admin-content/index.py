import json
import os

import psycopg2


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
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
    """Чтение и обновление текстовых блоков сайта (услуги, о компании, контакты, раскрытие информации).
    GET без авторизации отдаёт все блоки для публичных страниц.
    PUT требует авторизации и обновляет один блок по имени раздела.
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    headers = {**CORS_HEADERS, 'Content-Type': 'application/json'}
    conn = get_conn()
    try:
        cur = conn.cursor()

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            section = params.get('section')
            if section:
                cur.execute("SELECT section, data FROM content_blocks WHERE section = %s", (section,))
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Раздел не найден'})}
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({row[0]: row[1]})}

            cur.execute("SELECT section, data FROM content_blocks")
            rows = cur.fetchall()
            result = {r[0]: r[1] for r in rows}
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}

        if method == 'PUT':
            if not check_auth(cur, event):
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

            body = json.loads(event.get('body') or '{}')
            section = body.get('section')
            data = body.get('data')
            if not section or data is None:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Не указан раздел или данные'})}

            cur.execute(
                "INSERT INTO content_blocks (section, data, updated_at) VALUES (%s, %s, NOW()) "
                "ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()",
                (section, json.dumps(data)),
            )
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Метод не поддерживается'})}
    finally:
        conn.close()
