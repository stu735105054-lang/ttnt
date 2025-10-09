<?php
// Bắt đầu session
session_start();

// Hủy toàn bộ session
$_SESSION = array();

// Nếu bạn muốn xóa luôn cookie session (tùy chọn)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Hủy session
session_destroy();

// Chuyển hướng về trang đăng nhập
header("Location: login.php");
exit;
?>