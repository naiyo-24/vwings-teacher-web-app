export const theme = {
  colors: {
    primary: '#7B0771',
    primaryYellow: '#C0BEC5', // Replaced with Light Gray
    deepNavy: '#1A2134',
    magenta: '#9E161B',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #7B0771 0%, #9E161B 100%)',
    card: 'linear-gradient(135deg, rgba(123, 7, 113, 0.7) 0%, rgba(158, 22, 27, 0.5) 100%)',
    button: 'linear-gradient(135deg, #7B0771 0%, #9E161B 100%)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(192, 190, 197, 0.5)',
    darkBackground: 'rgba(26, 33, 52, 0.05)',
    darkBorder: 'rgba(57, 3, 6, 0.2)',
  },
  animation: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      default: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export const glassmorphicStyles = {
  light: 'backdrop-blur-md bg-white/80 border border-[#C0BEC5]/50',
  dark: 'backdrop-blur-md bg-[#1A2134]/10 border border-[#1A2134]/20',
  card: 'backdrop-blur-lg bg-white/90 border border-[#C0BEC5]/30',
};
