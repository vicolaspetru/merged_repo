/* External dependencies */
import {
    map,
    every,
    filter,
    forEach,
    isUndefined
} from "lodash";

/* Internal dependencies */
import { pickRelevantMediaFiles } from "./shared";
import DirectionGallery from "./DirectionGallery";

/* WordPress dependencies */
import { __ } from "@wordpress/i18n";
import { compose } from "@wordpress/compose";
import { Component, Fragment, Platform } from "@wordpress/element";
import { getBlobByURL, isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { withSelect } from "@wordpress/data";
import { withViewportMatch } from "@wordpress/viewport";

/* Module constants */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * A Direction step gallery within a Direction block.
 */
class DirectionGalleryEdit extends Component {

    /**
     * Constructs a DirectionStep editor component.
     *
     * @param {Object} props This component's properties.
     *
     * @returns {void}
     */
    constructor( props ) {
        super( props );

        this.onSelectImage = this.onSelectImage.bind( this );
        this.onSelectImages = this.onSelectImages.bind( this );
        this.onMove = this.onMove.bind( this );
        this.onMoveForward = this.onMoveForward.bind( this );
        this.onMoveBackward = this.onMoveBackward.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
        this.setImageAttributes = this.setImageAttributes.bind( this );
        this.setAttributes = this.setAttributes.bind( this );

        // this.getImagesSizeOptions = this.getImagesSizeOptions.bind( this );
        // this.updateImagesSize = this.updateImagesSize.bind( this );

        this.state = {
            selectedImage: null,
        };
    }

    setAttributes( attributes ) {
        // if ( attributes.ids ) {
        //     throw new Error(
        //         'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes'
        //     );
        // }

        console.log( attributes )

        // if ( attributes.images ) {
        //     attributes = {
        //         ...attributes,
        //         ids: map( attributes.images, 'id' ),
        //     };
        // }

        // this.props.setAttributes( attributes );
    }

    onSelectImage( index ) {
        return () => {
            if ( this.state.selectedImage !== index ) {
                this.setState( {
                    selectedImage: index,
                } );
            }
        };
    }

    onMove( oldIndex, newIndex ) {
        const images = [ ...this.props.images ];
        images.splice( newIndex, 1, this.props.images[ oldIndex ] );
        images.splice( oldIndex, 1, this.props.images[ newIndex ] );
        this.setState( { selectedImage: newIndex } );
        this.setAttributes( { images } );
    }

    onMoveForward( oldIndex ) {
        return () => {
            if ( oldIndex === this.props.images.length - 1 ) {
                return;
            }
            this.onMove( oldIndex, oldIndex + 1 );
        };
    }

    onMoveBackward( oldIndex ) {
        return () => {
            if ( oldIndex === 0 ) {
                return;
            }
            this.onMove( oldIndex, oldIndex - 1 );
        };
    }

    onRemoveImage( index ) {
        return () => {
            const images = filter(
                this.props.images,
                ( img, i ) => index !== i
            );
            this.setState( { selectedImage: null } );
            this.setAttributes( { images } );
        };
    }

    onSelectImages( newImages ) {

        console.log( newImages )

        const { sizeSlug } = this.props;

        this.setAttributes( {
            images: newImages.map( ( newImage ) => ( {
                ...pickRelevantMediaFiles( newImage, sizeSlug )
            } ) )
        } );
    }

    setImageAttributes( index, attributes ) {
        const { images } = this.props;
        if ( ! images[ index ] ) {
            return;
        }
        this.setAttributes( {
            images: [
                ...images.slice( 0, index ),
                {
                    ...images[ index ],
                    ...attributes,
                },
                ...images.slice( index + 1 ),
            ],
        } );
    }

    componentDidMount() {
        const { images, mediaUpload } = this.props;
        if (
            Platform.OS === 'web' &&
            ! isUndefined( images ) &&
            images.length > 0 &&
            every( images, ( { url } ) => isBlobURL( url ) )
        ) {
            const filesList = map( images, ( { url } ) => getBlobByURL( url ) );
            forEach( images, ( { url } ) => revokeBlobURL( url ) );
            mediaUpload( {
                filesList,
                onFileChange: this.onSelectImages,
                allowedTypes: ALLOWED_MEDIA_TYPES,
            } );
        }
    }

    componentDidUpdate( prevProps ) {
        // Deselect images when deselecting the block
        if ( ! this.props.isSelected && prevProps.isSelected ) {
            this.setState( {
                selectedImage: null
            } );
        }
    }

    /**
     * Renders this component.
     *
     * @returns {Component} The direction step editor.
     */
    render() {
        const { images } = this.props;

        const hasImages = ! isUndefined( images ) && !! images.length;

        if ( ! hasImages ) {
            return null;
        }

        return (
            <DirectionGallery
                { ...this.props }
                selectedImage={ this.state.selectedImage }
                onMoveBackward={ this.onMoveBackward }
                onMoveForward={ this.onMoveForward }
                onRemoveImage={ this.onRemoveImage }
                onSelectImage={ this.onSelectImage }
                onSetImageAttributes={ this.setImageAttributes }
            />
        );
    }
}

export default compose(
    withSelect( ( select ) => {
        const { getSettings } = select( 'core/block-editor' );
        const { mediaUpload } = getSettings();

        return {
            mediaUpload
        };
    } ),
    withViewportMatch( { isNarrow: '< small' } ),
)( DirectionGalleryEdit );