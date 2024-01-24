/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

const primary = colors.zinc;
const colorArray = [
  colors.amber,
  colors.blue,
  colors.cyan,
  colors.emerald,
  colors.fuchsia,
  colors.green,
  colors.indigo,
  colors.lime,
  colors.orange,
  colors.pink,
  colors.purple,
  colors.red,
  colors.rose,
  colors.sky,
  colors.teal,
  colors.violet,
  colors.yellow,
]

// Choose a color from the array based on the current date
const accentColor = colorArray[new Date().getDate() % colorArray.length];

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
				primary: primary,
				accent: accentColor,
			},
      fontFamily: {
        display: ['Rubik Mono One', ...defaultTheme.fontFamily.sans],
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
        emoji: ['Noto Color Emoji', 'Rubik', ...defaultTheme.fontFamily.sans]
      },
      typography: () => ({
        DEFAULT: {
				  css: {
					a: {
						color: accentColor,
						'&:hover': {
							color: accentColor,
						},
					}
				  },
				},
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
