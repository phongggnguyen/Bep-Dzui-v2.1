# Kế Hoạch Tái Cấu Trúc: Di Chuyển Vào src/

## Tổng Quan

**Mục tiêu:** Tái cấu trúc project để tất cả mã nguồn nằm trong thư mục `src/`, tách biệt rõ ràng khỏi các file cấu hình.

**Lý do:**
- Cải thiện tổ chức code (hiện tại: 22 file TypeScript/TSX nằm rải rác ở root)
- Tuân thủ chuẩn cấu trúc dự án React/Vite
- Dễ scale và maintain hơn

**Rủi ro:** Thấp (chỉ di chuyển file, không thay đổi logic)

---

## Tiêu Chí Thành Công

- [x] Tất cả file mã nguồn nằm trong `src/`
- [x] Ứng dụng build thành công (`npm run build`)
- [x] Dev server chạy ổn (`npm run dev`)
- [x] Tất cả tính năng hoạt động như cũ (auth, recipe generation, meal plan)
- [x] Không còn file `.temp.ts` trong codebase

---

## Cấu Trúc Thư Mục Mới

```
Bep-Dzui-v2.1/
├── src/
│   ├── assets/           # (tạo mới - để sau)
│   ├── components/       # (di chuyển từ root)
│   │   ├── AuthButton.tsx
│   │   ├── AuthInput.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── RecipeHistory.tsx
│   │   └── SousChefChat.tsx
│   ├── context/          # (di chuyển từ root)
│   │   └── AuthContext.tsx
│   ├── pages/            # (di chuyển từ root)
│   │   ├── Analyze.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MealPlan.tsx
│   │   ├── Profile.tsx
│   │   ├── Recipe.tsx
│   │   └── Signup.tsx
│   ├── services/         # (di chuyển từ root)
│   │   ├── firebaseService.ts
│   │   ├── geminiService.ts
│   │   └── recipeService.ts   # (XÓA .temp.ts)
│   ├── types/            # (tạo mới)
│   │   └── index.ts      # (di chuyển types.ts vào đây)
│   ├── utils/            # (di chuyển từ root)
│   │   └── firebaseErrors.ts
│   ├── App.tsx           # (di chuyển từ root)
│   ├── main.tsx          # (rename từ index.tsx)
│   └── index.css         # (tạo mới nếu cần)
├── public/               # (giữ nguyên)
├── index.html            # (giữ nguyên)
├── vite.config.ts        # (CẬP NHẬT paths)
├── tsconfig.json         # (CẬP NHẬT paths)
└── package.json          # (giữ nguyên)
```

---

## Chi Tiết Tasks

### PHASE 1: Chuẩn Bị (5 phút)

#### Task 1.1: Tạo cấu trúc thư mục `src/`
- **Agent:** `orchestrator`
- **Input:** Cấu trúc hiện tại (root)
- **Output:** Thư mục `src/` với các subdirectories
- **Commands:**
  ```powershell
  mkdir src
  mkdir src\components
  mkdir src\context
  mkdir src\pages
  mkdir src\services
  mkdir src\types
  mkdir src\utils
  mkdir src\assets
  ```
- **Verify:** `ls src` hiển thị 7 folders

---

### PHASE 2: Di Chuyển Files (10 phút)

#### Task 2.1: Di chuyển `components/`
- **Agent:** `orchestrator`
- **Input:** `./components/*.tsx`
- **Output:** `./src/components/*.tsx`
- **Commands:**
  ```powershell
  move components\*.tsx src\components\
  rmdir components
  ```
- **Verify:** `ls src\components` hiển thị 5 files

#### Task 2.2: Di chuyển `context/`
- **Agent:** `orchestrator`
- **Input:** `./context/AuthContext.tsx`
- **Output:** `./src/context/AuthContext.tsx`
- **Commands:**
  ```powershell
  move context\AuthContext.tsx src\context\
  rmdir context
  ```
- **Verify:** `ls src\context` hiển thị AuthContext.tsx

#### Task 2.3: Di chuyển `pages/`
- **Agent:** `orchestrator`
- **Input:** `./pages/*.tsx`
- **Output:** `./src/pages/*.tsx`
- **Commands:**
  ```powershell
  move pages\*.tsx src\pages\
  rmdir pages
  ```
- **Verify:** `ls src\pages` hiển thị 7 files

#### Task 2.4: Di chuyển `services/` và XÓA file .temp
- **Agent:** `orchestrator`
- **Input:** `./services/*.ts`
- **Output:** `./src/services/*.ts` (không bao gồm .temp.ts)
- **Commands:**
  ```powershell
  # Chỉ copy 3 files chính
  move services\firebaseService.ts src\services\
  move services\geminiService.ts src\services\
  move services\recipeService.ts src\services\
  # XÓA file temp
  del services\recipeService.temp.ts
  rmdir services
  ```
- **Verify:** `ls src\services` chỉ hiển thị 3 files (KHÔNG có .temp.ts)

#### Task 2.5: Di chuyển `utils/`
- **Agent:** `orchestrator`
- **Input:** `./utils/firebaseErrors.ts`
- **Output:** `./src/utils/firebaseErrors.ts`
- **Commands:**
  ```powershell
  move utils\firebaseErrors.ts src\utils\
  rmdir utils
  ```
- **Verify:** `ls src\utils` hiển thị firebaseErrors.ts

#### Task 2.6: Di chuyển `types.ts` → `src/types/index.ts`
- **Agent:** `orchestrator`
- **Input:** `./types.ts`
- **Output:** `./src/types/index.ts`
- **Commands:**
  ```powershell
  move types.ts src\types\index.ts
  ```
- **Verify:** `cat src\types\index.ts` hiển thị nội dung

