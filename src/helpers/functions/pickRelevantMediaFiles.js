/**
 * External dependencies
 */
import get from 'lodash/get';
import pick from 'lodash/pick';

export const pickRelevantMediaFiles = ( image, sizeSlug = 'large' ) => {
	const defaults = {
		id: null,
		link: '',
		url: null,
		caption: '',
		sizes: null,
		alt: '',
		title: '',
	};

	if ( ! image ) {
		return defaults;
	}

	const imageProps = pick( image, [
		'alt',
		'id',
		'link',
		'caption',
		'title',
	] );
	const pickedSize =
		get( image, [ 'sizes', sizeSlug, 'url' ] ) ||
		get( image, [ 'media_details', 'sizes', sizeSlug, 'source_url' ] );
	const original = get( image, [ 'url' ] ) || get( image, [ 'source_url' ] );
	const fullUrl =
		get( image, [ 'sizes', 'full', 'url' ] ) ||
		get( image, [ 'media_details', 'sizes', 'full', 'source_url' ] );

	imageProps.url = pickedSize || original;

	if ( fullUrl ) {
		imageProps.fullUrl = fullUrl;
	}

	return imageProps;
};
