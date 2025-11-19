
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalyzedDish, Recipe, DailyPlan, ShoppingItem } from "../types";

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
      "quickVersion": "Phiên bản nấu nhanh trong 15p (nếu có thể)"
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
