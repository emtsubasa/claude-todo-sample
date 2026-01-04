class TodoApp {
    constructor() {
        this.todos = this.loadFromLocalStorage();
        this.currentFilter = 'all';
        this.editingId = null;
        this.initElements();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveToLocalStorage();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    startEdit(id) {
        this.editingId = id;
        this.render();
    }

    saveEdit(id, newText) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo && newText.trim()) {
            todo.text = newText.trim();
            this.editingId = null;
            this.saveToLocalStorage();
            this.render();
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();

        this.todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            if (this.editingId === todo.id) {
                li.innerHTML = `
                    <input type="text" value="${this.escapeHtml(todo.text)}" class="edit-input" data-id="${todo.id}">
                    <button class="edit-btn save-btn" data-id="${todo.id}">保存</button>
                    <button class="delete-btn cancel-btn" data-id="${todo.id}">キャンセル</button>
                `;

                const input = li.querySelector('.edit-input');
                const saveBtn = li.querySelector('.save-btn');
                const cancelBtn = li.querySelector('.cancel-btn');

                input.focus();
                input.select();

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.saveEdit(todo.id, input.value);
                    } else if (e.key === 'Escape') {
                        this.cancelEdit();
                    }
                });

                saveBtn.addEventListener('click', () => {
                    this.saveEdit(todo.id, input.value);
                });

                cancelBtn.addEventListener('click', () => {
                    this.cancelEdit();
                });
            } else {
                li.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="edit-btn" data-id="${todo.id}">編集</button>
                    <button class="delete-btn" data-id="${todo.id}">削除</button>
                `;

                const checkbox = li.querySelector('input[type="checkbox"]');
                const editBtn = li.querySelector('.edit-btn');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => {
                    this.toggleTodo(todo.id);
                });

                editBtn.addEventListener('click', () => {
                    this.startEdit(todo.id);
                });

                deleteBtn.addEventListener('click', () => {
                    this.deleteTodo(todo.id);
                });
            }

            this.todoList.appendChild(li);
        });

        this.updateStats();
    }

    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(todo => !todo.completed).length;
        const completed = this.todos.filter(todo => todo.completed).length;

        this.totalCount.textContent = `全体: ${total}`;
        this.activeCount.textContent = `未完了: ${active}`;
        this.completedCount.textContent = `完了: ${completed}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('todos');
        return data ? JSON.parse(data) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
