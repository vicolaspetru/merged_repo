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
        wpzoom_rcb_settings_ingredients_title,
    },
} = wpzoomRecipeCard;

export const blockKeywords = [
    __( 'ingredients', 'wpzoom-recipe-card' ),
    __( 'wpzoom', 'wpzoom-recipe-card' ),
    __( 'recipe', 'wpzoom-recipe-card' ),
];

export const blockExample = {
    attributes: {
        items: [
            {
                id: generateId( 'ingredient-item' ),
                isGroup: false,
                name: [ 'Lorem ipsum dolor sit amet' ],
            },
            {
                id: generateId( 'ingredient-item' ),
                isGroup: false,
                name: [ 'Praesent feugiat dui eu pretium eleifend' ],
            },
            {
                id: generateId( 'ingredient-item' ),
                isGroup: true,
                name: [ 'Group Title here' ],
            },
            {
                id: generateId( 'ingredient-item' ),
                isGroup: false,
                name: [ 'Aenean nec diam a augue efficitur venenatis' ],
            },
            {
                id: generateId( 'ingredient-item' ),
                isGroup: false,
                name: [ 'Pellentesque habitant morbi' ],
            },
        ],
    },
};

export const deprecatedBlock = [
    {
        attributes: {
            title: {
                type: 'array',
                selector: '.ingredients-title',
                source: 'children',
                default: wpzoom_rcb_settings_ingredients_title,
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
            items: {
                type: 'array',
            },
            content: {
                type: 'array',
                selector: '.ingredients-list',
                source: 'children',
            },
        },
        save: legacy.v1_0,
    },
];
