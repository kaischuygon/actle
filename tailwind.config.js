/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

const primary = colors.zinc;
const accent = colors.fuchsia;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
				primary: primary,
				accent: accent
			},
      fontFamily: {
        display: ['Rubik Mono One', ...defaultTheme.fontFamily.sans],
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
      typography: () => ({
        accent: {
          css: {
            '--tw-prose-headings': accent[400],
            '--tw-prose-links': accent[400],
            '--tw-prose-bullets': accent[300],
            '--tw-prose-hr': accent[300],
            '--tw-prose-quote-borders': accent[300],
            '--tw-prose-th-borders': accent[300],
            '--tw-prose-td-borders': accent[200],
            '--tw-prose-invert-lead': accent[300],
            '--tw-prose-invert-bullets': accent[600],
            '--tw-prose-invert-hr': accent[700],
            '--tw-prose-invert-quote-borders': accent[700],
            '--tw-prose-invert-th-borders': accent[600],
            '--tw-prose-invert-td-borders': accent[700],
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
