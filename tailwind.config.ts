import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

export default {
  darkMode: 'selector',
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Link text color + decoration
            a: {
              color: theme('colors.blue.500'),
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              textDecorationColor: theme('colors.blue.500 / 0.3'),
              transitionProperty:
                'text-decoration-thickness, text-decoration-color, color',
              transitionDuration: '200ms',
              transitionTimingFunction: 'ease-out',
              '&:hover': {
                color: theme('colors.blue.700'),
                textDecorationColor: theme('colors.blue.700'),
              },
            },

            // Inline code chip (light)
            ':where(code):not(:where(pre code))': {
              backgroundColor: theme('colors.zinc.100'),
              color: theme('colors.zinc.800'),
              padding: '0.125rem 0.125rem', // py-0.5 px-0.5
              borderRadius: '0.375rem',     // rounded-md
              borderWidth: '1px',
              borderColor: theme('colors.zinc.300 / 0.6'),
              fontWeight: '500',
              whiteSpace: 'nowrap'
            },
            ':where(code):not(:where(pre code))::before': { content: '""' },
            ':where(code):not(:where(pre code))::after': { content: '""' },

            // Remove extra padding from fenced code
            ':where(pre code)': {
              padding: '0',
              background: 'none',
              border: '0',
            },

            // Blockquote tweaks
            blockquote: {
              quotes: 'none',
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: theme('colors.zinc.600'),
            },
            'blockquote p:first-of-type::before': { content: '""' },
            'blockquote p:last-of-type::after': { content: '""' },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.blue.400'),
              textDecorationColor: theme('colors.blue.400 / 0.3'),
              '&:hover': {
                color: theme('colors.blue.400'),
                textDecorationColor: theme('colors.blue.400'),
              },
            },
            ':where(code):not(:where(pre code))': {
              backgroundColor: theme('colors.zinc.800 / 0.6'),
              color: theme('colors.zinc.100'),
              borderColor: theme('colors.zinc.700 / 0.6'),
            },
            blockquote: {
              color: theme('colors.zinc.400'),
            },
          },
        },
      }),

      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.75rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '2rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [typographyPlugin],
} satisfies Config
