import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/stores/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF'
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC'
        }
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 1px rgba(34, 197, 94, 0.12), 0 18px 50px rgba(34, 197, 94, 0.15)'
      },
      backgroundImage: {
        'fintech-gradient': 'linear-gradient(135deg, rgba(34,197,94,0.16), rgba(22,163,74,0.08), rgba(248,250,252,1))'
      }
    }
  },
  plugins: [animate]
};

export default config;
