/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import {
    blockColors,
    accentBgColors,
    accentColors,
    pinterestBackgroundColors,
    pinterestTextColors,
    printBackgroundColors,
    printTextColors,
    metaTextColors,
    titleColors,
} from './shared/colors-palette';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
    BaseControl,
    PanelBody,
    ColorPalette,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Recipe Card Color Scheme', 'wpzoom-recipe-card' );

const ColorScheme = ( props ) => {
    const {
        attributes,
        onChangeSettings,
        activeStyle,
    } = props;

    const {
        id,
        settings: {
            0: {
                primary_color,
                accent_bg_color_header,
                accent_text_color_header,
                image_border_color,
                meta_color,
                recipe_title_color,
                pinterest_bg_color,
                pinterest_text_color,
                print_bg_color,
                print_text_color,
                rating_stars_color,
                hide_header_image,
                print_btn,
                pin_btn,
            },
        },
    } = attributes;

    return (
        <PanelBody className="wpzoom-recipe-card-color-scheme" initialOpen={ true } title={ PANEL_TITLE }>
            { 'accent-color-header' !== activeStyle.name &&
                <BaseControl
                    id={ `${ id }-primary-color` }
                    label={ __( 'Primary Color', 'wpzoom-recipe-card' ) }
                >
                    <ColorPalette
                        colors={ blockColors }
                        value={ primary_color }
                        onChange={ ( color ) => onChangeSettings( color, 'primary_color' ) }
                    />
                </BaseControl>
            }
            { 'accent-color-header' === activeStyle.name &&
                <Fragment>
                    <BaseControl
                        id={ `${ id }-bg-accent-color-header` }
                        label={ __( 'Accent Color Background', 'wpzoom-recipe-card' ) }
                        help={ __( 'Default color is based on selected Primary Color.', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ accentBgColors }
                            value={ accent_bg_color_header || get( accentBgColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'accent_bg_color_header' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-text-accent-color-header` }
                        label={ __( 'Accent Color Text', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ accentColors }
                            value={ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'accent_text_color_header' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-title-accent-color-header` }
                        label={ __( 'Title Color', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ titleColors }
                            value={ recipe_title_color || accent_text_color_header || get( titleColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'recipe_title_color' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-image-border-accent-color-header` }
                        label={ __( 'Image Border Color', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ accentColors }
                            value={ image_border_color || accent_text_color_header || get( accentColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'image_border_color' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-meta-accent-color-header` }
                        label={ __( 'Meta Color', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ metaTextColors }
                            value={ meta_color || accent_text_color_header || get( metaTextColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'meta_color' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-rating-stars-accent-color-header` }
                        label={ __( 'Rating Stars Color', 'wpzoom-recipe-card' ) }
                    >
                        <ColorPalette
                            colors={ [ { color: rating_stars_color || accent_text_color_header || get( accentColors, [ 0, 'color' ] ) } ] }
                            value={ rating_stars_color || accent_text_color_header || get( accentColors, [ 0, 'color' ] ) }
                            onChange={ ( color ) => onChangeSettings( color, 'rating_stars_color' ) }
                        />
                    </BaseControl>
                </Fragment>
            }
            {
                ! hide_header_image &&
                <Fragment>
                    { 'accent-color-header' === activeStyle.name && print_btn &&
                        <Fragment>
                            <BaseControl
                                id={ `${ id }-bg-color-print-button` }
                                label={ __( 'Print Button Background Color', 'wpzoom-recipe-card' ) }
                            >
                                <ColorPalette
                                    colors={ printBackgroundColors }
                                    value={ print_bg_color || get( printBackgroundColors, [ 0, 'color' ] ) }
                                    onChange={ ( color ) => onChangeSettings( color, 'print_bg_color' ) }
                                />
                            </BaseControl>
                            <BaseControl
                                id={ `${ id }-text-color-print-button` }
                                label={ __( 'Print Button Text Color', 'wpzoom-recipe-card' ) }
                            >
                                <ColorPalette
                                    colors={ printTextColors }
                                    value={ print_text_color || get( printTextColors, [ 0, 'color' ] ) }
                                    onChange={ ( color ) => onChangeSettings( color, 'print_text_color' ) }
                                />
                            </BaseControl>
                        </Fragment>
                    }
                    { 'accent-color-header' === activeStyle.name && pin_btn &&
                        <Fragment>
                            <BaseControl
                                id={ `${ id }-bg-pin-button` }
                                label={ __( 'Pinterest Button Background', 'wpzoom-recipe-card' ) }
                            >
                                <ColorPalette
                                    colors={ pinterestBackgroundColors }
                                    value={ pinterest_bg_color || get( pinterestBackgroundColors, [ 0, 'color' ] ) }
                                    onChange={ ( color ) => onChangeSettings( color, 'pinterest_bg_color' ) }
                                />
                            </BaseControl>
                            <BaseControl
                                id={ `${ id }-text-accent-color-header` }
                                label={ __( 'Pinterest Button Text Color', 'wpzoom-recipe-card' ) }
                            >
                                <ColorPalette
                                    colors={ pinterestTextColors }
                                    value={ pinterest_text_color || get( pinterestTextColors, [ 0, 'color' ] ) }
                                    onChange={ ( color ) => onChangeSettings( color, 'pinterest_text_color' ) }
                                />
                            </BaseControl>
                        </Fragment>
                    }
                </Fragment>
            }
        </PanelBody>
    );
};

export default ColorScheme;
