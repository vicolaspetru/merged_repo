/**
 * External dependencies
 */
import { includes } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { leftArrow, rightArrow, close } from './icons';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BACKSPACE, DELETE } from '@wordpress/keycodes';
import { withSelect } from '@wordpress/data';
import { isBlobURL } from '@wordpress/blob';
import { compose } from '@wordpress/compose';

class DirectionGalleryImage extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.bindContainer = this.bindContainer.bind( this );
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	onSelectImage() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}
	}

	onRemoveImage( event ) {
		if (
			this.container === document.activeElement &&
            this.props.isSelected &&
            includes( [ BACKSPACE, DELETE ], event.keyCode )
		) {
			event.stopPropagation();
			event.preventDefault();
			this.props.onRemove();
		}
	}

	componentDidUpdate() {
		const {
			image,
			url,
		} = this.props;
		if ( image && ! url ) {
			this.props.setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}
	}

	render() {
		const {
			url,
			alt,
			id,
			linkTo,
			link,
			galleryId,
			isFirstItem,
			isLastItem,
			isSelected,
			onRemove,
			onMoveForward,
			onMoveBackward,
			'aria-label': ariaLabel,
		} = this.props;

		let href;

		switch ( linkTo ) {
			case 'media':
				href = url;
				break;
			case 'attachment':
				href = link;
				break;
		}

		// Disable reason: Image itself is not meant to be
		// interactive, but should direct image selection and unfocus caption fields
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
		const img = (
			// Disable reason: Image itself is not meant to be interactive, but should
			// direct image selection and unfocus caption fields.
			/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
			<Fragment>
				<img
					src={ url }
					alt={ alt }
					data-id={ id }
					id={ `${ galleryId }-${ id }` }
					onClick={ this.onSelectImage }
					onFocus={ this.onSelectImage }
					onKeyDown={ this.onRemoveImage }
					tabIndex="0"
					aria-label={ ariaLabel }
					ref={ this.bindContainer }
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</Fragment>
			/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
		);

		const className = classnames( {
			'is-selected': isSelected,
			'is-transient': isBlobURL( url ),
		} );

		return (
			<figure className={ className }>
				{ href ? <a href={ href }>{ img }</a> : img }
				<div className="direction-step-gallery-item__move-menu">
					<Button
						icon={ leftArrow }
						onClick={ isFirstItem ? undefined : onMoveBackward }
						className="direciton-step-gallery-item__move-backward"
						label={ __( 'Move image backward' ) }
						aria-disabled={ isFirstItem }
						disabled={ ! isSelected }
					/>
					<Button
						icon={ rightArrow }
						onClick={ isLastItem ? undefined : onMoveForward }
						className="direciton-step-gallery-item__move-forward"
						label={ __( 'Move image forward' ) }
						aria-disabled={ isLastItem }
						disabled={ ! isSelected }
					/>
				</div>
				<div className="direction-step-gallery-item__inline-menu">
					<Button
						icon={ close }
						onClick={ onRemove }
						className="direciton-step-gallery-item__remove"
						label={ __( 'Remove image' ) }
						disabled={ ! isSelected }
					/>
				</div>
			</figure>
		);
	}
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { getMedia } = select( 'core' );
		const { id } = ownProps;

		return {
			image: id ? getMedia( id ) : null,
		};
	} ),
] )( DirectionGalleryImage );
