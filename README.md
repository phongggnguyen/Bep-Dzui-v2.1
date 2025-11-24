# Bep-Dzui-v2.1

## Giới thiệu dự án

**Bep-Dzui** là một ứng dụng web được thiết kế để đơn giản hóa công việc bếp núc và lập kế hoạch bữa ăn cho mọi người. Ứng dụng giúp bạn quản lý các công thức nấu ăn, tạo ra các kế hoạch bữa ăn hàng tuần một cách dễ dàng.

Điểm nổi bật của dự án là tính năng **"Bếp phó Dzui"** - một trợ lý ảo thông minh được tích hợp AI. "Bếp phó Dzui" sử dụng **Google Gemini API** để trò chuyện, đưa ra gợi ý, trả lời các câu hỏi liên quan đến nấu ăn và giúp bạn khám phá những ý tưởng ẩm thực mới mẻ.

Bạn có thể tìm hiểu thêm về Google Gemini API tại [Google AI Studio](https://ai.google.dev/).

## Chức năng chính

*   **Tạo công thức:** Hướng dẫn tạo công thức dựa trên tên món, nguyên liệu sẵn có và hình ảnh.
*   **Lập kế hoạch Bữa ăn:** Dễ dàng tạo lịch trình các bữa ăn cho cả tuần, giúp bạn chuẩn bị tốt hơn.
*   **Trợ lý AI "Bếp phó Dzui":** Giao tiếp với AI để nhận được lời khuyên nấu nướng, gợi ý công thức và giải đáp thắc mắc.
*   **Góc sức khỏe & Dinh dưỡng (MỚI):** Mỗi công thức nấu ăn đều được tích hợp phần phân tích sức khỏe chi tiết bao gồm:
    *   **Lượng Calo ước tính:** Tính toán tự động dựa trên nguyên liệu
    *   **Health Score (0-100):** Chấm điểm món ăn theo mục tiêu cá nhân (giảm cân, tăng cơ, ăn lành mạnh...)
    *   **Đặc điểm dinh dưỡng:** Tags nhanh như "Giàu Protein", "Ít chất xơ", "Nhiều Vitamin"
    *   **Quy đổi vận động:** Gợi ý bài tập cụ thể để tiêu hao năng lượng (đi bộ, chạy, bơi lội...)
    *   **Lời khuyên chuyên sâu:** Phân tích lợi ích và lưu ý khi ăn món này phù hợp với sở thích của bạn
*   **Giao diện người dùng thân thiện:** Thiết kế đơn giản, cá nhân hóa, trực quan, dễ dàng sử dụng.

## Hướng dẫn cài đặt và chạy dự án

Để chạy dự án này trên máy tính của bạn, hãy làm theo các bước sau:

### Yêu cầu

*   [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên được khuyến nghị)
*   [npm](https://www.npmjs.com/) (thường được cài đặt cùng với Node.js)

### Các bước thực hiện

1.  **Tải mã nguồn về máy:**
    Mở Terminal hoặc Command Prompt và clone repository:
    ```bash
    git clone https://github.com/phongggnguyen/Bep-Dzui-v2.1.git
    ```

2.  **Vào thư mục dự án:**
    ```bash
    cd Bep-Dzui-v2.1
    ```

3.  **Cài đặt các thư viện cần thiết:**
    ```bash
    npm install
    ```

4.  **Thiết lập biến môi trường:**
    *   Bạn sẽ thấy một file tên là `.env.example` trong thư mục gốc của dự án.
    *   Sao chép file này và đổi tên thành `.env.local`.
    *   Thay API key riêng của bạn.



5.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ tự động mở trong trình duyệt của bạn, thường là tại địa chỉ `http://localhost:3000`.

5.  **Link demo trong GG studio AI**
    ```bash
    https://aistudio.google.com/apps/drive/1i07Jf1CaGWBq-uihA063Uian2LYtflqr?showPreview=true&showAssistant=true
    ```

---

## Chi tiết tính năng "Góc sức khỏe & Dinh dưỡng"

Đây là tính năng mới được phát triển để giúp người dùng có cái nhìn toàn diện hơn về giá trị dinh dưỡng và tác động sức khỏe của mỗi món ăn.

### Cách hoạt động

Khi bạn tạo một công thức nấu ăn mới, AI sẽ tự động phân tích nguyên liệu và tạo ra một báo cáo sức khỏe chi tiết bao gồm:

#### 1. Điểm số sức khỏe (Health Score)
- Thang điểm từ 0-100
- Được tính toán dựa trên:
  - Mục tiêu cá nhân của bạn (giảm cân, tăng cơ, ăn lành mạnh...)
  - Thành phần dinh dưỡng của món ăn
  - Phương pháp chế biến
- Màu sắc trực quan:
  - **Xanh lá (80-100):** Rất phù hợp với mục tiêu
  - **Vàng (60-79):** Tốt cho sức khỏe
  - **Cam (40-59):** Cân nhắc điều chỉnh
  - **Đỏ (0-39):** Ít phù hợp

#### 2. Lượng Calo ước tính
- Tính toán dựa trên tổng nguyên liệu cho 1 khẩu phần
- Hiển thị dưới dạng khoảng (min-max) để phản ánh sự linh hoạt trong chế biến

#### 3. Đặc điểm dinh dưỡng
- Tags nhanh giúp nhận biết đặc điểm nổi bật:
  - "Giàu Protein" - Tốt cho tăng cơ
  - "Nhiều chất xơ" - Tốt cho tiêu hóa
  - "Ít đường" - Phù hợp giảm cân
  - "Giàu Vitamin" - Tăng cường sức đề kháng
  - Và nhiều đặc điểm khác...

#### 4. Quy đổi vận động
- Đề xuất 3 hoạt động thể chất phổ biến để tiêu hao năng lượng nạp vào
- Ví dụ:
  - Đi bộ nhanh 45 phút
  - Chạy bộ 25 phút
  - Bơi lội 30 phút
- Giúp bạn cân bằng chế độ ăn với hoạt động thể chất

#### 5. Lời khuyên chuyên sâu
- Phân tích ngắn gọn về lợi ích và lưu ý khi ăn món này
- Được cá nhân hóa theo mục tiêu của bạn
- Gợi ý điều chỉnh nếu cần (ví dụ: giảm dầu khi giảm cân)

### Giao diện hiển thị

Góc sức khỏe được thiết kế với 2 cột:
- **Cột trái (40%):** Vòng tròn điểm số lớn, thông tin calo và tags dinh dưỡng
- **Cột phải (60%):** Gợi ý tập luyện và lời khuyên trong hộp xanh nổi bật

Thiết kế responsive hoàn toàn, tự động xếp chồng trên thiết bị di động.

---