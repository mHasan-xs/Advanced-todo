import { useState } from 'react';
import { Loader, Plus } from 'lucide-react';

export const AddTodoForm = ({ onSubmit, isPending }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = input.trim();

        // Validation
        if (!text) {
            setError('Please enter a todo');
            return;
        }

        // Clear input immediately for better UX
        const originalInput = input;
        setInput('');
        setError(null);

        try {
            await onSubmit(text);
        } catch (err) {
            // Restore input on error
            setInput(originalInput);
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What needs to be done?"
                    disabled={isPending}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg disabled:bg-gray-50 disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={isPending || !input.trim()}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold"
                >
                    {isPending ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Add</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                    ❌ {error}
                </div>
            )}
        </form>
    );
};