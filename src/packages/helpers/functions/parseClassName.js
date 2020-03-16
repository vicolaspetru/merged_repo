import trim from "lodash/trim";
import split from "lodash/split";
import includes from "lodash/includes";

/**
 * Exclude uneeded class names.
 *
 * @param {array} className  	The block classname.
 * @param {array} exclude  		The classnames to exclude.
 *
 * @returns {string} className.
 */
export function excludeClassNames( className, exclude ) {
    let classname = className;
    exclude.map( ( item, index ) => {
        if ( includes( classname, item ) ) {
            classname = trim( classname, item );
        }
    } );
    return classname;
}

/**
 * Get block className without additions class names (e.g. is-style-).
 *
 * @param {array} className     The block classname.
 *
 * @returns {number} Block style.
 */
export function parseClassName( className ) {
    let m = split( className, ' ' );
    return m ? m[0] : className;
}