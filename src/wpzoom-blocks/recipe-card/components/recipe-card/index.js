/*global wpzoomRecipeCard*/

/**
 * External dependencies
 */
import {
    get,
    map,
    invoke,
    isEmpty,
    isUndefined,
} from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Detail from '../detail';
import Ingredient from '../ingredient';
import Direction from '../direction';
import CallToAction from '../call-to-action';
import FoodLabels from '../food-labels';
import Video from '../video';
import Notes from '../notes';
import Inspector from '../block-settings';
import ExtraOptionsModal from '../bulk';
import { sharedIcon } from './shared-icon';
import {
    stripHTML,
    pickRelevantMediaFiles,
    getBlockStyle,
    generateId,
} from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Component,
    renderToString,
    Fragment,
    Platform,
} from '@wordpress/element';
import {
    Placeholder,
    Spinner,
    Disabled,
    withNotices,
} from '@wordpress/components';
import {
    RichText,
    BlockControls,
    MediaPlaceholder,
} from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_QUERY = {
    per_page: -1,
    orderby: 'name',
    order: 'asc',
    _fields: 'id,name,parent',
};
const PLACEHOLDER_TEXT = Platform.select( {
    web: __( 'Drag image, upload new one or select file from your library.', 'wpzoom-recipe-card' ),
    native: __( 'ADD MEDIA', 'wpzoom-recipe-card' ),
} );

/**
 * Import Styles
 */
import '../../style.scss';
import '../../editor.scss';

/**
 * A Recipe Card block.
 */
class RecipeCard extends Component {
    /**
     * Constructs a Recipe Card editor component.
     *
     * @param {Object} props This component's properties.
     *
     * @returns {void}
     */
    constructor( props ) {
        super( props );

        this.setFocus = this.setFocus.bind( this );
        this.onBulkAdd = this.onBulkAdd.bind( this );
        this.onSelectImage = this.onSelectImage.bind( this );
        this.onUploadError = this.onUploadError.bind( this );

        this.editorRefs = {};
        this.state = {
            isLoading: true,
            isPostTitleSet: false,
            isCategoriesFetched: false,
            isTagsFetched: false,
            isBulkAdd: false,
            availableTerms: {},
            focus: '',
        };
    }

    componentDidMount() {
        this.setPostTitle();
        this.fetchCategories();
        this.fetchTags();
    }

    componentWillUnmount() {
        invoke( this.fetchRequest, [ 'abort' ] );
        invoke( this.addRequest, [ 'abort' ] );
    }

    componentDidUpdate( prevProps, prevState ) {
        const {
            coursesTaxonomy,
            cuisinesTaxonomy,
            difficultiesTaxonomy,
        } = this.props;

        if ( coursesTaxonomy !== prevProps.coursesTaxonomy ) {
            this.setState( { isLoading: true } );
            this.fetchTerms( coursesTaxonomy );
        }
        if ( cuisinesTaxonomy !== prevProps.cuisinesTaxonomy ) {
            this.setState( { isLoading: true } );
            this.fetchTerms( cuisinesTaxonomy );
        }
        if ( difficultiesTaxonomy !== prevProps.difficultiesTaxonomy ) {
            this.setState( { isLoading: true } );
            this.fetchTerms( difficultiesTaxonomy );
        }

        if ( this.state.isPostTitleSet && ! prevState.isPostTitleSet && RichText.isEmpty( this.props.attributes.recipeTitle ) ) {
            this.setState( { isLoading: true } );
            this.setPostTitle();
        }

        if ( this.state.isCategoriesFetched && ! prevState.isCategoriesFetched && isEmpty( this.props.attributes.course ) ) {
            this.setState( { isLoading: true } );
            this.fetchCategories();
        }

        if ( this.state.isTagsFetched && ! prevState.isTagsFetched && isEmpty( this.props.attributes.keywords ) ) {
            this.setState( { isLoading: true } );
            this.fetchTags();
        }
    }

    fetchTerms( taxonomy ) {
        if ( isEmpty( taxonomy ) ) {
            this.setState( { isLoading: false } );
            return;
        }
        this.fetchRequest = apiFetch( {
            path: addQueryArgs( `/wp/v2/${ taxonomy.rest_base }`, DEFAULT_QUERY ),
        } );
        this.fetchRequest.then(
            ( terms ) => { // resolve
                const availableTerms = [];

                availableTerms[ taxonomy.rest_base ] = terms;

                this.fetchRequest = null;
                this.setState( {
                    isLoading: false,
                    availableTerms,
                } );
            },
            ( xhr ) => { // reject
                if ( xhr.statusText === 'abort' ) {
                    return;
                }
                this.fetchRequest = null;
                this.setState( {
                    isLoading: false,
                } );
            }
        );
    }

