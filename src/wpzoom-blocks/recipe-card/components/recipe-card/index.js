/*global wpzoomRecipeCard*/

/**
 * External dependencies
 */
import {
    get,
    map,
    find,
    invoke,
    isEmpty,
    isUndefined,
} from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import SkinDefault from '../../skins/default';
import SkinSimple from '../../skins/simple';
import SkinNewDesign from '../../skins/new-design';
import SkinAccentColorHeader from '../../skins/accent-color-header';
import loadingSpinnerPlaceholder from '../../skins/shared/spinner';
import Inspector from '../block-settings';
import ExtraOptionsModal from '../bulk';
import { pickRelevantMediaFiles } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Component,
    Fragment,
} from '@wordpress/element';
import {
    RichText,
    BlockControls,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { withSelect } from '@wordpress/data';
import { withNotices } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { positionLeft, positionRight, positionCenter } from '@wordpress/icons';
import TokenList from '@wordpress/token-list';

/**
 * Module Constants
 */
const {
    setting_options,
    license_status,
    pluginURL,
} = wpzoomRecipeCard;
const { wpzoom_rcb_settings_template } = setting_options;

const DEFAULT_QUERY = {
    per_page: -1,
    orderby: 'name',
    order: 'asc',
    _fields: 'id,name,parent',
};

const BLOCK_ALIGNMENT_CONTROLS = [
    {
        icon: positionLeft,
        title: __( 'Align block left', 'wpzoom-recipe-card' ),
        align: 'left',
    },
    {
        icon: positionCenter,
        title: __( 'Align block center', 'wpzoom-recipe-card' ),
        align: 'center',
    },
    {
        icon: positionRight,
        title: __( 'Align block right', 'wpzoom-recipe-card' ),
        align: 'right',
    },
];

const layoutOptions = [
    {
        name: 'default',
        label: __( 'Default', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'default',
    },
    {
        name: 'simple',
        label: __( 'Simple', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'simple',
    },
    {
        name: 'newdesign',
        label: __( 'New Design', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'newdesign',
    },
    {
        name: 'accent-color-header',
        label: __( 'Accent Header', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'accent-color-header',
    },
];

/**
 * Returns the active style from the given className.
 *
 * @param {Array} styles Block style variations.
 * @param {string} className  Class name
 *
 * @return {Object?} The active style.
 */
function getActiveStyle( styles, className ) {
    for ( const style of new TokenList( className ).values() ) {
        if ( style.indexOf( 'is-style-' ) === -1 ) {
            continue;
        }

        const potentialStyleName = style.substring( 9 );
        const activeStyle = find( styles, { name: potentialStyleName } );

        if ( activeStyle ) {
            return activeStyle;
        }
    }

    return find( styles, { isDefault: true } );
}

/**
 * Replaces the active style in the block's className.
 *
 * @param {string}  className   Class name.
 * @param {Object?} activeStyle The replaced style.
 * @param {Object}  newStyle    The replacing style.
 *
 * @return {string} The updated className.
 */
function replaceActiveStyle( className, activeStyle, newStyle ) {
    const list = new TokenList( className );

    if ( activeStyle ) {
        list.remove( 'is-style-' + activeStyle.name );
    }

    list.add( 'is-style-' + newStyle.name );

    return list.value;
}

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
        this.renderTerms = this.renderTerms.bind( this );
        this.onChangeAlignment = this.onChangeAlignment.bind( this );
        this.updateStyle = this.updateStyle.bind( this );

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
            attributes,
            coursesTaxonomy,
            cuisinesTaxonomy,
            difficultiesTaxonomy,
        } = this.props;
        const activeStyle = getActiveStyle( layoutOptions, attributes.className );
        const lastActiveStyle = getActiveStyle(
            layoutOptions,
            prevProps.attributes.className
        );

        if ( activeStyle !== lastActiveStyle ) {
            // if ('circle' === activeStyle.name && (typeof attributes.alignment === 'undefined' || attributes.alignment === 'none')) {
            //     this.onChangeAlignment('center');
            // }
        }

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

    updateStyle( style ) {
        const { className, attributes } = this.props;

        const activeStyle = getActiveStyle( layoutOptions, className );
        const updatedClassName = replaceActiveStyle(
            attributes.className,
            activeStyle,
            style
        );

        this.props.setAttributes( { className: updatedClassName } );
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
        const activeStyle = getActiveStyle( layoutOptions, this.props.className );
        let sizeSlug = 'wpzoom-rcb-block-header';

        if ( 'simple' === activeStyle.name || 'accent-color-header' === activeStyle.name ) {
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

    /**
     * Change block alignment
     *
     * @since 2.8.4
     * @param  {string} newAlignment     The new alignment value
     * @return {void}                    Update attributes to set newAlignment
     */
    onChangeAlignment( newAlignment ) {
        const {
            className,
            attributes: {
                settings,
                blockAlignment,
            },
        } = this.props;
        const { 0: { headerAlign } } = settings;
        const activeStyle = getActiveStyle( layoutOptions, className );

        const newSettings = settings ? settings.slice() : [];

        newSettings[ 0 ] = {
            ...newSettings[ 0 ],
            headerAlign: newAlignment === undefined ? headerAlign : newAlignment,
        };

        if ( 'simple' === activeStyle.name && 'center' === newAlignment ) {
            newSettings[ 0 ] = {
                ...newSettings[ 0 ],
                headerAlign: 'left',
            };
        }

        this.props.setAttributes( {
            blockAlignment: newAlignment === undefined ? blockAlignment : newAlignment,
            settings: newSettings,
        } );
    }

    render() {
        const {
            attributes,
            className,
            settingOptions: {
                wpzoom_rcb_settings_heading_content_align,
            },
            isRecipeCardSelected,
            noticeUI,
        } = this.props;

        const activeStyle = getActiveStyle( layoutOptions, className );

        const {
            id,
            blockAlignment,
            settings: {
                0: {
                    hide_header_image,
                    headerAlign,
                },
            },
        } = attributes;

        const regex = /is-style-(\S*)/g;
        const m = regex.exec( className );

        let headerContentAlign = headerAlign;
        if ( isUndefined( headerAlign ) ) {
            headerContentAlign = wpzoom_rcb_settings_heading_content_align;
        }
        if ( 'simple' === activeStyle.name && 'center' === blockAlignment ) {
            headerContentAlign = 'left';
        }

        const RecipeCardClassName = classnames(
            className,
            `block-alignment-${ blockAlignment }`, {
                'is-loading-block': this.state.isLoading,
                'recipe-card-noimage': hide_header_image,
                [ `header-content-align-${ headerContentAlign }` ]: ! isEmpty( headerContentAlign ),
                [ `is-style-${ activeStyle.name }` ]: m === null,
            }
        );

        return (
            <Fragment>
                { isRecipeCardSelected && (
                    <Inspector
                        activeStyle={ activeStyle }
                        layoutOptions={ layoutOptions }
                        onUpdateStyle={ this.updateStyle }
                        { ...this.props }
                    />
                ) }
                { isRecipeCardSelected && (
                    <BlockControls>
                        <AlignmentToolbar
                            isRTL={ this.props.isRTL }
                            alignmentControls={ BLOCK_ALIGNMENT_CONTROLS }
                            label={ __( 'Change Block Alignment', 'wpzoom-recipe-card' ) }
                            value={ blockAlignment }
                            onChange={ this.onChangeAlignment }
                        />
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

                    { 'default' === activeStyle.name && (
                        <SkinDefault
                            setFocus={ this.setFocus }
                            renderTerms={ this.renderTerms }
                            onUploadError={ this.onUploadError }
                            onSelectImage={ this.onSelectImage }
                            activeStyle={ activeStyle }
                            { ...this.props }
                        />
                    ) }

                    { 'simple' === activeStyle.name && (
                        <SkinSimple
                            setFocus={ this.setFocus }
                            renderTerms={ this.renderTerms }
                            onUploadError={ this.onUploadError }
                            onSelectImage={ this.onSelectImage }
                            activeStyle={ activeStyle }
                            { ...this.props }
                        />
                    ) }

                    { 'newdesign' === activeStyle.name && (
                        <SkinNewDesign
                            setFocus={ this.setFocus }
                            renderTerms={ this.renderTerms }
                            onUploadError={ this.onUploadError }
                            onSelectImage={ this.onSelectImage }
                            activeStyle={ activeStyle }
                            { ...this.props }
                        />
                    ) }

                    { 'accent-color-header' === activeStyle.name && (
                        <SkinAccentColorHeader
                            setFocus={ this.setFocus }
                            renderTerms={ this.renderTerms }
                            onUploadError={ this.onUploadError }
                            onSelectImage={ this.onSelectImage }
                            activeStyle={ activeStyle }
                            { ...this.props }
                        />
                    ) }

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

