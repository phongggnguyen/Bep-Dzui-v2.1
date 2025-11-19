# Bep-Dzui-v2.1

## Giới thiệu dự án

**Bep-Dzui** là một ứng dụng web được thiết kế để đơn giản hóa công việc bếp núc và lập kế hoạch bữa ăn cho mọi người. Ứng dụng giúp bạn quản lý các công thức nấu ăn, tạo ra các kế hoạch bữa ăn hàng tuần một cách dễ dàng.

Điểm nổi bật của dự án là tính năng **"Bếp phó Dzui"** - một trợ lý ảo thông minh được tích hợp AI. "Bếp phó Dzui" sử dụng **Google Gemini API** để trò chuyện, đưa ra gợi ý, trả lời các câu hỏi liên quan đến nấu ăn và giúp bạn khám phá những ý tưởng ẩm thực mới mẻ.

Bạn có thể tìm hiểu thêm về Google Gemini API tại [Google AI Studio](https://ai.google.dev/).

## Chức năng chính

*   **Tạo công thức:** Hướng dẫn tạo công thức dựa trên tên món, nguyên liệu sẵn có và hình ảnh.
*   **Lập kế hoạch Bữa ăn:** Dễ dàng tạo lịch trình các bữa ăn cho cả tuần, giúp bạn chuẩn bị tốt hơn.
*   **Trợ lý AI "Bếp phó Dzui":** Giao tiếp với AI để nhận được lời khuyên nấu nướng, gợi ý công thức và giải đáp thắc mắc.
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