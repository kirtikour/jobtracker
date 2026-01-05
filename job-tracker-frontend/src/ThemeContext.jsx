import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    dark: {
        mode: 'dark',
        colors: {
            primaryBg: '#033f47',
            secondaryBg: '#022e38',
            tertiaryBg: '#044956',
            accent: '#c1ff72',
            textPrimary: '#d7f5e7',
            textSecondary: '#a0a0a0',
            textHighlight: '#c1ff72',
            border: '#044956',
            cardBg: '#022e38',
            modalOverlay: 'rgba(0, 0, 0, 0.45)'
        }
    },
    light: {
        mode: 'light',
        colors: {
            primaryBg: '#f0fdf4', // Mint green background
            secondaryBg: '#ffffff', // White cards/navbar
            tertiaryBg: '#dcfce7', // Slightly darker mint
            accent: '#14532d',     // Green-900 (Much darker for contrast)
            secondary: '#14532d',  // Green-900
            textPrimary: '#111827', // Gray-900
            textSecondary: '#4b5563', // Gray-600
            textHighlight: '#14532d', // Green-900
            border: '#14532d',     // Green-900
            cardBg: '#ffffff',
            modalOverlay: 'rgba(0, 0, 0, 0.25)'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('appTheme', newTheme);
    };

    const currentTheme = themes[theme];

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, isDarkMode: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
