<?php
session_start();
header('Content-Type: application/json');

$ADMIN_PASSWORD = 'admin'; // Simple password for now

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['password']) && $data['password'] === $ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['logout'])) {
        session_destroy();
        echo json_encode(['success' => true]);
        exit;
    }
    echo json_encode(['logged_in' => isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true]);
    exit;
}
?>
