/**
 * External dependencies
 */
import {
	map,
	isObject,
} from 'lodash';

/**
 * Set inline styles
 *
 * @param {Object} styles     The styles object (e.g. 'identifier': 'style')
 * @param {boolean} important Make styles `!important`?
 * @return {Component}       Style component
 */
export const buildInlineStyle = ( styles, important = true ) => {
	let parsedStyles = '';

	if ( ! isObject( styles ) ) {
		return;
	}

	map( styles, ( style, identifier ) => {
		parsedStyles += `${ identifier } { ${ style } }\n`;
	} );

	if ( important ) {
		parsedStyles = parsedStyles.replace( /;(?=\S|\s*)/gm, ' !important;' );
	}

	return (
		<style dangerouslySetInnerHTML={ {
			__html: [ parsedStyles ],
		} }></style>
	);
};
