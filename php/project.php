<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

require_once '../includes/db.php';

$project_id = $_GET['id'] ?? 0;
if (!$project_id) die("Invalid project");

// Kiểm tra quyền truy cập
$stmt = $pdo->prepare("
    SELECT p.*, u.username as owner_name
    FROM projects p
    LEFT JOIN users u ON p.owner_id = u.id
    LEFT JOIN project_shares ps ON p.id = ps.project_id
    WHERE p.id = ? AND (p.owner_id = ? OR ps.user_id = ?)
");
$stmt->execute([$project_id, $_SESSION['user_id'], $_SESSION['user_id']]);
$project = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$project) {
    die("Bạn không có quyền truy cập dự án này.");
}

// Lấy ghi chú
$stmt = $pdo->prepare("SELECT * FROM notes WHERE project_id = ? ORDER BY created_at DESC");
$stmt->execute([$project_id]);
$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
    <link rel="stylesheet" href="../css/home.css" />
    <title><?= htmlspecialchars($project['name']) ?> - NoteBoard</title>
    <style>
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .btn-share {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
        }
        .notes-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .note-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .note-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .note-title {
            font-weight: 600;
            font-size: 16px;
            color: #1e40af;
        }
        .note-content {
            color: #4b5563;
            font-size: 14px;
            margin-bottom: 12px;
            white-space: pre-wrap;
        }
        .note-footer {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #94a3b8;
        }
        .note-actions {
            display: flex;
            gap: 8px;
        }
        .note-actions button {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            font-size: 14px;
        }
        .note-actions button:hover {
            color: #3b82f6;
        }
        .create-note-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 24px;
        }
    </style>
</head>
<body>
    <div class="main-wrapper">
        <!-- Sidebar -->
        <div class="sidebar-wrapper">
            <div class="sidebar-item">
                <i class="fas fa-arrow-left"></i>
                <a href="index.php">Back to Home</a>
            </div>
            <div class="sidebar-item active">
                <i class="fas fa-layer-group"></i>
                <span><?= htmlspecialchars($project['name']) ?></span>
            </div>
            <div class="footer">
                <div class="sidebar-item"><i class="fas fa-cog"></i> Settings</div>
            </div>
        </div>

        <div class="Tong">
            <div class="container">
                <div class="project-header">
                    <h1><?= htmlspecialchars($project['name']) ?></h1>
                    <div>
                        <button class="btn-share" onclick="window.location='share.php?project_id=<?= $project_id ?>'">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>

                <button class="create-note-btn" onclick="openNoteModal()">
                    <i class="fas fa-plus"></i> Create Note
                </button>

                <div class="notes-container" id="notesContainer">
                    <?php foreach ($notes as $note): ?>
                    <div class="note-card" data-note-id="<?= $note['id'] ?>">
                        <div class="note-header">
                            <div class="note-title"><?= htmlspecialchars($note['title']) ?></div>
                            <div class="note-actions">
                                <button onclick="editNote(<?= $note['id'] ?>)"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteNote(<?= $note['id'] ?>)"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="note-content"><?= htmlspecialchars($note['content']) ?></div>
                        <div class="note-footer">
                            <span>Status: <?= ucfirst($note['status']) ?></span>
                            <span><?= date('d/m/Y', strtotime($note['created_at'])) ?></span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Modal tạo/chỉnh sửa ghi chú -->
        <div id="noteModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;">
            <div style="background:white; margin:80px auto; padding:30px; width:500px; border-radius:12px;">
                <h3 id="noteModalTitle">Create Note</h3>
                <form id="noteForm">
                    <input type="hidden" id="noteId" name="note_id">
                    <input type="hidden" name="project_id" value="<?= $project_id ?>">
                    <input type="text" id="noteTitle" name="title" placeholder="Title" required style="width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:6px;">
                    <textarea id="noteContent" name="content" placeholder="Content..." style="width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:6px; height:120px;"></textarea>
                    <select id="noteStatus" name="status" style="width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:6px;">
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <div>
                        <button type="submit" style="background:#3b82f6; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer;">Save</button>
                        <button type="button" onclick="document.getElementById('noteModal').style.display='none'" style="margin-left:10px; background:#e5e7eb; border:none; padding:10px 20px; border-radius:6px;">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <script>
            // Tạo/sửa ghi chú
            document.getElementById('noteForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const action = document.getElementById('noteId').value ? 'update' : 'create';
                formData.append('action', action);

                const res = await fetch('note.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (result.success) {
                    location.reload();
                } else {
                    alert('Lỗi: ' + result.message);
                }
            });

            function openNoteModal() {
                document.getElementById('noteModalTitle').textContent = 'Create Note';
                document.getElementById('noteId').value = '';
                document.getElementById('noteTitle').value = '';
                document.getElementById('noteContent').value = '';
                document.getElementById('noteStatus').value = 'todo';
                document.getElementById('noteModal').style.display = 'block';
            }

            function editNote(id) {
                // Tìm ghi chú
                const note = <?= json_encode($notes) ?>;
                const n = note.find(n => n.id == id);
                if (n) {
                    document.getElementById('noteModalTitle').textContent = 'Edit Note';
                    document.getElementById('noteId').value = n.id;
                    document.getElementById('noteTitle').value = n.title;
                    document.getElementById('noteContent').value = n.content;
                    document.getElementById('noteStatus').value = n.status;
                    document.getElementById('noteModal').style.display = 'block';
                }
            }

            async function deleteNote(id) {
                if (!confirm('Xóa ghi chú này?')) return;
                const formData = new FormData();
                formData.append('action', 'delete');
                formData.append('note_id', id);
                const res = await fetch('note.php', { method: 'POST', body: formData });
                const result = await res.json();
                if (result.success) {
                    location.reload();
                } else {
                    alert('Lỗi: ' + result.message);
                }
            }
        </script>
    </div>
</body>
</html>