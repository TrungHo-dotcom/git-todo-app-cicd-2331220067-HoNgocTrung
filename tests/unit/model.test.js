// Import class TodoService từ file model.js
// Lưu ý: Cần điều chỉnh đường dẫn '../js/model.js' nếu cấu trúc thư mục của bạn khác
const { TodoService } = require('../../js/model.js');

describe('TodoService Unit Tests', () => {
    let service;

    // Hook 'beforeEach' của Jest sẽ chạy trước mỗi test case
    // Điều này đảm bảo mỗi test bắt đầu với một service "sạch"
    beforeEach(() => {
        service = new TodoService();
        // Vì TodoService là một Singleton, chúng ta cần một cách để reset
        // trạng thái của nó. Cách đơn giản nhất là xóa mảng todos.
        // Trong một ứng dụng thực tế, bạn có thể thêm một phương thức .reset()
        // chỉ dành cho testing.
        service.todos = []; 
    });

    /**
     * Test case 1:
     * Kiểm tra xem phương thức addTodo có thêm một item mới vào mảng 'todos' không.
     */
    test('should add a new todo item', () => {
        // 1. Arrange (Sắp xếp)
        const todoText = 'Test this task';

        // 2. Act (Hành động)
        service.addTodo(todoText);
        const todos = service.getTodos();

        // 3. Assert (Khẳng định)
        expect(todos).toHaveLength(1); // Mảng todos nên có 1 phần tử
        expect(todos[0].text).toBe(todoText); // Text của phần tử đó phải đúng
        expect(todos[0].completed).toBe(false); // Trạng thái ban đầu phải là false
    });

    /**
     * Test case 2:
     * Kiểm tra xem phương thức toggleTodoComplete có thay đổi trạng thái 'completed'.
     */
    test('should toggle the completed state of a todo', () => {
        // 1. Arrange
        service.addTodo('Task to toggle');
        const todoId = service.getTodos()[0].id; // Lấy ID của item vừa thêm

        // 2. Act (Lần 1)
        service.toggleTodoComplete(todoId);
        
        // 3. Assert (Lần 1)
        let todo = service.getTodos().find(t => t.id === todoId);
        expect(todo.completed).toBe(true); // Trạng thái nên là true

        // 2. Act (Lần 2) - Toggle ngược lại
        service.toggleTodoComplete(todoId);

        // 3. Assert (Lần 2)
        todo = service.getTodos().find(t => t.id === todoId);
        expect(todo.completed).toBe(false); // Trạng thái nên quay lại là false
    });

    /**
     * Test case 3:
     * Kiểm tra xem phương thức removeTodo có xóa một item khỏi mảng 'todos' không.
     */
    test('should remove a todo item', () => {
        // 1. Arrange
        service.addTodo('Task to delete');
        const todoId = service.getTodos()[0].id;
        expect(service.getTodos()).toHaveLength(1); // Đảm bảo item đã ở đó

        // 2. Act
        service.removeTodo(todoId);

        // 3. Assert
        expect(service.getTodos()).toHaveLength(0); // Mảng todos nên rỗng
    });

    /**
     * Test case 4 (để đáp ứng 4 test của rubric):
     * Kiểm tra xem addTodo có bỏ qua text rỗng không.
     */
    test('should not add a todo if the text is empty', () => {
        // 1. Arrange
        const emptyText = '';

        // 2. Act
        service.addTodo(emptyText);
        service.addTodo(null);
        service.addTodo(undefined);

        // 3. Assert
        const todos = service.getTodos();
        expect(todos).toHaveLength(0); // Không item nào được thêm
    });
});