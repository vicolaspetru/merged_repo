/**
 * External dependencies
 */
import {
	map,
	some,
	every,
	filter,
	forEach,
	isUndefined,
	includes,
} from 'lodash';

/**
 * Internal dependencies
 */
import { pickRelevantMediaFiles } from '@wpzoom/helpers';
import { sharedIcon } from './shared-icon';
import DirectionGallery from './direction-gallery';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withNotices } from '@wordpress/components';
import { Component, Platform } from '@wordpress/element';
import { LEFT, RIGHT } from '@wordpress/keycodes';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { withSelect } from '@wordpress/data';
import { withViewportMatch } from '@wordpress/viewport';
import { MediaPlaceholder } from '@wordpress/block-editor';

/**
 * Module constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

const PLACEHOLDER_TEXT = Platform.select( {
	web: __( 'Drag images, upload new ones or select files from your library.', 'wpzoom-recipe-card' ),
	native: __( 'ADD MEDIA', 'wpzoom-recipe-card' ),
} );

/**
 * A Direction step gallery within a Direction block.
 */
class DirectionGalleryEdit extends Component {
	/**
	 * Constructs a DirectionStep editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @return {void}
	 */
	constructor( props ) {
		super( props );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.onMove = this.onMove.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMoveBackward = this.onMoveBackward.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.setAttributes = this.setAttributes.bind( this );
		this.onUploadError = this.onUploadError.bind( this );
		this.handleImagesLoaded = this.handleImagesLoaded.bind( this );

		this.state = {
			selectedImage: null,
			isLoadingImages: true,
		};
	}

	setAttributes( attributes ) {
		if ( attributes.ids ) {
			throw new Error(
				'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes'
			);
		}

		if ( attributes.images ) {
			attributes = {
				...attributes,
				ids: map( attributes.images, 'id' ),
			};
		}

		this.props.onChangeGallery( attributes, this.props.stepIndex );
	}

	onSelectImage( index ) {
		return () => {
			this.props.onFocusStep( this.props.stepIndex, 'text' );

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

	onKeyDown( event ) {
		if ( includes( [ LEFT, RIGHT ], event.keyCode ) ) {
			event.stopPropagation();
			event.preventDefault();
		}
		if ( includes( [ RIGHT ], event.keyCode ) ) {
			this.onSelectForward( this.state.selectedImage );
		}
		if ( includes( [ LEFT ], event.keyCode ) ) {
			this.onSelectBackward( this.state.selectedImage );
		}
	}

	onSelectForward( oldIndex ) {
		if ( oldIndex === this.props.images.length - 1 ) {
			return;
		}
		this.setState( { selectedImage: oldIndex + 1 } );
	}

	onSelectBackward( oldIndex ) {
		if ( oldIndex === 0 ) {
			return;
		}
		this.setState( { selectedImage: oldIndex - 1 } );
	}

	onRemoveImage( index ) {
		return () => {
			const images = filter( this.props.images, ( img, i ) => index !== i );

			this.setState( { selectedImage: null } );
			this.setAttributes( { images } );
		};
	}

	onSelectImages( newImages ) {
		this.setAttributes( {
			images: newImages.map( ( newImage ) => ( {
				...pickRelevantMediaFiles( newImage, 'wpzoom-rcb-block-step-image' ),
			} ) ),
		} );
	}

	onUploadError( message ) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
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
		// Deselect images when deselecting the step or Recipe Card Block
		if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedImage: null,
			} );
		}
	}

	handleImagesLoaded( imagesLoadedInstance ) {
		if ( imagesLoadedInstance.isComplete && this.state.isLoadingImages === true ) {
			this.setState( { isLoadingImages: false } );
		}
	}

	/**
	 * Renders this component.
	 *
	 * @return {Component} The direction step editor.
	 */
	render() {
		const {
			images,
			isSelected,
			noticeUI,
		} = this.props;

		const hasImages = ! isUndefined( images ) && !! images.length;
		const hasImagesWithId = hasImages && some( images, ( { id } ) => id );
		const galleryId = `direction-${ this.props.stepIndex }-gallery`;

		const mediaPlaceholder = (
			<MediaPlaceholder
				addToGallery={ hasImagesWithId }
				isAppender={ hasImages }
				disableMediaButtons={ hasImages && ! isSelected }
				className="direction-step-gallery-placeholder"
				icon={ hasImages && sharedIcon }
				labels={ {
					title: hasImages ? __( 'Edit Gallery', 'wpzoom-recipe-card' ) : __( 'Add Gallery', 'wpzoom-recipe-card' ),
					instructions: ! hasImages && PLACEHOLDER_TEXT,
				} }
				onSelect={ this.onSelectImages }
				accept="image/*"
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				multiple
				value={ hasImagesWithId ? images : undefined }
				onError={ this.onUploadError }
				notices={ hasImages ? undefined : noticeUI }
			/>
		);

		if ( ! hasImages && isSelected ) {
			return mediaPlaceholder;
		}

		if ( ! hasImages && ! isSelected ) {
			return null;
		}

		return (
			<div
				id={ galleryId }
				onKeyDown={ this.onKeyDown }
			>
				{ noticeUI }
				<DirectionGallery
					{ ...this.props }
					galleryId={ galleryId }
					selectedImage={ this.state.selectedImage }
					isLoading={ this.state.isLoadingImages }
					mediaPlaceholder={ mediaPlaceholder }
					onMoveBackward={ this.onMoveBackward }
					onMoveForward={ this.onMoveForward }
					onRemoveImage={ this.onRemoveImage }
					onSelectImage={ this.onSelectImage }
					onSetImageAttributes={ this.setImageAttributes }
					handleImagesLoaded={ this.handleImagesLoaded }
				/>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const { mediaUpload } = getSettings();

		return {
			mediaUpload,
		};
	} ),
	withNotices,
	withViewportMatch( { isNarrow: '< small' } ),
] )( DirectionGalleryEdit );
