/* External dependencies */
import { __ } from "@wordpress/i18n";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import invoke from "lodash/invoke";
import isUndefined from "lodash/isUndefined";
import ReactPlayer from "react-player";

/* Internal dependencies */
import Detail from "./Detail";
import Ingredient from "./Ingredient";
import Direction from "./Direction";
import CallToAction from "./CTA";
import FoodLabels from "./FoodLabels";
import Inspector from "./Inspector";
import ExtraOptionsModal from "./ExtraOptionsModal";
import { stripHTML } from "../../../helpers/stringHelpers";
import { pickRelevantMediaFiles } from "../../../helpers/pickRelevantMediaFiles";
import { getBlockStyle } from "../../../helpers/getBlockStyle";
import { generateId } from "../../../helpers/generateId";

/* WordPress dependencies */
const { Component, renderToString, Fragment } = wp.element;
const {
    Button,
    Placeholder,
    Spinner,
    Disabled
} = wp.components;

const {
    RichText,
    BlockControls,
    MediaUpload,
} = wp.blockEditor;

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

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

/* Import CSS. */
import '../style.scss';
import '../editor.scss';

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
        this.hintLoading = this.hintLoading.bind( this );
        this.onSelectImage = this.onSelectImage.bind( this );

        this.editorRefs = {};
        this.state = {
            isLoading: true,
            isPostTitleSet: false,
            isCategoriesFetched: false,
            isTagsFetched: false,
            isBulkAdd: false,
            availableTerms: {},
            focus: ""
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
            difficultiesTaxonomy
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
                    availableTerms
                } );
            },
            ( xhr ) => { // reject
                if ( xhr.statusText === 'abort' ) {
                    return;
                }
                this.fetchRequest = null;
                this.setState( {
                    isLoading: false
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
                course
            },
            categories
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
            path: addQueryArgs( `/wp/v2/categories`, query ),
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
                    isLoading: false
                } );
            }
        );
    }

    fetchTags() {
        const {
            attributes: {
                keywords
            },
            tags
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
            path: addQueryArgs( `/wp/v2/tags`, query ),
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
                    isLoading: false
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
        const relevantMedia = pickRelevantMediaFiles( media, 'header' );

        this.props.setAttributes( {
            hasImage: true,
            image: {
                id: relevantMedia.id,
                url: relevantMedia.url,
                alt: relevantMedia.alt,
                title: relevantMedia.title,
                sizes: media.sizes
            }
        } );
    }

    renderTerms( taxonomy ) {
        const { terms = [] } = this.props;

        if ( isUndefined( this.state.availableTerms[taxonomy] ) ) {
            return;
        }

        if ( isEmpty( terms[taxonomy] ) ) {
            return (
                <mark>
                    { __( "Not added", "wpzoom-recipe-card" ) }
                </mark>
            );
        }

        return this.state.availableTerms[taxonomy].map( ( term ) => {
            if ( !isUndefined( terms[taxonomy] ) ) {
                if ( terms[taxonomy].indexOf( term.id ) !== -1 ) {
                    return (
                        <Fragment key={ term.id }>
                            <a href="#">{ term.name }</a>
                        </Fragment>
                    );
                }
            }
        } );
    }

    hintLoading( isLoading = true ) {
        this.setState( { isLoading } );
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
            postPermalink,
            media,
            settingOptions,
            coursesTaxonomy,
            cuisinesTaxonomy,
            difficultiesTaxonomy
        } = this.props;

        const {
            id,
            recipeTitle,
            summary,
            jsonSummary,
            notesTitle,
            notes,
            course,
            cuisine,
            difficulty,
            hasVideo,
            video,
            videoTitle,
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
                    headerAlign
                }
            },
        } = attributes;

        const postThumbnail = pickRelevantMediaFiles( media, 'header' );

        const style = getBlockStyle( className );
        const loadingClass = this.state.isLoading ? 'is-loading-block' : '';
        const hideRecipeImgClass = hide_header_image ? 'recipe-card-noimage' : '';
        const videoType = get( video, 'type' );

        let pin_description = recipeTitle;
        let headerContentAlign = headerAlign;
        let customAuthorName;

        if ( get( settingOptions, 'wpzoom_rcb_settings_pin_description' ) === 'recipe_summary' ) {
            pin_description = jsonSummary;
        }
        if ( isUndefined( headerAlign ) ) {
            headerContentAlign = get( settingOptions, 'wpzoom_rcb_settings_heading_content_align' );
        }
        if ( 'simple' === style ) {
            headerContentAlign = 'left';
        }

        customAuthorName = custom_author_name;
        if ( custom_author_name === '' ) {
            customAuthorName = postAuthor;
        }

        const regex = /is-style-(\S*)/g;
        let m = regex.exec( className );
        let classNames = m !== null ? [ className, `header-content-align-${ headerContentAlign }`, loadingClass, hideRecipeImgClass ] : [ className, `is-style-${ style }`, `header-content-align-${ headerContentAlign }`, loadingClass, hideRecipeImgClass ];

        let printStyles = [];

        if ( '' != primary_color ) {
            if ( 'default' === style || 'simple' === style ) {
                printStyles = {
                    'background-color': `${ primary_color }`,
                };
            } else if ( 'newdesign' === style ) {
                printStyles = {
                    'background-color': `${ primary_color }`,
                    'box-shadow': `0 5px 40px ${ primary_color }`
                };
            }
        }

        const RecipeCardClassName = classNames.filter( ( item ) => item ).join( " " );
        const PrintClasses = [ "wpzoom-recipe-card-print-link" ].filter( ( item ) => item ).join( " " );
        const PinterestClasses = [ "wpzoom-recipe-card-pinit" ].filter( ( item ) => item ).join( " " );
        const pinitURL = `https://www.pinterest.com/pin/create/button/?url=${ postPermalink }&media=${ get( image, [ 'url' ] ) || get( postThumbnail, [ 'url' ] ) }&description=${ pin_description }`;

        return (
            <div className={ RecipeCardClassName } id={ id }>

                {
                    this.state.isLoading &&
                    <Placeholder
                        className="wpzoom-recipe-card-loading-spinner"
                        label={ __( "Loading...", "wpzoom-recipe-card" ) }
                    >
                        <Spinner />
                    </Placeholder>
                }

                {
                    'simple' !== style &&
                    <Fragment>

                        {
                            ! hasImage &&
                                <Placeholder
                                    icon="format-image"
                                    className="recipe-card-image-placeholder"
                                    label={ __( "Recipe Image", "wpzoom-recipe-card" ) }
                                    instructions={ __( "Select an image file from your library.", "wpzoom-recipe-card" ) }
                                >
                                    <MediaUpload
                                        onSelect={ this.onSelectImage }
                                        allowedTypes={ ALLOWED_MEDIA_TYPES }
                                        value="0"
                                        render={ ( { open } ) => (
                                            <Button
                                                onClick={ open }
                                                isButton="true"
                                                isDefault="true"
                                                isLarge="true"
                                            >
                                                { __( "Media Library", "wpzoom-recipe-card" ) }
                                            </Button>
                                        ) }
                                    />
                                </Placeholder>
                        }
                        {
                            hasImage &&
                            <div className="recipe-card-image-preview">
                                <div className="recipe-card-image">
                                    <figure>
                                        <img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle }/>
                                        <figcaption>
                                            <Disabled>
                                                {
                                                    pin_btn &&
                                                    <div className={ PinterestClasses }>
                                                        <a className="btn-pinit-link no-print" data-pin-do="buttonPin" href={ pinitURL } data-pin-custom="true">
                                                            <i className="icon-pinit-link"></i>
                                                            <span>{ __( "Pin", "wpzoom-recipe-card" ) }</span>
                                                        </a>
                                                    </div>
                                                }
                                                {
                                                    print_btn &&
                                                    <div className={ PrintClasses }>
                                                        <a className="btn-print-link no-print" href={ "#" + id } title={ __( "Print directions...", "wpzoom-recipe-card" ) } style={ printStyles }>
                                                            <i className="icon-print-link"></i>
                                                            <span>{ __( "Print", "wpzoom-recipe-card" ) }</span>
                                                        </a>
                                                    </div>
                                                }
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
                                unstableOnFocus={ () => this.setFocus( "recipeTitle" ) }
                                onChange={ newTitle => setAttributes( { recipeTitle: newTitle } ) }
                                onSetup={ ( ref ) => {
                                    this.editorRefs.recipeTitle = ref;
                                } }
                                placeholder={ __( "Enter the title of your recipe", "wpzoom-recipe-card" ) }
                                keepPlaceholderOnFocus={ true }
                            />
                            {
                                displayAuthor &&
                                <span className="recipe-card-author">
                                    { __( "Recipe by", "wpzoom-recipe-card" ) } { customAuthorName }
                                </span>
                            }
                            {
                                <Fragment key="recipe-card-metadata">
                                    {
                                        displayCourse &&
                                        '1' !== get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
                                        <span className="recipe-card-course">{ __( "Course", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( course ) ? course.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                    }
                                    {
                                        displayCuisine &&
                                        '1' !== get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
                                        <span className="recipe-card-cuisine">{ __( "Cuisine", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( cuisine ) ? cuisine.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                    }
                                    {
                                        displayDifficulty &&
                                        '1' !== get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
                                        <span className="recipe-card-difficulty">{ __( "Difficulty", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( difficulty ) ? difficulty.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                    }
                                </Fragment>
                            }
                            {
                                <Fragment key="recipe-card-terms">
                                    {
                                        displayCourse &&
                                        '1' === get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
                                        <span className="recipe-card-course">{ __( "Course", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
                                    }
                                    {
                                        displayCuisine &&
                                        '1' === get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
                                        <span className="recipe-card-cuisine">{ __( "Cuisine", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
                                    }
                                    {
                                        displayDifficulty &&
                                        '1' === get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
                                        <span className="recipe-card-difficulty">{ __( "Difficulty", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
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
                    'simple' === style &&
                    <div className="recipe-card-header-wrap">

                        {
                            ! hasImage &&
                                <Placeholder
                                    icon="format-image"
                                    className="recipe-card-image-placeholder"
                                    label={ __( "Recipe Image", "wpzoom-recipe-card" ) }
                                    instructions={ __( "Select an image file from your library.", "wpzoom-recipe-card" ) }
                                >
                                    <MediaUpload
                                        onSelect={ this.onSelectImage }
                                        allowedTypes={ ALLOWED_MEDIA_TYPES }
                                        value="0"
                                        render={ ( { open } ) => (
                                            <Button
                                                onClick={ open }
                                                isButton="true"
                                                isDefault="true"
                                                isLarge="true"
                                            >
                                                { __( "Media Library", "wpzoom-recipe-card" ) }
                                            </Button>
                                        ) }
                                    />
                                </Placeholder>
                        }
                        {
                            hasImage &&
                            <div className="recipe-card-image-preview">
                                <div className="recipe-card-image">
                                    <figure>
                                        <img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle }/>
                                        <figcaption>
                                            <Disabled>
                                                {
                                                    pin_btn &&
                                                    <div className={ PinterestClasses }>
                                                        <a className="btn-pinit-link no-print" data-pin-do="buttonPin" href={ pinitURL } data-pin-custom="true">
                                                            <i className="icon-pinit-link"></i>
                                                            <span>{ __( "Pin", "wpzoom-recipe-card" ) }</span>
                                                        </a>
                                                    </div>
                                                }
                                                {
                                                    print_btn &&
                                                    <div className={ PrintClasses }>
                                                        <a className="btn-print-link no-print" href={ "#" + id } title={ __( "Print directions...", "wpzoom-recipe-card" ) } style={ printStyles }>
                                                            <i className="icon-print-link"></i>
                                                            <span>{ __( "Print", "wpzoom-recipe-card" ) }</span>
                                                        </a>
                                                    </div>
                                                }
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
                                    unstableOnFocus={ () => this.setFocus( "recipeTitle" ) }
                                    onChange={ newTitle => setAttributes( { recipeTitle: newTitle } ) }
                                    onSetup={ ( ref ) => {
                                        this.editorRefs.recipeTitle = ref;
                                    } }
                                    placeholder={ __( "Enter the title of your recipe", "wpzoom-recipe-card" ) }
                                    keepPlaceholderOnFocus={ true }
                                />
                                {
                                    displayAuthor &&
                                    <span className="recipe-card-author">
                                        { __( "Recipe by", "wpzoom-recipe-card" ) } { customAuthorName }
                                    </span>
                                }
                                {
                                    <Fragment key="recipe-card-metadata">
                                        {
                                            displayCourse &&
                                            '1' !== get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
                                            <span className="recipe-card-course">{ __( "Course", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( course ) ? course.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                        }
                                        {
                                            displayCuisine &&
                                            '1' !== get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
                                            <span className="recipe-card-cuisine">{ __( "Cuisine", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( cuisine ) ? cuisine.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                        }
                                        {
                                            displayDifficulty &&
                                            '1' !== get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
                                            <span className="recipe-card-difficulty">{ __( "Difficulty", "wpzoom-recipe-card" ) }: <mark>{ ! RichText.isEmpty( difficulty ) ? difficulty.filter( ( item ) => item ).join( ", " ) : __( "Not added", "wpzoom-recipe-card" ) }</mark></span>
                                        }
                                    </Fragment>
                                }
                                {
                                    <Fragment key="recipe-card-terms">
                                        {
                                            displayCourse &&
                                            '1' === get( settingOptions, 'wpzoom_rcb_settings_course_taxonomy' ) &&
                                            <span className="recipe-card-course">{ __( "Course", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
                                        }
                                        {
                                            displayCuisine &&
                                            '1' === get( settingOptions, 'wpzoom_rcb_settings_cuisine_taxonomy' ) &&
                                            <span className="recipe-card-cuisine">{ __( "Cuisine", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
                                        }
                                        {
                                            displayDifficulty &&
                                            '1' === get( settingOptions, 'wpzoom_rcb_settings_difficulty_taxonomy' ) &&
                                            <span className="recipe-card-difficulty">{ __( "Difficulty", "wpzoom-recipe-card" ) }: <mark>{ this.renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
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
                    unstableOnFocus={ () => this.setFocus( "summary" ) }
                    onChange={ ( newSummary ) => setAttributes( { summary: newSummary, jsonSummary: stripHTML( renderToString( newSummary ) ) } ) }
                    onSetup={ ( ref ) => {
                        this.editorRefs.summary = ref;
                    } }
                    placeholder={ __( "Enter a short recipe description.", "wpzoom-recipe-card" ) }
                    keepPlaceholderOnFocus={ true }
                />
                <Ingredient
                    generateId={ generateId }
                    isRecipeCardSelected={ this.props.isRecipeCardSelected }
                    { ...{ attributes, setAttributes, className } }
                />
                <Direction
                    generateId={ generateId }
                    isRecipeCardSelected={ this.props.isRecipeCardSelected }
                    { ...{ attributes, setAttributes, className } }
                />
                <div className="recipe-card-video">
                    <RichText
                        tagName="h3"
                        className="video-title"
                        format="string"
                        value={ videoTitle }
                        unstableOnFocus={ () => this.setFocus( "videoTitle" ) }
                        onChange={ ( videoTitle ) => setAttributes( { videoTitle } ) }
                        onSetup={ ( ref ) => {
                            this.editorRefs.videoTitle = ref;
                        } }
                        placeholder={ __( "Write Recipe Video title", "wpzoom-recipe-card" ) }
                        keepPlaceholderOnFocus={ true }
                    />
                    {
                        ! hasVideo &&
                        <Placeholder
                            icon="video-alt3"
                            className="wpzoom-recipe-card-video-placeholder"
                            instructions={ __( "You can add a video here from Recipe Card Video Settings in the right sidebar", "wpzoom-recipe-card" ) }
                            label={ __( "Recipe Card Video", "wpzoom-recipe-card" ) }
                        />
                    }
                    {
                        hasVideo &&
                        'embed' === videoType &&
                        <Fragment>
                            <ReactPlayer
                                width="100%"
                                height="340px"
                                url={ get( video, 'url' ) }
                            />
                        </Fragment>
                    }
                    {
                        hasVideo &&
                        'self-hosted' === videoType &&
                        <Fragment>
                            <video
                                controls={ get( video, 'settings.controls' ) }
                                poster={ get( video, 'poster.url' ) }
                                src={ get( video, 'url' ) }
                            />
                        </Fragment>
                    }
                </div>
                <div className="recipe-card-notes">
                    <RichText
                        tagName="h3"
                        className="notes-title"
                        format="string"
                        value={ notesTitle }
                        unstableOnFocus={ () => this.setFocus( "notesTitle" ) }
                        onChange={ ( notesTitle ) => setAttributes( { notesTitle } ) }
                        onSetup={ ( ref ) => {
                            this.editorRefs.notesTitle = ref;
                        } }
                        placeholder={ __( "Write Notes title", "wpzoom-recipe-card" ) }
                        keepPlaceholderOnFocus={ true }
                    />
                    <RichText
                        className="recipe-card-notes-list"
                        tagName="ul"
                        multiline="li"
                        value={ notes }
                        unstableOnFocus={ () => this.setFocus( "notes" ) }
                        onChange={ ( newNote ) => setAttributes( { notes: newNote } ) }
                        onSetup={ ( ref ) => {
                            this.editorRefs.notes = ref;
                        } }
                        placeholder={ __( "Enter Note text for your recipe.", "wpzoom-recipe-card" ) }
                        keepPlaceholderOnFocus={ true }
                    />
                    <p className="description">{ __( "Press Enter to add new note.", "wpzoom-recipe-card" ) }</p>
                </div>
                <FoodLabels
                    location="bottom"
                    { ...{ attributes, setAttributes } }
                />
                <CallToAction/>
                <Inspector
                    media={ this.props.media }
                    categories={ this.props.categories }
                    postTitle={ postTitle }
                    postType={ postType }
                    postAuthor={ postAuthor }
                    imageSizes={ this.props.imageSizes }
                    maxWidth={ this.props.maxWidth }
                    isRTL={ this.props.isRTL }
                    hintLoading={ this.hintLoading }
                    settingOptions={ settingOptions }
                    coursesTaxonomy={ coursesTaxonomy }
                    cuisinesTaxonomy={ cuisinesTaxonomy }
                    difficultiesTaxonomy={ difficultiesTaxonomy }
                    { ...{ attributes, setAttributes, className } }
                />
                <BlockControls>
                    <ExtraOptionsModal
                        ingredients={ this.props.attributes.ingredients }
                        steps={ this.props.attributes.steps }
                        setAttributes={ this.props.setAttributes }
                        onBulkAdd={ this.onBulkAdd }
                    />
                </BlockControls>
            </div>
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
        getPostType,
        getAuthors
    } = select( 'core' );

    const {
        getEditedPostAttribute,
        getEditorSettings,
        getPermalink,
        getSelectedBlock
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

    const getAuthorData = ( authors, path = '' ) => {
        let postAuthor = getEditedPostAttribute( 'author' );
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
    }

    const selectedBlock = getSelectedBlock();
    const isRecipeCardSelected = get( selectedBlock, 'name' ) === "wpzoom-recipe-card/block-recipe-card";

    const postType = getPostType( getEditedPostAttribute( 'type' ) );
    const postPermalink = getPermalink();
    const categories = getEditedPostAttribute( 'categories' );
    const tags = getEditedPostAttribute( 'tags' );
    const postTitle = getEditedPostAttribute( 'title' );
    const featuredImageId = getEditedPostAttribute( 'featured_media' );
    const authors = getAuthors();
    const postAuthor = getAuthorData( authors, 'name' );

    let id = 0;
    let terms = {};
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
            if ( !isUndefined( coursesTaxonomy ) ) {
                coursesTaxonomy['visibility']['custom_show_ui'] = true;
                terms[coursesTaxonomy.rest_base] = getEditedPostAttribute( coursesTaxonomy.rest_base );
            }
        }
        if ( '1' === get( setting_options, 'wpzoom_rcb_settings_cuisine_taxonomy' ) ) {
            cuisinesTaxonomy = getTaxonomy( 'wpzoom_rcb_cuisines' );
            if ( !isUndefined( cuisinesTaxonomy ) ) {
                cuisinesTaxonomy['visibility']['custom_show_ui'] = true;
                terms[cuisinesTaxonomy.rest_base] = getEditedPostAttribute( cuisinesTaxonomy.rest_base );
            }
        }
        if ( '1' === get( setting_options, 'wpzoom_rcb_settings_difficulty_taxonomy' ) ) {
            difficultiesTaxonomy = getTaxonomy( 'wpzoom_rcb_difficulties' );
            if ( !isUndefined( difficultiesTaxonomy ) ) {
                difficultiesTaxonomy['visibility']['custom_show_ui'] = true;
                terms[difficultiesTaxonomy.rest_base] = getEditedPostAttribute( difficultiesTaxonomy.rest_base );
            }
        }
    }

    return {
        media: id ? getMedia( id ) : false,
        postTitle,
        postType,
        postPermalink,
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
        isRecipeCardSelected
    };
} );

export default compose(
    applyWithSelect
)( RecipeCard );

