/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        checkmarkFade: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        sendPlane: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "20%": { transform: "translate(10px, -10px) scale(1.1)" },
          "40%": { transform: "translate(30px, -20px) scale(1)" },
          "60%": { transform: "translate(60px, -30px) scale(0.9)" },
          "80%": {
            transform: "translate(100px, -40px) scale(0.8)",
            opacity: "0.5",
          },
          "100%": {
            transform: "translate(150px, -50px) scale(0.7)",
            opacity: "0",
          },
        },
        flyAway: {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
          "100%": {
            transform: "translate(150px, -50px) scale(0.7)",
            opacity: "0",
          },
        },
      },
      animation: {
        "spin-reverse": "spin 1s linear infinite reverse",
        fadeIn: "fadeIn 0.3s ease-in-out",
        fadeOut: "fadeOut 0.3s ease-in-out",
        checkmarkFade: "checkmarkFade 0.5s ease-in-out",
        sendPlane: "sendPlane 2s ease-in-out forwards",
        flyAway: "flyAway 2s ease-in-out",
      },
    },
  },
  plugins: [],
};
