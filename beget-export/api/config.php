<?php
// ЗАПОЛНИТЕ данными вашей базы MySQL из панели Beget (Базы данных -> MySQL)
define('DB_HOST', 'localhost');
define('DB_NAME', 'user_dbname');   // имя базы, созданной в панели Beget
define('DB_USER', 'user_dbuser');   // пользователь MySQL из панели Beget
define('DB_PASS', 'your_password'); // пароль от базы MySQL

// Папка, куда сохраняются загруженные картинки и документы (должна существовать и быть доступна на запись)
define('UPLOAD_DIR', __DIR__ . '/../uploads');
// Публичный URL этой папки (замените на ваш домен)
define('UPLOAD_URL', 'https://ВАШ-ДОМЕН.ru/uploads');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function send_cors(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Authorization');
    header('Access-Control-Max-Age: 86400');
}

function json_response(int $status, array $data): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function get_bearer_token(): string {
    $header = $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
    return trim(str_replace('Bearer ', '', $header));
}

function check_auth(PDO $pdo): bool {
    $token = get_bearer_token();
    if (!$token) return false;
    $stmt = $pdo->prepare('SELECT 1 FROM admin_sessions WHERE token = ? AND expires_at > NOW()');
    $stmt->execute([$token]);
    return (bool) $stmt->fetchColumn();
}

function handle_preflight(): void {
    send_cors();
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
