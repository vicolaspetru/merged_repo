/**
 * External dependencies
 */
import {
    get,
    pick,
} from 'lodash';

export const pickRelevantMediaFiles = ( image, target ) => {
    const defaults = {
        id: null,
        link: '',
        url: null,
        caption: '',
        sizes: null,
        alt: '',
        title: '',
    };
    let imageProps;

    if ( image ) {
        imageProps = pick( image, [ 'alt', 'id', 'link', 'caption', 'title' ] );

        const original = get( image, [ 'url' ] ) || get( image, [ 'source_url' ] );
        const wpzoom_rcb_block_step_image = get( image, [ 'sizes', 'wpzoom-rcb-block-step-image', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'wpzoom-rcb-block-step-image', 'source_url' ] );
        const wpzoom_rcb_block_header = get( image, [ 'sizes', 'wpzoom-rcb-block-header', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'wpzoom-rcb-block-header', 'source_url' ] );
        const large = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] );
        const medium = get( image, [ 'sizes', 'medium', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'medium', 'source_url' ] );
        const thumbnail = get( image, [ 'sizes', 'thumbnail', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'thumbnail', 'source_url' ] );

        if ( 'step' === target ) {
            imageProps.url = wpzoom_rcb_block_step_image || large || original;
        } else if ( 'ingredient' === target ) {
            imageProps.url = medium || thumbnail || original;
        } else if ( 'header' === target ) {
            imageProps.url = wpzoom_rcb_block_header || large || original;
        }
    }

    return imageProps || defaults;
};
