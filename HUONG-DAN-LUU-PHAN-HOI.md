# Lưu phản hồi xác nhận tham dự vào Google Sheet

GitHub Pages là hosting tĩnh nên trang web không tự lưu được dữ liệu. Form trên trang
sẽ gửi phản hồi sang một Google Sheet của bạn thông qua Google Apps Script.

- **Dữ liệu nằm ở:** Google Sheet trong Drive của bạn — bạn toàn quyền, miễn phí, không giới hạn số lượt.
- **Xem phản hồi ở:** mở chính Sheet đó trên máy hoặc app Google Sheets trên điện thoại.

Làm một lần, khoảng 5 phút.

---

## Bước 1 — Tạo Google Sheet

Vào <https://sheets.new>, đặt tên gì cũng được (ví dụ *Xác nhận tham dự - Thuỳ Linh*).
Không cần tạo cột, script sẽ tự tạo.

## Bước 2 — Mở Apps Script

Trong Sheet: menu **Tiện ích mở rộng** (Extensions) → **Apps Script**.

## Bước 3 — Dán đoạn mã

Xoá hết code mẫu có sẵn, dán đoạn dưới đây vào, rồi bấm biểu tượng đĩa mềm để lưu:

```javascript
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('PhanHoi') || ss.insertSheet('PhanHoi');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Thời gian', 'Tên', 'Lời nhắn', 'Tham dự']);
    sheet.setFrozenRows(1);
  }

  var p = (e && e.parameter) ? e.parameter : {};
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.msg || '',
    p.attend || ''
  ]);

  return ContentService.createTextOutput('ok');
}
```

## Bước 4 — Deploy thành Web App

1. Góc trên phải bấm **Triển khai** (Deploy) → **Tuỳ chọn triển khai mới** (New deployment)
2. Bấm bánh răng cạnh "Select type" → chọn **Ứng dụng web** (Web app)
3. Điền:
   - **Execute as / Thực thi với tư cách:** `Me` (chính bạn)
   - **Who has access / Ai có quyền truy cập:** `Anyone` (Bất kỳ ai) — **bắt buộc**, nếu để
     "Anyone with Google account" thì khách chưa đăng nhập Google sẽ không gửi được
4. Bấm **Triển khai** → Google hỏi cấp quyền thì bấm **Authorize / Cho phép**
   (có thể hiện cảnh báo "Google hasn't verified this app" → bấm *Advanced* → *Go to ...*)
5. Copy **URL ứng dụng web** — dạng:
   `https://script.google.com/macros/s/AKfycb..................../exec`

## Bước 5 — Dán URL vào `config.js`

Chỉ sửa **một file duy nhất**: `config.js` (không cần mở `index.html`).

```javascript
window.RSVP_SHEET_URL = '';
```

Dán URL vào giữa hai dấu nháy:

```javascript
window.RSVP_SHEET_URL = 'https://script.google.com/macros/s/AKfycb..../exec';
```

Lưu file, rồi đẩy code lên:

```bash
git add config.js && git commit -m "Ket noi form voi Google Sheet" && git push
```

> `config.js` **phải** được commit và đẩy lên GitHub. Nếu bạn thêm nó vào `.gitignore`
> thì trang live sẽ không có URL và form ngừng lưu được.

Đợi 1–2 phút cho GitHub Pages build lại là xong.

## Bước 6 — Thử

Mở <https://lluciper.github.io/OurChapter/>, điền form và bấm **Xác nhận**.
Mở lại Google Sheet, tab **PhanHoi** phải có một dòng mới.

---

## Nhận thông báo khi có người xác nhận

Trong Sheet: **Công cụ** (Tools) → **Quy tắc thông báo** (Notification rules) →
chọn *Any changes are made* + *Notify me right away*. Google sẽ email mỗi lần có phản hồi mới.

---

## Vài điều nên biết

**Trang không đọc được phản hồi từ server.** Apps Script không trả header CORS nên
trang phải gửi ở chế độ `no-cors` — dữ liệu vẫn tới Sheet, nhưng trang chỉ báo
"đã gửi" chứ không biết server ghi thành công hay chưa. Sau khi khách xác nhận,
bạn nên mở Sheet kiểm tra thay vì tin hoàn toàn vào dòng thông báo trên trang.

**Không có cách nào giấu URL này khỏi khách.** Tách ra `config.js` chỉ để bạn dễ sửa và
giữ `index.html` gọn — nó vẫn là file tĩnh gửi xuống trình duyệt, ai mở DevTools hoặc vào
thẳng `lluciper.github.io/OurChapter/config.js` là đọc được. Đây là giới hạn của mọi trang
tĩnh: bất cứ thứ gì trình duyệt cần để gọi API thì khách cũng lấy được. Vì vậy **đừng bao
giờ** đặt mật khẩu, API key hay token vào `config.js` — URL Apps Script thì không sao, vì
nó chỉ cho phép ghi thêm dòng, không đọc được dữ liệu đã có.

**Có thể bị gửi rác.** Vì URL công khai nên về lý thuyết người khác gửi rác vào Sheet được.
Với thiệp mời cá nhân thì rủi ro rất thấp; trang đã có sẵn bẫy chống bot (một ô ẩn, bot điền
vào thì phản hồi bị bỏ qua) và chặn bấm gửi nhiều lần. Nếu bị spam thật, chỉ cần vào Apps
Script bấm **Triển khai → Quản lý bản triển khai → Archive** là URL cũ chết ngay, rồi deploy
URL mới và dán lại vào `config.js`.

**Đừng lưu phản hồi vào repo.** Repo `lluciper/OurChapter` đang ở chế độ public, bất kỳ
ai cũng đọc được — tên và lời nhắn của khách không nên nằm trong đó.

**Sửa lại đoạn mã Apps Script thì phải deploy lại.** Mỗi lần sửa `doPost`, vào
**Triển khai → Quản lý bản triển khai → biểu tượng bút chì → Version: New version → Deploy**.
URL giữ nguyên, không cần sửa `config.js`.

## Nếu không thấy dòng nào trong Sheet

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Không có dòng nào | Bước 4 chọn sai "Who has access" — phải là **Anyone** |
| Không có dòng nào | Dán URL kết thúc bằng `/dev` thay vì `/exec` |
| Console báo lỗi mạng | URL bị thiếu ký tự khi copy, dán lại |
| Dòng bị trống cột | Sửa `doPost` mà chưa deploy version mới |
| Form báo "chưa được nối" | Chưa dán URL vào `config.js`, hoặc quên commit `config.js` |
