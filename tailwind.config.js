/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        violeta: '#9333EA',
        rose: '#C288A3',
        nude: '#FDF2F8',
        pessego: '#F6E7EA',
        creme: '#FFF8F4',
        onbg: '#1F1A1C'
      },
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'Lato', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
