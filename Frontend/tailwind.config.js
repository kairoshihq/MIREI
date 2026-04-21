/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        't1': 'var(--t1)',
        't2': 'var(--t2)',
        't3': 'var(--t3)',
        'accent-soft': 'var(--accent-soft)',
      },
      fontFamily: {
        'sora': ['Sora', 'sans-serif'],
      },
      animation: {
        'slideUp': 'slideUp 0.4s ease',
        'pageEnter': 'pageEnter 0.6s ease',
        'typingBounce': 'typingBounce 1.2s infinite ease-in-out',
        'liveRingPulse': 'liveRingPulse 3s infinite ease-in-out',
        'livePulseDot': 'livePulseDot 2s infinite',
      },
      keyframes: {
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pageEnter: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        liveRingPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.6' },
        },
        livePulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
}
