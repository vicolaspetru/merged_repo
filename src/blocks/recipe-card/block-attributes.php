<?php
return array(
    'id' => array(
        'type' => 'string',
        'default' => 'wpzoom-premium-recipe-card'
    ),
    'style' => array(
        'type' => 'string',
        'default' => WPZOOM_Settings::get( 'template' ),
    ),
    'image' => array(
        'type' => 'object',
    ),
    'hasImage' => array(
        'type' => 'boolean',
        'default' => false
    ),
    'video' => array(
        'type' => 'object',
    ),
    'hasVideo' => array(
        'type' => 'boolean',
        'default' => false
    ),
    'videoTitle' => array(
        'type' => 'string',
        'selector' => '.video-title',
        'default' => WPZOOM_Settings::get( 'video_title' ),
    ),
    'recipeTitle' => array(
        'type' => 'string',
        'selector' => '.recipe-card-title',
    ),
    'summary' => array(
        'type' => 'string',
        'selector' => '.recipe-card-summary',
        'default' => ''
    ),
    'jsonSummary' => array(
        'type' => 'string',
    ),
    'course' => array(
        'type' => 'array',
        'items' => array(
            'type' => 'string'
        )
    ),
    'cuisine' => array(
        'type' => 'array',
        'items' => array(
            'type' => 'string'
        )
    ),
    'difficulty' => array(
        'type' => 'array',
        'items' => array(
            'type' => 'string'
        )
    ),
    'keywords' => array(
        'type' => 'array',
        'items' => array(
            'type' => 'string'
        )
    ),
    'settings' => array(
        'type' => 'array',
        'default' => array(
            array(
                'primary_color' => WPZOOM_Settings::get( 'primary_color' ),
                'icon_details_color' => '#6d767f',
                'hide_header_image' => false,
                'print_btn' => WPZOOM_Settings::get( 'display_print' ) === '1',
                'pin_btn' => WPZOOM_Settings::get( 'display_pin' ) === '1',
                'pin_has_custom_image' => false,
                'pin_custom_image' => array(),
                'pin_custom_text' => '',
                'custom_author_name' => WPZOOM_Settings::get( 'author_custom_name' ),
                'displayCourse' => WPZOOM_Settings::get( 'display_course' ) === '1',
                'displayCuisine' => WPZOOM_Settings::get( 'display_cuisine' ) === '1',
                'displayDifficulty' => WPZOOM_Settings::get( 'display_difficulty' ) === '1',
                'displayAuthor' => WPZOOM_Settings::get( 'display_author' ) === '1',
                'displayServings' => WPZOOM_Settings::get( 'display_servings' ) === '1',
                'displayPrepTime' => WPZOOM_Settings::get( 'display_preptime' ) === '1',
                'displayCookingTime' => WPZOOM_Settings::get( 'display_cookingtime' ) === '1',
                'displayTotalTime' => WPZOOM_Settings::get( 'display_totaltime' ) === '1',
                'displayCalories' => WPZOOM_Settings::get( 'display_calories' ) === '1',
                'headerAlign' => WPZOOM_Settings::get( 'heading_content_align' ),
                'ingredientsLayout' => '1-column',
                'adjustableServings' => WPZOOM_Settings::get( 'enable_adjustable_servings' ) === '1'
            ),
            array(
                'displayFoodLabels' => WPZOOM_Settings::get( 'display_food_labels' ) === '1',
                'locationToShowFoodLabels' => WPZOOM_Settings::get( 'location_to_show_food_labels' )
            )
        ),
        'items' => array(
            'type' => 'object'
        )
    ),
    'details' => array(
        'type' => 'array',
        'default' => wpzoom_rcb_details_default(),
        'items' => array(
            'type' => 'object'
        )
    ),
    'toInsert' => array(
        'type' => 'integer',
    ),
    'showModal' => array(
        'type' => 'boolean',
        'default' => false
    ),
    'icons' => array(
        'type' => 'object',
    ),
    'activeIconSet' => array(
        'type' => 'string',
        'default' => 'foodicons'
    ),
    'searchIcon' => array(
        'type' => 'string',
        'default' => ''
    ),
    'ingredientsTitle' => array(
        'type' => 'string',
        'selector' => '.ingredients-title',
        'default' => WPZOOM_Settings::get( 'ingredients_title' ),
    ),
    'jsonIngredientsTitle' => array(
        'type' => 'string',
    ),
    'ingredients' => array(
        'type' => 'array',
        'default' => wpzoom_rcb_ingredients_default(),
        'items' => array(
            'type' => 'object'
        )
    ),
    'directionsTitle' => array(
        'type' => 'string',
        'selector' => '.directions-title',
        'default' => WPZOOM_Settings::get( 'steps_title' ),
    ),
    'jsonDirectionsTitle' => array(
        'type' => 'string',
    ),
    'steps' => array(
        'type' => 'array',
        'default' => wpzoom_rcb_steps_default(),
        'items' => array(
            'type' => 'object'
        )
    ),
    'notesTitle' => array(
        'type' => 'string',
        'selector' => '.notes-title',
        'default' => WPZOOM_Settings::get( 'notes_title' ),
    ),
    'notes' => array(
        'type' => 'string',
        'selector' => '.recipe-card-notes-list',
        'default' => ''
    ),
    'blockAlignment' => array(
        'type' => 'string',
        'default' => is_rtl() ? 'right' : 'left',
    )
);

