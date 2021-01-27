import uniqueId from 'lodash/uniqueId';

/**
 * Generates a pseudo-unique id.
 *
 * @param {string} [prefix] The prefix to use.
 *
 * @return {string} Returns the unique ID.
 */
export function generateId( prefix = '' ) {
	return prefix !== ''
		? uniqueId( `${ prefix }-${ new Date().getTime() }` )
		: uniqueId( new Date().getTime() );
}
