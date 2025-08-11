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

            // Disclosure containers
            ':where(details)': {
              backgroundColor: theme('colors.zinc.50'),
              border: `1px solid ${theme('colors.zinc.200')}`,
              borderRadius: theme('borderRadius.xl'),
              padding: theme('spacing.3'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              overflow: 'hidden',
              transitionProperty: 'background-color, border-color, box-shadow',
              transitionDuration: theme('transitionDuration.200'),
              transitionTimingFunction: theme('transitionTimingFunction.in-out'),
            },

            // Summary header
            ':where(details) > :where(summary)': {
              cursor: 'pointer',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: theme('spacing.2'),
              padding: theme('spacing.2'),
              margin: `calc(${theme('spacing.1')} * -1)`, // expand hit area to edges
              borderRadius: theme('borderRadius.lg'),
              color: theme('colors.zinc.800'),
              fontWeight: 600,
              outline: 'none',
              transitionProperty: 'background-color, color',
              transitionDuration: theme('transitionDuration.150'),
            },
            ':where(details) > :where(summary):hover': {
              backgroundColor: theme('colors.zinc.100'),
            },
            ':where(details) > :where(summary):focus-visible': {
              boxShadow: `0 0 0 3px ${theme('colors.blue.200')}`,
            },

            // Hide default marker
            ':where(details) > :where(summary)::-webkit-details-marker': { display: 'none' },

            // Custom chevron
            ':where(details) > :where(summary)::before': {
              content: '""',
              width: theme('spacing.4'),
              height: theme('spacing.4'),
              flexShrink: '0',
              backgroundColor: theme('colors.zinc.600'),
              WebkitClipPath: 'polygon(40% 5%, 85% 50%, 40% 95%, 30% 85%, 65% 50%, 30% 15%)',
              clipPath:       'polygon(40% 5%, 85% 50%, 40% 95%, 30% 85%, 65% 50%, 30% 15%)',
              transition: `transform ${theme('transitionDuration.200')} ${theme('transitionTimingFunction.in-out')}`,
            },
            ':where(details[open]) > :where(summary)::before': {
              transform: 'rotate(90deg)',
            },

            // The content area
            ':where(details) > *:not(summary)': {
              paddingTop: theme('spacing.3'),
              marginTop: theme('spacing.2'),
              borderTop: `1px solid ${theme('colors.zinc.200')}`,
              color: 'var(--tw-prose-body)', // match body text color
            },

            // Motion preference
            '@media (prefers-reduced-motion: reduce)': {
              ':where(details) > :where(summary)::before': {
                transition: 'none',
              },
            },

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
            ':where(details)': {
              backgroundColor: theme('colors.zinc.900 / 0.4'),
              borderColor: theme('colors.zinc.700'),
            },
            ':where(details) > :where(summary)': {
              color: theme('colors.zinc.100'),
            },
            ':where(details) > :where(summary):hover': {
              backgroundColor: theme('colors.zinc.800 / 0.5'),
            },
            ':where(details) > :where(summary)::before': {
              backgroundColor: theme('colors.zinc.400'),
            },
            ':where(details) > *:not(summary)': {
              borderTopColor: theme('colors.zinc.700'),
              color: 'var(--tw-prose-invert-body)',
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
