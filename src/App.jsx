// ============================================
// App.jsx - Main Component
// 
// 🎯 HOOKS DEMONSTRATED:
// 1. useSyncExternalStore - Sync with localStorage
// 2. useOptimistic - Instant UI updates
// 3. useTransition - Non-blocking updates
//
// 📝 WORLD-CLASS PATTERNS:
// - Optimistic updates for all mutations
// - Automatic rollback on errors
// - Non-blocking UI during async operations
// - Clear visual feedback for all states
// ============================================

import React, { useState, useOptimistic, useTransition, useSyncExternalStore } from 'react';
import { Database, X } from 'lucide-react';

import { todoStore } from './store/todoStore';
import { todoApi } from './api/todoApi';
import { Toast } from './components/Toast';
import { NetworkStatus } from './components/NetworkStatus';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoItem } from './components/TodoItem';
import { HooksExplanation } from './components/HooksExplanation';

export default function App() {

  // ============================================
  // 1️⃣ useSyncExternalStore
  // PATTERN: Subscribe to external data source
  // ============================================
  const storedTodos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    () => [] // Server-side fallback
  );

  // ============================================
  // 2️⃣ useOptimistic
  // PATTERN: Optimistic UI updates
  // Shows changes immediately, rolls back on error
  // ============================================
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    storedTodos,
    (state, newTodo) => [...state, newTodo]
  );

  // ============================================
  // 3️⃣ useTransition
  // PATTERN: Non-blocking state updates
  // Keeps UI responsive during async operations
  // ============================================
  const [isPending, startTransition] = useTransition();

  // UI state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // ============================================
  // ADD TODO
  // WORLD-CLASS PATTERN: Optimistic + Transition
  // ============================================
  const handleAddTodo = async (text) => {
    const tempTodo = {
      id: 'temp-' + Date.now(),
      text,
      completed: false
    };

    // Non-blocking update
    startTransition(async () => {
      // Show optimistically
      addOptimisticTodo(tempTodo);

      try {
        const newTodo = await todoApi.addTodo(text);

        // Replace temp with real
        todoStore.updateTodos([...storedTodos, newTodo]);
        showToast('Todo added successfully');

      } catch (error) {
        // Optimistic update auto-rolls back
        showToast(error.message, 'error');
        throw error;
      }
    });
  };

  // ============================================
  // TOGGLE TODO
  // WORLD-CLASS PATTERN: Optimistic update with rollback
  // ============================================
  const handleToggleTodo = async (id) => {
    const original = [...storedTodos];

    // Update optimistically
    const updated = storedTodos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    );

    todoStore.updateTodos(updated);

    try {
      await todoApi.toggleTodo(id);
    } catch (error) {
      // Rollback on error
      todoStore.updateTodos(original);
      showToast('Failed to toggle todo', 'error');
    }
  };

  // ============================================
  // DELETE TODO
  // WORLD-CLASS PATTERN: Optimistic delete with rollback
  // ============================================
  const handleDeleteTodo = async (id) => {
    const original = [...storedTodos];

    // Delete optimistically
    const updated = storedTodos.filter(todo => todo.id !== id);
    todoStore.updateTodos(updated);

    try {
      await todoApi.deleteTodo(id);
      showToast('Todo deleted');
    } catch (error) {
      // Rollback on error
      todoStore.updateTodos(original);
      showToast('Failed to delete todo', 'error');
    }
  };

  // ============================================
  // UPDATE TODO
  // WORLD-CLASS PATTERN: Optimistic update
  // ============================================
  const handleUpdateTodo = async (id, newText) => {
    const original = [...storedTodos];

    // Update optimistically
    const updated = storedTodos.map(todo =>
      todo.id === id
        ? { ...todo, text: newText }
        : todo
    );

    todoStore.updateTodos(updated);

    try {
      await todoApi.updateTodo(id, newText);
      showToast('Todo updated');
    } catch (error) {
      // Rollback on error
      todoStore.updateTodos(original);
      showToast('Failed to update todo', 'error');
    }
  };

  // ============================================
  // CLEAR ALL
  // ============================================
  const handleClearAll = () => {
    if (window.confirm('Delete all todos? This cannot be undone.')) {
      todoStore.updateTodos([]);
      showToast('All todos cleared');
    }
  };

  // Stats
  const stats = {
    total: optimisticTodos.length,
    completed: optimisticTodos.filter(t => t.completed).length,
    active: optimisticTodos.filter(t => !t.completed).length,
    optimistic: optimisticTodos.filter(t =>
      t.id.toString().startsWith('temp-')
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            React Hooks Demo
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            World-class patterns for useOptimistic, useTransition & useSyncExternalStore
          </p>

          <div className="flex items-center justify-center gap-4">
            <NetworkStatus />

            {storedTodos.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Add Form */}
          <div className="p-8 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <AddTodoForm
              onSubmit={handleAddTodo}
              isPending={isPending}
            />

            {/* Pending indicator */}
            {isPending && (
              <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Processing... (UI stays responsive!)</span>
              </div>
            )}
          </div>

          {/* Todo List */}
          <div className="max-h-[500px] overflow-y-auto">
            {optimisticTodos.length === 0 ? (
              <div className="p-20 text-center">
                <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-2xl text-gray-400 mb-2">No todos yet</p>
                <p className="text-gray-500">Add one above to see optimistic updates in action!</p>
              </div>
            ) : (
              optimisticTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))
            )}
          </div>

          {/* Stats */}
          <div className="p-6 bg-gray-50 border-t-2 border-gray-100">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{stats.optimistic}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanations */}
        <HooksExplanation />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}