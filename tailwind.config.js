/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        butter: 'var(--color-butter)',
        'butter-dark': 'var(--color-butter-dark)',
        'brown-900': 'var(--color-brown-900)',
        'brown-800': 'var(--color-brown-800)',
        'brown-700': 'var(--color-brown-700)',
      },
    },
  },
  plugins: [],
};
