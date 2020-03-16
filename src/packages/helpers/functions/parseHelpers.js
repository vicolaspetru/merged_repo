/* External dependencies */
import get from "lodash/get";
import trim from "lodash/trim";
import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import forEach from "lodash/forEach";

/* Internal dependencies */
import { stripHTML } from "@wpzoom/helpers";

/* WordPress dependencies */
const { renderToString } = wp.element;

// parse value for ingredients and directions
// render from array to string and strip HTML
// append \n newline at the end of each item
export function parseValue( value, isGroup = false ) {
    const content = convertObjectToString( value );
    let returnValue = '';

    if ( ! isEmpty( content ) ) {
        returnValue = stripHTML( renderToString( trim( content ) ) );

        if ( isGroup ) {
            returnValue = `**${ returnValue }**`;
        }
    }
    return ! isEmpty( returnValue ) ? returnValue + '\n' : '';
}

export function parseObjectStyle( style ) {
    let css = '';
    if ( isObject( style ) ) {
        forEach( style, ( value, property ) => {
            css += `${ property }: ${ value };`
        } );
    }
    if ( isString( style ) ) {
        css = style;
    }
    return css;
}

export function convertObjectToString( nodes, $type = '' ) {
    if ( isString( nodes ) ) {
        return nodes;
    }

    if ( isNull( nodes ) ) {
        return '';
    }

    let output = '';

    forEach( nodes, ( node, index ) => {
        if ( isString( node ) ) {
            output += node;
        } else {
            const type     = get( node, [ 'type' ] ) || '';
            let children   = get( node, [ 'props', 'children' ] ) || '';
            let startTag   = type ? '<'+type+'>' : '';
            let endTag     = type ? '</'+type+'>' : '';

            if ( 'img' === type ) {
                const src = get( node, [ 'props', 'src' ] ) || false;
                if ( src ) {
                    const alt      = get( node, [ 'props', 'alt' ] ) || '';
                    const imgStyle = get( node, [ 'props', 'style' ] ) || '';
                    const imgClass = 'direction-step-image';
                    startTag = `<${ type } src="${ src }" alt="${ alt }" class="${ imgClass }" style="${ parseObjectStyle( imgStyle ) }" />`;
                } else {
                    startTag = '';
                }
                endTag = '';
            } else if ( 'a' === type ) {
                const rel        = get( node, [ 'props', 'rel' ] ) || '';
                const ariaLabel  = get( node, [ 'props', 'aria-label' ] ) || '';
                const href       = get( node, [ 'props', 'href' ] ) || '#';
                const target     = get( node, [ 'props', 'target' ] ) || '_blank';
                startTag = `<${ type } rel="${ rel }" aria-label="${ ariaLabel }" href="${ href }" target="${ target }">`;
            } else if ( 'br' === type ) {
                endTag = '';
            }
            output += startTag + convertObjectToString( children, type ) + endTag;
        }
    } );

    return output;
}