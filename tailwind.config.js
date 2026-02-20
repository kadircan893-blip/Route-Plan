/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coastal Travel Theme Colors
        'moss-green': '#5B7C6A',
        'soft-mint': '#DFF2EA',
        'dark-slate': '#2F3E46',
        'ocean-blue': '#4A7C9E',
        'sand-beige': '#F5EDE0',
        'coral-accent': '#E07A5F',
        'sky-light': '#A8DADC',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'section': '48px',
        'section-lg': '64px',
      },
      borderRadius: {
        'button': '16px',
        'card': '20px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}