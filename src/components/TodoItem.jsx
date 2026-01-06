// ============================================
// components/TodoItem.jsx
// 
// 🎯 HOOK: useTransition
// 📝 WORLD-CLASS PATTERN: Non-blocking UI Updates
// 
// BEST PRACTICE: Use useTransition for operations that:
// 1. Take time (API calls, heavy computations)
// 2. Should not block user interactions
// 3. Need visual feedback while processing
// ============================================

import React, { useState, useTransition } from 'react';
import { Trash2, Edit2, Check, X, Loader } from 'lucide-react';

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {

    // ============================================
    // useTransition: Keep UI responsive
    // isPending - true while transition is running
    // startTransition - wrap non-urgent updates
    // ============================================
    const [isPending, startTransition] = useTransition();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const isOptimistic = todo.id.toString().startsWith('temp-');

    // ============================================
    // WORLD-CLASS PATTERN: Transition wrapper for async operations
    // ============================================
    const handleToggle = () => {
        startTransition(() => {
            // Mark as non-urgent - React keeps UI responsive
            onToggle(todo.id);
        });
    };

    const handleDelete = () => {
        startTransition(() => {
            onDelete(todo.id);
        });
    };

    const handleSave = () => {
        if (!editText.trim()) return;

        startTransition(() => {
            onUpdate(todo.id, editText);
        });

        setIsEditing(false);
    };

    return (
        <div className={`
      group flex items-center gap-4 p-5 border-b border-gray-200 
      hover:bg-gray-50 transition-all
      ${isPending ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
      ${isOptimistic ? 'bg-orange-50 border-l-4 border-orange-500' : ''}
    `}>

            {/* Checkbox with loading state */}
            <div className="relative flex-shrink-0">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                    disabled={isPending || isOptimistic}
                    className="w-6 h-6 text-blue-500 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                    </div>
                )}
            </div>

            {/* Todo text or edit input */}
            {isEditing ? (
                <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') {
                            setEditText(todo.text);
                            setIsEditing(false);
                        }
                    }}
                    className="flex-1 px-3 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                    autoFocus
                />
            ) : (
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <span
                        className={`text-lg break-words ${todo.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-800'
                            }`}
                        onDoubleClick={() => !isOptimistic && !isPending && setIsEditing(true)}
                        title="Double-click to edit"
                    >
                        {todo.text}
                    </span>

                    {/* Visual indicators */}
                    {isOptimistic && (
                        <span className="flex-shrink-0 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-medium animate-pulse">
                            Optimistic
                        </span>
                    )}

                    {isPending && (
                        <span className="flex-shrink-0 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <Loader className="w-3 h-3 animate-spin" />
                            Updating
                        </span>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex-shrink-0 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Save (Enter)"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setEditText(todo.text);
                                setIsEditing(false);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cancel (Esc)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isOptimistic || isPending}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                            title="Edit todo"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isOptimistic || isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                            title="Delete todo"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};