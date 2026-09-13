<?php
// CRUD новостей. GET доступен всем (публичная лента), POST/PUT/DELETE требуют авторизации.
require_once __DIR__ . '/config.php';
handle_preflight();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

function news_row_to_array(array $row): array {
    return [
        'id' => (int) $row['id'],
        'category' => $row['category'],
        'date' => $row['news_date'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'body' => json_decode($row['body'], true),
        'addresses' => $row['addresses'],
        'images' => json_decode($row['images'], true),
    ];
}

if ($method === 'GET') {
    $newsId = $_GET['id'] ?? null;

    if ($newsId) {
        $stmt = $pdo->prepare('SELECT * FROM news WHERE id = ?');
        $stmt->execute([$newsId]);
        $row = $stmt->fetch();
        if (!$row) json_response(404, ['error' => 'Новость не найдена']);
        json_response(200, news_row_to_array($row));
    }

    $stmt = $pdo->query('SELECT * FROM news ORDER BY news_date DESC, id DESC');
    $result = array_map('news_row_to_array', $stmt->fetchAll());
    json_response(200, $result);
}

if ($method === 'POST') {
    if (!check_auth($pdo)) json_response(401, ['error' => 'Требуется авторизация']);

    $body = read_json_body();
    $stmt = $pdo->prepare(
        'INSERT INTO news (category, news_date, title, excerpt, body, addresses, images) ' .
        'VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $body['category'] ?? '',
        $body['date'] ?? null,
        $body['title'] ?? '',
        $body['excerpt'] ?? '',
        json_encode($body['body'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        $body['addresses'] ?? null,
        json_encode($body['images'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);

    json_response(200, ['id' => (int) $pdo->lastInsertId()]);
}

if ($method === 'PUT') {
    if (!check_auth($pdo)) json_response(401, ['error' => 'Требуется авторизация']);

    $body = read_json_body();
    $newsId = $body['id'] ?? null;
    if (!$newsId) json_response(400, ['error' => 'Не указан id']);

    $stmt = $pdo->prepare(
        'UPDATE news SET category = ?, news_date = ?, title = ?, excerpt = ?, ' .
        'body = ?, addresses = ?, images = ?, updated_at = NOW() WHERE id = ?'
    );
    $stmt->execute([
        $body['category'] ?? '',
        $body['date'] ?? null,
        $body['title'] ?? '',
        $body['excerpt'] ?? '',
        json_encode($body['body'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        $body['addresses'] ?? null,
        json_encode($body['images'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        $newsId,
    ]);

    json_response(200, ['ok' => true]);
}

if ($method === 'DELETE') {
    if (!check_auth($pdo)) json_response(401, ['error' => 'Требуется авторизация']);

    $newsId = $_GET['id'] ?? null;
    if (!$newsId) json_response(400, ['error' => 'Не указан id']);

    $stmt = $pdo->prepare('DELETE FROM news WHERE id = ?');
    $stmt->execute([$newsId]);

    json_response(200, ['ok' => true]);
}

json_response(405, ['error' => 'Метод не поддерживается']);
