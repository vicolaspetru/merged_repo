/**
 * External dependencies
 */
import classnames from 'classnames';
import Masonry from 'react-masonry-component';

/**
 * Internal dependencies
 */
import DirectionGalleryImage from './direction-gallery-image';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Module constants
 */
const masonryOptions = {
    transitionDuration: 0,
    percentPosition: true,
    gutter: 8,
    columnWidth: '.direction-step-gallery-item'
};

export const DirectionGallery = ( props ) => {
    const {
        images,
        galleryId,
        className,
        isRecipeCardSelected,
        selectedImage,
        isLoading,
        onMoveBackward,
        onMoveForward,
        onRemoveImage,
        onSelectImage,
        mediaPlaceholder,
        onSetImageAttributes,
        handleImagesLoaded,
    } = props;

    const galleryClassName = classnames(
        className, {
            'is-editor-gallery': true,
            'is-loading': isLoading
        }
    );

    const masonryClasses = classnames( {
        'direction-step-gallery-grid': true
    } );

    const focusOnKeyDown = ( imgId ) => {
        document.getElementById( `${ galleryId }-${ imgId }` ).focus();
    }

    return (
        <Fragment>
            <div className={ galleryClassName }>
                {
                    isLoading && <Spinner/>
                }
                <Masonry
                    elementType={ 'ul' }
                    className={ masonryClasses }
                    options={ masonryOptions }
                    disableImagesLoaded={ false }
                    updateOnEachImageLoad={ false }
                    onImagesLoaded={ handleImagesLoaded }
                >
                    { images.map( ( img, index ) => {
                        const isSelected = isRecipeCardSelected && selectedImage === index;

                        /* translators: %1$d is the order number of the image, %2$d is the total number of images. */
                        const ariaLabel = sprintf(
                            __( 'image %1$d of %2$d in gallery' ),
                            index + 1,
                            images.length
                        );

                        /* Focus image when is selected by keyDown event [LEFT, RIGHT] */
                        if ( isSelected ) {
                            focusOnKeyDown( img.id );
                        }

                        return (
                            <li className="direction-step-gallery-item" key={ img.id || img.url }>
                                <DirectionGalleryImage
                                    url={ img.url }
                                    alt={ img.alt }
                                    id={ img.id }
                                    index={ index }
                                    galleryId={ galleryId }
                                    isFirstItem={ index === 0 }
                                    isLastItem={ index + 1 === images.length }
                                    isSelected={ isSelected}
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
                </Masonry>
                { mediaPlaceholder }
            </div>
        </Fragment>
    );
};

export default DirectionGallery;