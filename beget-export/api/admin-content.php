<?php
// Чтение и обновление текстовых блоков сайта (услуги, о компании, контакты, раскрытие информации).
// GET без авторизации отдаёт блоки для публичных страниц. PUT требует авторизации.
require_once __DIR__ . '/config.php';
handle_preflight();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

if ($method === 'GET') {
    $section = $_GET['section'] ?? null;

    if ($section) {
        $stmt = $pdo->prepare('SELECT section, data FROM content_blocks WHERE section = ?');
        $stmt->execute([$section]);
        $row = $stmt->fetch();
        if (!$row) json_response(404, ['error' => 'Раздел не найден']);
        json_response(200, [$row['section'] => json_decode($row['data'], true)]);
    }

    $stmt = $pdo->query('SELECT section, data FROM content_blocks');
    $result = [];
    foreach ($stmt->fetchAll() as $row) {
        $result[$row['section']] = json_decode($row['data'], true);
    }
    json_response(200, $result);
}

if ($method === 'PUT') {
    if (!check_auth($pdo)) json_response(401, ['error' => 'Требуется авторизация']);

    $body = read_json_body();
    $section = $body['section'] ?? null;
    $data = $body['data'] ?? null;
    if (!$section || $data === null) {
        json_response(400, ['error' => 'Не указан раздел или данные']);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO content_blocks (section, data, updated_at) VALUES (?, ?, NOW()) ' .
        'ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()'
    );
    $stmt->execute([$section, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);

    json_response(200, ['ok' => true]);
}

json_response(405, ['error' => 'Метод не поддерживается']);
