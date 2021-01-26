const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const postcssConfig = require( './postcss.config' );

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const RtlCssPlugin = require( 'rtlcss-webpack-plugin' );
const CleanCSS = require( 'clean-css' );
const MergeIntoSingleFilePlugin = require( 'webpack-merge-and-include-globally' );
const nodeSassGlobImporter = require( 'node-sass-glob-importer' );
const CopyPlugin = require( 'copy-webpack-plugin' );

const isProduction = process.env.NODE_ENV === 'production';

// Rewrite defaultConfig css loaders for own use
const cssLoaders = [
	{
		loader: MiniCssExtractPlugin.loader,
	},
	{
		loader: require.resolve( 'css-loader' ),
		options: {
			sourceMap: ! isProduction,
		},
	},
	{
		loader: require.resolve( 'postcss-loader' ),
		options: {
			...postcssConfig,
			sourceMap: ! isProduction,
		},
	},
];

module.exports = {
	...defaultConfig,

	entry: {
		'wpzoom-recipe-card': path.resolve( process.cwd(), 'src/blocks.js' ),

		// Styles
		'wpzoom-recipe-card-editor': path.resolve( process.cwd(), 'src/styles/editor.scss' ),
		'wpzoom-recipe-card-style': path.resolve( process.cwd(), 'src/styles/style.scss' ),
		'css/vendors/magnific-popup': path.resolve( process.cwd(), 'node_modules/magnific-popup/src/css/main.scss' ),
		'css/admin/wpzoom-recipe-card-admin': path.resolve( process.cwd(), 'src/styles/admin/style.scss' ),
		'css/wpzoom-recipe-card-print': path.resolve( process.cwd(), 'src/styles/style/print.scss' ),

		// Admin
		'js/admin/wpzoom-manage-ratings': path.resolve( process.cwd(), 'src/js/admin/wpzoom-manage-ratings.js' ),
		'js/admin/wpzoom-recipe-card-admin': path.resolve( process.cwd(), 'src/js/admin/wpzoom-recipe-card-admin.js' ),

		// Front-End Scripts
		'js/wpzoom-adjustable-servings': path.resolve( process.cwd(), 'src/js/wpzoom-adjustable-servings.js' ),
		'js/wpzoom-comment-rating': path.resolve( process.cwd(), 'src/js/wpzoom-comment-rating.js' ),
		'js/wpzoom-masonry': path.resolve( process.cwd(), 'src/js/wpzoom-masonry.js' ),
		'js/wpzoom-rating-stars': path.resolve( process.cwd(), 'src/js/wpzoom-rating-stars.js' ),
		'js/wpzoom-scripts': path.resolve( process.cwd(), 'src/js/wpzoom-scripts.js' ),

		// Vendors
		'js/vendors/fitvids': path.resolve( process.cwd(), 'node_modules/fitvids/dist/fitvids.js' ),
		'js/vendors/magnific-popup': path.resolve( process.cwd(), 'node_modules/magnific-popup/dist/jquery.magnific-popup.js' ),
	},

	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'dist/' ),
	},

	module: {
		// Rewrite defaultConfig module rules
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					require.resolve( 'thread-loader' ),
					{
						loader: require.resolve( 'babel-loader' ),
						options: {
							// Babel uses a directory within local node_modules
							// by default. Use the environment variable option
							// to enable more persistent caching.
							cacheDirectory:
								process.env.BABEL_CACHE_DIRECTORY || true,

							babelrc: false,
							configFile: false,
							presets: [
								require.resolve(
									'@wordpress/babel-preset-default'
								),
							],
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: cssLoaders,
			},
			{
				test: /\.(sc|sa)ss$/,
				use: [
					...cssLoaders,
					{
						loader: require.resolve( 'sass-loader' ),
						options: {
							sourceMap: ! isProduction,
							sassOptions: {
								importer: nodeSassGlobImporter(),
							},
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: [ '@svgr/webpack', 'url-loader' ],
			},
			{
				test: /\.(bmp|png|jpe?g|gif)$/i,
				loader: require.resolve( 'file-loader' ),
				options: {
					name: 'images/[name].[hash:8].[ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'fonts/[name].[hash:8].[ext]',
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
		new MiniCssExtractPlugin( {
			filename: '[name].css',
		} ),
		new RtlCssPlugin( {
			filename: '[name]-rtl.css',
		} ),
		new MergeIntoSingleFilePlugin( {
			files: {
				'css/wpzoom-recipe-card-icon-fonts.css': [
					path.resolve( process.cwd(), 'node_modules/@fortawesome/fontawesome-free/css/all.css' ),
					path.resolve( process.cwd(), 'src/css/foodicons.css' ),
					path.resolve( process.cwd(), 'src/css/genericons.css' ),
					path.resolve( process.cwd(), 'src/css/oldicons.css' ),
				],
			},
			transform: {
				'css/wpzoom-recipe-card-icon-fonts.css': ( source ) => new CleanCSS( {} ).minify( source ).styles,
			},
		} ),
		new CopyPlugin( {
			patterns: [
				{ from: path.resolve( process.cwd(), 'src/webfonts' ), to: path.resolve( process.cwd(), 'dist/assets/webfonts' ) },
				{ from: path.resolve( process.cwd(), 'src/images' ), to: path.resolve( process.cwd(), 'dist/assets/images' ) },
			],
		} ),
	],
};
