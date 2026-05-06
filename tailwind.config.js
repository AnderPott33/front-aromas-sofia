/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Paleta dorada balanceada para UI profesional
        gold: {
          light: '#F3E5AB',  // Dorado crema para fondos suaves
          DEFAULT: '#D4AF37', // Dorado metálico estándar
          dark: '#996515',   // Dorado quemado para contraste o bordes
          premium: '#C5A059', // Un tono más sobrio y mate
        },
      },
      // Útil para los efectos metálicos en botones o cards
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728)',
      }
    },
  },
  plugins: [],
}