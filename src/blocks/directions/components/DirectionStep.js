/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { pickRelevantMediaFiles } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isShallowEqualObjects } from '@wordpress/is-shallow-equal';
import { Component, Fragment } from '@wordpress/element';
import { RichText, MediaUpload } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

/**
 * Module constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * A Direction step within a Direction block.
 */
export default class DirectionStep extends Component {
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
		this.onInsertStep = this.onInsertStep.bind( this );
		this.onRemoveStep = this.onRemoveStep.bind( this );
		this.onMoveStepUp = this.onMoveStepUp.bind( this );
		this.onMoveStepDown = this.onMoveStepDown.bind( this );
		this.setTextRef = this.setTextRef.bind( this );
		this.onFocusText = this.onFocusText.bind( this );
		this.onChangeText = this.onChangeText.bind( this );
		this.onChangeGroupTitle = this.onChangeGroupTitle.bind( this );
	}

	/**
	 * Handles the insert step button action.
	 *
	 * @return {void}
	 */
	onInsertStep() {
		this.props.insertStep( this.props.index );
	}

	/**
	 * Handles the remove step button action.
	 *
	 * @return {void}
	 */
	onRemoveStep() {
		this.props.removeStep( this.props.index );
	}

	/**
	 * Handles the move step up button action.
	 *
	 * @return {void}
	 */
	onMoveStepUp() {
		if ( this.props.isFirst ) {
			return;
		}
		this.props.onMoveUp( this.props.index );
	}

	/**
	 * Handles the move step down button action.
	 *
	 * @return {void}
	 */
	onMoveStepDown() {
		if ( this.props.isLast ) {
			return;
		}
		this.props.onMoveDown( this.props.index );
	}

	/**
	 * Pass the step text editor reference down to the parent component.
	 *
	 * @param {Object} ref Reference to the step text editor.
	 *
	 * @return {void}
	 */
	setTextRef( ref ) {
		this.props.editorRef( this.props.index, 'text', ref );
	}

	/**
	 * Handles the focus event on the step text editor.
	 *
	 * @return {void}
	 */
	onFocusText() {
		this.props.onFocus( this.props.index, 'text' );
	}

	/**
	 * Handles the on change event on the step text editor.
	 *
	 * @param {string} value The new step text.
	 *
	 * @return {void}
	 */
	onChangeText( value ) {
		const {
			onChange,
			index,
			step: {
				text,
			},
		} = this.props;

		onChange( value, text, index );
	}

	/**
	 * Handles the on change event on the direction group title editor.
	 *
	 * @param {string} value The new direction name.
	 *
	 * @return {void}
	 */
	onChangeGroupTitle( value ) {
		const {
			onChange,
			index,
			step: {
				text,
			},
		} = this.props;

		onChange( value, text, index, true );
	}

	/**
	 * The insert and remove step buttons.
	 *
	 * @return {Component} The buttons.
	 */
	getButtons() {
		const {
			step: {
				id,
				isGroup,
			},
		} = this.props;

		return <div className="direction-step-button-container">
			{ this.getMover() }
			{ ! isGroup &&
			<MediaUpload
				onSelect={ this.onSelectImage }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				value={ id }
				render={ ( { open } ) => (
					<Button
						className="direction-step-button direction-step-button-add-image editor-inserter__toggle direction-step-add-media"
						icon="format-image"
						onClick={ open }
            		/>
            	) }
			/>
			}
			<Button
				className="direction-step-button direction-step-button-delete editor-inserter__toggle"
				icon="trash"
				label={ __( 'Delete step', 'wpzoom-recipe-card' ) }
				onClick={ this.onRemoveStep }
			/>
			<Button
				className="direction-step-button direction-step-button-add editor-inserter__toggle"
				icon="editor-break"
				label={ __( 'Insert step', 'wpzoom-recipe-card' ) }
				onClick={ this.onInsertStep }
			/>
		</div>;
	}

	/**
	 * The mover buttons.
	 *
	 * @return {Component} the buttons.
	 */
	getMover() {
		return <Fragment>
			<Button
				className="editor-block-mover__control"
				onClick={ this.onMoveStepUp }
				icon="arrow-up-alt2"
				label={ __( 'Move step up', 'wpzoom-recipe-card' ) }
				aria-disabled={ this.props.isFirst }
			/>
			<Button
				className="editor-block-mover__control"
				onClick={ this.onMoveStepDown }
				icon="arrow-down-alt2"
				label={ __( 'Move step down', 'wpzoom-recipe-card' ) }
				aria-disabled={ this.props.isLast }
			/>
		</Fragment>;
	}

	/**
	 * Callback when an image from the media library has been selected.
	 *
	 * @param {Object} media The selected image.
	 *
	 * @return {void}
	 */
	onSelectImage( media ) {
		const {
			onChange,
			index,
			step: {
				text,
			},
		} = this.props;
		let newText = text.slice();

		const relevantMedia = pickRelevantMediaFiles( media, 'wpzoom-rcb-block-step-image' );
		const image = (
			<img
				key={ relevantMedia.id }
				alt={ relevantMedia.alt }
				title={ relevantMedia.title }
				src={ relevantMedia.url }
			/>
		);

		if ( newText.push ) {
			newText.push( image );
		} else {
			newText = [ newText, image ];
		}

		onChange( newText, text, index );
	}

	/**
	 * Returns the image src from step contents.
	 *
	 * @param {Array} contents The step contents.
	 *
	 * @return {string|boolean} The image src or false if none is found.
	 */
	static getImageSrc( contents ) {
		if ( ! contents || ! contents.filter ) {
			return false;
		}

		const image = contents.filter( ( node ) => node && node.type && node.type === 'img' )[ 0 ];

		if ( ! image ) {
			return false;
		}

		return image.props.src;
	}

	/**
	 * Perform a shallow equal to prevent every step item from being rerendered.
	 *
	 * @param {Object} nextProps The next props the component will receive.
	 *
	 * @return {boolean} Whether or not the component should perform an update.
	 */
	shouldComponentUpdate( nextProps ) {
		return ! isShallowEqualObjects( nextProps, this.props );
	}

	/**
	 * Renders this component.
	 *
	 * @return {Component} The direction step editor.
	 */
	render() {
		const {
			isSelected,
			subElement,
			step,
		} = this.props;
		const { id, text, isGroup } = step;
		const isSelectedText = isSelected && subElement === 'text';

		const stepClassName = classnames( {
			'direction-step': ! isGroup,
			'direction-step direction-step-group': isGroup,
		} );

		return (
			<li className={ stepClassName } key={ id }>
				{
					! isGroup &&
					<RichText
						className="direction-step-text"
						tagName="p"
						key={ `${ id }-text` }
						value={ text }
						onChange={ this.onChangeText }
						placeholder={ __( 'Enter step description', 'wpzoom-recipe-card' ) }
						unstableOnFocus={ this.onFocusText }
						keepPlaceholderOnFocus={ true }
					/>
				}
				{
					isGroup &&
					<RichText
						className="direction-step-group-title"
						tagName="p"
						key={ `${ id }-group-title` }
						value={ text }
						onChange={ this.onChangeGroupTitle }
						placeholder={ __( 'Enter group title', 'wpzoom-recipe-card' ) }
						unstableOnFocus={ this.onFocusText }
						keepPlaceholderOnFocus={ true }
					/>
				}
				{
					isSelectedText &&
					<div className="direction-step-controls-container">
						{ this.getButtons() }
					</div>
				}
			</li>
		);
	}
}

DirectionStep.propTypes = {
	index: PropTypes.number.isRequired,
	step: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	insertStep: PropTypes.func.isRequired,
	removeStep: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,
	subElement: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isFirst: PropTypes.bool.isRequired,
	isLast: PropTypes.bool.isRequired,
};
