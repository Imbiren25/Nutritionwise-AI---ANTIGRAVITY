/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./index.html', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}', './services/**/*.{ts,tsx}', './App.tsx'],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					// Legacy mappings
					hover: 'var(--color-primary-hover)',
					active: 'var(--color-primary-active)',
					light: 'var(--color-primary-light)',
					teal: 'var(--color-primary-teal)',
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					// Legacy mappings
					beige: 'var(--color-secondary-beige)',
					orange: 'var(--color-secondary-orange)',
					blue: 'var(--color-secondary-blue)',
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Legacy custom colors
				semantic: {
					success: {
						DEFAULT: 'var(--color-success)',
						light: 'var(--color-success-light)',
						dark: 'var(--color-success-dark)'
					},
					warning: {
						DEFAULT: 'var(--color-warning)',
						light: 'var(--color-warning-light)',
						dark: 'var(--color-warning-dark)'
					},
					error: {
						DEFAULT: 'var(--color-error)',
						light: 'var(--color-error-light)',
						dark: 'var(--color-error-dark)'
					},
					info: {
						DEFAULT: 'var(--color-info)',
						light: 'var(--color-info-light)',
						dark: 'var(--color-info-dark)'
					}
				},
				neutral: {
					'50': 'var(--color-neutral-50)',
					'100': 'var(--color-neutral-100)',
					'200': 'var(--color-neutral-200)',
					'300': 'var(--color-neutral-300)',
					'400': 'var(--color-neutral-400)',
					'500': 'var(--color-neutral-500)',
					'600': 'var(--color-neutral-600)',
					'700': 'var(--color-neutral-700)',
					'800': 'var(--color-neutral-800)',
					'900': 'var(--color-neutral-900)',
					charcoal: 'var(--color-neutral-charcoal)',
					slate: 'var(--color-neutral-slate)',
					white: 'var(--color-neutral-white)'
				},
				text: {
					primary: 'var(--color-text-primary)',
					secondary: 'var(--color-text-secondary)',
					tertiary: 'var(--color-text-tertiary)',
					disabled: 'var(--color-text-disabled)',
					inverse: 'var(--color-text-inverse)'
				},
				interactive: {
					hover: 'var(--color-interactive-hover)',
					pressed: 'var(--color-interactive-pressed)',
					selected: 'var(--color-interactive-selected)',
					focus: 'var(--color-interactive-focus)'
				},
				data: {
					protein: 'var(--color-data-protein)',
					carbs: 'var(--color-data-carbs)',
					fat: 'var(--color-data-fat)',
					fiber: 'var(--color-data-fiber)',
					deficit: 'var(--color-data-deficit)'
				},
				heading: 'var(--color-text-primary)',
				body: 'var(--color-text-secondary)',
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				// Legacy
				button: '12px',
				card: '12px'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			fontFamily: {
				heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}