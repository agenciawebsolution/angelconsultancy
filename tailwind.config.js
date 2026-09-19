/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: '#162F5E',
            50: '#F0F4FA',
            100: '#E1E9F5',
            200: '#C2D3EB',
            300: '#94B4DC',
            400: '#5F8EC9',
            500: '#3A6EB6',
            600: '#2B58A8',
            700: '#1F4388',
            800: '#162F5E',
            900: '#0F2144',
            950: '#091328',
          },
          blue: {
            DEFAULT: '#2B58A8',
            light: '#3898EC',
            soft: '#EBF3FC',
          },
          amber: {
            DEFAULT: '#E5A824',
            50: '#FDFBF4',
            100: '#FCF7E6',
            200: '#F8EEC6',
            300: '#F3E19C',
            400: '#ECCB65',
            500: '#E5A824',
            600: '#CB8C16',
            700: '#A46C12',
            800: '#835414',
            900: '#6C4415',
            soft: '#FEF8EB',
          },
          sand: {
            50: '#FAF9F6',
            100: '#F5F3EF',
            200: '#ECE8E1',
          }
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(22, 47, 94, 0.05), 0 1px 4px -1px rgba(22, 47, 94, 0.03)',
        'soft-md': '0 8px 24px -4px rgba(22, 47, 94, 0.07), 0 4px 12px -2px rgba(22, 47, 94, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(22, 47, 94, 0.09), 0 8px 18px -4px rgba(22, 47, 94, 0.05)',
        'soft-xl': '0 24px 48px -12px rgba(22, 47, 94, 0.12), 0 12px 24px -6px rgba(22, 47, 94, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
