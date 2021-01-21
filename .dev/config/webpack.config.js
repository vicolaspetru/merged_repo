const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const postcssConfig = require( './postcss.config' );

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const RtlCssPlugin = require( 'rtlcss-webpack-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const MergeIntoSingleFilePlugin = require( 'webpack-merge-and-include-globally' );
const nodeSassGlobImporter = require( 'node-sass-glob-importer' );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	...defaultConfig,

	entry: {
		'wpzoom-recipe-card': path.resolve( process.cwd(), 'src/blocks.js' ),

        // Styles
		'wpzoom-recipe-card-editor': path.resolve( process.cwd(), 'src/styles/editor.scss' ),
		'wpzoom-recipe-card-style': path.resolve( process.cwd(), 'src/styles/style.scss' ),

        // Print
        // 'css/wpzoom-recipe-card-print': path.resolve( process.cwd(), 'src/styles/style/print.scss' ),

        // Admin
        // 'css/admin/wpzoom-recipe-card-admin': path.resolve( process.cwd(), 'src/styles/admin/style.scss' ),
        './js/admin/wpzoom-manage-ratings': path.resolve( process.cwd(), 'src/js/admin/wpzoom-manage-ratings.js' ),
        './js/admin/wpzoom-recipe-card-admin': path.resolve( process.cwd(), 'src/js/admin/wpzoom-recipe-card-admin.js' ),

        // Front-End Scripts
		'./js/wpzoom-adjustable-servings': path.resolve( process.cwd(), 'src/js/wpzoom-adjustable-servings.js' ),
		'./js/wpzoom-comment-rating': path.resolve( process.cwd(), 'src/js/wpzoom-comment-rating.js' ),
		'./js/wpzoom-masonry': path.resolve( process.cwd(), 'src/js/wpzoom-masonry.js' ),
		'./js/wpzoom-rating-stars': path.resolve( process.cwd(), 'src/js/wpzoom-rating-stars.js' ),
		'./js/wpzoom-scripts': path.resolve( process.cwd(), 'src/js/wpzoom-scripts.js' ),

        // Vendors
		'./js/vendors/fitvids': path.resolve( process.cwd(), 'node_modules/fitvids/dist/fitvids.js' ),
		'./js/vendors/magnific-popup': path.resolve( process.cwd(), 'node_modules/magnific-popup/dist/jquery.magnific-popup.js' ),
		// 'css/vendors/magnific-popup': path.resolve( process.cwd(), 'node_modules/magnific-popup/src/css/main.scss' ),
	},

	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'dist/assets/' ),
	},

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,

			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
							sourceMap: ! isProduction,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							...postcssConfig,
							sourceMap: ! isProduction,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: ! isProduction,
							sassOptions: {
								importer: nodeSassGlobImporter(),
							},
						},
					},
				],
			},
		],
	},

	stats: {
		...defaultConfig.stats,
		modules: false,
		warnings: false,
	},

	plugins: [
		...defaultConfig.plugins,
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin( {
			filename: '[name].css',
		} ),
		new RtlCssPlugin( {
			filename: '[name]-rtl.css',
		} ),
		new MergeIntoSingleFilePlugin( {
			files: {
				'./css/wpzoom-recipe-card-icon-fonts.css': [
					path.resolve( process.cwd(), 'node_modules/@fortawesome/fontawesome-free/css/all.css' ),
					path.resolve( process.cwd(), 'src/css/foodicons.css' ),
					path.resolve( process.cwd(), 'src/css/genericons.css' ),
					path.resolve( process.cwd(), 'src/css/oldicons.css' ),
				],
			},

		} ),
	],
};
