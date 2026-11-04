# Meowcart Take-Home Test

## 1. How to install and run the project

### Công nghệ

- **Frontend:** React 19, Vite, Recharts
- **Backend:** Node.js, Express 5
- **Dữ liệu:** Shopify Admin GraphQL API

### Yêu cầu

- Node.js và npm
- Shopify store cùng Admin API access token có quyền đọc sản phẩm, tồn kho và đơn hàng

### Cài đặt

Clone repository về máy:
   ```bash
   git clone [Link-repo-của-bạn]
   cd meowcart-dashboard
   ```
   
Sau đó cài dependencies cho từng package:

```bash
npm install
```

Tạo file `server/.env` và điền thông tin Shopify:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_shopify_admin_api_access_token
SHOPIFY_API_VERSION=2026-10
PORT=3000
```


### Chạy ứng dụng

Từ thư mục gốc của project:

```bash
npm run dev
```

Lệnh này chạy đồng thời backend và frontend:

- Frontend Vite: `http://localhost:5173`
- Backend Express: `http://localhost:3000`
- Kiểm tra backend: `http://localhost:3000/`

Để chạy riêng từng phần:

- server
```bash
cd server
npm run dev 
```

- client
```bash
cd server
npm run dev
```

### Tính năng

- Tổng số sản phẩm, sản phẩm đang hoạt động và bản nháp
- Số đơn hàng và doanh thu trong 30 ngày gần nhất
- Danh sách sản phẩm có tồn kho dưới 5
- Biểu đồ doanh thu trong 14 ngày gần nhất

### API

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/` | Kiểm tra trạng thái backend |
| `GET` | `/api/products` | Lấy danh sách tối đa 10 sản phẩm |
| `GET` | `/api/productcount` | Đếm tổng số sản phẩm |
| `GET` | `/api/activeproducts/count` | Đếm sản phẩm đang hoạt động |
| `GET` | `/api/draftproducts/count` | Đếm sản phẩm bản nháp |
| `GET` | `/api/orders/last30days/count` | Đếm đơn hàng trong 30 ngày gần nhất |
| `GET` | `/api/orders/last30days/revenue` | Tính doanh thu trong 30 ngày gần nhất |
| `GET` | `/api/inventory/lowstock` | Lấy tối đa 10 sản phẩm có tồn kho dưới 5 |
| `GET` | `/api/order/last14days` | Lấy doanh thu theo ngày trong 14 ngày gần nhất |

## 2. The main decisions you made and why
* Backend xử lý giao tiếp với Shopify API để bảo mật token tuyệt đối, trình duyệt không gọi API trực tiếp.
* Lọc dữ liệu ngay từ truy vấn GraphQL để giảm tải tính toán và tối ưu tốc độ phản hồi thay vì xử lý bằng code.
* Tự xây dựng logic cốt lõi:

## 3. How long you actually spent
* **Đọc tài liệu & Test (3 - 4 giờ):** Nghiên cứu GraphQL Admin API, tài liệu phân trang và test kết nối token.
* **Code thực tế (~60 phút):**
  * **15 phút:** Setup project và cấu hình kết nối.
  * **30 phút:** Xong toàn bộ "Must-have" (~5 phút/yêu cầu cho cả backend & frontend).
  * **15 phút:** Dành cho tính năng "Nice-to-have" (10 phút hoàn thành backend doanh thu 14 ngày, 5 phút cuối dựng frontend biểu đồ).

## 4. Which AI tools you used, if any, and for what
Tôi hạn chế tối đa việc dùng AI, chỉ sử dụng cho 2 việc cụ thể để kịp tiến độ:
* **Sửa lỗi cú pháp (Syntax typos):** Dùng AI để phát hiện và fix nhanh một số lỗi TypeError hoặc sai định dạng khi xử lý logic gán ngày tháng lúc tính tổng doanh thu/sản phẩm.
* **Tạo Component Biểu đồ (Frontend Chart):** Ở 5 phút cuối, sau khi tự code xong logic backend, tôi nhờ AI generate nhanh UI biểu đồ để kịp thời gian nộp bài. Toàn bộ logic dữ liệu là do tôi tự viết.

## 5. What you would improve with one more hour
* **Nâng cấp UI/UX:** Cải thiện thiết kế chuyên nghiệp, trực quan hơn và bổ sung đầy đủ các trạng thái loading/error để tối ưu trải nghiệm người dùng.
* **Mở rộng dữ liệu phân tích:** Hiển thị thêm các chỉ số hữu ích cho chủ store như Danh sách sản phẩm bán chạy nhất hoặc Tổng số đơn hàng theo từng ngày.