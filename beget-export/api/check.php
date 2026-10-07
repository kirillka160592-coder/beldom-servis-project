<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

echo "PHP: " . PHP_VERSION . "\n";
echo "pdo_mysql: " . (extension_loaded('pdo_mysql') ? 'есть' : 'НЕТ') . "\n";

$cfg = __DIR__ . '/config.php';
echo "config.php: " . (file_exists($cfg) ? 'найден' : 'НЕ НАЙДЕН') . "\n";
if (!file_exists($cfg)) exit;

require_once $cfg;
echo "DB_NAME: " . DB_NAME . "\n";
echo "DB_USER: " . DB_USER . "\n";
echo "Заглушки в config: " . ((DB_NAME === 'user_dbname' || DB_PASS === 'your_password') ? 'ДА, данные не заполнены' : 'нет') . "\n";

try {
    $pdo = db();
    echo "Подключение к базе: OK\n";
    foreach (['admin_users', 'admin_sessions', 'content_blocks', 'news', 'media_library'] as $t) {
        try {
            $n = $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
            echo "Таблица $t: $n строк\n";
        } catch (Throwable $e) {
            echo "Таблица $t: НЕТ ({$e->getMessage()})\n";
        }
    }
} catch (Throwable $e) {
    echo "Подключение к базе: ОШИБКА\n" . $e->getMessage() . "\n";
}

echo "uploads: " . (is_dir(__DIR__ . '/../uploads') ? (is_writable(__DIR__ . '/../uploads') ? 'есть, запись разрешена' : 'есть, НЕТ прав на запись') : 'папки нет') . "\n";
