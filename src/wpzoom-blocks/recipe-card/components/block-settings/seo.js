/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import PostTaxonomies from '../post-taxonomies';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    BaseControl,
    PanelBody,
    ToggleControl,
    FormTokenField,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Recipe Card SEO Settings', 'wpzoom-recipe-card' );

const coursesToken = [
    __( 'Appetizers', 'wpzoom-recipe-card' ),
    __( 'Snacks', 'wpzoom-recipe-card' ),
    __( 'Breakfast', 'wpzoom-recipe-card' ),
    __( 'Brunch', 'wpzoom-recipe-card' ),
    __( 'Dessert', 'wpzoom-recipe-card' ),
    __( 'Drinks', 'wpzoom-recipe-card' ),
    __( 'Dinner', 'wpzoom-recipe-card' ),
    __( 'Main', 'wpzoom-recipe-card' ),
    __( 'Lunch', 'wpzoom-recipe-card' ),
    __( 'Salads', 'wpzoom-recipe-card' ),
    __( 'Sides', 'wpzoom-recipe-card' ),
    __( 'Soups', 'wpzoom-recipe-card' ),
];

const cuisinesToken = [
    __( 'American', 'wpzoom-recipe-card' ),
    __( 'Chinese', 'wpzoom-recipe-card' ),
    __( 'French', 'wpzoom-recipe-card' ),
    __( 'Indian', 'wpzoom-recipe-card' ),
    __( 'Italian', 'wpzoom-recipe-card' ),
    __( 'Japanese', 'wpzoom-recipe-card' ),
    __( 'Mediterranean', 'wpzoom-recipe-card' ),
    __( 'Mexican', 'wpzoom-recipe-card' ),
    __( 'Southern', 'wpzoom-recipe-card' ),
    __( 'Thai', 'wpzoom-recipe-card' ),
    __( 'Other world cuisine', 'wpzoom-recipe-card' ),
];

const difficultyToken = [
    __( 'Easy', 'wpzoom-recipe-card' ),
    __( 'Medium', 'wpzoom-recipe-card' ),
    __( 'Difficult', 'wpzoom-recipe-card' ),
];

const keywordsToken = [];

const SEOSettings = ( props ) => {
    const {
        attributes,
        setAttributes,
        coursesTaxonomy,
        cuisinesTaxonomy,
        difficultiesTaxonomy,
        settingOptions,
        onChangeSettings,
    } = props;

    const {
        id,
        course,
        cuisine,
        difficulty,
        keywords,
        settings: {
            0: {
                displayCourse,
                displayCuisine,
                displayDifficulty,
            },
        },
    } = attributes;

    return (
        <PanelBody className="wpzoom-recipe-card-seo-settings" initialOpen={ true } title={ PANEL_TITLE }>
            <BaseControl
                id={ `${ id }-course` }
                label={ __( 'Course (required)', 'wpzoom-recipe-card' ) }
                help={ __( 'The post category is added by default.', 'wpzoom-recipe-card' ) }
            >
                <ToggleControl
                    label={ __( 'Display Course', 'wpzoom-recipe-card' ) }
                    checked={ displayCourse }
                    onChange={ ( display ) => onChangeSettings( display, 'displayCourse' ) }
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
                        label={ __( 'Add course', 'wpzoom-recipe-card' ) }
                        value={ course }
                        suggestions={ coursesToken }
                        onChange={ ( newCourse ) => setAttributes( { course: newCourse } ) }
                        placeholder={ __( 'Type course and press Enter', 'wpzoom-recipe-card' ) }
                    />
                }
            </BaseControl>
            <BaseControl
                id={ `${ id }-cuisine` }
                label={ __( 'Cuisine (required)', 'wpzoom-recipe-card' ) }
            >
                <ToggleControl
                    label={ __( 'Display Cuisine', 'wpzoom-recipe-card' ) }
                    checked={ displayCuisine }
                    onChange={ ( display ) => onChangeSettings( display, 'displayCuisine' ) }
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
                        label={ __( 'Add cuisine', 'wpzoom-recipe-card' ) }
                        value={ cuisine }
                        suggestions={ cuisinesToken }
                        onChange={ ( newCuisine ) => setAttributes( { cuisine: newCuisine } ) }
                        placeholder={ __( 'Type cuisine and press Enter', 'wpzoom-recipe-card' ) }
                    />
                }
            </BaseControl>
            <BaseControl
                id={ `${ id }-difficulty` }
                label={ __( 'Difficulty', 'wpzoom-recipe-card' ) }
            >
                <ToggleControl
                    label={ __( 'Display Difficulty', 'wpzoom-recipe-card' ) }
                    checked={ displayDifficulty }
                    onChange={ ( display ) => onChangeSettings( display, 'displayDifficulty' ) }
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
                        label={ __( 'Add difficulty level', 'wpzoom-recipe-card' ) }
                        value={ difficulty }
                        suggestions={ difficultyToken }
                        onChange={ ( newDifficulty ) => setAttributes( { difficulty: newDifficulty } ) }
                        placeholder={ __( 'Type difficulty level and press Enter', 'wpzoom-recipe-card' ) }
                    />
                }
            </BaseControl>
            <BaseControl
                id={ `${ id }-keywords` }
                label={ __( 'Keywords (recommended)', 'wpzoom-recipe-card' ) }
                help={ __( 'For multiple keywords add `,` after each keyword (ex: keyword, keyword, keyword). Note: The post tags is added by default.', 'wpzoom-recipe-card' ) }
            >
                <FormTokenField
                    label={ __( 'Add keywords', 'wpzoom-recipe-card' ) }
                    value={ keywords }
                    suggestions={ keywordsToken }
                    onChange={ ( newKeyword ) => setAttributes( { keywords: newKeyword } ) }
                    placeholder={ __( 'Type recipe keywords', 'wpzoom-recipe-card' ) }
                />
            </BaseControl>
        </PanelBody>
    );
};

export default SEOSettings;