function wpzoom_rcb_details_default() {
    return array(
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'oldicon',
            'icon'      => 'food',
            'label'     => __( "Servings", "wpzoom-recipe-card" ),
            'unit'      => __( "servings", "wpzoom-recipe-card" ),
            'value'     => '4'
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'oldicon',
            'icon'      => 'clock',
            'label'     => __( "Prep time", "wpzoom-recipe-card" ),
            'unit'      => __( "minutes", "wpzoom-recipe-card" ),
            'value'     => '30'
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'foodicons',
            'icon'      => 'cooking-food-in-a-hot-casserole',
            'label'     => __( "Cooking time", "wpzoom-recipe-card" ),
            'unit'      => __( "minutes", "wpzoom-recipe-card" ),
            'value'     => '40'
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'foodicons',
            'icon'      => 'fire-flames',
            'label'     => __( "Calories", "wpzoom-recipe-card" ),
            'unit'      => __( "kcal", "wpzoom-recipe-card" ),
            'value'     => '300'
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'fa',
            '_prefix'   => 'far',
            'icon'      => 'clock',
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'oldicon',
            'icon'      => 'chef-cooking',
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'oldicon',
            'icon'      => 'food-1',
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'fa',
            '_prefix'   => 'fas',
            'icon'      => 'sort-amount-down',
        ),
        array(
            'id'        => WPZOOM_Helpers()->generateId( "detail-item" ),
            'iconSet'   => 'fa',
            '_prefix'   => 'far',
            'icon'      => 'clock',
            'label'     => __( "Total time", "wpzoom-recipe-card" ),
            'unit'      => __( "minutes", "wpzoom-recipe-card" ),
            'value'     => '0'
        ),
    );
}

function wpzoom_rcb_ingredients_default() {
    return array(
        array(
            'id'   => WPZOOM_Helpers()->generateId( "ingredient-item" ),
            'name' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "ingredient-item" ),
            'name' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "ingredient-item" ),
            'name' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "ingredient-item" ),
            'name' => array(),
        )
    );
}

function wpzoom_rcb_steps_default() {
    return array(
        array(
            'id'   => WPZOOM_Helpers()->generateId( "direction-step" ),
            'text' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "direction-step" ),
            'text' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "direction-step" ),
            'text' => array(),
        ),
        array(
            'id'   => WPZOOM_Helpers()->generateId( "direction-step" ),
            'text' => array(),
        )
    );
}
?>