import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0713",
        panel: "#140f24",
        panel2: "#1c1530",
        neon: {
          purple: "#b14bff",
          pink: "#ff3ec8",
          cyan: "#3ef2ff",
          green: "#3bffb0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        neon: "0 0 5px rgba(177,75,255,.6), 0 0 20px rgba(177,75,255,.35), 0 0 45px rgba(255,62,200,.15)",
        neonCyan: "0 0 5px rgba(62,242,255,.6), 0 0 20px rgba(62,242,255,.35)",
      },
      backgroundImage: {
        smoke: "radial-gradient(circle at 20% 20%, rgba(177,75,255,.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(62,242,255,.18), transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,62,200,.2), transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;
