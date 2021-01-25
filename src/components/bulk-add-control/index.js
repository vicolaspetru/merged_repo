/**
 * External dependencies
 */
import get from 'lodash/get';
import trim from 'lodash/trim';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import ReactHtmlParser from 'react-html-parser';

/**
 * Internal dependencies
 */
import { stripHTML, generateId } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose, withState } from '@wordpress/compose';
import { Component, renderToString } from '@wordpress/element';
import {
	Button,
	Modal,
	TextareaControl,
} from '@wordpress/components';

/**
 * We need to stop the keypress event here, because block.js is firing
 * a maybeStartTyping on keypress, and that hides the "fixed-to-block" toolbar
 * which unregisters the slot, so when Editable tries to re-render its input
 * dialog, the slot is no longer in the system, and the dialog disappears
 *
 * @param {string} event The document event
 * @return {void} Stop event propagation
 */
const stopKeyPressPropagation = ( event ) => event.stopPropagation();

/**
 * Parse value for ingredients and directions
 * render from array to string and strip HTML
 * append \n newline at the end of each item
 *
 * @param {Object} value The HTML object array
 * @param {boolean} isGroup Determine if ingredient or direction is group item
 * @return {string} The parsed HTML to string
 */
function parseValue( value, isGroup = false ) {
	const content = convertObjectToString( value );
	let returnValue = '';

	if ( ! isEmpty( content ) ) {
		returnValue = stripHTML( renderToString( trim( content ) ) );
	}
	if ( isGroup ) {
		returnValue = `**${ returnValue }**`;
	}
	return ! isEmpty( returnValue ) ? returnValue + '\n' : '';
}

/**
 * Build styles string
 *
 * @param  {Object | string} style The style object or string
 * @return {string}              The styles string
 */
function parseObjectStyle( style ) {
	let css = '';
	if ( isObject( style ) ) {
		forEach( style, ( value, property ) => {
			css += `${ property }: ${ value };`;
		} );
	}
	if ( isString( style ) ) {
		css = style;
	}
	return css;
}

/**
 * Convert nodes object to string
 *
 * @param  {Object} nodes The HTML nodes object
 * @return {string}       The HTML string
 */
function convertObjectToString( nodes ) {
	if ( isString( nodes ) ) {
		return nodes;
	}

	if ( isNull( nodes ) ) {
		return '';
	}

	let output = '';

	forEach( nodes, ( node ) => {
		if ( isString( node ) ) {
			output += node;
		} else {
			const type = get( node, [ 'type' ] ) || '';
			const children = get( node, [ 'props', 'children' ] ) || '';
			let startTag = type ? '<' + type + '>' : '';
			let endTag = type ? '</' + type + '>' : '';

			if ( 'img' === type ) {
				const src = get( node, [ 'props', 'src' ] ) || false;
				if ( src ) {
					const alt = get( node, [ 'props', 'alt' ] ) || '';
					const imgStyle = get( node, [ 'props', 'style' ] ) || '';
					const imgClass = 'direction-step-image';
					startTag = `<${ type } src="${ src }" alt="${ alt }" class="${ imgClass }" style="${ parseObjectStyle( imgStyle ) }" />`;
				} else {
					startTag = '';
				}
				endTag = '';
			} else if ( 'a' === type ) {
				const rel = get( node, [ 'props', 'rel' ] ) || '';
				const ariaLabel = get( node, [ 'props', 'aria-label' ] ) || '';
				const href = get( node, [ 'props', 'href' ] ) || '#';
				const target = get( node, [ 'props', 'target' ] ) || '_blank';
				startTag = `<${ type } rel="${ rel }" aria-label="${ ariaLabel }" href="${ href }" target="${ target }">`;
			} else if ( 'br' === type ) {
				endTag = '';
			}
			output += startTag + convertObjectToString( children ) + endTag;
		}
	} );

	return output;
}

