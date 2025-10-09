<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

$message = '';
if ($_POST) {
    require_once '../includes/db.php';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        header("Location: index.php");
        exit;
    } else {
        $message = "Sai email hoặc mật khẩu!";
    }
}
?>

<!-- Giữ nguyên HTML của bạn, chỉ thêm xử lý PHP -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  <title>Login Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      
    }

    .container {
      width: 450px;
      text-align: center;
      background-color: rgb(235, 254, 255);
      padding: 50px 50px;
      margin-top: 20px;
      border: 5px solid rgb(195, 216, 245);

    }

    .container img.top {
      width: 100%;
      height: 180px;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 20px;
      margin-bottom: 15px;
      text-align: left;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
    }

    .forgot {
      text-align: right;
      font-size: 13px;
      margin: 10px 0 20px;
      color: #555;
      cursor: pointer;
    }

    .forgot:hover {
      color: #007bff;
    }

    .btn {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;/*khi trỏ vào thì hiện bàn tay */
      margin-bottom: 20px;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    .Phan_tach {
      margin: 20px 0;
      color: #777;
      font-size: 13px;
    }

    .icon_Social {
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .icon_Social a {
    text-decoration: none; 
    font-size: 40px;        
    }

    .icon_Social a:hover {
      transform: scale(1.1);/*phóng to phần tử lên 110% */
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="../anh/anhLogin.svg" alt="ảnh login" class="top">
    <h2>Login Details</h2>

    <?php if ($message): ?>
        <p style="color:red; margin-bottom:10px;"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <form method="POST">
      <input type="text" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <p class="forgot">Forgot Password ?</p>
      <button class="btn" type="submit">Login</button>
    </form>

    <div class="Phan_tach">-----------------------Or Sign up With-------------------</div>
    <div class="icon_Social">
      <a href=""><i class="fab fa-google"></i></a>
      <a href="#"><i class="fab fa-facebook" style="color: #105f9c;"></i></a>
      <a href="#"><i class="fab fa-apple" style="color: #000000;"></i></a>
    </div>
  </div>
</body>
</html>