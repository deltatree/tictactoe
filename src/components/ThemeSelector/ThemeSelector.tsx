import React from 'react';
import './ThemeSelector.css';

export type Theme = 'colorful' | 'dark' | 'ocean' | 'forest';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'colorful', label: 'Bunt', icon: '🌈' },
    { value: 'dark', label: 'Dunkel', icon: '🌙' },
    { value: 'ocean', label: 'Ozean', icon: '🌊' },
    { value: 'forest', label: 'Wald', icon: '🌲' },
  ];

  return (
    <div className="theme-selector">
      <label className="theme-label">
        🎨 <span>Farbschema:</span>
      </label>
      <div className="theme-buttons">
        {themes.map((theme) => (
          <button
            key={theme.value}
            className={`theme-button ${currentTheme === theme.value ? 'active' : ''}`}
            onClick={() => onThemeChange(theme.value)}
            title={theme.label}
          >
            <span className="theme-icon">{theme.icon}</span>
            <span className="theme-name">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
