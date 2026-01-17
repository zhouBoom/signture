/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce': 'bounce 0.6s ease',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(400px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(400px)', opacity: '0' },
        },
        fadeInScale: {
          'from': { transform: 'scale(0.8)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
