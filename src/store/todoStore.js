export const createTodoStore = () => {
    // Private state - not directly accessible
    let listeners = new Set();
    let todos = [];

    // Initialize from localStorage
    try {
        const stored = localStorage.getItem('todos');
        todos = stored ? JSON.parse(stored) : [];
    } catch {
        todos = [];
    }

    return {
        // Subscribe pattern - React needs this
        subscribe(listener) {
            listeners.add(listener);
            // Return unsubscribe function (cleanup)
            return () => listeners.delete(listener);
        },

        // Get current snapshot - React reads this
        getSnapshot() {
            return todos;
        },

        // Update store - notify all subscribers
        updateTodos(newTodos) {
            todos = newTodos;

            // Persist to localStorage
            try {
                localStorage.setItem('todos', JSON.stringify(todos));
            } catch (err) {
                console.error('Failed to persist:', err);
            }

            // Notify React components
            listeners.forEach(listener => listener());
        }
    };
};

// Single instance - shared across app
export const todoStore = createTodoStore();