// Import các hàm 'test' và 'expect' từ thư viện Playwright
const { test, expect } = require('@playwright/test');

/**
 * Định nghĩa một test suite cho 'Todo App E2E Tests'
 */
test.describe('Todo App E2E Tests', () => {
    let page;

    /**
     * Hook 'beforeEach' sẽ chạy trước mỗi test.
     * Nó điều hướng trình duyệt đến file index.html của bạn.
     *
     * QUAN TRỌNG:
     * Đảm bảo rằng bạn đã MỞ file 'index.html' trong một trình duyệt
     * HOẶC chạy một máy chủ cục bộ.
     *
     * Cách dễ nhất (không cần máy chủ):
     * 1. Lấy đường dẫn tuyệt đối đến file 'index.html'.
     * (ví dụ: /Users/your-name/project/index.html)
     * 2. Đổi 'http://127.0.0.1:5500/index.html' thành:
     * 'file:///Users/your-name/project/index.html'
     *
     * Cách khuyến nghị (dùng máy chủ):
     * 1. Cài đặt 'live-server': npm install -g live-server
     * 2. Chạy 'live-server' trong thư mục gốc của dự án.
     * 3. Nó sẽ mở trang của bạn tại địa chỉ như http://127.0.0.1:8080
     * 4. Cập nhật URL dưới đây cho đúng.
     *
     * Tạm thời, chúng ta sẽ dùng 'file://' với đường dẫn tương đối.
     * Hãy thay thế 'PATH_TO_YOUR_PROJECT' bằng đường dẫn thật.
     */
    beforeEach(async () => {
        // Playwright cần một URL. Chúng ta sẽ dùng 'file://' để trỏ đến file HTML.
        // Bạn CẦN thay đổi đường dẫn này cho đúng với máy của bạn.
        // Ví dụ: 'file:///C:/Users/Admin/MyProject/git-todo-app/index.html' (Windows)
        // Ví dụ: 'file:///Users/your-name/git-todo-app/index.html' (MacOS/Linux)
        
        // CÁCH TỐT NHẤT:
        // Sử dụng 'path' để lấy đường dẫn tuyệt đối một cách tự động
        const path = require('path');
        const fileUrl = `file://${path.join(__dirname, '../../index.html')}`;

        // Mở trang
        await test.page.goto(fileUrl);
        page = test.page; // Gán page để các test khác có thể dùng
    });

    /**
     * Test case 1:
     * Kiểm tra toàn bộ luồng: Thêm, Hoàn thành, và Xóa một To-Do.
     */
    test('should allow a user to add, complete, and delete a todo', async () => {
        
        // --- 1. Thêm một To-Do mới (Part 4 - Test 1) ---
        const taskText = 'My new E2E task';
        
        // Tìm ô input bằng ID và gõ chữ vào
        await page.locator('#todo-input').fill(taskText);
        
        // Tìm nút "Add" bằng ID và click
        await page.locator('#add-todo-btn').click();

        // --- 2. Kiểm tra item đã được thêm (Part 4 - Test 2) ---
        // 'locator' tìm một phần tử trên trang.
        // Chúng ta tìm 'li' có chứa text 'My new E2E task'
        const todoItem = page.locator(`li:has-text("${taskText}")`);
        
        // Khẳng định rằng item đó có thể nhìn thấy được
        await expect(todoItem).toBeVisible();
        // Khẳng định rằng nó chưa có class 'completed'
        await expect(todoItem).not.toHaveClass(/completed/);

        // --- 3. Hoàn thành To-Do (Part 4 - Test 3) ---
        
        // Trong 'todoItem', tìm 'input[type="checkbox"]' và click vào nó
        await todoItem.locator('input[type="checkbox"]').click();
        
        // Khẳng định rằng item BÂY GIỜ đã có class 'completed'
        await expect(todoItem).toHaveClass(/completed/);

        // --- 4. Xóa To-Do (Part 4 - Test 4) ---
        
        // Trong 'todoItem', tìm 'button.delete-btn' và click vào nó
        await todoItem.locator('button.delete-btn').click();
        
        // Khẳng định rằng item đó KHÔNG CÒN tồn tại trên trang
        await expect(todoItem).not.toBeVisible();
    });
});