/**
 * External dependencies
 */
import {
	get,
	map,
	compact,
	isEmpty,
	isNull,
	toString,
	uniqueId,
	isUndefined,
} from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ColorScheme from './color-scheme';
import MainSettings from './main';
import SEOSettings from './seo';
import CustomDetailsSettings from './custom-details';
import StructuredDataTestingTool from './structured-data-testing-tool';
import DetailsSettings from '../detail/inspector';
import VideoSettings from '../video/inspector';
import FoodLabelsSettings from '../food-labels/inspector';
import {
	stripHTML,
	getNumberFromString,
	pickRelevantMediaFiles,
} from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { isShallowEqualObjects } from '@wordpress/is-shallow-equal';
import { Component, renderToString } from '@wordpress/element';
import { RichText, InspectorControls } from '@wordpress/block-editor';

/**
 * Inspector controls
 */
export default class Inspector extends Component {
	/**
	 * Constructs a Inspector editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @return {void}
	 */
	constructor( props ) {
		super( props );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveRecipeImage = this.onRemoveRecipeImage.bind( this );
		this.onSelectPinImage = this.onSelectPinImage.bind( this );
		this.onRemovePinImage = this.onRemovePinImage.bind( this );
		this.onChangeDetail = this.onChangeDetail.bind( this );
		this.onChangeSettings = this.onChangeSettings.bind( this );
		this.onUpdateURL = this.onUpdateURL.bind( this );
		this.onClickCalculateTotalTime = this.onClickCalculateTotalTime.bind( this );

		this.state = {
			updateIngredients: false,
			updateInstructions: false,
			isCalculatedTotalTime: false,
			isCalculateBtnClick: false,
			structuredDataNotice: {
				errors: [],
				warnings: [],
				not_display: [],
			},
			structuredDataTable: {
				recipeIngredients: 0,
				recipeInstructions: 0,
			},
		};
	}

	componentDidMount() {
		this.setFeaturedImage();
		this.structuredDataTable();
		this.calculateTotalTime();
	}

	componentDidUpdate( prevProps ) {
		const { attributes } = this.props;
		const prevAttributes = prevProps.attributes;

		if ( ! attributes.hasImage && this.props.media !== prevProps.media ) {
			this.setFeaturedImage();
		}

		if ( attributes.ingredients !== prevAttributes.ingredients || attributes.steps !== prevAttributes.steps ) {
			this.structuredDataTable();
		}

		if ( ! isShallowEqualObjects( attributes, prevAttributes ) ) {
			this.structuredDataNotice();
		}

		if ( ! this.state.isCalculatedTotalTime ) {
			this.calculateTotalTime();
		}
	}

