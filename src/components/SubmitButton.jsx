// ============================================
// components/SubmitButton.jsx
// 
// 🎯 HOOK: useFormStatus (React 19 - simulated here)
// 📝 PURPOSE: Show loading state on submit button
// 
// Note: Real useFormStatus only works with <form action={}>
// We're simulating the same behavior
// ============================================

import React from 'react';
import { Loader, Plus } from 'lucide-react';

export const SubmitButton = ({ isPending, disabled }) => {
    return (
        <button
            type="submit"
            disabled={isPending || disabled}
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
                    <span>Add Todo</span>
                </>
            )}
        </button>
    );
};