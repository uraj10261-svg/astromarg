<?php
session_start();
header('Content-Type: application/json');

$file = '../data/settings.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $data = file_get_contents('php://input');
    // Basic validation
    if (json_decode($data) !== null) {
        file_put_contents($file, json_encode(json_decode($data), JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
    }
    exit;
}
?>
