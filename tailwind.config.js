/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a1929',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#1a3a4a',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#00bcd4',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#2d5a6b',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1e4659',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#00bcd4',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: '#2d5a6b',
        input: '#1e4659',
        ring: '#00bcd4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
}
