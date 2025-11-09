// Import các class cần thiết
const { Controller } = require('../../js/controller.js');
const { TodoService } = require('../../js/model.js');
// Chúng ta cũng import View, nhưng chỉ để dùng làm "khuôn mẫu" cho bản mock
const { View } = require('../../js/view.js');

/**
 * Mocking the View
 * Chúng ta tạo một "bản giả" của View bằng cách sử dụng jest.fn()
 * cho tất cả các phương thức mà Controller sẽ gọi.
 * Điều này cho phép chúng ta test Controller mà không cần DOM.
 */
jest.mock('../../js/view.js', () => {
    // Đây là cú pháp của Jest để mock một module
    return {
        View: jest.fn().mockImplementation(() => {
            return {
                bindAddTodo: jest.fn(),
                bindToggleTodo: jest.fn(),
                bindRemoveTodo: jest.fn(),
                update: jest.fn() // Controller gọi update() trong initialize
            };
        })
    };
});

describe('Controller-Service Integration Tests', () => {
    let service;
    let view;
    let controller;

    beforeEach(() => {
        // Reset View mock trước mỗi test
        View.mockClear();

        // Tạo một instance thật của Service (Model)
        service = new TodoService();
        
        // Reset trạng thái của Singleton Service
        service.todos = []; 

        // Tạo một instance "giả" (mocked) của View
        view = new View();

        // Tạo một instance thật của Controller,
        // tiêm Service thật và View giả vào
        controller = new Controller(service, view);
        
        // Chạy hàm initialize để thiết lập các bindings
        controller.initialize();
    });

    /**
     * Test case 1:
     * Kiểm tra khi Controller xử lý 'addTodo', nó có gọi đúng 'addTodo' 
     * của Service và Service có cập nhật đúng dữ liệu không.
     */
    test('should add a todo through the controller', () => {
        // 1. Arrange
        const todoText = 'Integration test task';

        // 2. Act
        // Giả lập View gọi handler của Controller
        controller.handleAddTodo(todoText);

        // 3. Assert
        // Chúng ta kiểm tra trực tiếp Model (Service)
        const todos = service.getTodos();
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe(todoText);
    });

    /**
     * Test case 2:
     * Kiểm tra khi Controller xử lý 'removeTodo', nó có gọi đúng 'removeTodo'
     * của Service và Service có xóa đúng dữ liệu không.
     */
    test('should remove a todo through the controller', () => {
        // 1. Arrange
        // Thêm một item trước để có cái mà xóa
        controller.handleAddTodo('Task to be removed');
        const todos = service.getTodos();
        const todoId = todos[0].id;
        expect(todos).toHaveLength(1); // Đảm bảo đã thêm

        // 2. Act
        // Giả lập View gọi handler của Controller
        controller.handleRemoveTodo(todoId);

        // 3. Assert
        // Kiểm tra lại Model (Service)
        expect(service.getTodos()).toHaveLength(0);
    });
});