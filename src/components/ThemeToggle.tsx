import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
    compact?: boolean;
}

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    if (compact) {
        return (
            <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200 border border-orange-100/50 dark:border-gray-700 shadow-sm flex items-center justify-center"
                aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 w-full"
            aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
        </button>
    );
};

export default ThemeToggle;
