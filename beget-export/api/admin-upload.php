<?php
// Загрузка файлов (изображения, PDF, Word, Excel) на диск хостинга + медиабиблиотека сайта.
// GET — список файлов (требует авторизации). POST — загрузить новый файл (base64).
// DELETE — удалить запись из библиотеки (сам файл на диске не удаляется).
require_once __DIR__ . '/config.php';
handle_preflight();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

$ALLOWED_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'application/pdf' => 'pdf',
    'application/msword' => 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
    'application/vnd.ms-excel' => 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
];

if (!check_auth($pdo)) json_response(401, ['error' => 'Требуется авторизация']);

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, url, filename, label, content_type, created_at FROM media_library ORDER BY created_at DESC');
    $result = [];
    foreach ($stmt->fetchAll() as $r) {
        $result[] = [
            'id' => (int) $r['id'],
            'url' => $r['url'],
            'filename' => $r['filename'],
            'label' => $r['label'],
            'contentType' => $r['content_type'],
            'createdAt' => $r['created_at'],
        ];
    }
    json_response(200, $result);
}

if ($method === 'POST') {
    $body = read_json_body();
    $contentType = $body['contentType'] ?? 'image/jpeg';
    $dataB64 = $body['data'] ?? '';
    $filename = $body['filename'] ?? '';
    $label = $body['label'] ?? '';

    if (!isset($ALLOWED_TYPES[$contentType])) {
        json_response(400, ['error' => 'Недопустимый тип файла']);
    }
    $ext = $ALLOWED_TYPES[$contentType];

    $raw = base64_decode($dataB64, true);
    if ($raw === false) {
        json_response(400, ['error' => 'Некорректные данные файла']);
    }

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    $key = 'media_' . bin2hex(random_bytes(16)) . '.' . $ext;
    $filePath = UPLOAD_DIR . '/' . $key;
    file_put_contents($filePath, $raw);

    $fileUrl = rtrim(UPLOAD_URL, '/') . '/' . $key;

    $stmt = $pdo->prepare(
        'INSERT INTO media_library (url, filename, label, content_type) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$fileUrl, $filename, $label, $contentType]);

    json_response(200, [
        'id' => (int) $pdo->lastInsertId(),
        'url' => $fileUrl,
        'filename' => $filename,
        'label' => $label,
        'contentType' => $contentType,
        'createdAt' => date('Y-m-d H:i:s'),
    ]);
}

if ($method === 'DELETE') {
    $mediaId = $_GET['id'] ?? null;
    if (!$mediaId) json_response(400, ['error' => 'Не указан id']);

    $stmt = $pdo->prepare('DELETE FROM media_library WHERE id = ?');
    $stmt->execute([$mediaId]);

    json_response(200, ['ok' => true]);
}

json_response(405, ['error' => 'Метод не поддерживается']);
