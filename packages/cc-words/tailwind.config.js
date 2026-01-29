/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "src/assets/**/*.{html,js,ts,svelte}",
    "src/entrypoints/**/*.{html,js,ts,svelte}",
    "src/components/**/*.{html,js,ts,svelte}",
    "src/lib/**/*.{html,js,ts,svelte}",
    "src/features/**/*.{html,js,ts,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
