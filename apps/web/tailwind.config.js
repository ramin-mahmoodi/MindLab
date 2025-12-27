/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
        },
        extend: {
            fontFamily: {
                sans: ['Sora', 'Vazirmatn', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                persian: ['Vazirmatn', 'sans-serif'],
            },
            colors: {
                border: "hsl(220, 20%, 18%)",
                background: "hsl(220, 25%, 6%)",
                foreground: "hsl(210, 40%, 98%)",
                primary: {
                    DEFAULT: "#2dd4bf",
                    foreground: "hsl(220, 25%, 6%)",
                },
                secondary: {
                    DEFAULT: "hsl(220, 25%, 14%)",
                    foreground: "hsl(210, 40%, 98%)",
                },
                muted: {
                    DEFAULT: "hsl(220, 20%, 18%)",
                    foreground: "hsl(215, 20%, 65%)",
                },
                accent: {
                    DEFAULT: "#a78bfa",
                    foreground: "hsl(220, 25%, 6%)",
                },
            },
            borderRadius: {
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.375rem",
            },
        },
    },
    plugins: [],
}
