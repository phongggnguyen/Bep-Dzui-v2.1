# 🔧 Firestore Setup Guide - Recipe History

## ⚠️ Vấn Đề: Không thấy công thức sau khi lưu

Nếu bạn thấy thông báo "Đã lưu thành công" nhưng khi vào lịch sử không thấy gì, có thể do:

### 1. **Firestore Index Chưa Được Tạo** (Nguyên nhân phổ biến nhất)

#### Cách kiểm tra:
1. Mở **Browser Console** (F12)
2. Click "Lịch sử"
3. Xem có error không

#### Lỗi thường gặp:
```
Error: The query requires an index. You can create it here: [LINK]
```

#### Cách fix:
1. **CLICK VÀO LINK** trong error message
2. Link sẽ mở Firebase Console
3. Click nút **"Create Index"**
4. Đợi 2-5 phút để index build
5. Refresh lại trang
6. Click "Lịch sử" lại

---

### 2. **Firestore Rules Chưa Được Setup**

#### Vào Firebase Console:
1. Vào **Firestore Database**
2. Tab **Rules**
3. Thay rules bằng code này:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Recipes collection
    match /recipes/{recipeId} {
      // Cho phép đọc recipe của chính mình
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      // Cho phép tạo recipe mới
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;

      // Cho phép update/delete recipe của chính mình
      allow update, delete: if request.auth != null
                            && resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Click **"Publish"**

---

### 3. **Debug Steps**

#### Bước 1: Kiểm tra Console Logs
Sau khi click "Lưu công thức", check console:

```javascript
// Nên thấy:
"Saving recipe with data: { userId: '...', query: '...', recipeName: '...' }"
"Recipe saved successfully with ID: xyz123"
```

#### Bước 2: Kiểm tra Firestore Database
1. Vào Firebase Console → Firestore Database
2. Xem collection `recipes`
3. Kiểm tra có document mới không
4. Xem field `userId` có match với user hiện tại không

#### Bước 3: Kiểm tra khi Load History
Click "Lịch sử", check console:

```javascript
// Nên thấy:
"Loading recipes for user: xyz..."
"Fetching recipes for userId: xyz..."
"Found recipes: 1" (hoặc số lượng recipes)
```

#### Bước 4: Nếu Found recipes = 0
- Kiểm tra userId có đúng không
- Vào Firestore xem field `userId` trong documents
- So sánh với userId trong console log

---

### 4. **Manual Test Recipe Save**

#### Test trực tiếp từ Firebase Console:
1. Vào Firestore Database
2. Collection `recipes`
3. Click **"Add document"**
4. Document ID: Auto-ID
5. Thêm fields:

```
userId: [YOUR_USER_ID_FROM_CONSOLE]
query: "test"
name: "Test Recipe"
description: "Testing"
ingredients: []
steps: []
cookingTime: "30 phút"
difficulty: "Dễ"
createdAt: [Click "timestamp", chọn "now"]
isFavorite: false
```

6. Save
7. Refresh app
8. Click "Lịch sử" → Nên thấy recipe test

---

### 5. **Common Errors & Solutions**

#### Error: "Missing or insufficient permissions"
**Fix:** Setup Firestore Rules (xem mục 2)

#### Error: "The query requires an index"
**Fix:** Click link trong error, tạo index (xem mục 1)

#### Error: "Cannot read property 'uid' of null"
**Fix:** User chưa login, check authentication

#### Recipes = 0 nhưng Firestore có data
**Fix:** userId không match, check console logs

---

### 6. **Quick Checklist**

- [ ] Firebase project đã được khởi tạo
- [ ] Firestore Database đã được enable
- [ ] Firestore Rules đã được setup
- [ ] Composite Index đã được tạo (userId + createdAt)
- [ ] User đã login thành công
- [ ] Console không có errors
- [ ] Có thể thấy data trong Firestore Console

---

### 7. **Environment Variables**

Kiểm tra file `.env.local` có đủ config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 8. **Debug Commands**

Thêm vào console để test:

```javascript
// Check current user
console.log('Current user:', firebase.auth().currentUser);

// Check user ID
console.log('User ID:', firebase.auth().currentUser?.uid);

// Manual save test
import { saveRecipe } from './services/recipeService';
const testRecipe = {
  name: "Test",
  description: "Test",
  ingredients: [],
  steps: [],
  cookingTime: "30 phút",
  difficulty: "Dễ"
};
saveRecipe('YOUR_USER_ID', testRecipe, 'test query');
```

---

### 9. **Index Creation (Manual)**

Nếu không có error link, tạo index thủ công:

1. Firebase Console → Firestore → Indexes
2. Click **"Create Index"**
3. Collection ID: `recipes`
4. Fields to index:
   - `userId` - Ascending
   - `createdAt` - Descending
5. Query scope: Collection
6. Click **"Create"**
7. Đợi build (2-5 phút)

---

## 🎯 Expected Behavior

### Khi lưu thành công:
1. Alert "Đã lưu công thức thành công! 🎉"
2. Console: "Recipe saved successfully with ID: xyz"
3. Firestore: Document mới xuất hiện
4. Lịch sử: Recipe hiển thị ngay lập tức

### Khi load lịch sử:
1. Loading spinner
2. Console: "Found recipes: X"
3. UI: Hiển thị X recipe cards
4. Nếu X = 0: Hiển thị "Chưa có công thức nào"

---

## 📞 Support

Nếu vẫn không được:

1. **Check Console Logs** - F12 → Console tab
2. **Check Network Tab** - Xem Firestore requests
3. **Check Firestore Console** - Xem data có lưu không
4. **Share error message** - Copy full error từ console

---

## ✅ Verification Steps

Sau khi setup xong, test:

1. Login vào app
2. Tạo 1 recipe
3. Click "Lưu công thức"
4. Thấy success message
5. Click "Lịch sử"
6. Thấy recipe vừa lưu
7. Click vào recipe → Load lại
8. Click heart → Favorite
9. Filter "Yêu thích" → Thấy recipe
10. Click trash → Delete → Xác nhận

Nếu tất cả pass → Setup thành công! ✅
