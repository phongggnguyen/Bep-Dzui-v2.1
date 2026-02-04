
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalyzedDish, Recipe, DailyPlan, ShoppingItem } from "@/types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON string if MD blocks are present
const cleanJsonString = (text: string): string => {
  return text.replace(/```json\n|\n```/g, "").replace(/```/g, "");
};

// --- NEW: Chat Assistant ---
export const createSousChefChat = () => {
  const model = "gemini-2.5-flash";

  return ai.chats.create({
    model,
    config: {
      systemInstruction: `
        Bạn là "Bếp Phó Dzui" - trợ lý nấu ăn vui tính.
        
        YÊU CẦU VỀ ĐỊNH DẠNG (QUAN TRỌNG):
        1. Sử dụng **Markdown** để trình bày.
        2. Luôn **in đậm** các từ khóa quan trọng, tên nguyên liệu hoặc bước chính.
        3. Sử dụng danh sách gạch đầu dòng (-) cho các bước hoặc liệt kê để dễ đọc trên điện thoại.
        4. Chia câu trả lời thành các đoạn ngắn, thoáng mắt.
        
        Phong cách:
        - Thân thiện, dùng emoji 🍳🌶️🥗 hợp ngữ cảnh.
        - Đi thẳng vào vấn đề. Nếu người dùng hỏi cách chữa cháy món ăn, đưa giải pháp ngay lập tức theo gạch đầu dòng.
        - Luôn khích lệ tinh thần người nấu.
      `,
    }
  });
};

// --- 1. Analyze Image ---
export const analyzeImage = async (base64Image: string): Promise<AnalyzedDish> => {
  const model = "gemini-2.5-flash"; // Use Flash for Vision

  const prompt = `
    Bạn là một chuyên gia ẩm thực Việt Nam. Hãy nhìn bức ảnh món ăn này và phân tích nó.
    Trả về kết quả dưới dạng JSON theo cấu trúc sau (không thêm text nào khác):
    {
      "dishName": "Tên món ăn tiếng Việt",
      "ingredients": ["nguyên liệu 1", "nguyên liệu 2"],
      "confidence": 0.95,
      "alternatives": ["tên món khác có thể đúng"]
    }
    Hãy đoán một cách thực tế, tránh ảo giác.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Lỗi phân tích ảnh:", error);
    throw new Error("Không thể nhận diện món ăn. Vui lòng thử lại.");
  }
};

// --- 2. Generate Recipe ---
export const generateRecipe = async (query: string, userProfile: UserProfile): Promise<Recipe> => {
  const model = "gemini-2.5-flash";

  const restrictions = `
    Lưu ý người dùng (BẮT BUỘC TUÂN THỦ):
    - Mục tiêu ăn uống: ${userProfile.goal}
    - Ghi chú đặc biệt (Sở thích/Dị ứng/Hạn chế): ${userProfile.dietaryNotes || "Không có"}
  `;

  const prompt = `
    Hãy tạo một công thức nấu ăn chi tiết cho món: "${query}".
    ${restrictions}
    Trả về JSON (Tiếng Việt):
    {
      "name": "Tên món chuẩn",
      "description": "Mô tả ngắn hấp dẫn",
      "ingredients": [{"name": "tên", "amount": "số lượng", "category": "loại"}],
      "steps": ["bước 1", "bước 2"],
      "cookingTime": "ví dụ: 30 phút",
      "difficulty": "Dễ/Trung bình/Khó",
      "quickVersion": "Phiên bản nấu nhanh trong 15p (nếu có thể)",
      "healthInfo": {
        "calories": {
          "min": 400,
          "max": 500
        },
        "healthScore": 85,
        "nutritionTags": ["Giàu Protein", "Nhiều chất xơ", "Ít đường"],
        "exerciseEquivalents": [
          {"activity": "Đi bộ nhanh", "duration": "45 phút"},
          {"activity": "Chạy bộ", "duration": "25 phút"},
          {"activity": "Bơi lội", "duration": "30 phút"}
        ],
        "advice": "Món này tốt cho phục hồi cơ bắp nhờ hàm lượng protein cao. Nếu đang giảm cân, nên hạn chế lượng dầu khi chế biến và ăn kèm nhiều rau xanh để tăng cảm giác no."
      }
    }

    CHÚ Ý VỀ HEALTH INFO:
    1. Calories: Tính toán dựa trên tổng nguyên liệu (cho 1 khẩu phần), ước lượng khoảng min-max hợp lý.
    2. Health Score (0-100): Đánh giá dựa trên mục tiêu người dùng "${userProfile.goal}":
       - 80-100: Rất phù hợp với mục tiêu
       - 60-79: Tốt, có thể điều chỉnh nhẹ
       - 40-59: Trung bình, cần lưu ý một số điểm
       - 0-39: Ít phù hợp, nên cân nhắc
    3. Nutrition Tags: Tối đa 3-4 tags nổi bật (ví dụ: "Giàu Protein", "Nhiều chất béo bão hòa", "Ít chất xơ", "Giàu Vitamin", "Nhiều Carbs", v.v.)
    4. Exercise Equivalents: Đề xuất 3 hoạt động phổ biến để tiêu hao lượng calo nạp vào.
    5. Advice: 2-3 câu phân tích ngắn gọn về lợi ích hoặc lưu ý khi ăn món này, có liên quan đến mục tiêu của người dùng.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Lỗi tạo công thức:", error);
    throw error;
  }
};

// --- 3. Generate Meal Plan ---
export const generateMealPlan = async (userProfile: UserProfile): Promise<DailyPlan[]> => {
  // Use Pro for complex reasoning over 7 days to avoid repetition
  const model = "gemini-2.5-flash";

  const prompt = `
    Lập thực đơn 7 ngày cho người Việt Nam.
    
    Hồ sơ người dùng:
    - Mục tiêu: ${userProfile.goal}
    - Ghi chú ăn uống (Sở thích/Dị ứng/Hạn chế): ${userProfile.dietaryNotes || "Không có"}
    - Thời gian nấu: Tối đa ${userProfile.cookingTime} phút/bữa.

    Yêu cầu:
    - 3 bữa/ngày (Sáng, Trưa, Tối).
    - Không trùng món chính trong tuần.
    - Cân bằng dinh dưỡng.
    - Tiết kiệm nguyên liệu (ví dụ: mua 1 con gà ăn 2 bữa khác nhau).
    - TUÂN THỦ NGHIÊM NGẶT các ghi chú về dị ứng và sở thích.
    
    Trả về JSON Array (7 phần tử):
    [
      {
        "day": "Thứ 2",
        "meals": {
          "breakfast": { "dishName": "...", "type": "breakfast", "notes": "..." },
          "lunch": { "dishName": "...", "type": "lunch" },
          "dinner": { "dishName": "...", "type": "dinner" }
        }
      },
      ...
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "[]";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Lỗi tạo thực đơn:", error);
    throw error;
  }
};

