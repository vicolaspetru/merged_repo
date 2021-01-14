/**
 * BLOCK: block-recipe-card
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * External dependencies
 */
import {
    map,
    isNull,
} from 'lodash';

/**
 * Internal dependencies
 */
import RecipeCard from './components/recipe-card';
import { generateId } from '@wpzoom/helpers';
import icon from './icon';
import {
    blockKeywords as keywords,
    blockExample as example,
} from './attributes';
import { blockCategory as category } from '../../block-category';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register: Ingredients Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( `${ category }/block-recipe-card`, {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Premium Recipe Card', 'wpzoom-recipe-card' ), // Block title.
    description: __( 'Display a Premium Recipe Card box with recipe metadata.', 'wpzoom-recipe-card' ),
    icon: {
        // Specifying a background color to appear with the icon e.g.: in the inserter.
        // background: '#FDA921',
        // Specifying a color for the icon (optional: if not set, a readable color will be automatically defined)
        foreground: '#FDA921',
        // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
        src: icon,
    },
    category, // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    // Allow only one Premium Recipe Card block per post.
    supports: {
        multiple: false,
    },
    keywords,
    example,
    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     *
     * @param {Object} attributes        The main attributes of block
     * @param {method} setAttributes     The function that helps to set attributes for block
     * @param {string} className         The string of class names
     * @returns {Component}              Recipe Card Component
     */
    edit: ( { attributes, setAttributes, className, clientId, isSelected } ) => {
        // Fix issue with null value for custom details items
        // Add default value instead of null
        const customDetailsDetaults = [
            {
                id: generateId( 'detail-item' ),
                iconSet: 'fa',
                _prefix: 'far',
                icon: 'clock',
            },
            {
                id: generateId( 'detail-item' ),
                iconSet: 'oldicon',
                icon: 'chef-cooking',
            },
            {
                id: generateId( 'detail-item' ),
                iconSet: 'oldicon',
                icon: 'food-1',
            },
            {
                id: generateId( 'detail-item' ),
                iconSet: 'fa',
                _prefix: 'fas',
                icon: 'sort-amount-down',
            },
        ];

        attributes.details = map( attributes.details, ( item, index ) => {
            if ( isNull( item ) ) {
                if ( 4 === index ) {
                    return customDetailsDetaults[ 0 ];
                } else if ( 5 === index ) {
                    return customDetailsDetaults[ 1 ];
                } else if ( 6 === index ) {
                    return customDetailsDetaults[ 2 ];
                } else if ( 7 === index ) {
                    return customDetailsDetaults[ 3 ];
                }
            } else {
                return item;
            }
        } );

        return <RecipeCard { ...{ attributes, setAttributes, className, clientId, isSelected } } />;
    },
    save() {
        // Rendering in PHP
        return null;
    },
} );
