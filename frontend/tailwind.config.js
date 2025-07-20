/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "rain": "rain 1s linear infinite",
        "snow": "snow 2s linear infinite",
        "lightning": "lightning 2s ease-in-out infinite",
        "fog": "fog 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100vh) translateX(0)' },
          '100%': { transform: 'translateY(100vh) translateX(-10px)' },
        },
        snow: {
          '0%': { transform: 'translateY(-100vh) translateX(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) translateX(10px) rotate(360deg)' },
        },
        lightning: {
          '0%, 90%, 100%': { opacity: '0' },
          '10%': { opacity: '1' },
          '20%': { opacity: '0' },
          '30%': { opacity: '1' },
          '40%': { opacity: '0' },
        },
        fog: {
          '0%, 100%': { transform: 'translateX(-50%) scaleX(0.8)', opacity: '0.2' },
          '50%': { transform: 'translateX(-50%) scaleX(1.2)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
