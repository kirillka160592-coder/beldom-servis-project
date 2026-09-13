import json
import os
import hashlib
import binascii
import secrets
from datetime import datetime, timedelta, timezone

import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_hex, hash_hex = stored_hash.split('$')
    except ValueError:
        return False
    salt = binascii.unhexlify(salt_hex)
    expected = binascii.unhexlify(hash_hex)
    computed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 200000)
    return secrets.compare_digest(computed, expected)


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 200000)
    return binascii.hexlify(salt).decode() + '$' + binascii.hexlify(dk).decode()


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
    'Access-Control-Max-Age': '86400',
}


def handler(event: dict, context) -> dict:
    """Авторизация администратора: вход по логину/паролю, проверка и завершение сессии."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    headers = {**CORS_HEADERS, 'Content-Type': 'application/json'}
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    conn = get_conn()
    try:
        cur = conn.cursor()

        if method == 'POST' and action == 'login':
            body = json.loads(event.get('body') or '{}')
            login = (body.get('login') or '').strip()
            password = body.get('password') or ''

            cur.execute("SELECT id, password_hash FROM admin_users WHERE login = %s", (login,))
            row = cur.fetchone()
            if not row or not verify_password(password, row[1]):
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный логин или пароль'}),
                }

            user_id = row[0]
            token = secrets.token_hex(32)
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
            cur.execute(
                "INSERT INTO admin_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires_at),
            )
            conn.commit()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'token': token, 'login': login}),
            }

        if method == 'GET' and action == 'me':
            token = (event.get('headers') or {}).get('X-Authorization') or (event.get('headers') or {}).get('x-authorization') or ''
            token = token.replace('Bearer ', '').strip()
            if not token:
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Нет токена'})}

            cur.execute(
                "SELECT u.login FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id "
                "WHERE s.token = %s AND s.expires_at > NOW()",
                (token,),
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'login': row[0]})}

        if method == 'POST' and action == 'logout':
            token = (event.get('headers') or {}).get('X-Authorization') or (event.get('headers') or {}).get('x-authorization') or ''
            token = token.replace('Bearer ', '').strip()
            if token:
                cur.execute("DELETE FROM admin_sessions WHERE token = %s", (token,))
                conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неизвестное действие'})}
    finally:
        conn.close()