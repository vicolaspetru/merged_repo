import { uniqueId } from 'lodash';

/**
 * Generates a pseudo-unique id.
 *
 * @param {string} [prefix] The prefix to use.
 *
 * @returns {string} Returns the unique ID.
 */
export function generateId( prefix = '' ) {
    return prefix !== '' ? uniqueId( `${ prefix }-${ new Date().getTime() }` ) : uniqueId( new Date().getTime() );
}
