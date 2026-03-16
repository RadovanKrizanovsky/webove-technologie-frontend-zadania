module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,css,json,png,jpg,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};