class BulkAddControl extends Component {
	constructor() {
		super( ...arguments );

		this.onBulkAdd = this.onBulkAdd.bind( this );
		this.onBulkAddIngredients = this.onBulkAddIngredients.bind( this );
		this.onBulkAddSteps = this.onBulkAddSteps.bind( this );
		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );
		this.updateIngredients = this.updateIngredients.bind( this );
		this.updateSteps = this.updateSteps.bind( this );
	}

	componentDidMount() {
		if ( this.props.attributes.ingredients ) {
			let _ingredients = '';

			this.props.attributes.ingredients.map( ( item ) => {
				const amount = get( item, [ 'parse', 'amount' ] ) || '';
				const unit = get( item, [ 'parse', 'unit' ] ) || '';
				const name = get( item, 'name' ) || get( item, [ 'parse', 'ingredient' ] );
				const isGroup = get( item, 'isGroup' ) || false;

				if ( ! isGroup && ( amount || unit ) ) {
					_ingredients += `${ amount }${ unit } `;
				}

				_ingredients += parseValue( name, isGroup );
			} );

			this.setState( { _ingredients } );
		}

		if ( this.props.attributes.directions ) {
			let _steps = '';

			this.props.attributes.directions.map( ( direction ) => {
				const isGroup = ! isUndefined( direction.isGroup ) ? direction.isGroup : false;
				_steps += parseValue( direction.text, isGroup );
			} );

			this.setState( { _steps } );
		}
	}

	openModal() {
		this.setState( { isOpen: true } );
	}

	closeModal() {
		this.setState( { isOpen: false } );
	}

	updateIngredients( newIngredients ) {
		this.setState( { _ingredients: newIngredients } );
	}

	updateSteps( newSteps ) {
		this.setState( { _steps: newSteps } );
	}

	onBulkAddIngredients() {
		const { _ingredients, setAttributes } = this.props;
		const ingredients = [];
		const regex = /([^\n\t\r\v\f][\w\W].*)/gmi;
		let m; let index = 0;

		while ( ( m = regex.exec( _ingredients ) ) !== null ) {
			// This is necessary to avoid infinite loops with zero-width matches
			if ( m.index === regex.lastIndex ) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			forEach( m, ( match, groupIndex ) => {
				if ( groupIndex === 1 ) {
					const isGroup = includes( match, '**' ); // check for group title if contains **Text**

					if ( isGroup ) {
						match = trim( match, '**' );
					}

					// Converting HTML strings into React components
					const ParserHTML = ReactHtmlParser( match );

					ingredients[ index ] = {
						...this.props.attributes.ingredients[ index ],
						id: get( this.props.attributes.ingredients, [ index, 'id' ] ) || `ingredient-item-${ m.index }`,
						name: ParserHTML,
						jsonName: stripHTML( renderToString( trim( match ) ) ),
						isGroup,
					};
					index++;
				}
			} );
		}

		setAttributes( { ingredients } );
	}

	onBulkAddSteps() {
		const { _steps, setAttributes } = this.props;
		const steps = [];
		const regex = /([^.\n\t\r\v\f][a-zA-Z0-9].*)/gmi;
		let m; let index = 0;

		while ( ( m = regex.exec( _steps ) ) !== null ) {
			// This is necessary to avoid infinite loops with zero-width matches
			if ( m.index === regex.lastIndex ) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			forEach( m, ( match, groupIndex ) => {
				if ( groupIndex === 1 ) {
					const isGroup = includes( match, '**' ); // check for group title if contains **Text**

					if ( isGroup ) {
						match = trim( match, '**' );
					}

					// Converting HTML strings into React components
					const ParserHTML = ReactHtmlParser( match );

					steps[ index ] = {
						...this.props.attributes.steps[ index ],
						id: get( this.props.attributes.steps, [ index, 'id' ] ) || generateId( 'direction-step' ),
						text: ParserHTML,
						jsonText: stripHTML( renderToString( trim( match ) ) ),
						isGroup,
					};
					index++;
				}
			} );
		}

		setAttributes( { steps } );
	}

	onBulkAdd() {
		this.onBulkAddIngredients();
		this.onBulkAddSteps();
		this.closeModal();
	}

	render() {
		const {
			isOpen,
			_ingredients,
			_steps,
		} = this.props;

		if ( ! isOpen ) {
			return (
				<Button
					icon="edit"
					className="wpzoom-recipe-card__extra-options"
					label={ __( 'Recipe Card extra options', 'wpzoom-recipe-card' ) }
					isPrimary={ true }
					onClick={ () => this.openModal }
				>
					{ __( 'Bulk Add', 'wpzoom-recipe-card' ) }
				</Button>
			);
		}

		return (
			<Modal
				title={ __( 'Recipe Card Bulk Add', 'wpzoom-recipe-card' ) }
				onRequestClose={ () => this.closeModal }>
				<div className="wpzoom-recipe-card-extra-options" style={ { maxWidth: 720 + 'px', maxHeight: 525 + 'px' } }>
					<div className="form-group">
						<p className="bulk-add-danger-alert"><strong>{ __( 'Known Problem', 'wpzoom-recipe-card' ) }:</strong> { __( 'There is a conflict with specific keyboard keys and this feature. To fix the conflict, simply enable the', 'wpzoom-recipe-card' ) } <strong>{ __( 'Top Toolbar', 'wpzoom-recipe-card' ) }</strong> { __( 'option in the editor options (click on the ⋮ three dots from right-top corner).', 'wpzoom-recipe-card' ) } <br /> <a href="https://wp.md/toolbar" target="_blank" rel="noopener noreferrer">{ __( 'View how to do this', 'wpzoom-recipe-card' ) }</a></p>
						<br />
						<div className="wrap-content">
							<TextareaControl
								label={ __( 'Insert Ingredients', 'wpzoom-recipe-card' ) }
								help={ __( 'Each line break is a new ingredient. Note: To add Ingredient Group Title just type **Group Title** on new line.', 'wpzoom-recipe-card' ) }
								className="bulk-add-enter-ingredients"
								rows="5"
								value={ _ingredients }
								onKeyPress={ stopKeyPressPropagation }
								onChange={ ( newIngredients ) => this.updateIngredients( newIngredients ) }
							/>
							<TextareaControl
								label={ __( 'Insert Directions', 'wpzoom-recipe-card' ) }
								help={ __( 'Each line break is a new direction. Note: To add Direction Group Title just type **Group Title** on new line.', 'wpzoom-recipe-card' ) }
								className="bulk-add-enter-directions"
								rows="5"
								value={ _steps }
								onKeyPress={ stopKeyPressPropagation }
								onChange={ ( newSteps ) => this.updateSteps( newSteps ) }
							/>
						</div>
					</div>
					<div className="form-group">
						<Button
							onClick={ () => this.closeModal }
						>
							{ __( 'Cancel', 'wpzoom-recipe-card' ) }
						</Button>
						{
							( ! isEmpty( _ingredients ) || ! isEmpty( _steps ) ) && (
								<Button
									isPrimary
									onClick={ () => this.onBulkAdd }
								>
									{ __( 'Bulk Add', 'wpzoom-recipe-card' ) }
								</Button>
							)
						}
					</div>
				</div>
			</Modal>
		);
	}
}

export default compose( [
	withState( {
		isOpen: false,
		isDataSet: false,
		_ingredients: '',
		_steps: '',
	} ),
] )( BulkAddControl );
