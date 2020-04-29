/**
 * BLOCK: block-ingredients
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * External dependencies
 */
import { isUndefined } from 'lodash';

/**
 * Internal dependencies
 */
import Ingredient from './components/Ingredient';
import icon from './icon';
import { generateId } from '@wpzoom/helpers';
import {
    blockKeywords as keywords,
    blockExample as example,
    deprecatedBlock as deprecated,
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
registerBlockType( `${ category }/block-ingredients`, {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Ingredients', 'wpzoom-recipe-card' ), // Block title.
    icon: {
        // // Specifying a background color to appear with the icon e.g.: in the inserter.
        // background: '#2EA55F',
        // Specifying a color for the icon (optional: if not set, a readable color will be automatically defined)
        foreground: '#2EA55F',
        // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
        src: icon,
    },
    category, // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    // Allow multiple Ingredients block per post.
    supports: {
        multiple: true,
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
     * @returns {Component}              Ingredient Component
     */
    edit: ( { attributes, setAttributes, className } ) => {
        const items = attributes.items ? attributes.items.slice() : [];

        // Populate deprecated attribute 'content'
        // Backward compatibility
        if ( attributes.content && attributes.content.length > 0 ) {
            const content = attributes.content;

            if ( items.length === 0 ) {
                for ( let i = 0; i < content.length; i++ ) {
                    if ( ! isUndefined( content[ i ].props ) ) {
                        items.push( {
                            id: generateId( 'ingredient-item' ),
                            name: content[ i ].props.children,
                        } );
                    }
                }

                setAttributes( { items } );
            }
        }

        // Because setAttributes is quite slow right after a block has been added we fake having a four ingredients.
        if ( ! items || items.length === 0 ) {
            attributes.items = [
                {
                    id: generateId( 'ingredient-item' ),
                    name: [],
                },
                {
                    id: generateId( 'ingredient-item' ),
                    name: [],
                },
                {
                    id: generateId( 'ingredient-item' ),
                    name: [],
                },
                {
                    id: generateId( 'ingredient-item' ),
                    name: [],
                },
            ];
        }

        return <Ingredient { ...{ attributes, setAttributes, className } } />;
    },
    save() {
        // Rendering in PHP
        return null;
    },
    deprecated,
} );
