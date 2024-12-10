/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#8DE040",
        secondary: "#6EB52C",
        tint: "#FBFFFE",
        "hf-ahbtabellen": "#EBBEC1",
        "hf-bedingungsbaum": "#E4C67F",
        "hf-fristenkalender": "#ABDCD3",
      },
    },
  },
  plugins: [],
};
