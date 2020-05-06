/**
 * External dependencies
 */
import { get } from 'lodash';
import { hexToCSSFilter } from 'hex-to-css-filter';

/**
 * Internal dependencies
 */
import UploadMediaPlaceholder from '../shared/media-placeholder';
import PrintButton from '../shared/print-button';
import PinterestButton from '../shared/pinterest-button';
import renderMetaData from '../shared/render-meta-data';
import SummaryText from '../../components/summary-text';
import Detail from '../../components/detail';
import Ingredient from '../../components/ingredient';
import Direction from '../../components/direction';
import CallToAction from '../../components/call-to-action';
import FoodLabels from '../../components/food-labels';
import Video from '../../components/video';
import Notes from '../../components/notes';
import { generateId } from '@wpzoom/helpers';
import {
    blockColors,
    accentColors,
    pinterestBackgroundColors,
    pinterestTextColors,
    printBackgroundColors,
    printTextColors,
    metaTextColors,
    titleColors,
} from '../../components/block-settings/shared/colors-palette';
import { getCSSSelector } from '../shared/css-selectors';
import { buildInlineStyle } from '../shared/inline-style';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

/**
 * A Recipe Card block.
 */
class SkinAccentColorHeader extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            className,
            postAuthor,
            settingOptions,
            isRecipeCardSelected,
            renderTerms,
            setFocus,
            activeStyle,
        } = this.props;

        const {
            wpzoom_rcb_settings_course_taxonomy,
            wpzoom_rcb_settings_cuisine_taxonomy,
            wpzoom_rcb_settings_difficulty_taxonomy,
        } = settingOptions;

        const {
            recipeTitle,
            course,
            cuisine,
            difficulty,
            hasImage,
            image,
            settings: {
                0: {
                    primary_color,
                    accent_bg_color_header,
                    accent_text_color_header,
                    recipe_title_color,
                    image_border_color,
                    meta_color,
                    pinterest_bg_color,
                    pinterest_text_color,
                    print_bg_color,
                    print_text_color,
                    hide_header_image,
                    print_btn,
                    pin_btn,
                    custom_author_name,
                    displayCourse,
                    displayCuisine,
                    displayDifficulty,
                    displayAuthor,
                },
            },
        } = attributes;

        let customAuthorName = custom_author_name;
        if ( custom_author_name === '' ) {
            customAuthorName = postAuthor;
        }

        const pinterestIconFilter = ( pinterest_text_color && hexToCSSFilter( pinterest_text_color ) ) || hexToCSSFilter( get( pinterestTextColors, [ 0, 'color' ] ) );
        const printIconFilter = ( print_text_color && hexToCSSFilter( print_text_color ) ) || hexToCSSFilter( get( printTextColors, [ 0, 'color' ] ) );
        const styles = {
            [ getCSSSelector( activeStyle, '.recipe-card-header-container' ) ]: `background-color: ${ accent_bg_color_header || primary_color || get( blockColors, [ 0, 'color' ] ) }; color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-image' ) } figure img` ]: `border: 10px solid ${ image_border_color || accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.recipe-card-title' ) ]: `color: ${ recipe_title_color || accent_text_color_header || get( titleColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.recipe-card-course' ) ]: `color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.recipe-card-cuisine' ) ]: `color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.recipe-card-difficulty' ) ]: `color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-course' ) } mark` ]: `color: ${ meta_color || accent_text_color_header || get( metaTextColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-cuisine' ) } mark` ]: `color: ${ meta_color || accent_text_color_header || get( metaTextColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-difficulty' ) } mark` ]: `color: ${ meta_color || accent_text_color_header || get( metaTextColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-cuisine' ) }::before` ]: `color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ `${ getCSSSelector( activeStyle, '.recipe-card-difficulty' ) }::before` ]: `color: ${ accent_text_color_header || get( accentColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.detail-item-icon' ) ]: `color: ${ accent_bg_color_header || primary_color || get( blockColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.btn-pinit-link' ) ]: `background-color: ${ pinterest_bg_color || get( pinterestBackgroundColors, [ 0, 'color' ] ) }; color: ${ pinterest_text_color || get( pinterestTextColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.btn-print-link' ) ]: `background-color: ${ print_bg_color || get( printBackgroundColors, [ 0, 'color' ] ) }; color: ${ print_text_color || get( printTextColors, [ 0, 'color' ] ) };`,
            [ getCSSSelector( activeStyle, '.icon-pinit-link' ) ]: `filter: ${ get( pinterestIconFilter, 'filter' ) }`,
            [ getCSSSelector( activeStyle, '.icon-print-link' ) ]: `filter: ${ get( printIconFilter, 'filter' ) }`,
        };

        return (
            <Fragment>
                { buildInlineStyle( styles ) }
                <div className="recipe-card-header-container">
                    { ! hasImage && (
                        <UploadMediaPlaceholder
                            image={ image }
                            hasImage={ hasImage }
                            onSelectImage={ this.props.onSelectImage }
                            onUploadError={ this.props.onUploadError }
                            isRecipeCardSelected={ isRecipeCardSelected }
                            noticeUI={ this.props.noticeUI }
                        />
                    ) }
                    { ( ! hide_header_image && hasImage ) && (
                        <div className="recipe-card-image-preview">
                            <div className="recipe-card-image">
                                <figure>
                                    <img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle } />
                                </figure>
                            </div>
                        </div>
                    ) }
                    <RichText
                        className="recipe-card-title"
                        tagName="h2"
                        format="string"
                        value={ recipeTitle }
                        unstableOnFocus={ () => setFocus( 'recipeTitle' ) }
                        onChange={ newTitle => setAttributes( { recipeTitle: newTitle } ) }
                        placeholder={ __( 'Enter the title of your recipe', 'wpzoom-recipe-card' ) }
                        keepPlaceholderOnFocus={ true }
                    />
                    <SummaryText
                        onFocus={ setFocus }
                        { ...{ attributes, setAttributes } }
                    />
                    <Disabled>
                        { pin_btn && (
                            <PinterestButton />
                        ) }
                        { print_btn && (
                            <PrintButton
                                id={ get( attributes, 'id' ) }
                            />
                        ) }
                    </Disabled>
                    <div className="recipe-card-heading">
                        {
                            displayAuthor &&
                            <span className="recipe-card-author">
                                { __( 'Recipe by', 'wpzoom-recipe-card' ) } { customAuthorName }
                            </span>
                        }
                        <Fragment key="recipe-card-metadata">
                            {
                                displayCourse &&
                                '1' !== wpzoom_rcb_settings_course_taxonomy &&
                                <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( course ) }</mark></span>
                            }
                            {
                                displayCuisine &&
                                '1' !== wpzoom_rcb_settings_cuisine_taxonomy &&
                                <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( cuisine ) }</mark></span>
                            }
                            {
                                displayDifficulty &&
                                '1' !== wpzoom_rcb_settings_difficulty_taxonomy &&
                                <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( difficulty ) }</mark></span>
                            }
                        </Fragment>
                        <Fragment key="recipe-card-terms">
                            {
                                displayCourse &&
                                '1' === wpzoom_rcb_settings_course_taxonomy &&
                                <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
                            }
                            {
                                displayCuisine &&
                                '1' === wpzoom_rcb_settings_cuisine_taxonomy &&
                                <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
                            }
                            {
                                displayDifficulty &&
                                '1' === wpzoom_rcb_settings_difficulty_taxonomy &&
                                <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
                            }
                        </Fragment>
                        <p className="description">{ __( 'You can add or edit these details in the Block Options on the right →', 'wpzoom-recipe-card' ) }</p>
                    </div>
                </div>
                <Detail
                    generateId={ generateId }
                    { ...{ attributes, setAttributes, className } }
                />
                <FoodLabels
                    location="top"
                    { ...{ attributes, setAttributes } }
                />
                <Ingredient
                    generateId={ generateId }
                    isRecipeCardSelected={ isRecipeCardSelected }
                    { ...{ attributes, setAttributes, className, activeStyle } }
                />
                <Direction
                    generateId={ generateId }
                    isRecipeCardSelected={ isRecipeCardSelected }
                    { ...{ attributes, setAttributes, className } }
                />
                <Video
                    onFocus={ setFocus }
                    { ...{ attributes, setAttributes } }
                />
                <Notes
                    onFocus={ setFocus }
                    { ...{ attributes, setAttributes } }
                />
                <FoodLabels
                    location="bottom"
                    { ...{ attributes, setAttributes } }
                />
                <CallToAction />
            </Fragment>
        );
    }
}

export default SkinAccentColorHeader;
