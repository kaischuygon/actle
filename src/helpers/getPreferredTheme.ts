import { Theme } from '../components/ThemeController';

export function getPreferredTheme(themes:Theme[]) {
    // Load from localStorage or find preffered color scheme
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.includes(savedTheme)) {
        return savedTheme;
    }
    
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};