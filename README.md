# Tổng Kết Luồng Đăng Ký và Đăng Nhập

- Tóm tắt

    > Đã cài đặt thành công tính năng Login/Register cơ bản và có dùng khuôn mặt.
    >
    > Chưa viết Specification.


- Cấu trúc thư mục sau khi chỉnh sửa

```


```

## 1. Luồng Đăng Ký

### Nhập Thông Tin Người Dùng:
Người dùng cung cấp các thông tin cần thiết bao gồm:
- **Tên**: Tên của người dùng.
- **Họ**: Họ của người dùng.
- **Email**: Địa chỉ email của người dùng, dùng để xác thực tài khoản và phục vụ cho các thông báo.
- **Mật khẩu**: Mật khẩu của tài khoản, dùng để bảo mật thông tin.
- **Hình ảnh khuôn mặt (Tùy chọn)**: Người dùng có thể cung cấp hình ảnh khuôn mặt của mình dưới định dạng base64, giúp tăng cường tính bảo mật thông qua xác thực khuôn mặt.

### Xử Lý Phía Client:
1. Giao diện người dùng thu thập thông tin đầu vào từ người dùng.
2. Nếu người dùng cung cấp hình ảnh khuôn mặt, hình ảnh sẽ được mã hóa dưới dạng base64.
3. Một yêu cầu POST được gửi đến điểm cuối backend cho việc đăng ký (`http://localhost:8080/user/register`), kèm theo các thông tin đã thu thập.

### Xử Lý Phía Backend:
1. Máy chủ nhận yêu cầu đăng ký từ client.
2. Backend kiểm tra xem tất cả các trường yêu cầu có được cung cấp hay không (tên, họ, email, mật khẩu và tùy chọn hình ảnh khuôn mặt).
3. Nếu hình ảnh khuôn mặt được cung cấp, nó sẽ được giải mã từ định dạng `base64` sang định dạng nhị phân.
4. Mật khẩu của người dùng sẽ được băm sử dụng một tiện ích bảo mật (ví dụ: lớp `Hash`) để bảo vệ thông tin nhạy cảm.
5. Tài liệu người dùng sẽ được tạo và lưu trữ trong cơ sở dữ liệu với mật khẩu đã băm và (nếu có) hình ảnh khuôn mặt nhị phân.
6. Một phản hồi được gửi lại cho client để chỉ ra thành công hoặc thất bại của quá trình đăng ký.

### Phản Hồi:
- Nếu đăng ký thành công, client có thể hiển thị một thông điệp thành công hoặc tự động chuyển hướng người dùng đến trang đăng nhập.
- Nếu có lỗi (ví dụ: thiếu trường, email đã tồn tại), một thông điệp lỗi sẽ được hiển thị cho người dùng.

---

## 2. Luồng Đăng Nhập

### Nhập Thông Tin Người Dùng:
Người dùng cung cấp các thông tin cần thiết cho quá trình xác thực bao gồm:
- **Email**: Địa chỉ email đã đăng ký của người dùng.
- **Mật khẩu**: Mật khẩu của tài khoản (đối với phương thức đăng nhập thông thường).
- **Hình ảnh khuôn mặt**: Người dùng có thể cung cấp hình ảnh khuôn mặt của mình để xác thực (dùng phương thức xác thực khuôn mặt).

### Xử Lý Phía Client:
1. Giao diện người dùng thu thập thông tin đầu vào từ người dùng.
2. Nếu người dùng chọn đăng nhập bằng khuôn mặt, hình ảnh sẽ được mã hóa dưới dạng `base64`.
3. Một yêu cầu POST được gửi đến điểm cuối backend cho đăng nhập (`http://localhost:8080/user/login` cho đăng nhập thông thường hoặc `http://localhost:8080/user/login-face` cho đăng nhập bằng khuôn mặt), kèm theo các thông tin đã thu thập.

### Xử Lý Phía Backend:
1. Máy chủ nhận yêu cầu đăng nhập từ client.
2. Backend kiểm tra xem cả email và mật khẩu (đối với đăng nhập thông thường) hoặc email và hình ảnh khuôn mặt (đối với đăng nhập bằng khuôn mặt) có được cung cấp hay không.
3. Nếu sử dụng hình ảnh khuôn mặt, hình ảnh sẽ được xử lý:
   - Nếu hình ảnh ở định dạng base64, nó sẽ được giải mã thành nhị phân.
   - Hình ảnh khuôn mặt nhị phân sẽ được so sánh với hình ảnh khuôn mặt đã lưu trữ trong cơ sở dữ liệu bằng các hàm nhận diện khuôn mặt (`face_auth`).
4. Nếu xác thực thành công (dù bằng mật khẩu hay khuôn mặt), backend sẽ truy xuất tài liệu người dùng dựa trên email.
5. Một JWT token sẽ được tạo cho người dùng, bao gồm ID người dùng và thời gian hết hạn, giúp xác thực các yêu cầu tiếp theo từ client.
6. Token được trả về trong phản hồi cho client.

### Phản Hồi:
- Nếu xác thực thành công, client sẽ lưu trữ token (ví dụ: trong `localStorage` và dưới dạng cookie) và tự động chuyển hướng người dùng đến trang dashboard.
- Nếu có lỗi (ví dụ: xác thực khuôn mặt không thành công, người dùng không tìm thấy, hoặc mật khẩu không chính xác), một thông điệp lỗi sẽ được hiển thị cho người dùng.

---

## Tóm Tắt Luồng
### Đăng Ký:
`Nhập` -> `Gửi yêu cầu đăng ký` -> `Kiểm tra đầu vào` -> `Băm mật khẩu` -> `Lưu người dùng trong cơ sở dữ liệu` -> `Phản hồi`.

### Đăng Nhập:
`Nhập` -> `Gửi yêu cầu đăng nhập` -> `Kiểm tra đầu vào` -> `So sánh khuôn mặt / Kiểm tra mật khẩu` -> `Truy xuất người dùng` -> `Tạo JWT token` -> `Phản hồi`.
