import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Inspired by the Sierra Leone flag: green (agriculture/mountains),
        // white (unity/justice), blue (Freetown harbour, sky).
        salone: {
          green: "#1EB53A",
          "green-dark": "#0F7A26",
          blue: "#0072C6",
          "blue-dark": "#00518c",
          sand: "#FAF7F0",
          ink: "#14231B",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
