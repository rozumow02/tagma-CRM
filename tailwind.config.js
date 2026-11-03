module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#8d68ad',        // Main color
        shade: '#FFF7E5',       // Shade
        text: '#272727',        // Text color
        white: '#FFFFFF',       // White
        stroke: '#E7E7EC',      // Stroke
        gray1: '#F7F7F7',       // Gray 1
        gray2: '#CDCDCD',       // Gray 2
        gray3: '#8C8C8C',       // Gray 3
        overlay: '#000000',     // Overlay
        successBg: '#56CE56',   // Success background (20%)
        errorBg: '#FB7185',     // Error background (20%)
        warningBg: '#FACC15',   // Warning background (20%)
        checkingBg: '#567EFE',  // Checking background (20%)
        success: '#56CE56',     // Success
        error: '#F04438',       // Error
        warning: '#8d68ad',     // Warning
        checking: '#567EFE',    // Checking
      },
      boxShadow: {
        shadow1: '0px 4px 12px rgba(0, 0, 0, 0.1)',  // Shadow 1
        shadow2: '0px 8px 24px rgba(0, 0, 0, 0.2)',  // Shadow 2
      },
    fontSize: {
      h1: ['24px', '32px'], // H1 - Bold 24px
      h2: ['20px', '28px'], // H2 - Bold 20px
      p1: ['18px', '26px'], // P1 - Regular 18px / Medium 18px
      p3: ['16px', '24px'], // P3 - Regular 16px / Medium 16px
      t2_14: ['14px', '20px'], // Tag T2 - Regular 14px / Medium 14px
      t2_12: ['12px', '18px'], // Tag T2 - Regular 12px / Medium 12px
    },
    fontWeight: {
      bold: '700',
      medium: '500',
      regular: '400',
    },
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    },
  },
  plugins: [
  ],
}
