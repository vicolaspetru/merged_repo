/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DirectionGalleryImage from './direction-gallery-image';

export const DirectionGallery = ( props ) => {
    const {
        images,
        className,
        isRecipeCardSelected,
        selectedImage,
        onMoveBackward,
        onMoveForward,
        onRemoveImage,
        onSelectImage,
        mediaPlaceholder,
        onSetImageAttributes,
    } = props;

    return (
        <div className={ className }>
            <ul className="direction-step-gallery-grid">
                { images.map( ( img, index ) => {
                    /* translators: %1$d is the order number of the image, %2$d is the total number of images. */
                    const ariaLabel = sprintf(
                        __( 'image %1$d of %2$d in gallery' ),
                        index + 1,
                        images.length
                    );

                    return (
                        <li className="direction-step-gallery-item" key={ img.id || img.url }>
                            <DirectionGalleryImage
                                url={ img.url }
                                alt={ img.alt }
                                id={ img.id }
                                isFirstItem={ index === 0 }
                                isLastItem={ index + 1 === images.length }
                                isSelected={ isRecipeCardSelected && selectedImage === index }
                                onMoveBackward={ onMoveBackward( index ) }
                                onMoveForward={ onMoveForward( index ) }
                                onRemove={ onRemoveImage( index ) }
                                onSelect={ onSelectImage( index ) }
                                setAttributes={ ( attrs ) => onSetImageAttributes( index, attrs ) }
                                aria-label={ ariaLabel }
                            />
                        </li>
                    );
                } ) }
            </ul>
            { mediaPlaceholder }
        </div>
    );
};

export default DirectionGallery;