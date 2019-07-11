/* External dependencies */
import get from "lodash/get";
import map from "lodash/map";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import PostTaxonomies from "./PostTaxonomies";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";
import { humanize } from "../../../helpers/stringHelpers";
import { pickRelevantMediaFiles } from "../../../helpers/pickRelevantMediaFiles";
import { getBlockStyle } from "../../../helpers/getBlockStyle";

/* WordPress dependencies */
const { __, _n } = wp.i18n;
const { Component, renderToString, Fragment } = wp.element;
const { RichText, InspectorControls, MediaUpload } = wp.blockEditor;
const { 
	BaseControl,
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	TextareaControl,
	Button,
	IconButton,
	FormTokenField,
	PanelColor,
	ColorIndicator,
	ColorPalette,
	SelectControl
} = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/* Module constants */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * Inspector controls
 */
class Inspector extends Component {

	/**
	 * Constructs a Inspector editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( ...arguments );
		this.onSelectImage 		= this.onSelectImage.bind( this );
		this.onSelectPinImage 	= this.onSelectPinImage.bind( this );
		this.onSetFeaturedImage = this.onSetFeaturedImage.bind( this );
		this.updateURL 			= this.updateURL.bind( this );
	}

	onSetFeaturedImage() {
		const {
			media,
			attributes: {
				hasImage
			},
			setAttributes
		} = this.props;

		if ( hasImage || ! media ) {
			return false;
		}

		const relevantMedia = pickRelevantMediaFiles( media );

		setAttributes( {
			hasImage: !isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				sizes: get( media, [ 'sizes' ] ) || get( media, [ 'media_details', 'sizes' ] )
			}
		} );
	}

	onSelectImage( media ) {
		const {
			setAttributes
		} = this.props;
		const relevantMedia = pickRelevantMediaFiles( media );

		setAttributes( {
			hasImage: !isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				sizes: media.sizes
			}
		} );
	}

	onSelectPinImage( media ) {
		const {
			attributes: {
				settings
			},
			setAttributes
		} = this.props;
		const relevantMedia = pickRelevantMediaFiles( media );

		settings[0]['pin_has_custom_image'] = !isNull( relevantMedia.id );
		settings[0]['pin_custom_image'] = {
			id: relevantMedia.id,
			url: relevantMedia.url,
			alt: relevantMedia.alt,
			sizes: media.sizes
		};

		setAttributes( { settings } );
	}

	updateURL( url ) {
		const {
			attributes: {
				image: {
					id,
					alt,
					sizes
				}
			}
		} = this.props;
		
		this.props.setAttributes( {
			hasImage: true,
			image: {
				id: id,
				url: url,
				alt: alt,
				sizes: sizes
			}
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

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The Ingredient items block settings.
	 */
	render() {

		// Set featured image if Recipe Card image aren't uploaded
		this.onSetFeaturedImage();

		const {
			className,
			clientId,
			media,
			attributes,
			setAttributes,
			postTitle,
			postType,
			coursesTaxonomy,
			cuisinesTaxonomy,
			difficultiesTaxonomy,
			settingOptions
		} = this.props;

		const {
			id,
			hasImage,
			image,
			hasVideo,
			video,
			recipeTitle,
			summary,
			jsonSummary,
			course,
			cuisine,
			difficulty,
			keywords,
			ingredients,
			steps,
			details,
			settings: {
				0: {
					primary_color,
					icon_details_color,
					print_btn,
					pin_btn,
					pin_has_custom_image,
					pin_custom_image,
					pin_custom_text,
					custom_author_name,
					displayCourse,
					displayCuisine,
					displayDifficulty,
					displayAuthor,
					displayServings,
					displayPrepTime,
					displayCookingTime,
					displayCalories,
					headerAlign,
					ingredientsLayout
				}
			}
		} = attributes;

		let style = getBlockStyle( className );
		const imageSizeOptions = this.getImageSizeOptions();
		
		const coursesToken = [
			__( "Appetizers", "wpzoom-recipe-card" ),
            __( "Snacks", "wpzoom-recipe-card" ),
            __( "Breakfast", "wpzoom-recipe-card" ),
            __( "Brunch", "wpzoom-recipe-card" ),
            __( "Dessert", "wpzoom-recipe-card" ),
            __( "Drinks", "wpzoom-recipe-card" ),
            __( "Dinner", "wpzoom-recipe-card" ),
            __( "Main", "wpzoom-recipe-card" ),
            __( "Lunch", "wpzoom-recipe-card" ),
            __( "Salads", "wpzoom-recipe-card" ),
            __( "Sides", "wpzoom-recipe-card" ),
            __( "Soups", "wpzoom-recipe-card" ),
		];

		const cuisinesToken = [
			__( "American", "wpzoom-recipe-card" ),
			__( "Chinese", "wpzoom-recipe-card" ),
			__( "French", "wpzoom-recipe-card" ),
			__( "Indian", "wpzoom-recipe-card" ),
			__( "Italian", "wpzoom-recipe-card" ),
			__( "Japanese", "wpzoom-recipe-card" ),
			__( "Mediterranean", "wpzoom-recipe-card" ),
			__( "Mexican", "wpzoom-recipe-card" ),
			__( "Southern", "wpzoom-recipe-card" ),
			__( "Thai", "wpzoom-recipe-card" ),
			__( "Other world cuisine", "wpzoom-recipe-card" ),
		];

		const difficultyToken = [
			__( "Easy", "wpzoom-recipe-card" ),
			__( "Medium", "wpzoom-recipe-card" ),
			__( "Difficult", "wpzoom-recipe-card" ),
		];

		const keywordsToken = [];

		const colors = [ 
			{ name: __( "Dark", "wpzoom-recipe-card" ), color: '#222222' },
			{ name: __( "Orange", "wpzoom-recipe-card" ), color: '#FFA921' },
			{ name: __( "Red", "wpzoom-recipe-card" ), color: '#FF4E6A' },
			{ name: __( "Green", "wpzoom-recipe-card" ), color: '#B7C662' },
		];

		const onChangeSettings = ( newValue, index, param ) => {
			const settings = this.props.attributes.settings ? this.props.attributes.settings.slice() : [];

			settings[ index ][ param ] = newValue;

			setAttributes( { settings } );
		}

		const onChangeDetail = ( newValue, index ) => {
			const details = this.props.attributes.details ? this.props.attributes.details.slice() : [];

			details[ index ][ 'value' ] = newValue;
			details[ index ][ 'jsonValue' ] = stripHTML( renderToString( newValue ) );
			details[ index ][ 'jsonUnit' ] = stripHTML( renderToString( details[ index ][ 'unit' ] ) );

			setAttributes( { details } );
		}

		const onRemoveRecipeImage = () => {
			setAttributes( { hasImage: false, image: null } )
		}

		const onRemovePinImage = () => {
			const settings = this.props.attributes.settings ? this.props.attributes.settings.slice() : [];
			settings[0]['pin_has_custom_image'] = false;
			settings[0]['pin_custom_image'] = [];
			setAttributes( { settings } );
		}

		function structuredDataTestingTool() {
			let dataTable = {
				ingredients: [],
				steps: [],
			};

			let check = {
				warnings: [],
				errors: []
			}

			for (var i = 0; i < ingredients.length; i++) {
				if ( ingredients[i].name.length !== 0 ) {
					dataTable.ingredients.push(<PanelRow><strong>recipeIngredient</strong><span>{ ingredients[i].name }</span></PanelRow>);
				}
			}

			for (var i = 0; i < steps.length; i++) {
				if ( steps[i].text.length !== 0 ) {
					dataTable.steps.push(<PanelRow><strong>recipeInstructions</strong><span>{ steps[i].text }</span></PanelRow>);
				}
			}

			RichText.isEmpty( summary ) ? check.warnings.push("summary") : '';
			! hasImage ? check.errors.push("image") : '';
			// ! hasVideo ? check.warnings.push("video") : '';
			! dataTable.ingredients.length ? check.errors.push("ingredients") : '';
			! dataTable.steps.length ? check.errors.push("steps") : '';
			! get( details, [ 1 ,'value' ] ) ? check.warnings.push("prepTime") : '';
			! get( details, [ 2 ,'value' ] ) ? check.warnings.push("cookTime") : '';
			! get( details, [ 3 ,'value' ] ) ? check.warnings.push("calories") : '';

			return (
		    	<BaseControl
					id={ `${ id }-counters` }
					help={ __( "Automatically check Structured Data errors and warnings.", "wpzoom-recipe-card" ) }
				>
					<PanelRow>
						<span>{ __( "Legend:", "wpzoom-recipe-card" ) }</span>
					</PanelRow>
					<PanelRow className="text-color-red">
						<ColorIndicator aria-label={ __( "Required fields", "wpzoom-recipe-card" ) } colorValue="#ff2725" />
						<strong>{ `${ check.errors.length } ` + _n( "error", "errors", `${ check.errors.length }`, "wpzoom-recipe-card" ) }</strong>
					</PanelRow>
					<PanelRow className="text-color-orange">
						<ColorIndicator aria-label={ __( "Recommended fields", "wpzoom-recipe-card" ) } colorValue="#ef6c00" />
						<strong>{ `${ check.warnings.length } ` + _n( "warning", "warnings", `${ check.warnings.length }`, "wpzoom-recipe-card" ) }</strong>
					</PanelRow>
					<PanelRow>
						<span>{ __( "Recipe:", "wpzoom-recipe-card" ) }</span>
					</PanelRow>
            		<PanelRow>
            			<span>recipeTitle</span>
            			<strong>{ ! RichText.isEmpty( recipeTitle ) ? recipeTitle : postTitle }</strong>
            		</PanelRow>
            		<PanelRow className={ RichText.isEmpty( summary ) ? "text-color-orange": "" }>
            			<span>description</span>
            			<strong>{ stripHTML( jsonSummary ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! hasImage ? "text-color-red": "" }>
            			<span>image</span>
            			<strong>{ hasImage ? get( image, ['url'] ) : '' }</strong>
            		</PanelRow>
            		<PanelRow>
            			<span>recipeYield</span>
            			<strong>{ get( details, [ 0, 'value' ] ) ? get( details, [ 0, 'value' ] ) + ' ' + get( details, [ 0, 'unit' ] ) : '0 ' + get( details, [ 0, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! get( details, [ 1, 'value' ] ) ? "text-color-orange": "" }>
            			<span>prepTime</span>
            			<strong><strong>{ get( details, [ 1, 'value' ] ) ? get( details, [ 1, 'value' ] ) + ' ' + get( details, [ 1, 'unit' ] ) : '0 ' + get( details, [ 1, 'unit' ] ) }</strong></strong>
            		</PanelRow>
            		<PanelRow className={ ! get( details, [ 2, 'value' ] ) ? "text-color-orange": "" }>
            			<span>cookTime</span>
            			<strong>{ get( details, [ 2, 'value' ] ) ? get( details, [ 2, 'value' ] ) + ' ' + get( details, [ 2, 'unit' ] ) : '0 ' + get( details, [ 2, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! get( details, [ 3, 'value' ] ) ? "text-color-orange": "" }>
            			<span>calories</span>
            			<strong>{ get( details, [ 3, 'value' ] ) ? get( details, [ 3, 'value' ] ) + ' ' + get( details, [ 3, 'unit' ] ) : '0 ' + get( details, [ 3, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! dataTable.ingredients.length ? "text-color-red": "" }>
            			<span>{ __( "Ingredients", "wpzoom-recipe-card" ) }</span>
            			<strong>{ dataTable.ingredients.length }</strong>
            		</PanelRow>
            		<PanelRow className={ ! dataTable.steps.length ? "text-color-red" : "" }>
            			<span>{ __( "Steps", "wpzoom-recipe-card" ) }</span>
            			<strong>{ dataTable.steps.length }</strong>
            		</PanelRow>
            	</BaseControl>
			);
		}

		return (
			<InspectorControls>
                <PanelBody className="wpzoom-recipe-card-settings" initialOpen={ true } title={ __( "Recipe Card Settings", "wpzoom-recipe-card" ) }>
	            	<BaseControl
	        			id={ `${ id }-image` }
	        			className="editor-post-featured-image"
	        			label={ __( "Recipe Card Image (required)", "wpzoom-recipe-card" ) }
	        			help={ __( "Upload image for Recipe Card.", "wpzoom-recipe-card" ) }
	        		>
						{ 
							hasImage &&
		            		<MediaUpload
		            			onSelect={ this.onSelectImage }
		            			allowedTypes={ ALLOWED_MEDIA_TYPES }
		            			value={ get( image, ['id'] ) }
		            			render={ ( { open } ) => (
		            				<Button
			            				className="editor-post-featured-image__preview"
			            				onClick={ open }
			            			>
    									<img
    				                        className={ `${ id }-image` }
    				                        src={ get( image, ['sizes', 'full', 'url'] ) || get( image, ['sizes', 'full', 'source_url'] ) || get( image, ['url'] ) || get( image, ['source_url'] ) }
    				                        alt={ get( image, ['alt'] ) || recipeTitle }
    				                    />
			            			</Button>
		            			) }
		            		/>
			            }
		            	{
		            		! hasImage &&
		            		<MediaUpload
		            			onSelect={ this.onSelectImage }
		            			allowedTypes={ ALLOWED_MEDIA_TYPES }
		            			value={ get( image, ['id'] ) }
		            			render={ ( { open } ) => (
		            				<Button
			            				className="editor-post-featured-image__toggle"
			            				onClick={ open }
			            			>
			            				{ __( "Add Recipe Image", "wpzoom-recipe-card" ) }
			            			</Button>
		            			) }
		            		/>
		            	}
		                {
		                	hasImage &&
		                	<MediaUpload
		                		onSelect={ this.onSelectImage }
		                		allowedTypes={ ALLOWED_MEDIA_TYPES }
		                		value={ get( image, ['id'] ) }
		                		render={ ( { open } ) => (
		                			<Button
		                				isDefault
		                				isLarge
		                				onClick={ open }
		                			>
		                				{__( "Replace Image", "wpzoom-recipe-card" ) }
		                			</Button>
		                		) }
		                	/>
		                }
	                	{ 
	                		hasImage && 
	                		<Button isLink="true" isDestructive="true" onClick={ onRemoveRecipeImage }>{ __( "Remove Recipe Image", "wpzoom-recipe-card" ) }</Button>
	                	}
	        		</BaseControl>
	        		{
	        			hasImage &&
	        			! isEmpty( imageSizeOptions ) &&
		                <SelectControl
	                		label={ __( "Image Size", "wpzoom-recipe-card" ) }
	                		value={ get( image, ['url'] ) }
	                		options={ imageSizeOptions }
	                		onChange={ this.updateURL }
	                	/>
	        		}
			    	<BaseControl
						id={ `${ id }-print-btn` }
						label={ __( "Print Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Print Button", "wpzoom-recipe-card" ) }
		                    checked={ print_btn }
		                    onChange={ display => onChangeSettings( display, 0, 'print_btn' ) }
		                />
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-pinit-btn` }
						label={ __( "Pinterest Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Pinterest Button", "wpzoom-recipe-card" ) }
		                    checked={ pin_btn }
		                    onChange={ display => onChangeSettings( display, 0, 'pin_btn' ) }
		                />
	        		</BaseControl>
	        		{	
	        			pin_btn &&
	        			'custom_image' === get( settingOptions, 'wpzoom_rcb_settings_pin_image' ) &&
				    	<BaseControl
							id={ `${ id }-pinit-custom-image` }
							label={ __( "Pinterest Custom Image", "wpzoom-recipe-card" ) }
						>
		                	<MediaUpload
		                		onSelect={ this.onSelectPinImage }
		                		allowedTypes={ ALLOWED_MEDIA_TYPES }
		                		value={ get( pin_custom_image, ['id'] ) }
		                		render={ ( { open } ) => (
		                			<Button
		                				className={ pin_has_custom_image ? "editor-post-featured-image__preview" : "editor-post-featured-image__toggle" }
		                				onClick={ open }
		                			>
		                				{ pin_has_custom_image ?
		                					<img
		                                        className={ `${ id }-pinit-custom-image` }
		                                        src={ get( pin_custom_image, ['sizes', 'full', 'url'] ) || get( pin_custom_image, ['url'] ) }
		                                        alt={ get( pin_custom_image, ['alt'] ) || recipeTitle }
		                                    />
		                					: __( "Add Pin custom image", "wpzoom-recipe-card" )
		                                }
		                			</Button>
		                		) }
		                	/>
		                	{ pin_has_custom_image ? <Button isLink="true" isDestructive="true" onClick={ onRemovePinImage }>{ __( "Remove Image", "wpzoom-recipe-card" ) }</Button> : '' }
		        		</BaseControl>
		        	}
		        	{
		        		pin_btn &&
	        			'custom_text' === get( settingOptions, 'wpzoom_rcb_settings_pin_description' ) &&
				    	<TextareaControl
				    	    id={ `${ id }-pinit-custom-text` }
				    	    instanceId={ `${ id }-pinit-custom-text` }
				    	    type="text"
				    	    label={ __( "Pinterest Custom Description", "wpzoom-recipe-card" ) }
				    	    value={ pin_custom_text }
				    	    onChange={ customText => onChangeSettings( customText, 0, 'pin_custom_text' ) }
				    	/>
	        		}
	        		{
	        			'simple' !== style &&
				    	<BaseControl
							id={ `${ id }-heading-align` }
							label={ __( "Header Content Align", "wpzoom-recipe-card" ) }
						>
			                <SelectControl
		                		label={ __( "Select Alignment", "wpzoom-recipe-card" ) }
		                		value={ headerAlign }
		                		options={ [
		                			{ label: __( "Left" ), value: "left" },
		                			{ label: __( "Center" ), value: "center" },
		                			{ label: __( "Right" ), value: "right" },
		                		] }
		                		onChange={ alignment => onChangeSettings( alignment, 0, 'headerAlign' ) }
		                	/>
		        		</BaseControl>
	        		}
    		    	<BaseControl
    					id={ `${ id }-author` }
    					label={ __( "Author", "wpzoom-recipe-card" ) }
    				>
		                <ToggleControl
		                    label={ __( "Display Author", "wpzoom-recipe-card" ) }
		                    checked={ displayAuthor }
		                    onChange={ display => onChangeSettings( display, 0, 'displayAuthor' ) }
		                />
		                {
		                	displayAuthor &&
			                <TextControl
			                	id={ `${ id }-custom-author-name` }
			                	instanceId={ `${ id }-custom-author-name` }
			                	type="text"
			                	label={ __( "Custom author name", "wpzoom-recipe-card" ) }
			                	help={ __( "Default: Post author name", "wpzoom-recipe-card" ) }
			                	value={ custom_author_name }
			                	onChange={ authorName => onChangeSettings( authorName, 0, 'custom_author_name' ) }
			                />
			            }
		           	</BaseControl>
					<BaseControl
						id={ `${ id }-primary-color` }
						label={ __( "Primary Color", "wpzoom-recipe-card" ) }
					>
    		        	<ColorPalette 
    						colors={ colors } 
    						value={ primary_color }
    						onChange={ color => onChangeSettings( color, 0, 'primary_color' ) }
    					/>
	        		</BaseControl>
   	        		{
   	        			style === 'newdesign' &&
   					    	<BaseControl
   								id={ `${ id }-ingredients-layout` }
   								label={ __( "Ingredients Layout", "wpzoom-recipe-card" ) }
   							>
   				                <SelectControl
   			                		label={ __( "Select Layout", "wpzoom-recipe-card" ) }
   			                		help={ __( "This setting is visible only on Front-End. In Editor still appears in one column to prevent floating elements on editing.", "wpzoom-recipe-card" ) }
   			                		value={ ingredientsLayout }
   			                		options={ [
   			                			{ label: __( "1 column" ), value: "1-column" },
   			                			{ label: __( "2 columns" ), value: "2-columns" },
   			                		] }
   			                		onChange={ size => onChangeSettings( size, 0, 'ingredientsLayout' ) }
   			                	/>
   			        		</BaseControl>
   	        		}
	            </PanelBody>
                <PanelBody className="wpzoom-recipe-card-seo-settings" initialOpen={ true } title={ __( "Recipe Card SEO Settings", "wpzoom-recipe-card" ) }>
			    	<BaseControl
						id={ `${ id }-course` }
						label={ __( "Course (required)", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Course", "wpzoom-recipe-card" ) }
						    checked={ displayCourse }
						    onChange={ display => onChangeSettings( display, 0, 'displayCourse' ) }
						/>
						{
							displayCourse && 
							'1' === get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
							<PostTaxonomies
								taxonomies={ [ coursesTaxonomy ] }
							/>
						}
						{
							displayCourse && 
							'1' !== get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
				    		<FormTokenField 
				    			label={ __( "Add course", "wpzoom-recipe-card" ) }
								value={ course } 
								suggestions={ coursesToken } 
								onChange={ newCourse => setAttributes( { course: newCourse } ) }
								placeholder={ __( "Type course and press Enter", "wpzoom-recipe-card" ) }
							/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-cuisine` }
						label={ __( "Cuisine (required)", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Cuisine", "wpzoom-recipe-card" ) }
						    checked={ displayCuisine }
						    onChange={ display => onChangeSettings( display, 0, 'displayCuisine' ) }
						/>
						{
							displayCuisine && 
							'1' === get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
							<PostTaxonomies
								taxonomies={ [ cuisinesTaxonomy ] }
							/>
						}
						{
							displayCuisine && 
							'1' !== get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
	    		    		<FormTokenField 
	    		    			label={ __( "Add cuisine", "wpzoom-recipe-card" ) }
	    						value={ cuisine } 
	    						suggestions={ cuisinesToken } 
	    						onChange={ newCuisine => setAttributes( { cuisine: newCuisine } ) }
	    						placeholder={ __( "Type cuisine and press Enter", "wpzoom-recipe-card" ) }
	    					/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-difficulty` }
						label={ __( "Difficulty", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Difficulty", "wpzoom-recipe-card" ) }
						    checked={ displayDifficulty }
						    onChange={ display => onChangeSettings( display, 0, 'displayDifficulty' ) }
						/>
						{
							displayDifficulty && 
							'1' === get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
							<PostTaxonomies
								taxonomies={ [ difficultiesTaxonomy ] }
							/>
						}
						{
							displayDifficulty && 
							'1' !== get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
	    		    		<FormTokenField 
	    		    			label={ __( "Add difficulty level", "wpzoom-recipe-card" ) }
	    						value={ difficulty } 
	    						suggestions={ difficultyToken } 
	    						onChange={ newDifficulty => setAttributes( { difficulty: newDifficulty } ) }
	    						placeholder={ __( "Type difficulty level and press Enter", "wpzoom-recipe-card" ) }
	    					/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-keywords` }
						label={ __( "Keywords (recommended)", "wpzoom-recipe-card" ) }
						help={ __( "For multiple keywords add `,` after each keyword (ex: keyword, keyword, keyword).", "wpzoom-recipe-card" ) }
					>
	            		<FormTokenField
	            			label={ __( "Add keywords", "wpzoom-recipe-card" ) } 
	        				value={ keywords } 
	        				suggestions={ keywordsToken } 
	        				onChange={ newKeyword => setAttributes( { keywords: newKeyword } ) }
	        				placeholder={ __( "Type recipe keywords", "wpzoom-recipe-card" ) }
	        			/>
	        		</BaseControl>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-details" initialOpen={ true } title={ __( "Recipe Card Details", "wpzoom-recipe-card" ) }>
    				<ToggleControl
    				    label={ __( "Display Servings", "wpzoom-recipe-card" ) }
    				    checked={ displayServings }
    				    onChange={ display => onChangeSettings( display, 0, 'displayServings' ) }
    				/>
        			<PanelRow>
        				{
        					displayServings &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-yield` }
		        	    			instanceId={ `${ id }-yield` }
		        	    			type="number"
		        	    			label={ __( "Servings", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 0, 'value' ] ) }
		        	    			onChange={ newYield => onChangeDetail(newYield, 0) }
		        	    		/>
		        				<span>{ get( details, [ 0, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Preparation Time", "wpzoom-recipe-card" ) }
    				    checked={ displayPrepTime }
    				    onChange={ display => onChangeSettings( display, 0, 'displayPrepTime' ) }
    				/>
        			<PanelRow>
        				{
        					displayPrepTime &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-preptime` }
		        	    			instanceId={ `${ id }-preptime` }
		        	    			type="number"
		        	    			label={ __( "Preparation time", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 1, 'value' ] ) }
		        	    			onChange={ newPrepTime => onChangeDetail(newPrepTime, 1) }
		        	    		/>
		        				<span>{ get( details, [ 1, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Cooking Time", "wpzoom-recipe-card" ) }
    				    checked={ displayCookingTime }
    				    onChange={ display => onChangeSettings( display, 0, 'displayCookingTime' ) }
    				/>
        			<PanelRow>
        				{
        					displayCookingTime &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-cookingtime` }
		        	    			instanceId={ `${ id }-cookingtime` }
		        	    			type="number"
		        	    			label={ __( "Cooking time", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 2, 'value' ] ) }
		        	    			onChange={ newCookingTime => onChangeDetail(newCookingTime, 2) }
		        	    		/>
		        				<span>{ get( details, [ 2, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Calories", "wpzoom-recipe-card" ) }
    				    checked={ displayCalories }
    				    onChange={ display => onChangeSettings( display, 0, 'displayCalories' ) }
    				/>
        			<PanelRow>
        				{
        					displayCalories &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-calories` }
		        	    			instanceId={ `${ id }-calories` }
		        	    			type="number"
		        	    			label={ __( "Calories", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 3, 'value' ] ) }
		        	    			onChange={ newCalories => onChangeDetail(newCalories, 3) }
		        	    		/>
		        				<span>{ get( details, [ 3, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-structured-data-testing" initialOpen={ false } title={ __( "Structured Data Testing", "wpzoom-recipe-card" ) }>
	            	{ structuredDataTestingTool() }
	            </PanelBody>
            </InspectorControls>
		);
	}
}

const applyWithSelect = withSelect( ( select, props ) => {
	const {
		attributes: {
			image,
			hasImage
		}
	} = props;
	const {
		getMedia,
		getTaxonomy,
		getPostType
	} = select( 'core' );
	const {
		getEditedPostAttribute,
		getEditorSettings
	} = select( 'core/block-editor' );
	const {
		maxWidth,
		isRTL,
		imageSizes
	} = getEditorSettings();
	const {
		license_status,
		setting_options
	} = wpzoomRecipeCard;

	const postType = getPostType( getEditedPostAttribute( 'type' ) );
	const postTitle = getEditedPostAttribute( 'title' );
	const featuredImageId = getEditedPostAttribute( 'featured_media' );

	let id = 0;
	let coursesTaxonomy = {};
	let cuisinesTaxonomy = {};
	let difficultiesTaxonomy = {};

	if ( hasImage ) {
		id = get( image, ['id'] ) || 0;
	} else {
		id = featuredImageId;
	}

	if ( 'valid' === license_status ) {
		if ( '1' === setting_options['wpzoom_rcb_settings_course_taxonomy'] ) {
			coursesTaxonomy = getTaxonomy( 'wpzoom_rcb_courses' );
			if ( !isUndefined( coursesTaxonomy ) ) {
				coursesTaxonomy['visibility']['custom_show_ui'] = true;
			}
		}
		if ( '1' === setting_options['wpzoom_rcb_settings_cuisine_taxonomy'] ) {
			cuisinesTaxonomy = getTaxonomy( 'wpzoom_rcb_cuisines' );
			if ( !isUndefined( cuisinesTaxonomy ) ) {
				cuisinesTaxonomy['visibility']['custom_show_ui'] = true;
			}
		}
		if ( '1' === setting_options['wpzoom_rcb_settings_difficulty_taxonomy'] ) {
			difficultiesTaxonomy = getTaxonomy( 'wpzoom_rcb_difficulties' );
			if ( !isUndefined( difficultiesTaxonomy ) ) {
				difficultiesTaxonomy['visibility']['custom_show_ui'] = true;
			}
		}
	}

	return {
		media: id ? getMedia( id ) : false,
		imageSizes,
		maxWidth,
		isRTL,
		postTitle,
		postType,
		settingOptions: setting_options,
		licenseStatus: license_status,
		coursesTaxonomy,
		cuisinesTaxonomy,
		difficultiesTaxonomy,
	};
} );

export default compose(
	applyWithSelect
)( Inspector );