    setPostTitle() {
        const { postTitle } = this.props;

        if ( ! RichText.isEmpty( this.props.attributes.recipeTitle ) ) {
            return;
        }

        this.props.setAttributes( { recipeTitle: postTitle } );

        setTimeout( this.setState.bind( this, { isPostTitleSet: true, isLoading: false } ), 250 );
    }

    fetchCategories() {
        const {
            attributes: {
                course,
            },
            categories,
        } = this.props;

        // We have added course
        if ( ! isEmpty( course ) ) {
            this.setState( { isLoading: false } );
            return;
        }

        // We don't have selected post category
        if ( isEmpty( categories ) ) {
            this.setState( { isLoading: false } );
            return;
        }

        const query = { ...DEFAULT_QUERY, ...{ include: categories.join( ',' ) } };

        this.fetchRequest = apiFetch( {
            path: addQueryArgs( '/wp/v2/categories', query ),
        } );

        this.fetchRequest.then(
            ( terms ) => { // resolve
                const availableCategories = map( terms, ( { name } ) => {
                    return name;
                } );

                this.fetchRequest = null;
                this.props.setAttributes( { course: availableCategories } );
                setTimeout( this.setState.bind( this, { isCategoriesFetched: true, isLoading: false } ), 250 );
            },
            ( xhr ) => { // reject
                if ( xhr.statusText === 'abort' ) {
                    return;
                }
                this.fetchRequest = null;
                this.setState( {
                    isLoading: false,
                } );
            }
        );
    }

    fetchTags() {
        const {
            attributes: {
                keywords,
            },
            tags,
        } = this.props;

        // We have added keywords
        if ( ! isEmpty( keywords ) ) {
            this.setState( { isLoading: false } );
            return;
        }

        // We don't have added post tags
        if ( isEmpty( tags ) ) {
            this.setState( { isLoading: false } );
            return;
        }

        const query = { ...DEFAULT_QUERY, ...{ include: tags.join( ',' ) } };

        this.fetchRequest = apiFetch( {
            path: addQueryArgs( '/wp/v2/tags', query ),
        } );

        this.fetchRequest.then(
            ( terms ) => { // resolve
                const availableTags = map( terms, ( { name } ) => {
                    return name;
                } );

                this.fetchRequest = null;
                this.props.setAttributes( { keywords: availableTags } );
                setTimeout( this.setState.bind( this, { isTagsFetched: true, isLoading: false } ), 250 );
            },
            ( xhr ) => { // reject
                if ( xhr.statusText === 'abort' ) {
                    return;
                }
                this.fetchRequest = null;
                this.setState( {
                    isLoading: false,
                } );
            }
        );
    }

    /**
     * Sets the focus to a specific element in block.
     *
     * @param {number|string} elementToFocus The element to focus, either the index of the item that should be in focus or name of the input.
     *
     * @returns {void}
     */
    setFocus( elementToFocus ) {
        if ( elementToFocus === this.state.focus ) {
            return;
        }

        this.setState( { focus: elementToFocus } );

        if ( this.editorRefs[ elementToFocus ] ) {
            this.editorRefs[ elementToFocus ].focus();
        }
    }

    onSelectImage( media ) {
        const { className } = this.props;
        const activeStyle = getBlockStyle( className );
        let sizeSlug = 'wpzoom-rcb-block-header';

        if ( 'simple' === activeStyle ) {
            sizeSlug = 'wpzoom-rcb-block-header-square';
        }

        const relevantMedia = pickRelevantMediaFiles( media, sizeSlug );

        this.props.setAttributes( {
            hasImage: true,
            image: {
                id: relevantMedia.id,
                url: relevantMedia.url,
                alt: relevantMedia.alt,
                title: relevantMedia.title,
                sizes: media.sizes,
            },
        } );
    }

    onUploadError( message ) {
        const { noticeOperations } = this.props;
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice( message );
    }

