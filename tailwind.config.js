/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003B5C', // Shnoor corporate blue
          50: '#E0E7EE',
          100: '#C2D0DD',
          200: '#89A4BC',
          300: '#51799C',
          400: '#294F79',
          500: '#003B5C',
          600: '#002E49',
          700: '#002237',
          800: '#001625',
          900: '#000B13',
        },
        secondary: {
          DEFAULT: '#E8AA25', // Shnoor accent gold
          light: '#F3C45D',
          dark: '#C58A12',
        },
        background: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 40px rgba(15,23,42,0.06)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

