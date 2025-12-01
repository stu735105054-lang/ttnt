  function handleSignup() {
    const firstName = document.querySelector('input[placeholder="First name"]').value.trim();
    const lastName = document.querySelector('input[placeholder="Last name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const password = document.querySelector('input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value;

    // Kiểm tra rỗng
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Kiểm tra email hợp lệ
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Email không hợp lệ!');
      return;
    }

    // Kiểm tra mật khẩu trùng
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    // Lấy danh sách người dùng hiện có
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra email đã tồn tại chưa
    if (users.some(u => u.email === email)) {
      alert('Email này đã được đăng ký!');
      return;
    }

    // Tạo tài khoản mới
    const newUser = {
      taikhoan: email.split('@')[0], // Tạo tên tài khoản từ email
      hoten: `${firstName} ${lastName}`,
      email,
      password,
      quyen: 'user', // Mặc định là user, admin sẽ được cấp sau
      status: 'active'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
    window.location.href = 'Login.html'; // Chuyển sang trang login
  }