    renderTerms( taxonomy ) {
        const { terms = [] } = this.props;

        if ( isUndefined( this.state.availableTerms[ taxonomy ] ) ) {
            return;
        }

        if ( isEmpty( terms[ taxonomy ] ) ) {
            return (
                <mark>
                    { __( 'Not added', 'wpzoom-recipe-card' ) }
                </mark>
            );
        }

        return this.state.availableTerms[ taxonomy ].map( ( term ) => {
            if ( ! isUndefined( terms[ taxonomy ] ) ) {
                if ( terms[ taxonomy ].indexOf( term.id ) !== -1 ) {
                    return (
                        <Fragment key={ term.id }>
                            <a href="#">{ term.name }</a>
                        </Fragment>
                    );
                }
            }
        } );
    }

    onBulkAdd() {
        this.setState( { isBulkAdd: true } );
    }

    render() {
        const {
            attributes,
            setAttributes,
            className,
            postType,
            postTitle,
            postAuthor,
            settingOptions,
            coursesTaxonomy,
            cuisinesTaxonomy,
            difficultiesTaxonomy,
            isRecipeCardSelected,
            noticeUI,
        } = this.props;

        const {
            wpzoom_rcb_settings_heading_content_align,
            wpzoom_rcb_settings_course_taxonomy,
            wpzoom_rcb_settings_cuisine_taxonomy,
            wpzoom_rcb_settings_difficulty_taxonomy,
        } = settingOptions;

        const {
            id,
            recipeTitle,
            summary,
            course,
            cuisine,
            difficulty,
            hasImage,
            image,
            settings: {
                0: {
                    primary_color,
                    hide_header_image,
                    print_btn,
                    pin_btn,
                    custom_author_name,
                    displayCourse,
                    displayCuisine,
                    displayDifficulty,
                    displayAuthor,
                    headerAlign,
                },
            },
        } = attributes;

        const hasImageWithId = hasImage && ! isUndefined( get( image, 'id' ) );
        const activeStyle = getBlockStyle( className );

        let headerContentAlign = headerAlign;

        if ( isUndefined( headerAlign ) ) {
            headerContentAlign = wpzoom_rcb_settings_heading_content_align;
        }
        if ( 'simple' === activeStyle ) {
            headerContentAlign = 'left';
        }

        let customAuthorName = custom_author_name;
        if ( custom_author_name === '' ) {
            customAuthorName = postAuthor;
        }

        const regex = /is-style-(\S*)/g;
        const m = regex.exec( className );

        let printStyles = [];

        if ( '' !== primary_color ) {
            if ( 'default' === activeStyle || 'simple' === activeStyle ) {
                printStyles = {
                    'background-color': `${ primary_color }`,
                };
            } else if ( 'newdesign' === activeStyle ) {
                printStyles = {
                    'background-color': `${ primary_color }`,
                    'box-shadow': `0 5px 40px ${ primary_color }`,
                };
            }
        }

        const RecipeCardClassName = classnames(
            className, {
                'is-loading-block': this.state.isLoading,
                'recipe-card-noimage': hide_header_image,
                [ `header-content-align-${ headerContentAlign }` ]: true,
                [ `is-style-${ activeStyle }` ]: m === null,
            } );
        const PrintClasses = classnames(
            'wpzoom-recipe-card-print-link'
        );
        const PinterestClasses = classnames(
            'wpzoom-recipe-card-pinit'
        );

        const loadingSpinnerPlaceholder = (
            <Placeholder
                className="wpzoom-recipe-card-loading-spinner"
                label={ __( 'Loading...', 'wpzoom-recipe-card' ) }
            >
                <Spinner />
            </Placeholder>
        );

        const mediaPlaceholder = (
            <MediaPlaceholder
                addToGallery={ false }
                disableMediaButtons={ hasImage && ! isRecipeCardSelected }
                className="recipe-card-image-placeholder"
                icon={ ! hasImage && sharedIcon }
                labels={ {
                    title: ! hasImage && __( 'Recipe Card Image', 'wpzoom-recipe-card' ),
                    instructions: ! hasImage && PLACEHOLDER_TEXT,
                } }
                onSelect={ this.onSelectImage }
                accept="image/*"
                allowedTypes={ ALLOWED_MEDIA_TYPES }
                value={ hasImageWithId ? image : undefined }
                onError={ this.onUploadError }
                notices={ hasImage ? undefined : noticeUI }
            />
        );

        const pinterestButton = (
            <div className={ PinterestClasses }>
                <a className="btn-pinit-link no-print" data-pin-do="buttonPin" href="#" data-pin-custom="true">
                    <i className="icon-pinit-link"></i>
                    <span>{ __( 'Pin', 'wpzoom-recipe-card' ) }</span>
                </a>
            </div>
        );

        const printButton = (
            <div className={ PrintClasses }>
                <a className="btn-print-link no-print" href={ `#${ id }` } title={ __( 'Print directions...', 'wpzoom-recipe-card' ) } style={ printStyles }>
                    <i className="icon-print-link"></i>
                    <span>{ __( 'Print', 'wpzoom-recipe-card' ) }</span>
                </a>
            </div>
        );

        return (
            <Fragment>
                { isRecipeCardSelected && (
                    <Inspector
                        media={ this.props.media }
                        categories={ this.props.categories }
                        postTitle={ postTitle }
                        postType={ postType }
                        postAuthor={ postAuthor }
                        imageSizes={ this.props.imageSizes }
                        maxWidth={ this.props.maxWidth }
                        isRTL={ this.props.isRTL }
                        settingOptions={ settingOptions }
                        coursesTaxonomy={ coursesTaxonomy }
                        cuisinesTaxonomy={ cuisinesTaxonomy }
                        difficultiesTaxonomy={ difficultiesTaxonomy }
                        { ...{ attributes, setAttributes, className } }
                    />
                ) }
                { isRecipeCardSelected && (
                    <BlockControls>
                        <ExtraOptionsModal
                            ingredients={ this.props.attributes.ingredients }
                            steps={ this.props.attributes.steps }
                            setAttributes={ this.props.setAttributes }
                            onBulkAdd={ this.onBulkAdd }
                        />
                    </BlockControls>
                ) }
                <div className={ RecipeCardClassName } id={ id }>
                    { noticeUI }
                    { this.state.isLoading && loadingSpinnerPlaceholder }
                    {
                        'simple' !== activeStyle &&
                        <Fragment>
                            { ! hasImage && mediaPlaceholder }
                            {
                                hasImage &&
                                <div className="recipe-card-image-preview">
                                    <div className="recipe-card-image">
                                        <figure>
                                            <img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle } />
                                            <figcaption>
                                                <Disabled>
                                                    { pin_btn && pinterestButton }
                                                    { print_btn && printButton }
                                                </Disabled>
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                            }
                            <div className="recipe-card-heading">
                                <RichText
                                    className="recipe-card-title"
                                    tagName="h2"
                                    format="string"
                                    value={ recipeTitle }
                                    unstableOnFocus={ () => this.setFocus( 'recipeTitle' ) }
                                    onChange={ newTitle => setAttributes( { recipeTitle: newTitle } ) }
                                    onSetup={ ( ref ) => {
                                        this.editorRefs.recipeTitle = ref;
                                    } }
                                    placeholder={ __( 'Enter the title of your recipe', 'wpzoom-recipe-card' ) }
                                    keepPlaceholderOnFocus={ true }
                                />
                                {
                                    displayAuthor &&
                                    <span className="recipe-card-author">
                                        { __( 'Recipe by', 'wpzoom-recipe-card' ) } { customAuthorName }
                                    </span>
                                }
                                {
                                    <Fragment key="recipe-card-metadata">
                                        {
                                            displayCourse &&
                                            '1' !== wpzoom_rcb_settings_course_taxonomy &&
                                            <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( course ) ? course.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                        }
                                        {
                                            displayCuisine &&
                                            '1' !== wpzoom_rcb_settings_cuisine_taxonomy &&
                                            <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( cuisine ) ? cuisine.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                        }
                                        {
                                            displayDifficulty &&
                                            '1' !== wpzoom_rcb_settings_difficulty_taxonomy &&
                                            <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( difficulty ) ? difficulty.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                        }
                                    </Fragment>
                                }
                                {
                                    <Fragment key="recipe-card-terms">
                                        {
                                            displayCourse &&
                                            '1' === wpzoom_rcb_settings_course_taxonomy &&
                                            <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
                                        }
                                        {
                                            displayCuisine &&
                                            '1' === wpzoom_rcb_settings_cuisine_taxonomy &&
                                            <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
                                        }
                                        {
                                            displayDifficulty &&
                                            '1' === wpzoom_rcb_settings_difficulty_taxonomy &&
                                            <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
                                        }
                                    </Fragment>
                                }
                                <p className="description">{ __( 'You can add or edit these details in the Block Options on the right →', 'wpzoom-recipe-card' ) }</p>
                            </div>
                            <Detail
                                generateId={ generateId }
                                { ...{ attributes, setAttributes, className } }
                            />

                        </Fragment>
                    }

                    {
                        'simple' === activeStyle &&
                        <div className="recipe-card-header-wrap">
                            { ! hasImage && mediaPlaceholder }
                            {
                                hasImage &&
                                <div className="recipe-card-image-preview">
                                    <div className="recipe-card-image">
                                        <figure>
                                            <img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle } />
                                            <figcaption>
                                                <Disabled>
                                                    { pin_btn && pinterestButton }
                                                    { print_btn && printButton }
                                                </Disabled>
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                            }

                            <div className="recipe-card-along-image">

                                <div className="recipe-card-heading">
                                    <RichText
                                        className="recipe-card-title"
                                        tagName="h2"
                                        format="string"
                                        value={ recipeTitle }
                                        unstableOnFocus={ () => this.setFocus( 'recipeTitle' ) }
                                        onChange={ newTitle => setAttributes( { recipeTitle: newTitle } ) }
                                        onSetup={ ( ref ) => {
                                            this.editorRefs.recipeTitle = ref;
                                        } }
                                        placeholder={ __( 'Enter the title of your recipe', 'wpzoom-recipe-card' ) }
                                        keepPlaceholderOnFocus={ true }
                                    />
                                    {
                                        displayAuthor &&
                                        <span className="recipe-card-author">
                                            { __( 'Recipe by', 'wpzoom-recipe-card' ) } { customAuthorName }
                                        </span>
                                    }
                                    {
                                        <Fragment key="recipe-card-metadata">
                                            {
                                                displayCourse &&
                                                '1' !== wpzoom_rcb_settings_course_taxonomy &&
                                                <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( course ) ? course.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                            }
                                            {
                                                displayCuisine &&
                                                '1' !== wpzoom_rcb_settings_cuisine_taxonomy &&
                                                <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( cuisine ) ? cuisine.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                            }
                                            {
                                                displayDifficulty &&
                                                '1' !== wpzoom_rcb_settings_difficulty_taxonomy &&
                                                <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ ! RichText.isEmpty( difficulty ) ? difficulty.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' ) }</mark></span>
                                            }
                                        </Fragment>
                                    }
                                    {
                                        <Fragment key="recipe-card-terms">
                                            {
                                                displayCourse &&
                                                '1' === wpzoom_rcb_settings_course_taxonomy &&
                                                <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
                                            }
                                            {
                                                displayCuisine &&
                                                '1' === wpzoom_rcb_settings_cuisine_taxonomy &&
                                                <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
                                            }
                                            {
                                                displayDifficulty &&
                                                '1' === wpzoom_rcb_settings_difficulty_taxonomy &&
                                                <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
                                            }
                                        </Fragment>
                                    }
                                    <p className="description">{ __( 'You can add or edit these details in the Block Options on the right →', 'wpzoom-recipe-card' ) }</p>
                                </div>
                                <Detail
                                    generateId={ generateId }
                                    { ...{ attributes, setAttributes, className } }
                                />

                            </div>

                        </div>
                    }
                    <FoodLabels
                        location="top"
                        { ...{ attributes, setAttributes } }
                    />
                    <RichText
                        className="recipe-card-summary"
                        tagName="p"
                        value={ summary }
                        unstableOnFocus={ () => this.setFocus( 'summary' ) }
                        onChange={ ( newSummary ) => setAttributes( { summary: newSummary, jsonSummary: stripHTML( renderToString( newSummary ) ) } ) }
                        onSetup={ ( ref ) => {
                            this.editorRefs.summary = ref;
                        } }
                        placeholder={ __( 'Enter a short recipe description.', 'wpzoom-recipe-card' ) }
                        keepPlaceholderOnFocus={ true }
                    />
                    <Ingredient
                        generateId={ generateId }
                        isRecipeCardSelected={ isRecipeCardSelected }
                        { ...{ attributes, setAttributes, className } }
                    />
                    <Direction
                        generateId={ generateId }
                        isRecipeCardSelected={ isRecipeCardSelected }
                        { ...{ attributes, setAttributes, className } }
                    />
                    <Video
                        onFocus={ this.setFocus }
                        { ...{ attributes, setAttributes } }
                    />
                    <Notes
                        onFocus={ this.setFocus }
                        { ...{ attributes, setAttributes } }
                    />
                    <FoodLabels
                        location="bottom"
                        { ...{ attributes, setAttributes } }
                    />
                    <CallToAction />
                </div>
            </Fragment>
        );
    }
}