#### Task 2.7: Di chuyển `App.tsx` và rename `index.tsx` → `main.tsx`
- **Agent:** `orchestrator`
- **Input:** `./App.tsx`, `./index.tsx`
- **Output:** `./src/App.tsx`, `./src/main.tsx`
- **Commands:**
  ```powershell
  move App.tsx src\App.tsx
  move index.tsx src\main.tsx
  ```
- **Verify:** `ls src` hiển thị App.tsx và main.tsx

---

### PHASE 3: Cập Nhật Cấu Hình (10 phút)

#### Task 3.1: Cập nhật `vite.config.ts`
- **Agent:** `orchestrator`
- **Input:** `vite.config.ts` hiện tại
- **Output:** `vite.config.ts` với alias mới
- **Changes:**
  ```diff
  - '@': path.resolve(__dirname, '.'),
  + '@': path.resolve(__dirname, './src'),
  ```
- **Verify:** File chứa `'@': path.resolve(__dirname, './src')`

#### Task 3.2: Cập nhật `tsconfig.json`
- **Agent:** `orchestrator`
- **Input:** `tsconfig.json` hiện tại
- **Output:** `tsconfig.json` với paths mới
- **Changes:**
  ```diff
  "paths": {
  -   "@/*": ["./*"]
  +   "@/*": ["./src/*"]
  }
  ```
- **Verify:** File chứa `"@/*": ["./src/*"]`

#### Task 3.3: Cập nhật `index.html`
- **Agent:** `orchestrator`
- **Input:** `index.html`
- **Output:** `index.html` với script tag mới
- **Changes:**
  ```diff
  - <script type="module" src="/index.tsx"></script>
  + <script type="module" src="/src/main.tsx"></script>
  ```
- **Verify:** File chứa `src="/src/main.tsx"`

---

### PHASE 4: Cập Nhật Import Paths (15 phút)

#### Task 4.1: Cập nhật imports trong `src/App.tsx`
- **Agent:** `orchestrator`
- **Input:** `src/App.tsx`
- **Output:** Updated imports
- **Changes:**
  ```diff
  - import HomePage from './pages/Home';
  + import HomePage from '@/pages/Home';
  - import { UserProfile } from './types';
  + import { UserProfile } from '@/types';
  - import { useAuth } from './context/AuthContext';
  + import { useAuth } from '@/context/AuthContext';
  ```
- **Dependencies:** Task 2.7 complete
- **Verify:** `npm run build` không báo lỗi import

#### Task 4.2: Cập nhật imports trong `src/main.tsx`
- **Agent:** `orchestrator`
- **Input:** `src/main.tsx`
- **Output:** Updated imports
- **Changes:**
  ```diff
  - import App from './App';
  + import App from '@/App';
  - import { AuthProvider } from './context/AuthContext';
  + import { AuthProvider } from '@/context/AuthContext';
  ```
- **Verify:** File sử dụng `@/` alias

#### Task 4.3: Cập nhật imports trong tất cả `src/pages/*.tsx`
- **Agent:** `orchestrator`
- **Input:** 7 files trong `src/pages/`
- **Output:** All files với `@/` imports
- **Changes:** Thay tất cả relative imports (`../`, `./`) bằng `@/`
- **Verify:** Grep `from '\.\./` returns 0 results trong src/

#### Task 4.4: Cập nhật imports trong `src/components/*.tsx`
- **Agent:** `orchestrator`
- **Input:** 5 files trong `src/components/`
- **Output:** All files với `@/` imports
- **Changes:** Thay tất cả relative imports bằng `@/`
- **Verify:** Tất cả imports dùng `@/`

#### Task 4.5: Cập nhật imports trong `src/context/AuthContext.tsx`
- **Agent:** `orchestrator`
- **Input:** `src/context/AuthContext.tsx`
- **Output:** Updated imports
- **Changes:**
  ```diff
  - import { UserProfile } from '../types';
  + import { UserProfile } from '@/types';
  - from '../services/firebaseService'
  + from '@/services/firebaseService'
  ```
- **Verify:** File sử dụng `@/` alias

---

### PHASE X: Verification (10 phút)

#### Verify X.1: Build Success
- **Command:** `npm run build`
- **Expected:** Build thành công, không có errors
- **If fails:** Kiểm tra lại import paths

#### Verify X.2: Dev Server
- **Command:** `npm run dev`
- **Expected:** Server khởi động ở `http://localhost:3000`
- **Manual Test:**
  1. Mở browser, truy cập `http://localhost:3000`
  2. Đăng nhập / Đăng ký hoạt động
  3. Tạo công thức hoạt động
  4. Meal plan hoạt động
  5. Profile hoạt động

#### Verify X.3: No Temp Files
- **Command:** `Get-ChildItem -Recurse -Filter "*.temp.*"`
- **Expected:** Không tìm thấy file nào

#### Verify X.4: Clean Structure
- **Command:** `ls`
- **Expected:** Root chỉ còn: `src/`, `public/`, `index.html`, config files, `node_modules/`

---

## Rollback Plan

Nếu có lỗi:
1. **Git reset:** `git reset --hard HEAD` (nếu đã commit trước đó)
2. **Manual rollback:** Di chuyển files từ `src/` về root
3. **Restore configs:** Khôi phục `vite.config.ts`, `tsconfig.json`, `index.html`

---

## Checklist Hoàn Thành

- [ ] Tất cả files đã di chuyển vào `src/`
- [ ] File `.temp.ts` đã bị xóa
- [ ] Config files đã được cập nhật
- [ ] Import paths đã được cập nhật sang `@/` alias
- [ ] `npm run build` thành công
- [ ] `npm run dev` chạy ổn
- [ ] Manual test tất cả features
