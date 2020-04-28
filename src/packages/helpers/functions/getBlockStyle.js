/*global wpzoomRecipeCard*/

/**
 * External dependencies.
 */
import { get, find } from 'lodash';

/**
 * Constants
 */
const {
    setting_options: {
        wpzoom_rcb_settings_template,
    },
} = wpzoomRecipeCard;
const TokenList = wp.tokenList;

export const availableStyles = [
    {
        name: 'default',
        isDefault: 'default' === wpzoom_rcb_settings_template,
    },
    {
        name: 'newdesign',
        isDefault: 'newdesign' === wpzoom_rcb_settings_template,
    },
    {
        name: 'simple',
        isDefault: 'simple' === wpzoom_rcb_settings_template,
    },
];

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
