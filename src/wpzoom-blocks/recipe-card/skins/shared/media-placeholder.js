/**
 * External dependencies
 */
import {
    get,
    isUndefined,
} from 'lodash';

/**
 * Internal dependencies
 */
import { imageIcon } from './icon';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Platform } from '@wordpress/element';
import { MediaPlaceholder } from '@wordpress/block-editor';
import {
    Placeholder,
    Spinner,
    Disabled,
    withNotices,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';

/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const PLACEHOLDER_TEXT = Platform.select( {
    web: __( 'Drag image, upload new one or select file from your library.', 'wpzoom-recipe-card' ),
    native: __( 'ADD MEDIA', 'wpzoom-recipe-card' ),
} );

class UploadMediaPlaceholder extends Component {
    render() {
        const {
            image,
            hasImage,
            onSelectImage,
            onUploadError,
            isRecipeCardSelected,
            noticeUI,
        } = this.props;

        const hasImageWithId = hasImage && ! isUndefined( get( image, 'id' ) );

        return (
            <MediaPlaceholder
                addToGallery={ false }
                disableMediaButtons={ hasImage && ! isRecipeCardSelected }
                className="recipe-card-image-placeholder"
                icon={ ! hasImage && imageIcon }
                labels={ {
                    title: ! hasImage && __( 'Recipe Card Image', 'wpzoom-recipe-card' ),
                    instructions: ! hasImage && PLACEHOLDER_TEXT,
                } }
                accept="image/*"
                allowedTypes={ ALLOWED_MEDIA_TYPES }
                value={ hasImageWithId ? image : undefined }
                onSelect={ onSelectImage }
                onError={ onUploadError }
                notices={ hasImage ? undefined : noticeUI }
            />
        );
    }
}

export default compose(
    withNotices
)( UploadMediaPlaceholder );
