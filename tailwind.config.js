/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                'apple-blue': '#06b6d4',
                'apple-bg': 'rgba(255, 255, 255, 0.05)',
            },
            backdropBlur: {
                xs: '2px',
            }
        }
    },
    plugins: []
}