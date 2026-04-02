import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        body: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['Inter', '"JetBrains Mono"', 'monospace'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(91,141,239,0.10), 0 4px 12px rgba(0,0,0,0.04)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.18' },
          '50%': { transform: 'translateY(-26px) translateX(12px)', opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
