/**
 * External dependencies
 */
import trim from 'lodash/trim';
import split from 'lodash/split';
import includes from 'lodash/includes';

/**
 * Exclude uneeded class names.
 *
 * @param {Array} className  	The block classname.
 * @param {Array} exclude  		The classnames to exclude.
 *
 * @return {string} className.
 */
export function excludeClassNames( className, exclude ) {
	let classname = className;
	exclude.map( ( item ) => {
		if ( includes( classname, item ) ) {
			classname = trim( classname, item );
		}
		return classname;
	} );
	return classname;
}

/**
 * Get block className without additions class names (e.g. is-style-).
 *
 * @param {Array} className     The block classname.
 *
 * @return {string} Block style.
 */
export function parseClassName( className ) {
	const m = split( className, ' ' );
	return m ? m[ 0 ] : className;
}
