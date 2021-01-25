/*global wpzoomRecipeCard*/

/**
 * Internal dependencies
 */
import legacy from './legacy';
import { generateId } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const {
	setting_options: {
		wpzoom_rcb_settings_steps_title,
	},
} = wpzoomRecipeCard;

export const blockKeywords = [
	__( 'directions', 'wpzoom-recipe-card' ),
	__( 'wpzoom', 'wpzoom-recipe-card' ),
	__( 'recipe', 'wpzoom-recipe-card' ),
];

export const blockExample = {
	attributes: {
		steps: [
			{
				id: generateId( 'direction-step' ),
				isGroup: false,
				text: [ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fringilla nunc id nibh rutrum, tristique finibus quam interdum.' ],
			},
			{
				id: generateId( 'direction-step' ),
				isGroup: false,
				text: [ 'Praesent feugiat dui eu pretium eleifend. In non tempus est. Praesent ullamcorper sapien vitae viverra imperdiet.' ],
			},
			{
				id: generateId( 'direction-step' ),
				isGroup: true,
				text: [ 'Group Title here' ],
			},
			{
				id: generateId( 'direction-step' ),
				isGroup: false,
				text: [ 'Aenean nec diam a augue efficitur venenatis.' ],
			},
			{
				id: generateId( 'direction-step' ),
				isGroup: false,
				text: [ 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' ],
			},
		],
	},
};

export const deprecatedBlock = [
	{
		attributes: {
			title: {
				type: 'array',
				selector: '.directions-title',
				source: 'children',
				default: wpzoom_rcb_settings_steps_title,
			},
			id: {
				type: 'string',
			},
			print_visibility: {
				type: 'string',
				default: 'visible',
			},
			jsonTitle: {
				type: 'string',
			},
			steps: {
				type: 'array',
			},
			content: {
				type: 'array',
				selector: '.directions-list',
				source: 'children',
			},
		},
		save: legacy.v1_0,
	},
];
