/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                charcoal: {
                    50: '#F8F9FA',
                    100: '#E9ECEF',
                    500: '#6C757D',
                    700: '#495057',
                    800: '#2B2D42',
                    850: '#24242B',
                    900: '#1E1E24',
                    950: '#0F0F12',
                },
                darkcanvas: '#0F0F12',
                darksurface: '#18181C',
                darkborder: '#2C2C35',
                devyellow: {
                    100: '#FEF9C3',
                    300: '#FDE047',
                    400: '#FACC15',
                    500: '#EAB308',
                },
                devorange: {
                    100: '#FFEDD5',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#F97316',
                    600: '#EA580C',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'warm-sm': '0 2px 8px -2px rgba(234, 88, 12, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
                'warm-md': '0 10px 25px -5px rgba(251, 146, 60, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                'warm-lg': '0 20px 35px -8px rgba(234, 88, 12, 0.15), 0 12px 16px -8px rgba(0, 0, 0, 0.04)',
                'warm-3d': '0 25px 50px -12px rgba(249, 115, 22, 0.25)',
            },
            height: {
                '76': '19rem',
                '84': '21rem',
                '88': '22rem',
            },
            keyframes: {
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(28px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-28px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'breathing-glow': {
                    '0%, 100%': { transform: 'scale(0.96)', opacity: '0.45' },
                    '50%': { transform: 'scale(1.08)', opacity: '0.8' },
                },
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-in-left': 'slide-in-left 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
                'breathing-glow': 'breathing-glow 4s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}