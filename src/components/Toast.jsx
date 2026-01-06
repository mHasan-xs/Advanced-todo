// ============================================
// components/Toast.jsx
// 
// Simple notification popup
// (No special hooks - just regular React)
// ============================================

import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export const Toast = ({ message, type, onClose }) => {
    // Auto-close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const color = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed top-4 right-4 ${color} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}>
            <AlertCircle className="w-5 h-5" />
            <span>{message}</span>
        </div>
    );
};