	/*
     * Set featured image if Recipe Card image aren't uploaded
     */
	setFeaturedImage() {
		const {
			media,
			attributes: {
				hasImage,
			},
			setAttributes,
			activeStyle,
		} = this.props;

		if ( hasImage || ! media ) {
			return;
		}

		let sizeSlug = 'wpzoom-rcb-block-header';

		if ( 'simple' === activeStyle.name || 'accent-color-header' === activeStyle.name ) {
			sizeSlug = 'wpzoom-rcb-block-header-square';
		}

		const relevantMedia = pickRelevantMediaFiles( media, sizeSlug );

		setAttributes( {
			hasImage: ! isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				title: relevantMedia.title,
				sizes: get( media, [ 'sizes' ] ) || get( media, [ 'media_details', 'sizes' ] ),
			},
		} );
	}

	onSelectImage( media ) {
		const { setAttributes, activeStyle } = this.props;

		let sizeSlug = 'wpzoom-rcb-block-header';

		if ( 'simple' === activeStyle.name || 'accent-color-header' === activeStyle.name ) {
			sizeSlug = 'wpzoom-rcb-block-header-square';
		}

		const relevantMedia = pickRelevantMediaFiles( media, sizeSlug );

		setAttributes( {
			hasImage: ! isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				title: relevantMedia.title,
				sizes: media.sizes,
			},
		} );
	}

	onSelectPinImage( media ) {
		const {
			attributes: {
				settings,
			},
			setAttributes,
		} = this.props;
		const relevantMedia = pickRelevantMediaFiles( media, 'wpzoom-rcb-block-header' );

		const newSettings = settings ? settings.slice() : [];

		newSettings[ 0 ] = {
			...newSettings[ 0 ],
			pin_has_custom_image: ! isNull( relevantMedia.id ),
			pin_custom_image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				title: relevantMedia.title,
				sizes: media.sizes,
			},
		};

		setAttributes( { settings: newSettings } );
	}

	onRemovePinImage() {
		const {
			attributes: {
				settings,
			},
			setAttributes,
		} = this.props;

		const newSettings = settings ? settings.slice() : [];

		newSettings[ 0 ] = {
			...newSettings[ 0 ],
			pin_has_custom_image: false,
			pin_custom_image: null,
		};

		setAttributes( { settings: newSettings } );
	}

	onChangeSettings( newValue, param, index = 0 ) {
		const {
			setAttributes,
			attributes: {
				settings,
			},
		} = this.props;
		const newSettings = settings ? settings.slice() : [];

		if ( ! get( newSettings, index ) ) {
			newSettings[ index ] = {};
		}

		newSettings[ index ][ param ] = newValue;

		setAttributes( { settings: newSettings } );
	}

	onChangeDetail( newValue, index, field ) {
		const {
			setAttributes,
			attributes: {
				details,
			},
		} = this.props;
		const newDetails = details ? details.slice() : [];

		const id = get( newDetails, [ index, 'id' ] );
		const icon = get( newDetails, [ index, 'icon' ] );
		const iconSet = get( newDetails, [ index, 'iconSet' ] );

		if ( ! get( newDetails, index ) ) {
			newDetails[ index ] = {};
		}

		if ( ! id ) {
			newDetails[ index ].id = uniqueId( `detail-item-${ new Date().getTime() }` );
		}

		if ( 'icon' === field ) {
			newDetails[ index ].icon = newValue;
		} else if ( ! icon ) {
			newDetails[ index ].icon = 'restaurant-utensils';
		}

		if ( 'iconSet' === field ) {
			newDetails[ index ].iconSet = newValue;
		} else if ( ! iconSet ) {
			newDetails[ index ].iconSet = 'foodicons';
		}

		if ( 'label' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ].jsonLabel = stripHTML( renderToString( newValue ) );
		}
		if ( 'value' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ].jsonValue = stripHTML( renderToString( newValue ) );
		}
		if ( 'unit' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ].jsonUnit = stripHTML( renderToString( newValue ) );
		}
		if ( 'isRestingTimeField' === field ) {
			newDetails[ index ][ field ] = newValue;
		}

		setAttributes( { details: newDetails } );
	}

	onRemoveRecipeImage() {
		const { setAttributes } = this.props;

		setAttributes( { hasImage: false, image: null } );
	}

	onUpdateURL( url ) {
		const {
			setAttributes,
			attributes: {
				image: {
					id,
					alt,
					sizes,
				},
			},
		} = this.props;

		setAttributes( {
			hasImage: true,
			image: {
				id,
				url,
				alt,
				sizes,
			},
		} );
	}

	getImageSizeOptions() {
		const { imageSizes, media } = this.props;

		return compact( map( imageSizes, ( { name, slug } ) => {
			const sizeUrl = get( media, [ 'media_details', 'sizes', slug, 'source_url' ] );
			if ( ! sizeUrl ) {
				return null;
			}
			return {
				value: sizeUrl,
				label: name,
			};
		} ) );
	}

	errorDetails() {
		const string = toString( this.state.structuredDataNotice.errors );
		return string.replace( /,/g, ', ' );
	}

	warningDetails() {
		const string = toString( this.state.structuredDataNotice.warnings );
		return string.replace( /,/g, ', ' );
	}

	notDisplayDetails() {
		const string = toString( this.state.structuredDataNotice.not_display );
		return string.replace( /,/g, ', ' );
	}

	structuredDataTable() {
		const {
			ingredients,
			steps,
		} = this.props.attributes;

		let recipeIngredients = 0;
		let recipeInstructions = 0;

		ingredients.forEach( ( ingredient ) => {
			const jsonName = get( ingredient, 'jsonName' );

			if ( ! isEmpty( jsonName ) ) {
				recipeIngredients++;
			}
		} );

		steps.forEach( ( step ) => {
			const jsonText = get( step, 'jsonText' );

			if ( ! isEmpty( jsonText ) ) {
				recipeInstructions++;
			}
		} );

		this.setState( { structuredDataTable: { recipeIngredients, recipeInstructions } }, this.structuredDataNotice );
	}

	structuredDataNotice() {
		const { structuredDataTable } = this.state;
		const {
			hasImage,
			details,
			course,
			cuisine,
			keywords,
			summary,
			hasVideo,
			settings: {
				0: {
					displayPrepTime,
					displayCookingTime,
					displayCourse,
					displayCuisine,
					displayCalories,
				},
			},
		} = this.props.attributes;

		const not_display = [];
		const warnings = [];
		const errors = [];

		// Push warnings
		if ( RichText.isEmpty( summary ) ) {
			warnings.push( 'summary' );
		}
		if ( ! hasVideo ) {
			warnings.push( 'video' );
		}
		if ( ! get( details, [ 1, 'value' ] ) ) {
			warnings.push( 'prepTime' );
		}
		if ( ! get( details, [ 2, 'value' ] ) ) {
			warnings.push( 'cookTime' );
		}
		if ( ! get( details, [ 3, 'value' ] ) ) {
			warnings.push( 'calories' );
		}
		if ( isEmpty( course ) ) {
			warnings.push( 'course' );
		}
		if ( isEmpty( cuisine ) ) {
			warnings.push( 'cuisine' );
		}
		if ( isEmpty( keywords ) ) {
			warnings.push( 'keywords' );
		}

		// Push not displayed
		if ( ! displayCookingTime ) {
			not_display.push( 'cookTime' );
		}
		if ( ! displayPrepTime ) {
			not_display.push( 'prepTime' );
		}
		if ( ! displayCalories ) {
			not_display.push( 'calories' );
		}
		if ( ! displayCuisine ) {
			not_display.push( 'cuisine' );
		}
		if ( ! displayCourse ) {
			not_display.push( 'course' );
		}

		// Push errors
		if ( ! hasImage ) {
			errors.push( 'image' );
		}
		if ( ! get( structuredDataTable, 'recipeIngredients' ) ) {
			errors.push( 'ingredients' );
		}
		if ( ! get( structuredDataTable, 'recipeInstructions' ) ) {
			errors.push( 'steps' );
		}

		this.setState( { structuredDataNotice: { warnings, errors, not_display } } );
	}

	calculateTotalTime() {
		// We already have value for total time, in this case we don't need to recalculate them
		if ( this.state.isCalculatedTotalTime ) {
			return;
		}

		const { details } = this.props.attributes;
		const index = 8; // Total Time index in details object array
		const prepTime = getNumberFromString( get( details, [ 1, 'value' ] ) );
		const cookTime = getNumberFromString( get( details, [ 2, 'value' ] ) );
		const restingTime = getNumberFromString( get( details, [ 4, 'value' ] ) );
		const isRestingTimeField = get( details, [ 4, 'isRestingTimeField' ] ) || false;

		let totalTime = prepTime + cookTime;

		// Add resting time value to sum
		if ( isRestingTimeField ) {
			totalTime = prepTime + cookTime + restingTime;
		}

		const totalTimeValue = get( details, [ index, 'value' ] );

		if ( ! this.state.isCalculateBtnClick && ! isUndefined( totalTimeValue ) && ! isEmpty( totalTimeValue ) && 0 !== totalTimeValue ) {
			this.setState( {
				isCalculatedTotalTime: true,
				isCalculateBtnClick: false,
			} );
			return;
		}

		if ( '' !== prepTime && '' !== cookTime && totalTime > 0 ) {
			this.onChangeDetail( toString( totalTime ), index, 'value' );
			this.setState( {
				isCalculatedTotalTime: true,
				isCalculateBtnClick: false,
			} );
		}
	}

	onClickCalculateTotalTime() {
		this.setState( { isCalculatedTotalTime: false, isCalculateBtnClick: true } );
	}

	/**
	 * Renders this component.
	 *
	 * @return {Component} The Ingredient items block settings.
	 */
	render() {
		const {
			className,
			attributes,
			setAttributes,
			settingOptions,
			activeStyle,
			layoutOptions,
			onUpdateStyle,
		} = this.props;

		const {
			structuredDataNotice,
			structuredDataTable,
		} = this.state;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Styles', 'wpzoom-recipe-card' ) } initialOpen={ false }>
					<div className={ classnames(
						'block-editor-block-styles',
						'wpzoom-recipe-card-editor-block-styles'
					) }>
						{ layoutOptions.map( ( style ) => (
							<div
								key={ `style-${ style.name }` }
								className={ classnames(
									'block-editor-block-styles__item',
									{ 'is-active': activeStyle === style },
								) }
								onClick={ () => onUpdateStyle( style ) }
								onKeyDown={ ( event ) => {
									if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
										event.preventDefault();
										onUpdateStyle( style );
									}
								} }
								role="button"
								tabIndex="0"
								aria-label={ style.label || style.name }
							>
								<div className="block-editor-block-styles__item-preview">
									Here will be thumbnail image
								</div>
								<div className="block-editor-block-styles__item-label">
									{ style.label || style.name }
								</div>
							</div>
						) ) }
					</div>
				</PanelBody>
				<ColorScheme
					onChangeSettings={ this.onChangeSettings }
					{ ...{ attributes, className, settingOptions, activeStyle } }
				/>
				<MainSettings
					getImageSizeOptions={ this.getImageSizeOptions() }
					onUpdateURL={ this.onUpdateURL }
					onSelectImage={ this.onSelectImage }
					onRemoveImage={ this.onRemoveRecipeImage }
					onSelectPinImage={ this.onSelectPinImage }
					onRemovePinImage={ this.onRemovePinImage }
					onChangeSettings={ this.onChangeSettings }
					{ ...{ attributes, className, settingOptions, activeStyle } }
				/>
				<VideoSettings
					{ ...{ attributes, setAttributes, className } }
				/>
				<FoodLabelsSettings
					onChangeSettings={ this.onChangeSettings }
					{ ...{ attributes } }
				/>
				<SEOSettings
					onChangeSettings={ this.onChangeSettings }
					coursesTaxonomy={ this.props.coursesTaxonomy }
					cuisinesTaxonomy={ this.props.cuisinesTaxonomy }
					difficultiesTaxonomy={ this.props.difficultiesTaxonomy }
					{ ...{ attributes, setAttributes, settingOptions } }
				/>
				<DetailsSettings
					onChangeSettings={ this.onChangeSettings }
					onChangeDetail={ this.onChangeDetail }
					onClickCalculateTotalTime={ this.onClickCalculateTotalTime }
					{ ...{ attributes, setAttributes } }
				/>
				<CustomDetailsSettings
					onChangeDetail={ this.onChangeDetail }
					{ ...{ attributes } }
				/>
				<StructuredDataTestingTool
					noticeData={ structuredDataNotice }
					tableData={ structuredDataTable }
					errorDetails={ this.errorDetails() }
					warningDetails={ this.warningDetails() }
					notDisplayDetails={ this.notDisplayDetails() }
					{ ...{ attributes } }
				/>
			</InspectorControls>
		);
	}
}
