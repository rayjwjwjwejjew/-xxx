import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f1923',
          orange: '#f0a030',
        },
        surface: {
          page: '#0f1923',
          card: 'rgba(12, 20, 40, 0.75)',
          board: 'rgba(8, 14, 30, 0.72)',
        },
        border: {
          soft: 'rgba(201, 168, 76, 0.22)',
          strong: 'rgba(232, 212, 139, 0.42)',
        },
        text: {
          primary: '#E8E4DF',
          secondary: '#9CA8B7',
        },
        galgame: {
          'bg-dark': '#0f1923',
          'bg-panel': 'rgba(12, 20, 40, 0.75)',
          gold: '#c9a84c',
          'gold-light': '#e8d48b',
          'gold-orange': '#f0a030',
          'text-primary': '#e8e4df',
          'text-secondary': '#9ca8b7',
          border: 'rgba(201, 168, 76, 0.3)',
        },
        competency: {
          orange: '#FB923C',
          yellow: '#FACC15',
          green: '#4ADE80',
          blue: '#38BDF8',
          indigo: '#6366F1',
          purple: '#C084FC',
          gray: '#9CA3AF',
        },
        state: {
          danger: '#EF4444',
          dangerSoft: 'rgba(239, 68, 68, 0.16)',
          success: '#22C55E',
          successSoft: 'rgba(34, 197, 94, 0.16)',
          study: '#64748B',
          studySoft: 'rgba(100, 116, 139, 0.2)',
          eventSoft: 'rgba(129, 140, 248, 0.18)',
          cafeteriaSoft: 'rgba(146, 64, 14, 0.2)',
        },
        tile: {
          penalty: '#EF4444',
          service: '#22C55E',
          event: '#818CF8',
          study: '#64748B',
          cafeteria: '#92400E',
          start: '#F0A030',
        },
      },
      borderRadius: {
        panel: '12px',
        card: '10px',
        button: '10px',
        input: '8px',
        tile: '8px',
      },
      boxShadow: {
        card: '0 0 20px rgba(201, 168, 76, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 24px rgba(201, 168, 76, 0.16), 0 0 16px rgba(232, 212, 139, 0.08)',
        board: '0 0 40px rgba(99, 102, 241, 0.08), 0 12px 48px rgba(0,0,0,0.25)',
        drag: '0 0 20px rgba(201, 168, 76, 0.3), 0 12px 32px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        title: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        body: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['Inter', '"JetBrains Mono"', 'monospace'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-soft': 'linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)',
        'paper-texture': 'radial-gradient(circle at 1px 1px, rgba(232, 212, 139, 0.08) 1px, transparent 0)',
      },
      backgroundSize: {
        grid: '24px 24px',
        paper: '14px 14px',
      },
      backdropBlur: {
        panel: '16px',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(-30px) translateX(15px)', opacity: '0.8' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(232, 212, 139, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(232, 212, 139, 0.4)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
