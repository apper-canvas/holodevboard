/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#5E72E4',
          600: '#5A67D8',
          700: '#4C51BF',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#2DCE89',
          600: '#22C55E',
        },
        warning: {
          50: '#FEF3C7',
          100: '#FDE68A',
          500: '#FB6340',
          600: '#F59E0B',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#F5365C',
          600: '#EF4444',
        },
        info: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#11CDEF',
          600: '#06B6D4',
        },
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '30px'],
        '2xl': ['25px', '32px'],
        '3xl': ['31px', '40px'],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.15)',
        'drag': '0 8px 25px rgba(0,0,0,0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5E72E4 0%, #825EE4 100%)',
        'gradient-success': 'linear-gradient(135deg, #2DCE89 0%, #11998E 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
      },
    },
  },
  plugins: [],
}