export const theme = {
  colors: {
    primary: '#FFFFFF',
    primaryYellow: '#F5C300',
    deepNavy: '#370E62',
    magenta: '#B6007D',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #370E62 0%, #B6007D 100%)',
    card: 'linear-gradient(135deg, rgba(55, 14, 98, 0.7) 0%, rgba(182, 0, 125, 0.5) 100%)',
    button: 'linear-gradient(135deg, #F5C300 0%, #FFD700 100%)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    darkBackground: 'rgba(55, 14, 98, 0.3)',
    darkBorder: 'rgba(55, 14, 98, 0.5)',
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
  light: 'backdrop-blur-md bg-white/10 border border-white/20',
  dark: 'backdrop-blur-md bg-[#370E62]/30 border border-[#370E62]/50',
  card: 'backdrop-blur-lg bg-white/5 border border-white/10',
};
