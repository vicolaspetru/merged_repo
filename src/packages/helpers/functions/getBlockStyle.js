/**
 * External dependencies.
 */
import { get, find } from 'lodash';

/**
 * Internal dependencies
 */
import { blockStyles as availableStyles } from '../../../wpzoom-blocks/recipe-card/attributes';

/**
 * Constants
 */
const TokenList = wp.tokenList;

/**
 * Get block style.
 *
 * @param {array} className     The block classname.
 *
 * @returns {number} Block style.
 */
export function getBlockStyle( className ) {
    for ( const style of new TokenList( className ).values() ) {
        if ( style.indexOf( 'is-style-' ) === -1 ) {
            continue;
        }

        const potentialStyleName = style.substring( 9 );
        const activeStyle = find( availableStyles, { name: potentialStyleName } );

        if ( activeStyle ) {
            return get( activeStyle, 'name' );
        }
    }

    const defaultStyle = find( availableStyles, { isDefault: true } );

    return get( defaultStyle, 'name' );
}
