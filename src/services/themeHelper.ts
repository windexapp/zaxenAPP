import { AccentColor } from '../types';

export interface ThemeConfig {
  id: AccentColor;
  label: string;
  primaryHex: string;
  glowHex: string;
  rgb: string;
  bgGradient: string;
  hoverGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export const THEMES: Record<AccentColor, ThemeConfig> = {
  red: {
    id: 'red',
    label: 'ZAXEN Red',
    primaryHex: '#e11d48',
    glowHex: 'rgba(225, 29, 72, 0.45)',
    rgb: '225, 29, 72',
    bgGradient: 'from-[#e11d48] to-[#be123c]',
    hoverGradient: 'hover:from-[#f43f5e] hover:to-[#e11d48]',
    borderColor: 'border-[#e11d48]/40',
    badgeBg: 'bg-[#e11d48]/20',
    badgeText: 'text-[#ff4d73]',
  },
  blue: {
    id: 'blue',
    label: 'Cyber Blue',
    primaryHex: '#3b82f6',
    glowHex: 'rgba(59, 130, 246, 0.45)',
    rgb: '59, 130, 246',
    bgGradient: 'from-[#2563eb] to-[#1d4ed8]',
    hoverGradient: 'hover:from-[#3b82f6] hover:to-[#2563eb]',
    borderColor: 'border-blue-500/40',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
  },
  purple: {
    id: 'purple',
    label: 'Neon Purple',
    primaryHex: '#a855f7',
    glowHex: 'rgba(168, 85, 247, 0.45)',
    rgb: '168, 85, 247',
    bgGradient: 'from-[#9333ea] to-[#7e22ce]',
    hoverGradient: 'hover:from-[#a855f7] hover:to-[#9333ea]',
    borderColor: 'border-purple-500/40',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
  },
  green: {
    id: 'green',
    label: 'Toxic Green',
    primaryHex: '#10b981',
    glowHex: 'rgba(16, 185, 129, 0.45)',
    rgb: '16, 185, 129',
    bgGradient: 'from-[#059669] to-[#047857]',
    hoverGradient: 'hover:from-[#10b981] hover:to-[#059669]',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
  },
  gold: {
    id: 'gold',
    label: 'Apex Gold',
    primaryHex: '#f59e0b',
    glowHex: 'rgba(245, 158, 11, 0.45)',
    rgb: '245, 158, 11',
    bgGradient: 'from-[#d97706] to-[#b45309]',
    hoverGradient: 'hover:from-[#f59e0b] hover:to-[#d97706]',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
  },
};

export function applyThemeVariables(color: AccentColor): void {
  const cfg = THEMES[color] || THEMES.red;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', cfg.primaryHex);
    root.style.setProperty('--accent-glow', cfg.glowHex);
    root.style.setProperty('--accent-rgb', cfg.rgb);
  }
}
