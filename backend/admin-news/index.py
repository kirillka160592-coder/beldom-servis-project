import json
import os

import psycopg2
import psycopg2.extras


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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


def row_to_dict(row) -> dict:
    return {
        'id': row['id'],
        'category': row['category'],
        'date': row['news_date'].isoformat(),
        'title': row['title'],
        'excerpt': row['excerpt'],
        'body': row['body'],
        'addresses': row['addresses'],
        'images': row['images'],
    }


def handler(event: dict, context) -> dict:
    """CRUD новостей. GET доступен всем (публичная лента), POST/PUT/DELETE требуют авторизации."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    headers = {**CORS_HEADERS, 'Content-Type': 'application/json'}
    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            if news_id:
                cur.execute("SELECT * FROM news WHERE id = %s", (news_id,))
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Новость не найдена'})}
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(row_to_dict(row))}

            cur.execute("SELECT * FROM news ORDER BY news_date DESC, id DESC")
            rows = cur.fetchall()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps([row_to_dict(r) for r in rows])}

        if method == 'POST':
            if not check_auth(cur, event):
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

            body = json.loads(event.get('body') or '{}')
            cur.execute(
                "INSERT INTO news (category, news_date, title, excerpt, body, addresses, images) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body.get('category', ''),
                    body.get('date'),
                    body.get('title', ''),
                    body.get('excerpt', ''),
                    json.dumps(body.get('body', [])),
                    body.get('addresses'),
                    json.dumps(body.get('images', [])),
                ),
            )
            new_id = cur.fetchone()['id']
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': new_id})}

        if method == 'PUT':
            if not check_auth(cur, event):
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

            body = json.loads(event.get('body') or '{}')
            news_id = body.get('id')
            if not news_id:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Не указан id'})}

            cur.execute(
                "UPDATE news SET category = %s, news_date = %s, title = %s, excerpt = %s, "
                "body = %s, addresses = %s, images = %s, updated_at = NOW() WHERE id = %s",
                (
                    body.get('category', ''),
                    body.get('date'),
                    body.get('title', ''),
                    body.get('excerpt', ''),
                    json.dumps(body.get('body', [])),
                    body.get('addresses'),
                    json.dumps(body.get('images', [])),
                    news_id,
                ),
            )
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if method == 'DELETE':
            if not check_auth(cur, event):
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Требуется авторизация'})}

            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            if not news_id:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Не указан id'})}

            cur.execute("DELETE FROM news WHERE id = %s", (news_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Метод не поддерживается'})}
    finally:
        conn.close()
