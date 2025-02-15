module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',       // Trustworthy blue for main elements
        secondary: '#f97316',     // Warm orange for CTAs and highlights
        accent: '#0ea5e9',        // Bright sky blue for interactive accents
        background: '#f1f5f9',    // Light, neutral background
        textPrimary: '#1e293b',   // Dark blue-gray for primary text
        textSecondary: '#64748b', // Muted blue-gray for secondary text
      },
      fontFamily: {
        // "Sarabun" supports Thai characters and offers excellent readability.
        sans: ['Sarabun', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: '.75rem',      // 12px
        sm: '.875rem',     // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
      },
      spacing: {
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        7: '1.75rem',   // 28px
        8: '2rem',      // 32px
        9: '2.25rem',   // 36px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
        32: '8rem',     // 128px
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '1rem',       // 16px
        '2xl': '1.5rem',  // 24px
        '3xl': '2rem',    // 32px
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
        none: 'none',
      },
      container: {
        center: true,
        padding: '1rem', // Consistent container padding for responsiveness
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
