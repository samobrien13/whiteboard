import type { Config } from 'tailwindcss';

export default {
    content: [
        './resources/**/*.{vue,js,ts,jsx,tsx}',
        './resources/views/root.html',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
