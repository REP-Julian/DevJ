/** @type {import('tailwindcss').Config} */
export default {
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
                    800: '#2B2D42',
                    900: '#1E1E24',
                },
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
            }
        },
    },
    plugins: [],
}