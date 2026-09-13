<?php
// Авторизация администратора: вход по логину/паролю, проверка сессии, выход.
require_once __DIR__ . '/config.php';
handle_preflight();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pdo = db();

function verify_password_php(string $password, string $storedHash): bool {
    // Формат хеша, унаследованный от Python: "salt_hex$hash_hex" (pbkdf2_hmac sha256, 200000 итераций)
    $parts = explode('$', $storedHash);
    if (count($parts) !== 2) return false;
    [$saltHex, $hashHex] = $parts;
    $salt = hex2bin($saltHex);
    $expected = hex2bin($hashHex);
    $computed = hash_pbkdf2('sha256', $password, $salt, 200000, 32, true);
    return hash_equals($expected, $computed);
}

if ($method === 'POST' && $action === 'login') {
    $body = read_json_body();
    $login = trim($body['login'] ?? '');
    $password = $body['password'] ?? '';

    $stmt = $pdo->prepare('SELECT id, password_hash FROM admin_users WHERE login = ?');
    $stmt->execute([$login]);
    $row = $stmt->fetch();

    if (!$row || !verify_password_php($password, $row['password_hash'])) {
        json_response(401, ['error' => 'Неверный логин или пароль']);
    }

    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 7 * 24 * 3600);
    $stmt = $pdo->prepare('INSERT INTO admin_sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$row['id'], $token, $expiresAt]);

    json_response(200, ['token' => $token, 'login' => $login]);
}

if ($method === 'GET' && $action === 'me') {
    $token = get_bearer_token();
    if (!$token) json_response(401, ['error' => 'Нет токена']);

    $stmt = $pdo->prepare(
        'SELECT u.login FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id ' .
        'WHERE s.token = ? AND s.expires_at > NOW()'
    );
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    if (!$row) json_response(401, ['error' => 'Сессия истекла']);

    json_response(200, ['login' => $row['login']]);
}

if ($method === 'POST' && $action === 'logout') {
    $token = get_bearer_token();
    if ($token) {
        $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token = ?');
        $stmt->execute([$token]);
    }
    json_response(200, ['ok' => true]);
}

json_response(400, ['error' => 'Неизвестное действие']);
