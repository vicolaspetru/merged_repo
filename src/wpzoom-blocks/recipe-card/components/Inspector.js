/* External dependencies */
import get from "lodash/get";
import map from "lodash/map";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import forEach from "lodash/forEach";
import toString from "lodash/toString";
import uniqueId from "lodash/uniqueId";
import isUndefined from "lodash/isUndefined";
import PostTaxonomies from "./PostTaxonomies";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";
import { humanize } from "../../../helpers/stringHelpers";
import { pickRelevantMediaFiles } from "../../../helpers/pickRelevantMediaFiles";
import { getBlockStyle } from "../../../helpers/getBlockStyle";
import VideoUpload from "./VideoUpload";

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
	ColorPalette,
	SelectControl,
	Notice
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
		
		this.onSelectImage 				= this.onSelectImage.bind( this );
		this.onSetFeaturedImage 		= this.onSetFeaturedImage.bind( this );
		this.onRemoveRecipeImage 		= this.onRemoveRecipeImage.bind( this );
		this.onSelectPinImage			= this.onSelectPinImage.bind( this );
		this.onRemovePinImage			= this.onRemovePinImage.bind( this );
		this.onChangeDetail 			= this.onChangeDetail.bind( this );
		this.onChangeSettings 			= this.onChangeSettings.bind( this );
		this.onUpdateURL 				= this.onUpdateURL.bind( this );

		this.state = {
			updateIngredients: false,
			updateInstructions: false,
			updateErrors: false,
			updateWarnings: false,
			structuredDataNotice: {
				errors: [],
				warnings: []
			},
			structuredDataTable: {
				recipeIngredients: 0,
				recipeInstructions: 0
			}
		}
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

		const relevantMedia = pickRelevantMediaFiles( media, 'header' );

		setAttributes( {
			hasImage: !isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				title: relevantMedia.title,
				sizes: get( media, [ 'sizes' ] ) || get( media, [ 'media_details', 'sizes' ] )
			}
		} );
	}

	onSelectImage( media ) {
		const { setAttributes } = this.props;
		const relevantMedia = pickRelevantMediaFiles( media, 'header' );

		setAttributes( {
			hasImage: !isNull( relevantMedia.id ),
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				title: relevantMedia.title,
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
		const relevantMedia = pickRelevantMediaFiles( media, 'header' );

		settings[0]['pin_has_custom_image'] = !isNull( relevantMedia.id );
		settings[0]['pin_custom_image'] = {
			id: relevantMedia.id,
			url: relevantMedia.url,
			alt: relevantMedia.alt,
			title: relevantMedia.title,
			sizes: media.sizes
		};

		setAttributes( { settings } );
	}

	onRemovePinImage() {
		const {
			attributes: {
				settings
			},
			setAttributes
		} = this.props;
		
		settings[0]['pin_has_custom_image'] = false;
		settings[0]['pin_custom_image'] = [];

		setAttributes( { settings } );
	}

	onChangeSettings( newValue, param, index = 0 ) {
		const {
			setAttributes,
			attributes: {
				settings
			}
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
				details
			}
		} = this.props;
		const newDetails = details ? details.slice() : [];

		const id 		= get( newDetails, [ index, 'id' ] );
		const icon 		= get( newDetails, [ index, 'icon' ] );
		const iconSet 	= get( newDetails, [ index, 'iconSet' ] );

		if ( ! get( newDetails, index ) ) {
			newDetails[ index ] = {};
		}

		if ( !id ) {
			newDetails[ index ][ 'id' ] = uniqueId( `detail-item-${ new Date().getTime() }` );
		}
		if ( !icon ) {
			newDetails[ index ][ 'icon' ] = 'restaurant-utensils';
		}
		if ( !iconSet ) {
			newDetails[ index ][ 'iconSet' ] = 'foodicons';
		}

		if ( 'label' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ][ 'jsonLabel' ] = stripHTML( renderToString( newValue ) );
		}
		if ( 'value' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ][ 'jsonValue' ] = stripHTML( renderToString( newValue ) );
		}
		if ( 'unit' === field ) {
			newDetails[ index ][ field ] = newValue;
			newDetails[ index ][ 'jsonUnit' ] = stripHTML( renderToString( newValue ) );
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
					sizes
				}
			}
		} = this.props;
		
		setAttributes( {
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

	errorDetails() {
		const string = toString( this.state.structuredDataNotice.errors );
		return string.replace( /,/g, ', ' );
	}

	warningDetails() {
		const string = toString( this.state.structuredDataNotice.warnings );
		return string.replace( /,/g, ', ' );
	}

	structuredDataTable() {
		const {
			updateIngredients,
			updateInstructions,
			structuredDataTable
		} = this.state;
		const {
			ingredients,
			steps
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

		if ( recipeIngredients != get( structuredDataTable, 'recipeIngredients' ) || recipeInstructions != get( structuredDataTable, 'recipeInstructions' ) ) {
			this.setState( { structuredDataTable: { recipeIngredients, recipeInstructions } } );
		}
	}

	structuredDataNotice() {
		const {
			structuredDataNotice,
			structuredDataTable
		} = this.state;
		const {
			hasImage,
			details,
			summary,
			hasVideo
		} = this.props.attributes;

		let warnings = [];
		let errors = [];

		// Push warnings
		RichText.isEmpty( summary ) && warnings.push("summary");
		! hasVideo && warnings.push("video");
		! get( details, [ 1 ,'value' ] ) && warnings.push("prepTime");
		! get( details, [ 2 ,'value' ] ) && warnings.push("cookTime");
		! get( details, [ 3 ,'value' ] ) && warnings.push("calories");

		// Push errors
		! hasImage && errors.push("image");
		! get( structuredDataTable, 'recipeIngredients' ) && errors.push("ingredients");
		! get( structuredDataTable, 'recipeInstructions' ) && errors.push("steps");

		if ( warnings.length != get( structuredDataNotice, 'warnings' ).length || errors.length != get( structuredDataNotice, 'errors' ).length ) {
			this.setState( { structuredDataNotice: { warnings, errors } } );
		}
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The Ingredient items block settings.
	 */
	render() {

		// Set featured image if Recipe Card image aren't uploaded
		this.onSetFeaturedImage();

		// Inline check Schema Markup
		this.structuredDataTable();
		this.structuredDataNotice();

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
			structuredDataNotice,
			structuredDataTable
		} = this.state;

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
					ingredientsLayout,
					ajustableServings
				}
			}
		} = attributes;

		const style = getBlockStyle( className );
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
        					<Fragment>
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
		                		<Button isLink="true" isDestructive="true" onClick={ this.onRemoveRecipeImage }>{ __( "Remove Recipe Image", "wpzoom-recipe-card" ) }</Button>
		                	</Fragment>
	                	}
	        		</BaseControl>
	        		{
	        			hasImage &&
	        			! isEmpty( imageSizeOptions ) &&
		                <SelectControl
	                		label={ __( "Image Size", "wpzoom-recipe-card" ) }
	                		value={ get( image, ['url'] ) }
	                		options={ imageSizeOptions }
	                		onChange={ this.onUpdateURL }
	                	/>
	        		}
			    	<BaseControl
						id={ `${ id }-print-btn` }
						label={ __( "Print Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Print Button", "wpzoom-recipe-card" ) }
		                    checked={ print_btn }
		                    onChange={ display => this.onChangeSettings( display, 'print_btn' ) }
		                />
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-pinit-btn` }
						label={ __( "Pinterest Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Pinterest Button", "wpzoom-recipe-card" ) }
		                    checked={ pin_btn }
		                    onChange={ display => this.onChangeSettings( display, 'pin_btn' ) }
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
		                	{ pin_has_custom_image ? <Button isLink="true" isDestructive="true" onClick={ this.onRemovePinImage }>{ __( "Remove Image", "wpzoom-recipe-card" ) }</Button> : '' }
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
				    	    onChange={ customText => this.onChangeSettings( customText, 'pin_custom_text' ) }
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
		                		onChange={ alignment => this.onChangeSettings( alignment, 'headerAlign' ) }
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
		                    onChange={ display => this.onChangeSettings( display, 'displayAuthor' ) }
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
			                	onChange={ authorName => this.onChangeSettings( authorName, 'custom_author_name' ) }
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
    						onChange={ color => this.onChangeSettings( color, 'primary_color' ) }
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
   			                		onChange={ size => this.onChangeSettings( size, 'ingredientsLayout' ) }
   			                	/>
   			        		</BaseControl>
   	        		}
	            </PanelBody>
                <VideoUpload { ...{ attributes, setAttributes, className , clientId } } />
                <PanelBody className="wpzoom-recipe-card-seo-settings" initialOpen={ true } title={ __( "Recipe Card SEO Settings", "wpzoom-recipe-card" ) }>
			    	<BaseControl
						id={ `${ id }-course` }
						label={ __( "Course (required)", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Course", "wpzoom-recipe-card" ) }
						    checked={ displayCourse }
						    onChange={ display => this.onChangeSettings( display, 'displayCourse' ) }
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
						    onChange={ display => this.onChangeSettings( display, 'displayCuisine' ) }
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
						    onChange={ display => this.onChangeSettings( display, 'displayDifficulty' ) }
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
	            	{
	            		! get( attributes, [ 'settings', 1, 'isNoticeDismiss' ] ) &&
		            	<Notice
		            		status="info"
		            		onRemove={ () => this.onChangeSettings( true, 'isNoticeDismiss', 1 ) }
		            	>
	            	        <p>{ __( "The following details are used for Schema Markup (Rich Snippets). If you want to hide some details in the post, just turn them off below.", "wpzoom-recipe-card") }</p>
	            	        <p><strong>{ __( "NEW: you can also add custom details (see next panel below).", "wpzoom-recipe-card" ) }</strong></p>
	            	    </Notice>
	            	}
    				<ToggleControl
    				    label={ __( "Display Servings", "wpzoom-recipe-card" ) }
    				    checked={ displayServings }
    				    onChange={ display => this.onChangeSettings( display, 'displayServings' ) }
    				/>
    				<ToggleControl
    				    label={ __( "Enable Ajustable Servings", "wpzoom-recipe-card" ) }
    				    checked={ ajustableServings }
    				    onChange={ value => this.onChangeSettings( value, 'ajustableServings' ) }
    				/>
        			<PanelRow>
        				{
        					displayServings &&
        					<Fragment>
        						<TextControl
        							id={ `${ id }-yield-label` }
        							instanceId={ `${ id }-yield-label` }
        							type="text"
        							label={ __( "Servings Label", "wpzoom-recipe-card" ) }
        							placeholder={ __( "Servings", "wpzoom-recipe-card" ) }
        							value={ get( details, [ 0, 'label' ] ) }
        							onChange={ newValue => this.onChangeDetail(newValue, 0, 'label') }
        						/>
        						<TextControl
        							id={ `${ id }-yield-value` }
        							instanceId={ `${ id }-yield-value` }
        							type="number"
        							label={ __( "Servings Value", "wpzoom-recipe-card" ) }
        							value={ get( details, [ 0, 'value' ] ) }
        							onChange={ newValue => this.onChangeDetail(newValue, 0, 'value') }
        						/>
        						<TextControl
        							id={ `${ id }-yield-unit` }
        							instanceId={ `${ id }-yield-unit` }
        							type="text"
        							label={ __( "Servings Unit", "wpzoom-recipe-card" ) }
        							value={ get( details, [ 0, 'unit' ] ) }
        							onChange={ newValue => this.onChangeDetail(newValue, 0, 'unit') }
        						/>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Preparation Time", "wpzoom-recipe-card" ) }
    				    checked={ displayPrepTime }
    				    onChange={ display => this.onChangeSettings( display, 'displayPrepTime' ) }
    				/>
        			<PanelRow>
        				{
        					displayPrepTime &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-preptime-label` }
		        	    			instanceId={ `${ id }-preptime-label` }
		        	    			type="text"
		        	    			label={ __( "Prep Time Label", "wpzoom-recipe-card" ) }
		        	    			placeholder={ __( "Prep Time", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 1, 'label' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 1, 'label') }
		        	    		/>
		        	    		<TextControl
		        	    			id={ `${ id }-preptime-value` }
		        	    			instanceId={ `${ id }-preptime-value` }
		        	    			type="number"
		        	    			label={ __( "Prep Time Value", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 1, 'value' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 1, 'value') }
		        	    		/>
		        	    		<span>{ get( details, [ 1, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Cooking Time", "wpzoom-recipe-card" ) }
    				    checked={ displayCookingTime }
    				    onChange={ display => this.onChangeSettings( display, 'displayCookingTime' ) }
    				/>
        			<PanelRow>
        				{
        					displayCookingTime &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-cookingtime-label` }
		        	    			instanceId={ `${ id }-cookingtime-label` }
		        	    			type="text"
		        	    			label={ __( "Cook Time Label", "wpzoom-recipe-card" ) }
		        	    			placeholder={ __( "Cooking Time", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 2, 'label' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 2, 'label') }
		        	    		/>
		        	    		<TextControl
		        	    			id={ `${ id }-cookingtime-value` }
		        	    			instanceId={ `${ id }-cookingtime-value` }
		        	    			type="number"
		        	    			label={ __( "Cook Time Value", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 2, 'value' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 2, 'value') }
		        	    		/>
		        	    		<span>{ get( details, [ 2, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Calories", "wpzoom-recipe-card" ) }
    				    checked={ displayCalories }
    				    onChange={ display => this.onChangeSettings( display, 'displayCalories' ) }
    				/>
        			<PanelRow>
        				{
        					displayCalories &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-calories-label` }
		        	    			instanceId={ `${ id }-calories-label` }
		        	    			type="text"
		        	    			label={ __( "Cook Time Label", "wpzoom-recipe-card" ) }
		        	    			placeholder={ __( "Cooking Time", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 3, 'label' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 3, 'label') }
		        	    		/>
		        	    		<TextControl
		        	    			id={ `${ id }-calories-value` }
		        	    			instanceId={ `${ id }-calories-value` }
		        	    			type="number"
		        	    			label={ __( "Cook Time Value", "wpzoom-recipe-card" ) }
		        	    			value={ get( details, [ 3, 'value' ] ) }
		        	    			onChange={ newValue => this.onChangeDetail(newValue, 3, 'value') }
		        	    		/>
		        	    		<span>{ get( details, [ 3, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-custom-details" initialOpen={ true } title={ __( "Add Custom Details", "wpzoom-recipe-card" ) }>
        			<PanelRow>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-1-label` }
        	    			instanceId={ `${ id }-custom-detail-1-label` }
        	    			type="text"
        	    			label={ __( "Custom Label 1", "wpzoom-recipe-card" ) }
        	    			placeholder={ __( "Resting Time", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 4, 'label' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 4, 'label') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-1-value` }
        	    			instanceId={ `${ id }-custom-detail-1-value` }
        	    			type="text"
        	    			label={ __( "Custom Value 1", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 4, 'value' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 4, 'value') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-1-unit` }
        	    			instanceId={ `${ id }-custom-detail-1-unit` }
        	    			type="text"
        	    			label={ __( "Custom Unit 1", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 4, 'unit' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 4, 'unit') }
        	    		/>
        			</PanelRow>
        			<PanelRow>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-2-label` }
        	    			instanceId={ `${ id }-custom-detail-2-label` }
        	    			type="text"
        	    			label={ __( "Custom Label 2", "wpzoom-recipe-card" ) }
        	    			placeholder={ __( "Baking Time", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 5, 'label' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 5, 'label') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-2-value` }
        	    			instanceId={ `${ id }-custom-detail-2-value` }
        	    			type="text"
        	    			label={ __( "Custom Value 2", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 5, 'value' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 5, 'value') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-2-unit` }
        	    			instanceId={ `${ id }-custom-detail-2-unit` }
        	    			type="text"
        	    			label={ __( "Custom Unit 2", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 5, 'unit' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 5, 'unit') }
        	    		/>
        			</PanelRow>
        			<PanelRow>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-3-label` }
        	    			instanceId={ `${ id }-custom-detail-3-label` }
        	    			type="text"
        	    			label={ __( "Custom Label 3", "wpzoom-recipe-card" ) }
        	    			placeholder={ __( "Total Time", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 6, 'label' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 6, 'label') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-3-value` }
        	    			instanceId={ `${ id }-custom-detail-3-value` }
        	    			type="text"
        	    			label={ __( "Custom Value 3", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 6, 'value' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 6, 'value') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-3-unit` }
        	    			instanceId={ `${ id }-custom-detail-3-unit` }
        	    			type="text"
        	    			label={ __( "Custom Unit 3", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 6, 'unit' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 6, 'unit') }
        	    		/>
        			</PanelRow>
        			<PanelRow>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-4-label` }
        	    			instanceId={ `${ id }-custom-detail-4-label` }
        	    			type="text"
        	    			label={ __( "Custom Label 4", "wpzoom-recipe-card" ) }
        	    			placeholder={ __( "Net Carbs", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 7, 'label' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 7, 'label') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-4-value` }
        	    			instanceId={ `${ id }-custom-detail-4-value` }
        	    			type="text"
        	    			label={ __( "Custom Value 4", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 7, 'value' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 7, 'value') }
        	    		/>
        	    		<TextControl
        	    			id={ `${ id }-custom-detail-4-unit` }
        	    			instanceId={ `${ id }-custom-detail-4-unit` }
        	    			type="text"
        	    			label={ __( "Custom Unit 4", "wpzoom-recipe-card" ) }
        	    			value={ get( details, [ 7, 'unit' ] ) }
        	    			onChange={ newValue => this.onChangeDetail(newValue, 7, 'unit') }
        	    		/>
        			</PanelRow>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-structured-data-testing" initialOpen={ true } title={ __( "Structured Data Testing", "wpzoom-recipe-card" ) }>
    		    	<BaseControl
    					id={ `${ id }-counters` }
    					help={ __( "Automatically check Structured Data errors and warnings.", "wpzoom-recipe-card" ) }
    				>
    					{
    						get( structuredDataNotice, 'errors' ).length > 0 &&
    						<Notice status="error" isDismissible={ false }>
    							<p>{ __( "Please enter value for required fields: ", "wpzoom-recipe-card" ) } <strong>{ this.errorDetails() }</strong>.</p>
    						</Notice>
    					}
    					{
    						get( structuredDataNotice, 'warnings' ).length > 0 &&
    						<Notice status="warning" isDismissible={ false }>
    							<p>{ __( "We recommend to add value for following fields: ", "wpzoom-recipe-card" ) } <strong>{ this.warningDetails() }</strong>.</p>
    						</Notice>
    					}
    	        		<PanelRow>
    	        			<span>recipeTitle</span>
    	        			<strong>{ ! RichText.isEmpty( recipeTitle ) ? recipeTitle : postTitle }</strong>
    	        		</PanelRow>
    	        		<PanelRow className={ RichText.isEmpty( summary ) ? "text-color-orange": "" }>
    	        			<span>description</span>
    	        			<strong>{ ! isUndefined( jsonSummary ) ? stripHTML( jsonSummary ) : __( "Not added", "wpzoom-recipe-card" ) }</strong>
    	        		</PanelRow>
    	        		<PanelRow className={ ! hasImage ? "text-color-red": "" }>
    	        			<span>image</span>
    	        			<strong>{ hasImage ? get( image, 'url' ) : __( "Not added", "wpzoom-recipe-card" ) }</strong>
    	        		</PanelRow>
    	        		<PanelRow className={ ! hasVideo ? "text-color-orange": "" }>
    	        			<span>video</span>
    	        			<strong>{ hasVideo ? get( video, 'url' ) : __( "Not added", "wpzoom-recipe-card" ) }</strong>
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
    	        		<PanelRow className={ ! get( structuredDataTable, 'recipeIngredients' ) ? "text-color-red": "" }>
    	        			<span>{ __( "Ingredients", "wpzoom-recipe-card" ) }</span>
    	        			<strong>{ get( structuredDataTable, 'recipeIngredients' ) }</strong>
    	        		</PanelRow>
    	        		<PanelRow className={ ! get( structuredDataTable, 'recipeInstructions' ) ? "text-color-red" : "" }>
    	        			<span>{ __( "Steps", "wpzoom-recipe-card" ) }</span>
    	        			<strong>{ get( structuredDataTable, 'recipeInstructions' ) }</strong>
    	        		</PanelRow>
    	        	</BaseControl>
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
	} = select( 'core/editor' );

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
