/**
 * Internal dependencies
 */
import legacy from './legacy';
import { Icons } from '@wpzoom/utils';
import { generateId } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const blockKeywords = [
    __( 'details', 'wpzoom-recipe-card' ),
    __( 'wpzoom', 'wpzoom-recipe-card' ),
    __( 'recipe', 'wpzoom-recipe-card' ),
];

export const blockExample = {
    attributes: {
        course: [ __( 'Main', 'wpzoom-recipe-card' ) ],
        cuisine: [ __( 'Italian', 'wpzoom-recipe-card' ) ],
        difficulty: [ __( 'Medium', 'wpzoom-recipe-card' ) ],
        details: [
            { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'food', label: __( 'Servings', 'wpzoom-recipe-card' ) },
            { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'room-service', label: __( 'Prep time', 'wpzoom-recipe-card' ) },
            { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'cook', label: __( 'Cooking time', 'wpzoom-recipe-card' ) },
            { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'shopping-basket', label: __( 'Calories', 'wpzoom-recipe-card' ) },
        ],
    },
};

export const deprecatedBlock = [
    {
        attributes: {
            title: {
                type: 'array',
                selector: '.details-title',
                source: 'children',
                default: __( 'Details', 'wpzoom-recipe-card' ),
            },
            id: {
                type: 'string',
            },
            details: {
                type: 'array',
                selector: '.details-items',
                default: [
                    { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'food', label: __( 'Servings', 'wpzoom-recipe-card' ) },
                    { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'room-service', label: __( 'Prep time', 'wpzoom-recipe-card' ) },
                    { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'cook', label: __( 'Cooking time', 'wpzoom-recipe-card' ) },
                    { id: generateId( 'detail-item' ), iconSet: 'oldicon', icon: 'shopping-basket', label: __( 'Calories', 'wpzoom-recipe-card' ) },
                ],
            },
            columns: {
                type: 'number',
                default: 4,
            },
            toInsert: {
                type: 'string',
            },
            showModal: {
                type: 'string',
                default: false,
            },
            activeIconSet: {
                type: 'string',
                default: 'oldicon',
            },
            searchIcon: {
                type: 'string',
                default: '',
            },
            icons: {
                type: 'object',
                default: Icons,
            },
            jsonTitle: {
                type: 'string',
            },
            course: {
                type: 'array',
            },
            cuisine: {
                type: 'array',
            },
            keywords: {
                type: 'array',
            },
            blocks_count: {
                type: 'string',
            },
        },
        save: legacy.v1_0,
    },
];
