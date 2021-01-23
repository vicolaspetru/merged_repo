/*global wpzoomRecipeCard*/

/**
 * Internal dependencies
 */
import icon from './icon';
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

/**
 * Block constants
 */
const { name, category } = metadata;
const { assetsDir } = wpzoomRecipeCard;

const settings = {
	/* translators: block name */
	title: __( 'Premium Recipe Card', 'wpzoom-recipe-card' ),
	/* translators: block description */
	description: __( 'Display a Premium Recipe Card box with recipe metadata.', 'wpzoom-recipe-card' ),
	category,
	icon: <Icon icon={ icon } size="20" className="wpzoom-rcb-icon-foreground" />,
	keywords: [
		'wpzoom',
		__( 'Recipe Card', 'wpzoom-recipe-card' ),
		__( 'Premium Recipe Card', 'wpzoom-recipe-card' ),
		__( 'WPZOOM', 'wpzoom-recipe-card' ),
	],
	example: {
		attributes: {
			recipeTitle: __( 'Your recipe title goes here', 'wpzoom-recipe-card' ),
			hasImage: true,
			image: {
				id: 0,
				url: assetsDir + '/images/examples/recipe-card-image-example-1.jpg',
			},
			course: [ __( 'Main', 'wpzoom-recipe-card' ) ],
			cuisine: [ __( 'Italian', 'wpzoom-recipe-card' ) ],
			difficulty: [ __( 'Medium', 'wpzoom-recipe-card' ) ],
		},
	},
	supports: {
		multiple: false,
	},
	edit,
	save() {
		return null;
	},
};

export { name, category, settings };
