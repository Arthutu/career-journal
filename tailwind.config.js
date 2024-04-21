/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
    content: ["./app/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                titan: {
                    50: "#f5f6fd",
                    100: "#e6e6fa",
                    200: "#dbdbf9",
                    300: "#c0bff3",
                    400: "#9f9aeb",
                    500: "#7e71e1",
                    600: "#6952d5",
                    700: "#5940c1",
                    800: "#4a35a2",
                    900: "#3f2d85",
                    950: "#251b5a",
                },
                manatee: {
                    50: "#f6f6f7",
                    100: "#eef0f1",
                    200: "#e0e2e5",
                    300: "#cdcfd4",
                    400: "#b8bbc1",
                    500: "#a4a8b0",
                    600: "#8b8d98",
                    700: "#7b7d87",
                    800: "#65666e",
                    900: "#54555b",
                    950: "#313235",
                },
                gigas: {
                    50: "#f0f2fd",
                    100: "#e4e7fb",
                    200: "#cfd4f6",
                    300: "#b1b7f0",
                    400: "#9293e7",
                    500: "#7d77dd",
                    600: "#6c5dce",
                    700: "#5d4db5",
                    800: "#483d8b",
                    900: "#413a75",
                    950: "#272244",
                },
            },
        },
        fontFamily: {
            sans: ["Inter", ...defaultTheme.fontFamily.sans],
        },
    },
    plugins: [require("tailwindcss-react-aria-components")],
};
