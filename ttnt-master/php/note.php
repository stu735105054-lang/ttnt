<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../includes/db.php';

$action = $_POST['action'] ?? '';

try {
    if ($action === 'create') {
        $stmt = $pdo->prepare("INSERT INTO notes (project_id, title, content, status, created_by) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['project_id'],
            $_POST['title'],
            $_POST['content'],
            $_POST['status'],
            $_SESSION['user_id']
        ]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'update') {
        $stmt = $pdo->prepare("UPDATE notes SET title = ?, content = ?, status = ? WHERE id = ? AND (created_by = ? OR EXISTS (SELECT 1 FROM projects p WHERE p.id = (SELECT project_id FROM notes WHERE id = ?) AND p.owner_id = ?))");
        $stmt->execute([
            $_POST['title'],
            $_POST['content'],
            $_POST['status'],
            $_POST['note_id'],
            $_SESSION['user_id'],
            $_POST['note_id'],
            $_SESSION['user_id']
        ]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND (created_by = ? OR EXISTS (SELECT 1 FROM projects p WHERE p.id = (SELECT project_id FROM notes WHERE id = ?) AND p.owner_id = ?))");
        $stmt->execute([
            $_POST['note_id'],
            $_SESSION['user_id'],
            $_POST['note_id'],
            $_SESSION['user_id']
        ]);
        echo json_encode(['success' => true]);
    } else {
        throw new Exception("Hành động không hợp lệ");
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>