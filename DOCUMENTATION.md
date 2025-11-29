# Tài liệu dự án Cloud Storage

## Tổng quan

Dự án Cloud Storage là một ứng dụng lưu trữ đám mây đơn giản được xây dựng bằng HTML, CSS và JavaScript. Ứng dụng cho phép người dùng đăng ký, đăng nhập và lưu trữ các loại file khác nhau trên trình duyệt thông qua localStorage.

## Cấu trúc dự án

```
/workspace/
├── README.md
├── DOCUMENTATION.md        # Tài liệu dự án
├── html/
│   ├── login.html          # Trang đăng nhập
│   ├── singUp.html         # Trang đăng ký
│   ├── trangchinh.html     # Trang chính sau khi đăng nhập
│   ├── upload.html         # Trang upload file
│   ├── category_audio.html # Trang hiển thị file âm thanh
│   ├── category_document.html # Trang hiển thị tài liệu
│   ├── category_photo.html # Trang hiển thị hình ảnh
│   ├── category_video.html # Trang hiển thị video
│   ├── trash.html          # Trang thùng rác
│   ├── share.html          # Trang chia sẻ
│   ├── setting_profile.html # Trang cài đặt hồ sơ
│   ├── Workspace.html      # Trang workspace
│   └── filedetal_preview.html # Trang xem chi tiết file
├── css/
│   └── trangchinh.css      # File CSS chính
└── pictures/
    ├── Folder.png          # Hình ảnh thư mục
    ├── PDF.png             # Hình ảnh file PDF
    ├── anhLogin.svg        # Hình ảnh đăng nhập
    ├── email.png           # Hình ảnh email
    ├── gig.png             # Hình ảnh khác
    ├── html.png            # Hình ảnh HTML
    ├── logo.jpg            # Logo ứng dụng
    ├── mp3.png             # Hình ảnh file MP3
    ├── mp4.png             # Hình ảnh file MP4
    ├── signUp.png          # Hình ảnh đăng ký
    ├── signUp copy.png     # Hình ảnh đăng ký (bản sao)
    ├── word.png            # Hình ảnh file Word
    ├── xlx.png             # Hình ảnh file Excel
    └── zip.png             # Hình ảnh file ZIP
```

## Công nghệ sử dụng

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- localStorage (lưu trữ dữ liệu phía client)
- Font Awesome (icon)
- CDN cho các thư viện bên ngoài

## Tính năng chính

1. **Xác thực người dùng**
   - Đăng ký tài khoản mới
   - Đăng nhập vào hệ thống
   - Quản lý thông tin người dùng

2. **Quản lý file**
   - Upload file lên hệ thống
   - Phân loại file theo loại (document, photo, video, audio)
   - Hiển thị file theo từng danh mục
   - Tìm kiếm file

3. **Giao diện người dùng**
   - Sidebar điều hướng
   - Main content
   - Right panel (thông tin người dùng)
   - Responsive design

## Cơ chế hoạt động

### Xác thực người dùng
- Khi đăng ký, thông tin người dùng được lưu vào localStorage dưới dạng JSON
- Khi đăng nhập, hệ thống kiểm tra thông tin đăng nhập với dữ liệu đã lưu
- Token xác thực được lưu trong localStorage để duy trì phiên đăng nhập

### Quản lý file
- File được lưu dưới dạng base64 trong localStorage
- Mỗi file có các thuộc tính: id, name, type, category, size, uploadDate
- Hệ thống phân loại file theo phần mở rộng và hiển thị trong các tab tương ứng

## Cài đặt và chạy

1. Mở file `html/index.html` hoặc `html/trangchinh.html` trong trình duyệt web
2. Truy cập vào trang đăng ký hoặc đăng nhập
3. Sử dụng các chức năng của ứng dụng

## Các file chính

### html/login.html
- Chứa form đăng nhập
- Xử lý logic đăng nhập
- Kiểm tra thông tin đăng nhập với dữ liệu trong localStorage

### html/singUp.html
- Chứa form đăng ký
- Xử lý logic đăng ký
- Kiểm tra thông tin đầu vào
- Lưu thông tin người dùng mới vào localStorage

### html/trangchinh.html
- Trang chính sau khi đăng nhập
- Hiển thị giao diện chính của ứng dụng
- Chứa sidebar, main content và right panel

### html/upload.html
- Trang upload file
- Hỗ trợ drag & drop
- Chuyển file thành base64
- Phân loại file theo loại

### css/trangchinh.css
- Chứa toàn bộ CSS cho ứng dụng
- Responsive design
- Animation và hiệu ứng

## Cấu trúc dữ liệu

### Người dùng
```javascript
{
  id: string,
  username: string,
  password: string,
  email: string,
  files: array
}
```

### File
```javascript
{
  id: string,
  name: string,
  type: string,
  category: string,
  size: number,
  uploadDate: string,
  data: string (base64)
}
```

## Cơ chế phân loại file

File được phân loại theo phần mở rộng:
- Document: .pdf, .doc, .docx, .txt, .xls, .xlsx
- Photo: .jpg, .jpeg, .png, .gif, .bmp
- Video: .mp4, .avi, .mov, .wmv, .flv
- Audio: .mp3, .wav, .flac, .aac

## Cơ chế hiển thị theo category

Các trang category như `category_audio.html`, `category_document.html`, `category_photo.html`, `category_video.html` sẽ:
- Lấy dữ liệu từ localStorage
- Lọc các file theo category tương ứng
- Hiển thị danh sách file phù hợp

## Bảo mật

- Dữ liệu được lưu trữ cục bộ bằng localStorage
- Mật khẩu được lưu trực tiếp (cần cải thiện)

## Giới hạn

- Chỉ hoạt động trên trình duyệt hiện tại
- Không có backend server
- Dữ liệu bị mất khi xóa localStorage
- Giới hạn dung lượng lưu trữ phụ thuộc vào trình duyệt

## Cải tiến đã thực hiện

1. **Sửa lỗi trong upload.html**:
   - Đã tách riêng hàm `getFileCategory` và `saveFilesToStorage`
   - Đảm bảo file được lưu đúng category vào localStorage
   - Cập nhật nút upload để sử dụng hàm lưu file đúng cách

2. **Tăng cường chức năng hiển thị category**:
   - Các trang category sẽ hiển thị đúng các file theo loại đã được phân loại
   - Tăng cường trải nghiệm người dùng khi xem file theo danh mục

3. **Cải thiện chức năng dropdown menu**:
   - Thêm JavaScript để xử lý toggle dropdown menu trong các trang category
   - Đảm bảo menu Categories hoạt động đúng trong tất cả các trang (audio, photo, video)

## Hướng phát triển trong tương lai

1. Thêm backend server
2. Cải thiện bảo mật (mã hóa mật khẩu, xác thực token)
3. Thêm chức năng chia sẻ file
4. Tối ưu hóa hiệu suất và giao diện người dùng
5. Thêm tính năng tìm kiếm nâng cao