/**
 * Get deep CSS selector by specified target for only active block style
 * @param  {string} activeStyle The main block active style
 * @param  {string} target      The target selector to be find
 * @return {string}             The full deep selector based on activeStyle and target
 */
export const getCSSSelector = ( activeStyle, target ) => {
    let selector = `.wp-block-wpzoom-recipe-card-block-recipe-card.is-style-${ activeStyle }`;

    if ( selectors[ target ] ) {
        selector += ` ${ selectors[ target ] }`;
    }

    return selector;
};

const selectors = {
    '.btn-pinit-link': '.wpzoom-recipe-card-pinit .btn-pinit-link',
    '.wpzoom-rcb-pinit-icon': '.wpzoom-recipe-card-pinit .btn-pinit-link .wpzoom-rcb-pinit-icon',
    '.btn-print-link': '.wpzoom-recipe-card-print-link .btn-print-link',
    '.wpzoom-rcb-print-icon': '.wpzoom-recipe-card-print-link .btn-print-link .wpzoom-rcb-print-icon',
    '.recipe-card-image': '.recipe-card-header-container .recipe-card-image',
    '.recipe-card-course': '.recipe-card-header-container .recipe-card-course',
    '.recipe-card-cuisine': '.recipe-card-header-container .recipe-card-cuisine',
    '.recipe-card-difficulty': '.recipe-card-header-container .recipe-card-difficulty',
    '.detail-item-icon': '.recipe-card-details .details-items .detail-item .detail-item-icon span',
    '.recipe-card-header-container': '.recipe-card-header-container',
    '.recipe-card-title': '.recipe-card-header-container .recipe-card-title',
    '.tick-circle': '.ingredients-list>li .tick-circle',
    '.recipe-card-notes-list': '.recipe-card-notes .recipe-card-notes-list',
};
