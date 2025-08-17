/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'forest': {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb85c',
          500: '#228B22', // Primary forest green
          600: '#1e7e1e',
          700: '#1a6b1a',
          800: '#175817',
          900: '#144914',
        },
        'primary': {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb85c',
          500: '#228B22',
          600: '#1e7e1e',
          700: '#1a6b1a',
          800: '#175817',
          900: '#144914',
        }
      }
    },
  },
  plugins: [],
};
