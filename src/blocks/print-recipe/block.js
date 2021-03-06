/**
 * BLOCK: block-print-recipe
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * Internal dependencies
 */
import icon from './icon';
import { blockKeywords as keywords } from './attributes';
import { blockCategory as category } from '../../block-category';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
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
registerBlockType( `${ category }/block-print-recipe`, {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Print Recipe', 'wpzoom-recipe-card' ), // Block title.
	description: __( 'A button to print WPZOOM Recipe Card.', 'wpzoom-recipe-card' ),
	icon: {
		// // Specifying a background color to appear with the icon e.g.: in the inserter.
		// background: '#2EA55F',
		// Specifying a color for the icon (optional: if not set, a readable color will be automatically defined)
		foreground: '#2EA55F',
		// Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		src: icon,
	},
	category, // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	// Allow only one Recipe Card Block per post.
	supports: {
		multiple: false,
		html: false,
		inserter: false,
	},
	keywords,
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param attributes.attributes
	 * @param {Object} attributes        The main attributes of block
	 * @param {method} setAttributes     The function that helps to set attributes for block
	 * @param attributes.className
	 * @param {string} className         The string of class names
	 * @return {Component}              Print Recipe Button Component
	 */
	edit: ( { attributes, className } ) => {
		const { id, text } = attributes;

		return (
			<Fragment>
				<a href={ `#${ id }` } className={ className }>{ text }</a>
			</Fragment>
		);
	},
	save() {
		// Rendering in PHP
		return null;
	},
} );