const applyWithSelect = withSelect( ( select, props ) => {
    const {
        attributes: {
            image,
            hasImage,
        },
        clientId,
        isSelected,
    } = props;

    const {
        getMedia,
        getTaxonomy,
        getPostType,
        getAuthors,
    } = select( 'core' );

    const {
        getEditedPostAttribute,
        getEditorSettings,
    } = select( 'core/editor' );

    const {
        getBlockHierarchyRootClientId,
        getSelectedBlockClientId,
    } = select( 'core/block-editor' );

    const {
        maxWidth,
        isRTL,
        imageSizes,
    } = getEditorSettings();

    const {
        license_status,
        setting_options,
    } = wpzoomRecipeCard;

    const getAuthorData = ( authors, path = '' ) => {
        const postAuthor = getEditedPostAttribute( 'author' );
        let authorData = null;

        authors.map(
            function( author, key ) {
                if ( author.id === postAuthor ) {
                    if ( path !== '' ) {
                        authorData = get( authors, [ key, path ] );
                    } else {
                        authorData = get( authors, [ key ] );
                    }
                }
            }
        );

        return authorData;
    };

    // Get clientID of the parent block.
    const rootClientId = getBlockHierarchyRootClientId( clientId );
    const selectedRootClientId = getBlockHierarchyRootClientId( getSelectedBlockClientId() );

    const postType = getPostType( getEditedPostAttribute( 'type' ) );
    const categories = getEditedPostAttribute( 'categories' );
    const tags = getEditedPostAttribute( 'tags' );
    const postTitle = getEditedPostAttribute( 'title' );
    const featuredImageId = getEditedPostAttribute( 'featured_media' );
    const authors = getAuthors();
    const postAuthor = getAuthorData( authors, 'name' );

    let id = 0;
    const terms = {};
    let coursesTaxonomy = {};
    let cuisinesTaxonomy = {};
    let difficultiesTaxonomy = {};

    if ( hasImage ) {
        id = get( image, [ 'id' ] ) || 0;
    } else {
        id = featuredImageId;
    }

    if ( 'valid' === license_status ) {
        if ( '1' === get( setting_options, 'wpzoom_rcb_settings_course_taxonomy' ) ) {
            coursesTaxonomy = getTaxonomy( 'wpzoom_rcb_courses' );
            if ( ! isUndefined( coursesTaxonomy ) ) {
                coursesTaxonomy.visibility[ 'custom_show_ui' ] = true;
                terms[ coursesTaxonomy.rest_base ] = getEditedPostAttribute( coursesTaxonomy.rest_base );
            }
        }
        if ( '1' === get( setting_options, 'wpzoom_rcb_settings_cuisine_taxonomy' ) ) {
            cuisinesTaxonomy = getTaxonomy( 'wpzoom_rcb_cuisines' );
            if ( ! isUndefined( cuisinesTaxonomy ) ) {
                cuisinesTaxonomy.visibility[ 'custom_show_ui' ] = true;
                terms[ cuisinesTaxonomy.rest_base ] = getEditedPostAttribute( cuisinesTaxonomy.rest_base );
            }
        }
        if ( '1' === get( setting_options, 'wpzoom_rcb_settings_difficulty_taxonomy' ) ) {
            difficultiesTaxonomy = getTaxonomy( 'wpzoom_rcb_difficulties' );
            if ( ! isUndefined( difficultiesTaxonomy ) ) {
                difficultiesTaxonomy.visibility[ 'custom_show_ui' ] = true;
                terms[ difficultiesTaxonomy.rest_base ] = getEditedPostAttribute( difficultiesTaxonomy.rest_base );
            }
        }
    }

    return {
        media: id ? getMedia( id ) : false,
        postTitle,
        postType,
        postAuthor,
        settingOptions: setting_options,
        licenseStatus: license_status,
        coursesTaxonomy,
        cuisinesTaxonomy,
        difficultiesTaxonomy,
        terms,
        categories,
        tags,
        imageSizes,
        maxWidth,
        isRTL,
        isRecipeCardSelected: isSelected || rootClientId === selectedRootClientId,
    };
} );

export default compose(
    applyWithSelect,
    withNotices
)( RecipeCard );

