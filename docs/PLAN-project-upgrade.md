# PLAN: Bếp Dzui Project Upgrade

Dựa trên việc kiểm tra toàn bộ project, tôi đề xuất kế hoạch nâng cấp toàn diện cho **Bếp Dzui** để tối ưu hóa trải nghiệm người dùng, nâng cao năng lực AI và cải thiện cấu trúc mã nguồn.

## 🎯 Mục tiêu
- Nâng cấp lõi AI lên model mạnh mẽ và hiện đại nhất.
- Cải thiện trải nghiệm người dùng (UX) thông qua các tính năng rảnh tay (Hands-free).
- Tối ưu hóa hiệu năng và cấu trúc code để dễ bảo trì.

## 🛠️ Lộ trình nâng cấp (Proposed Changes)

### 1. Nâng cấp Lõi AI (AI Engine Upgrade)
- **Model Migration**: Chuyển từ `gemini-1.5-flash` sang `gemini-2.0-flash`. Model này cung cấp tốc độ phản hồi nhanh hơn và khả năng hiểu ngữ cảnh tốt hơn.
- **Multimodal Chat**: Cập nhật `SousChefChat` để người dùng có thể gửi ảnh trực tiếp trong khung chat (ví dụ: chụp ảnh tủ lạnh để hỏi "nấu gì với đống này?").
- **Structured Output**: Sử dụng tính năng "Structured Output" của Gemini để đảm bảo JSON trả về từ AI luôn chuẩn xác, giảm thiểu lỗi parsing.

### 2. Tính năng hỗ trợ nấu ăn (Hands-free Cooking)
- **Voice Mode (STT)**: Tích hợp Speech-to-Text để người dùng có thể đặt câu hỏi bằng giọng nói khi tay đang bận làm bếp.
- **Interactive Steps**: Tạo chế độ xem "Bước nấu ăn tương tác" với font chữ lớn, hỗ trợ chuyển bước bằng giọng nói hoặc nút bấm lớn.

### 3. Cải thiện UI/UX & Hiệu năng
- **Nutrition Visualization**: Thay vì chỉ hiển thị text, sử dụng biểu đồ (SVG hoặc Chart.js) để trực quan hóa lượng Calo, Protein, Carbs.
- **Framer Motion**: Thêm các hiệu ứng chuyển cảnh mượt mà giữa các trang và các folder công thức.
- **PWA Support**: Biến ứng dụng thành Progressive Web App để người dùng có thể mở nhanh từ màn hình điện thoại và xem các công thức đã lưu khi offline.

### 4. Code Refactoring (Dọn dẹp mã nguồn)
- **Component Splitting**: Tách file `Recipe.tsx` (hiện tại ~500 lines) thành các component nhỏ hơn: `RecipeHeader`, `IngredientList`, `CookingSteps`, `NutritionPanel`.
- **Custom Hooks**: Tạo các hooks như `useGemini`, `useProfile` để quản lý logic tách biệt với UI.

### 5. Hoàn thiện Authentication (Phase 2)
- **Social Login**: Thêm đăng nhập bằng Google (Firebase Auth).
- **Email Verification**: Yêu cầu xác thực email để tăng tính bảo mật.

---

## 📅 Kế hoạch triển khai (Phasewise)

| Phase | Nhiệm vụ | Độ ưu tiên |
|-------|----------|------------|
| Phase 1 | Cấu trúc lại code & Nâng cấp Model Gemini 2.0 | Cao |
| Phase 2 | Nâng cấp UI/UX (Animations & Visualization) | Trung bình |
| Phase 3 | Tính năng Voice & PWA | Trung bình |
| Phase 4 | Hoàn thiện Auth & Social Login | Thấp |

---

## 🧐 Socratic Gate (Câu hỏi cho bạn)
Trước khi bắt đầu triển khai, tôi cần xác nhận một số điểm sau:
1. Bạn có muốn ưu tiên phần nào trước không? (Ví dụ: Tập trung vào AI trước hay UI trước?)
2. Tính năng Voice (điều khiển bằng giọng nói) có thực sự cần thiết cho nhóm người dùng của bạn không?
3. Bạn có muốn sử dụng thư viện chart nào cụ thể cho phần dinh dưỡng không, hay muốn tôi tự build bằng SVG cho nhẹ?
4. Bạn có đồng ý với việc chia nhỏ các file lớn như `Recipe.tsx` để code sạch hơn không?

---
*Kế hoạch được tạo bởi Antigravity Agent.*
