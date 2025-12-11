import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 2000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50">
            <span>{message}</span>
            <button
                onClick={onClose}
                className="hover:bg-green-700 p-1 rounded transition"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
