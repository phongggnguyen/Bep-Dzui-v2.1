# Plan: Persist Meal Plan

## Context
**User Request:** "ở chức năng thực đơn tuần sau khi tạo xong thực đơn tuần thì chuyển sang tab khác và quay lại thì mất. tôi muốn lưu trữ tạm thời trên trang web cho đến khi người dùng xóa hoặc tạo lại thực đơn mới"
**Analysis:**
- Current state is held in React `useState`, causing data loss on unmount (navigation).
- User wants client-side persistence ("lưu trữ tạm thời trên trang web").
- Data needs to persist until explicit reset or clear.

## Goals
1. Persist `DailyPlan[]` and `ShoppingItem[]` to `localStorage`.
2. Load data from `localStorage` on component mount.
3. Clear/Update `localStorage` when user generates a new plan.
4. Add a "Clear Plan" (Xóa thực đơn) button to satisfy "cho đến khi người dùng xóa".

## Task Breakdown

### Phase 1: Storage Logic
- [ ] Define storage keys (e.g., `bepdzui_meal_plan_{userId}`, `bepdzui_shopping_list_{userId}`).
- [ ] Create utility functions for saving/loading/clearing local storage safely.

### Phase 2: Update MealPlan.tsx
- [ ] Initialize `plan` and `shoppingList` state from `localStorage` (lazy initialization).
- [ ] Update `createPlan` to save new plan to storage.
- [ ] Update `createShoppingList` to save list to storage.
- [ ] Add `useEffect` to sync state changes to storage (optional, or just save on mutation).

### Phase 3: UI Enhancements
- [ ] Add "Xóa thực đơn" (Delete Plan) button.
- [ ] Implement clear logic: wipe state and storage.

## Verification Plan
1. Generate a meal plan.
2. Refresh the page or navigate away and back.
3. Verify the plan is still displayed.
4. Click "Tạo lại thực đơn" -> Verify new plan overwrites old one.
5. Click "Xóa thực đơn" -> Verify plan is gone and storage is empty.

## Agent Assignments
- **Frontend Specialist**: Implement React state changes and localStorage logic.
