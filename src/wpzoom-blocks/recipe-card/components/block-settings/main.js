/**
 * External dependencies
 */
import {
    get,
    isEmpty,
} from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { MediaUpload } from '@wordpress/block-editor';
import {
    BaseControl,
    PanelBody,
    ToggleControl,
    TextControl,
    TextareaControl,
    Button,
    SelectControl,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Recipe Card Settings', 'wpzoom-recipe-card' );
const ALLOWED_MEDIA_TYPES = [ 'image' ];

const MainSettings = ( props ) => {
    const {
        attributes,
        settingOptions,
        getImageSizeOptions,
        onUpdateURL,
        onSelectImage,
        onRemoveImage,
        onSelectPinImage,
        onRemovePinImage,
        onChangeSettings,
        activeStyle,
    } = props;

    const {
        id,
        hasImage,
        image,
        recipeTitle,
        settings: {
            0: {
                hide_header_image,
                print_btn,
                pin_btn,
                pin_has_custom_image,
                pin_custom_image,
                pin_custom_text,
                custom_author_name,
                displayAuthor,
                headerAlign,
                ingredientsLayout,
            },
        },
    } = attributes;

    const imageSizeOptions = getImageSizeOptions;

    const pinCustomImage = (
        <img
            className={ `${ id }-pinit-custom-image` }
            src={ get( pin_custom_image, [ 'sizes', 'full', 'url' ] ) || get( pin_custom_image, [ 'url' ] ) }
            alt={ get( pin_custom_image, [ 'alt' ] ) || recipeTitle }
        />
    );

    const selectPinImageClassNames = classnames( {
        'editor-post-featured-image__preview': pin_has_custom_image,
        'editor-post-featured-image__toggle': ! pin_has_custom_image,
    } );

    return (
        <PanelBody className="wpzoom-recipe-card-settings" initialOpen={ true } title={ PANEL_TITLE }>
            <BaseControl
                id={ `${ id }-image` }
                className="editor-post-featured-image"
                label={ __( 'Recipe Card Image (required)', 'wpzoom-recipe-card' ) }
                help={ __( 'Upload image for Recipe Card.', 'wpzoom-recipe-card' ) }
            >
                {
                    ! hasImage &&
                    <MediaUpload
                        onSelect={ onSelectImage }
                        allowedTypes={ ALLOWED_MEDIA_TYPES }
                        value={ get( image, [ 'id' ] ) }
                        render={ ( { open } ) => (
                            <Button
                                className="editor-post-featured-image__toggle"
                                onClick={ open }
                            >
                                { __( 'Add Recipe Image', 'wpzoom-recipe-card' ) }
                            </Button>
                        ) }
                    />
                }
                {
                    hasImage &&
                    <Fragment>
                        <MediaUpload
                            onSelect={ onSelectImage }
                            allowedTypes={ ALLOWED_MEDIA_TYPES }
                            value={ get( image, [ 'id' ] ) }
                            render={ ( { open } ) => (
                                <Button
                                    className="editor-post-featured-image__preview"
                                    onClick={ open }
                                >
                                    <img
                                        className={ `${ id }-image` }
                                        src={ get( image, [ 'sizes', 'full', 'url' ] ) || get( image, [ 'sizes', 'full', 'source_url' ] ) || get( image, [ 'url' ] ) || get( image, [ 'source_url' ] ) }
                                        alt={ get( image, [ 'alt' ] ) || recipeTitle }
                                    />
                                </Button>
                            ) }
                        />
                        <MediaUpload
                            onSelect={ onSelectImage }
                            allowedTypes={ ALLOWED_MEDIA_TYPES }
                            value={ get( image, [ 'id' ] ) }
                            render={ ( { open } ) => (
                                <Button
                                    isSecondary
                                    isLarge
                                    onClick={ open }
                                >
                                    { __( 'Replace Image', 'wpzoom-recipe-card' ) }
                                </Button>
                            ) }
                        />
                        <Button isLink="true" isDestructive="true" onClick={ onRemoveImage }>{ __( 'Remove Recipe Image', 'wpzoom-recipe-card' ) }</Button>
                    </Fragment>
                }
            </BaseControl>
            {
                hasImage &&
                ! isEmpty( imageSizeOptions ) &&
                <SelectControl
                    label={ __( 'Image Size', 'wpzoom-recipe-card' ) }
                    value={ get( image, [ 'url' ] ) }
                    options={ imageSizeOptions }
                    onChange={ onUpdateURL }
                />
            }
            <BaseControl
                id={ `${ id }-hide-header-image` }
                label={ __( 'Hide Recipe Image on Front-End', 'wpzoom-recipe-card' ) }
            >
                <ToggleControl
                    label={ __( 'Hide Image', 'wpzoom-recipe-card' ) }
                    checked={ hide_header_image }
                    onChange={ ( display ) => onChangeSettings( display, 'hide_header_image' ) }
                />
            </BaseControl>
            {
                ! hide_header_image &&
                <Fragment>
                    <BaseControl
                        id={ `${ id }-print-btn` }
                        label={ __( 'Print Button', 'wpzoom-recipe-card' ) }
                    >
                        <ToggleControl
                            label={ __( 'Display Print Button', 'wpzoom-recipe-card' ) }
                            checked={ print_btn }
                            onChange={ ( display ) => onChangeSettings( display, 'print_btn' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-pinit-btn` }
                        label={ __( 'Pinterest Button', 'wpzoom-recipe-card' ) }
                    >
                        <ToggleControl
                            label={ __( 'Display Pinterest Button', 'wpzoom-recipe-card' ) }
                            checked={ pin_btn }
                            onChange={ ( display ) => onChangeSettings( display, 'pin_btn' ) }
                        />
                    </BaseControl>
                </Fragment>
            }
            {
                ! hide_header_image &&
                pin_btn &&
                'custom_image' === get( settingOptions, 'wpzoom_rcb_settings_pin_image' ) &&
                <BaseControl
                    id={ `${ id }-pinit-custom-image` }
                    label={ __( 'Pinterest Custom Image', 'wpzoom-recipe-card' ) }
                >
                    <MediaUpload
                        onSelect={ onSelectPinImage }
                        allowedTypes={ ALLOWED_MEDIA_TYPES }
                        value={ get( pin_custom_image, [ 'id' ] ) }
                        render={ ( { open } ) => (
                            <Button
                                className={ selectPinImageClassNames }
                                onClick={ open }
                            >
                                { pin_has_custom_image ? pinCustomImage : __( 'Add Pin custom image', 'wpzoom-recipe-card' ) }
                            </Button>
                        ) }
                    />
                    { pin_has_custom_image &&
                        <Button isLink="true" isDestructive="true" onClick={ onRemovePinImage }>{ __( 'Remove Image', 'wpzoom-recipe-card' ) }</Button>
                    }
                </BaseControl>
            }
            {
                ! hide_header_image &&
                pin_btn &&
                'custom_text' === get( settingOptions, 'wpzoom_rcb_settings_pin_description' ) &&
                <TextareaControl
                    id={ `${ id }-pinit-custom-text` }
                    instanceId={ `${ id }-pinit-custom-text` }
                    type="text"
                    label={ __( 'Pinterest Custom Description', 'wpzoom-recipe-card' ) }
                    value={ pin_custom_text }
                    onChange={ ( customText ) => onChangeSettings( customText, 'pin_custom_text' ) }
                />
            }
            {
                'simple' !== activeStyle &&
                'accent-color-header' !== activeStyle &&
                <BaseControl
                    id={ `${ id }-heading-align` }
                    label={ __( 'Header Content Align', 'wpzoom-recipe-card' ) }
                >
                    <SelectControl
                        label={ __( 'Select Alignment', 'wpzoom-recipe-card' ) }
                        value={ headerAlign }
                        options={ [
                            { label: __( 'Left' ), value: 'left' },
                            { label: __( 'Center' ), value: 'center' },
                            { label: __( 'Right' ), value: 'right' },
                        ] }
                        onChange={ ( alignment ) => onChangeSettings( alignment, 'headerAlign' ) }
                    />
                </BaseControl>
            }
            <BaseControl
                id={ `${ id }-author` }
                label={ __( 'Author', 'wpzoom-recipe-card' ) }
            >
                <ToggleControl
                    label={ __( 'Display Author', 'wpzoom-recipe-card' ) }
                    checked={ displayAuthor }
                    onChange={ ( display ) => onChangeSettings( display, 'displayAuthor' ) }
                />
                {
                    displayAuthor &&
                    <TextControl
                        id={ `${ id }-custom-author-name` }
                        instanceId={ `${ id }-custom-author-name` }
                        type="text"
                        label={ __( 'Custom author name', 'wpzoom-recipe-card' ) }
                        help={ __( 'Default: Post author name', 'wpzoom-recipe-card' ) }
                        value={ custom_author_name }
                        onChange={ ( authorName ) => onChangeSettings( authorName, 'custom_author_name' ) }
                    />
                }
            </BaseControl>
            {
                'newdesign' === activeStyle &&
                    <BaseControl
                        id={ `${ id }-ingredients-layout` }
                        label={ __( 'Ingredients Layout', 'wpzoom-recipe-card' ) }
                    >
                        <SelectControl
                            label={ __( 'Select Layout', 'wpzoom-recipe-card' ) }
                            help={ __( 'This setting is visible only on Front-End. In Editor still appears in one column to prevent floating elements on editing.', 'wpzoom-recipe-card' ) }
                            value={ ingredientsLayout }
                            options={ [
                                { label: __( '1 column' ), value: '1-column' },
                                { label: __( '2 columns' ), value: '2-columns' },
                            ] }
                            onChange={ ( size ) => onChangeSettings( size, 'ingredientsLayout' ) }
                        />
                    </BaseControl>
            }
        </PanelBody>
    );
};

export default MainSettings;
