# Bep-Dzui-v2.1 - Trợ Lý Bếp AI Thông Minh

## 📖 Giới thiệu dự án

**Bep-Dzui** là ứng dụng web hiện đại giúp đơn giản hóa việc nấu nướng và lập kế hoạch bữa ăn. Với sự hỗ trợ của AI, ứng dụng không chỉ giúp bạn quản lý công thức mà còn đóng vai trò như một người bạn đồng hành trong gian bếp.

Điểm đặc biệt nhất là **"Bếp phó Dzui"** - trợ lý ảo tích hợp **Google Gemini AI**, sẵn sàng gợi ý món ăn, giải đáp thắc mắc và tính toán dinh dưỡng chi tiết cho từng khẩu phần.

---

## 🛠️ Công nghệ sử dụng

Dự án được xây dựng trên nền tảng công nghệ hiện đại, tối ưu cho hiệu năng và trải nghiệm người dùng:

*   **Frontend Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Tốc độ building siêu nhanh)
*   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) (Đảm bảo type safety và code chất lượng)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Giao diện hiện đại, responsive)
*   **AI Integration:** [Google Gemini API](https://ai.google.dev/) (Trí tuệ nhân tạo thế hệ mới)
*   **Backend/Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Cấu trúc dự án

Dự án tuân theo cấu trúc `src` chuẩn để dễ dàng mở rộng và bảo trì:

```
src/
├── components/      # Các thành phần UI tái sử dụng (Button, Input, Chat...)
├── context/         # Quản lý trạng thái toàn cục (AuthContext, ThemeContext)
├── pages/           # Các trang chính (Home, Recipe, About, Login...)
├── services/        # Xử lý logic API (Gemini, Firebase)
├── types/           # Định nghĩa kiểu dữ liệu TypeScript (User, Recipe...)
├── utils/           # Các hàm tiện ích hỗ trợ
└── assets/          # Tài nguyên tĩnh (Hình ảnh, fonts)
```

---

## ✨ Chức năng chính

*   **🍳 Tạo công thức thông minh:** Tự động tạo công thức chi tiết từ tên món ăn hoặc hình ảnh nguyên liệu có sẵn.
*   **📅 Lập kế hoạch bữa ăn:** Lên thực đơn cho cả tuần chỉ với vài cú click chuột.
*   **🤖 "Bếp phó Dzui" AI:** Chatbot thông minh hỗ trợ nấu ăn 24/7.
*   **🌙 Chế độ Sáng/Tối (Dark Mode):** Chuyển đổi giao diện theo sở thích bằng một nút bấm.
*   **🥗 Góc sức khỏe & Dinh dưỡng:**
    *   **Health Score:** Chấm điểm độ lành mạnh (0-100).
    *   **Calo & Macro:** Tính toán năng lượng và dưỡng chất.
    *   **Quy đổi vận động:** Gợi ý bài tập để tiêu hao calo nạp vào.

---

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu
*   [Node.js](https://nodejs.org/) (v18.x trở lên)
*   [npm](https://www.npmjs.com/)

### Các bước thực hiện

1.  **Clone dự án:**
    ```bash
    git clone https://github.com/phongggnguyen/Bep-Dzui-v2.1.git
    cd Bep-Dzui-v2.1
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Cấu hình môi trường:**
    *   Copy file `.env.example` thành `.env.local`
    *   Điền API Key của bạn (Google Gemini, Firebase config)
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    # Thêm các cấu hình Firebase khác...
    ```

4.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    ```
    Truy cập: `http://localhost:3000`

---

## 💡 Demo
Trải nghiệm demo trực tiếp trên Google AI Studio: [Link Demo](https://aistudio.google.com/apps/drive/1i07Jf1CaGWBq-uihA063Uian2LYtflqr?showPreview=true&showAssistant=true)

---

## 📝 Chi tiết tính năng "Góc sức khỏe"

Tính năng độc quyền giúp bạn ăn ngon mà vẫn healthy:

**1. Health Score (0-100)**
*   🟢 **80-100:** Rất tốt (Eat clean, balanced)
*   🟡 **60-79:** Tốt
*   🟠 **40-59:** Cân nhắc điều chỉnh
*   🔴 **0-39:** Hạn chế ăn thường xuyên

**2. Phân tích thông minh**
*   **Tags dinh dưỡng:** "Giàu Protein", "Ít Carb", "Nhiều Vitamin C"...
*   **Lời khuyên:** AI phân tích dựa trên mục tiêu cá nhân (Giảm cân/Tăng cơ).
*   **Gợi ý vận động:** "Ăn phở bò? Hãy chạy bộ 30 phút nhé!"

---

## 🌙 Dark Mode

Bếp Dzui hỗ trợ giao diện **Sáng / Tối** giúp bảo vệ mắt khi dùng vào ban đêm.

*   **Bật/Tắt:** Nhấn nút **Moon 🌙 / Sun ☀️** ở cuối sidebar (desktop) hoặc góc phải header (mobile).
*   **Tự động ghi nhớ:** Lựa chọn được lưu vào `localStorage`, giữ nguyên sau khi reload trang.
*   **Phát hiện hệ thống:** Lần đầu mở app, giao diện tự khớp với cài đặt `prefers-color-scheme` của thiết bị.
*   **Triển khai:** Sử dụng Tailwind CSS `darkMode: 'class'` và React Context API (`ThemeContext`).

---
*Developed with ❤️ by Phong Nguyen*