// --- 4. Generate Shopping List ---
export const generateShoppingList = async (mealPlan: DailyPlan[]): Promise<ShoppingItem[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Dựa trên thực đơn 7 ngày sau đây, hãy tạo danh sách đi chợ gộp (Shopping List).
    
    Thực đơn: ${JSON.stringify(mealPlan)}

    Yêu cầu:
    - Gộp các nguyên liệu trùng nhau và cộng dồn số lượng (ước lượng hợp lý).
    - Phân loại rõ ràng (Rau củ, Thịt cá, Gia vị, Đồ khô).
    
    Trả về JSON Array:
    [
      { "name": "Thịt ba chỉ", "amount": "500g", "category": "Thịt" },
      { "name": "Hành lá", "amount": "1 bó", "category": "Rau" }
      ...
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "[]";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Lỗi tạo danh sách mua sắm:", error);
    throw error;
  }
};
// --- 5. Recipe Remix Logic ---

// Helper to create a chat session specifically for remixing
export const createRemixChat = (recipeName: string) => {
  const model = "gemini-2.5-flash";
  return ai.chats.create({
    model,
    config: {
      systemInstruction: `
        Bạn là "Bếp Phó Dzui" chuyên giúp chỉnh sửa công thức nấu ăn.
        Đang thảo luận về món: "${recipeName}".
        
        Nhiệm vụ:
        1. Lắng nghe yêu cầu thay đổi của người dùng (ví dụ: "thêm cay", "đổi thịt heo thành gà", "nấu nhanh hơn").
        2. Tư vấn ngắn gọn về ảnh hưởng của thay đổi (vị, dinh dưỡng).
        3. Luôn giữ thái độ vui vẻ, khuyến khích.
        
        Phong cách: Ngắn gọn, súc tích, tập trung vào việc sửa món ăn.
      `,
    }
  });
};

// Generate the new recipe JSON based on chat history
export const remixRecipe = async (originalRecipe: Recipe, userRequest: string): Promise<Recipe> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Dựa trên công thức gốc và yêu cầu thay đổi của người dùng, hãy viết lại công thức mới.
    
    Công thức gốc: ${JSON.stringify(originalRecipe)}
    
    Yêu cầu chỉnh sửa (User Request): "${userRequest}"
    
    Yêu cầu đầu ra:
    - Giữ nguyên cấu trúc JSON.
    - Thay đổi tên món nếu cần (ví dụ: "Gà kho gừng" -> "Gà kho gừng (Phiên bản cay)").
    - Cập nhật nguyên liệu, các bước, và cả thông tin dinh dưỡng (healthInfo) cho phù hợp với thay đổi.
    - Đảm bảo logic nấu ăn hợp lý.
    
    Trả về JSON chuẩn của Recipe:
    {
      "name": "...",
      "description": "...",
      "ingredients": [...],
      "steps": [...],
      "cookingTime": "...",
      "difficulty": "...",
      "healthInfo": { ... }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Lỗi remix công thức:", error);
    throw error;
  }
};
