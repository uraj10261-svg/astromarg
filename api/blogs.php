<?php
session_start();
header('Content-Type: application/json');

$file = '../data/blogs.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
    exit;
}

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$blogs = json_decode(file_get_contents($file), true) ?: [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Edit existing or add new
    if (isset($data['id'])) {
        // Edit
        foreach ($blogs as &$blog) {
            if ($blog['id'] === $data['id']) {
                $blog['title'] = $data['title'];
                $blog['content'] = $data['content'];
                $blog['slug'] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
                if(isset($data['image'])) { $blog['image'] = $data['image']; }
                break;
            }
        }
    } else {
        // Add new
        $data['id'] = uniqid();
        $data['date'] = date('Y-m-d H:i:s');
        $data['slug'] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        array_unshift($blogs, $data); // Add to beginning
    }
    
    file_put_contents($file, json_encode($blogs, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['id'])) {
        $blogs = array_filter($blogs, function($blog) use ($data) {
            return $blog['id'] !== $data['id'];
        });
        file_put_contents($file, json_encode(array_values($blogs), JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    }
    exit;
}
?>
