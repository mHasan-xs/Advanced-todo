// ============================================
// components/NetworkStatus.jsx
// 
// 🎯 HOOK: useSyncExternalStore
// 📝 PURPOSE: Show online/offline status
// 
// This connects React to browser's navigator.onLine
// ============================================

import React, { useSyncExternalStore } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus = () => {
    // Connect to browser's online/offline events
    const isOnline = useSyncExternalStore(
        // 1. Subscribe: Listen to browser events
        (callback) => {
            window.addEventListener('online', callback);
            window.addEventListener('offline', callback);

            // Cleanup function
            return () => {
                window.removeEventListener('online', callback);
                window.removeEventListener('offline', callback);
            };
        },

        // 2. Get snapshot: What's the current value?
        () => navigator.onLine,

        // 3. Server fallback (assume online on server)
        () => true
    );

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-semibold">
                {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
            <span className="text-xs opacity-70">(useSyncExternalStore)</span>
        </div>
    );
};