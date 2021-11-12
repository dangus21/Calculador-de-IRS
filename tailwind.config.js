module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './shared/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			width: {
				'108': '27rem',
				'120': '30rem'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
}