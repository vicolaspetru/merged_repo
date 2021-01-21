module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended-with-formatting',
	],
	env: {
		browser: true,
	},
	plugins: [
		'chai-friendly',
	],
};
