/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#0B1736",
        text: {
          main: "#EAF0FF",
          subtitle: "#C9D6F5",
          muted: "#9FB0D6",
        },
        accent: {
          DEFAULT: "#5AB0FF",
          secondary: "#8C9BFF",
          amber: "#FFB547",
        },
        border: {
          subtle: "#2A417F",
          ghost: "#4A64A8",
        },
        chip: {
          text: "#C4D3F7",
          bg: "rgba(90, 176, 255, 0.1)",
        }
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "14px",
        photo: "22px",
        btn: "8px",
      },
      maxWidth: {
        container: "1120px",
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(160deg, #162B63, #102250)',
        'contact-card': 'linear-gradient(135deg, #1E3FA0, #12245A 60%)',
        'primary-btn': 'linear-gradient(135deg, #5AB0FF, #8C9BFF)',
        'heading-gradient': 'linear-gradient(90deg, #FFFFFF 0%, #5AB0FF 60%, #8C9BFF 100%)',
        'photo-border': 'linear-gradient(135deg, #5AB0FF, #7C8CFF, #FFB547)',
      }
    },
  },
  plugins: [],
}
