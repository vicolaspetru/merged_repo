module.exports = function( grunt ) {
	'use strict';

	const pkg = grunt.file.readJSON( 'package.json' );

	grunt.initConfig( {

		pkg,

		clean: {
			build: [ 'build/' ],
		},

		copy: {
			build: {
				files: [
					{
						expand: true,
						src: [
							'!**/*.{ai,eps,psd}',
							'LICENSE',
							'class-' + pkg.name + '.php',
							'dist/**',
							'includes/**',
							'languages/**',
							'templates/**',
							'readme.txt',
							'src/**/*.php',
							'src/blocks/details/*.json',
							'src/blocks/directions/*.json',
							'src/blocks/ingredients/*.json',
							'src/blocks/jump-to-recipe/*.json',
							'src/blocks/nutrition/*.json',
							'src/blocks/print-recipe/*.json',
							'src/blocks/recipe-card/*.json',
						],
						dest: 'build/<%= pkg.name %>',
					},
				],
			},
		},

		compress: {
			main: {
				options: {
					archive: 'build/<%= pkg.name %>-v<%= pkg.version %>.zip',
					mode: 'zip',
				},
				files: [
					{
						cwd: 'build/<%= pkg.name %>/',
						dest: '<%= pkg.name %>/',
						src: [ '**' ],
					},
				],
			},
		},

		replace: {
			php: {
				src: [
					'class-' + pkg.name + '.php',
					'includes/**/*.php',
				],
				overwrite: true,
				replacements: [
					{
						from: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
						to: 'Version:$1' + pkg.version,
					},
					{
						from: /@since(.*?)NEXT/mg,
						to: '@since$1' + pkg.version,
					},
					{
						from: 'x.x.x',
						to: pkg.version,
					},
					{
						from: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
						to: 'Version:$1' + pkg.version,
					},
					{
						from: /define\(\s*'WPZOOM_RCB_VERSION',\s*'(.*)'\s*\);/,
						to: 'define( \'WPZOOM_RCB_VERSION\', \'<%= pkg.version %>\' );',
					},
					{
						from: /Tested up to:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
						to: 'Tested up to:$1' + pkg.tested_up_to,
					},
				],
			},
			readme: {
				src: 'readme.*',
				overwrite: true,
				replacements: [
					{
						from: /^(\*\*|)Stable tag:(\*\*|)(\s*?)[a-zA-Z0-9.-]+(\s*?)$/mi,
						to: '$1Stable tag:$2$3<%= pkg.version %>$4',
					},
					{
						from: /Tested up to:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
						to: 'Tested up to:$1' + pkg.tested_up_to,
					},
				],
			},
			languages: {
				src: 'languages/wpzoom-recipe-card.pot',
				overwrite: true,
				replacements: [
					{
						from: /(Project-Id-Version: Recipe Card Blocks PRO by WPZOOM )[0-9\.]+/,
						to: '$1' + pkg.version,
					},
				],
			},
		},

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt',
				},
			},
		},

		bumpup: {
			options: {
				updateProps: {
					pkg: 'package.json',
				},
			},
			file: 'package.json',
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					potFilename: '<%= pkg.name %>.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true,
					},
					type: 'wp-plugin',
					updateTimestamp: true,
				},
			},
		},

		addtextdomain: {
			options: {
				textdomain: '<%= pkg.textdomain %>',
				updateDomains: [ 'wpzoom' ],
			},
			target: {
				files: {
					src: [
						'class-' + pkg.name + '.php',
						'includes/**/*.php',
						'src/**/*.php',
						'templates/**/*.php',
					],
				},
			},
		},

		shell: {
			build: [ 'npm run build' ].join( ' && ' ),
		},

	} );

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	grunt.registerTask( 'build', [ 'shell:build', 'update-pot', 'replace', 'clean:build', 'copy:build' ] );
	grunt.registerTask( 'update-pot', [ 'addtextdomain', 'makepot', 'replace:languages' ] );

	// Bump Version - `grunt version-bump --ver=<version-number>`
	grunt.registerTask( 'version-bump', function( ver ) {
		let newVersion = grunt.option( 'ver' );

		if ( newVersion ) {
			newVersion = newVersion ? newVersion : 'patch';

			grunt.task.run( 'bumpup:' + newVersion );
			grunt.task.run( 'replace' );
		}
	} );
};
