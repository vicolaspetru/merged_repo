/*global wpzoomRecipeCard*/

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Module constants
 */
const { setting_options, pluginURL } = wpzoomRecipeCard;
const { wpzoom_rcb_settings_template } = setting_options;

export const blockKeywords = [
    __( 'Recipe Card', 'wpzoom-recipe-card' ),
    __( 'Premium Recipe Card', 'wpzoom-recipe-card' ),
    __( 'WPZOOM', 'wpzoom-recipe-card' ),
];

export const blockExample = {
    attributes: {
        recipeTitle: __( 'Your recipe title goes here', 'wpzoom-recipe-card' ),
        hasImage: true,
        image: {
            id: 0,
            url: pluginURL + 'dist/assets/images/examples/recipe-card-image-example-1.jpg',
        },
        course: [ __( 'Main', 'wpzoom-recipe-card' ) ],
        cuisine: [ __( 'Italian', 'wpzoom-recipe-card' ) ],
        difficulty: [ __( 'Medium', 'wpzoom-recipe-card' ) ],
    },
};

export const blockStyles = [
    {
        name: 'default',
        label: __( 'Default', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'default',
    },
    {
        name: 'newdesign',
        label: __( 'New Design', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'newdesign',
    },
    {
        name: 'simple',
        label: __( 'Simple Design', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'simple',
    },
    {
        name: 'accent-color-header',
        label: __( 'Accent Color Header', 'wpzoom-recipe-card' ),
        isDefault: wpzoom_rcb_settings_template === 'accent-color-header',
    },
];
