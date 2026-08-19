# Thiệp Mời Lễ Kỷ Yếu — Template

Trang thiệp mời điện tử (1 trang, cuộn dọc) cho **lễ kỷ yếu / đêm gala tri ân**.
Chạy được ngay: mở `index.html` bằng trình duyệt.

## Cấu trúc thư mục
```
kyyeu/
├── index.html      ← nội dung & bố cục
├── css/style.css   ← màu sắc, font, giao diện
├── js/script.js    ← đếm ngược, nhạc, album, form...
└── img/            ← ảnh (thay bằng ảnh của bạn, giữ nguyên tên)
```

## Cách chỉnh nội dung (mở `index.html`)
- **Tên lớp / trường / khóa**: sửa trong phần `.hero`, `.foot` và tiêu đề `<title>`.
- **Ngày giờ sự kiện**: sửa ở 3 nơi cho khớp: chữ hiển thị trong `.hero__date` & phần "Thông tin sự kiện", và **quan trọng nhất** là đồng hồ đếm ngược:
  ```html
  <div class="cd" id="cd" data-date="2026-11-20T18:00:00">
  ```
  Đổi `data-date` theo định dạng `NĂM-THÁNG-NGÀYTgiờ:phút:giây`.
- **Địa điểm, dress code, chương trình, lời ngỏ**: sửa trực tiếp chữ trong từng section.

## Thay ảnh
Bỏ ảnh của bạn vào thư mục `img/`, đặt trùng tên: `hero.jpg` (ảnh bìa), `g1.jpg`…`g8.jpg` (album), `map.jpg`. Hoặc đổi đường dẫn trong `index.html`.

## Nhạc nền
Thêm file nhạc rồi gắn đường dẫn vào thẻ `<source>` trong `index.html`:
```html
<audio id="bgm" loop preload="none">
  <source src="img/nhac-nen.mp3" type="audio/mpeg" />
</audio>
```

## Bản đồ Google Maps
Thay ảnh `map.jpg` bằng iframe nhúng từ Google Maps: trong section `#map`,
đổi thẻ `<img>` thành `<iframe src="...link nhúng..."></iframe>`.

## Nhận phản hồi "Xác nhận tham dự" thật
Hiện form chỉ ghi tạm (in ra Console). Muốn nhận được dữ liệu thật, nối tới
**Google Form / Google Sheet / API**: xem hàm xử lý `rsvpForm` trong `js/script.js`
(có ghi chú sẵn chỗ cần thay).

## Màu sắc
Đổi bảng màu ở đầu `css/style.css` trong khối `:root` (ivory / pine / gold...).
