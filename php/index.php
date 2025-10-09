<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

require_once '../includes/db.php';

// Lấy danh sách dự án của người dùng
$stmt = $pdo->prepare("
    SELECT p.*, u.username as owner_name,
           (SELECT COUNT(*) FROM notes n WHERE n.project_id = p.id) as note_count
    FROM projects p
    LEFT JOIN users u ON p.owner_id = u.id
    LEFT JOIN project_shares ps ON p.id = ps.project_id
    WHERE p.owner_id = ? OR ps.user_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
");
$stmt->execute([$_SESSION['user_id'], $_SESSION['user_id']]);
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
    <link rel="stylesheet" href="../css/home.css" />
    <title>Home - NoteBoard</title>
</head>
<body>
    <div class="main-wrapper">
        <!-- Sidebar -->
        <div class="sidebar-wrapper">
            <div class="sidebar-item active">
                <i class="fas fa-house-user"></i>
                <a href="index.php">Home</a>
            </div>
            <div class="sidebar-item">
                <i class="fas fa-plus-circle"></i>
                <a href="#" id="createProjectBtn">New Project</a>
            </div>
            <div class="sidebar-item"><i class="fas fa-search"></i><a href="search.php">Search</a></div>
            <div class="sidebar-item"><i class="fas fa-bell"></i><a href="#">Notifications</a></div>

            <div class="dropdown open" id="categories-dropdown">
                <div class="dropdown-label">Categories <i class="fas fa-angle-down"></i></div>
                <div class="dropdown-menu">
                    <a href="share.php" class="dropdown-item">
                        <i class="fas fa-share-from-square"></i> Shared with me
                    </a>
                    <a href="trash.php" class="dropdown-item">
                        <i class="fas fa-trash-can"></i> Trash
                    </a>
                </div>
            </div>

            <div class="footer">
    <div class="sidebar-item"><i class="fas fa-cog"></i> Settings</div>
    <div class="sidebar-item"><i class="far fa-question-circle"></i> Help & Feedback</div>
    <div class="sidebar-item">
        <i class="fas fa-right-from-bracket"></i>
        <a href="logout.php">Logout</a>
    </div>
</div>
        </div>

        <!-- Main Content -->
        <div class="Tong">
            <div class="container">
                <div class="Home_Le">
                    <h1><i class="fas fa-house-user"></i> Home</h1>
                </div>

                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search projects..." id="mainSearch" />
                </div>

                <div class="section-header">
                    <h2>All Projects</h2>
                </div>

                <div class="categories-grid">
                    <?php foreach ($projects as $project): ?>
                    <a href="project.php?id=<?= $project['id'] ?>" class="category-card-link">
                        <div class="category-card">
                            <i class="fas fa-layer-group"></i>
                            <h3><?= htmlspecialchars($project['name']) ?></h3>
                            <span class="file-count"><?= $project['note_count'] ?> notes</span>
                        </div>
                    </a>
                    <?php endforeach; ?>

                    <!-- Nút tạo mới -->
                    <div class="category-card-link" id="createProjectCard">
                        <div class="category-card" style="border:2px dashed #cbd5e1; background:#f8fafc;">
                            <i class="fas fa-plus"></i>
                            <h3>Create Project</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">
            <div class="user-section">
                <i class="fas fa-circle-user"></i>
                <div class="user-name"><?= htmlspecialchars($_SESSION['username'] ?? 'User') ?></div>
            </div>

            <div class="upload-btn" id="createProjectBtn2">
                <i class="fa-solid fa-plus"></i> Create Project
            </div>

            <div class="quick-links">
                <div class="quick-link"><a href="share.php"><i class="fas fa-share-from-square"></i> Shared with me</a></div>
                <div class="quick-link"><a href="trash.php"><i class="fas fa-trash-can"></i> Trash</a></div>
            </div>
        </div>
    </div>

    <!-- Modal tạo dự án -->
    <div id="projectModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;">
        <div style="background:white; margin:100px auto; padding:30px; width:400px; border-radius:12px;">
            <h3>Create New Project</h3>
            <form method="POST" action="project_action.php">
                <input type="hidden" name="action" value="create">
                <input type="text" name="project_name" placeholder="Project name" required style="width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:6px;">
                <textarea name="description" placeholder="Description (optional)" style="width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:6px; height:80px;"></textarea>
                <div>
                    <button type="submit" style="background:#3b82f6; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer;">Create</button>
                    <button type="button" onclick="document.getElementById('projectModal').style.display='none'" style="margin-left:10px; background:#e5e7eb; border:none; padding:10px 20px; border-radius:6px;">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.getElementById('createProjectBtn').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('projectModal').style.display = 'block';
        });
        document.getElementById('createProjectBtn2').addEventListener('click', function() {
            document.getElementById('projectModal').style.display = 'block';
        });
        document.getElementById('createProjectCard').addEventListener('click', function() {
            document.getElementById('projectModal').style.display = 'block';
        });

        document.getElementById('mainSearch').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.category-card h3').forEach(el => {
                const card = el.closest('.category-card-link');
                card.style.display = el.textContent.toLowerCase().includes(query) ? 'block' : 'none';
            });
        });
    </script>
</body>
</html>