<?php
session_start();
require_once '../includes/db.php';

// Lấy ghi chú đã xóa (trong thực tế có thể thêm cột `deleted_at`)
// Ở đây ta giả lập bằng cách không hiển thị trong project, nhưng vẫn có thể khôi phục nếu cần
// Bạn có thể thêm cột `is_deleted` vào bảng notes để quản lý tốt hơn

$stmt = $pdo->prepare("
    SELECT n.*, p.name as project_name
    FROM notes n
    JOIN projects p ON n.project_id = p.id
    WHERE n.created_by = ? AND n.is_deleted = 1
    ORDER BY n.updated_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$deletedNotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="../css/home.css" />
    <title>Trash - NoteBoard</title>
</head>
<body>
    <div class="main-wrapper">
        <!-- Sidebar giữ nguyên -->
        <?php include 'sidebar_partial.php'; ?>

        <div class="Tong">
            <div class="container">
                <h1><i class="fas fa-trash-can"></i> Trash</h1>
                <?php if (empty($deletedNotes)): ?>
                    <p>Không có ghi chú nào trong thùng rác.</p>
                <?php else: ?>
                    <div class="folder_con">
                        <?php foreach ($deletedNotes as $note): ?>
                        <div class="file-item">
                            <i class="fas fa-sticky-note"></i>
                            <?= htmlspecialchars($note['title']) ?> 
                            <span style="color:#9ca3af; font-size:12px;">(<?= htmlspecialchars($note['project_name']) ?>)</span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>