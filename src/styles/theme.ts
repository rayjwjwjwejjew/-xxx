import type { CompetencyColor } from '@/types';

export const theme = {
  colors: {
    background: '#eef6ff',
    panel: 'rgba(255,255,255,0.78)',
    border: 'rgba(255,255,255,0.6)',
    accentBlue: '#5b8def',
    accentOrange: '#f59e0b',
    accentPurple: '#8b5cf6',
    textPrimary: '#24324a',
    textSecondary: '#6b7a90',
    success: '#22c55e',
    danger: '#ef4444',
    competency: {
      orange: '#fb923c',
      yellow: '#facc15',
      green: '#4ade80',
      blue: '#38bdf8',
      indigo: '#6366f1',
      purple: '#c084fc',
      gray: '#9ca3af',
    } satisfies Record<CompetencyColor, string>,
    tile: {
      start: '#f59e0b',
      event: '#8b5cf6',
      penalty: '#ef4444',
      study: '#64748b',
      publicService: '#22c55e',
      cafeteria: '#b45309',
    },
    playerTokens: ['#5b8def', '#f97316', '#10b981', '#8b5cf6'],
  },
} as const;
