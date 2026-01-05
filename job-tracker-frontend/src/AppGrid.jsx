import React from 'react';
import { useTheme } from './ThemeContext';

const AppGrid = () => {
    const { theme, isDarkMode } = useTheme();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: isDarkMode ? 0.05 : 0.15, // Higher opacity for light mode contrast
            backgroundImage: `
        linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px),
        linear-gradient(0deg, ${theme.colors.border} 1px, transparent 1px)
      `,
            backgroundSize: '40px 40px'
        }} />
    );
};

export default AppGrid;
