<?php
/**
 * Server-side rendering of the `wpzoom-recipe-card/block-recipe-card` block.
 *
 * @package WPZOOM_Recipe_Card_Blocks
 */

/**
 * Renders the block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the block content.
 */
function wpzoom_rcb_render_recipe_card_block( $attributes, $content ) {
    global $post;

    if ( ! is_array( $attributes ) ) {
        return $content;
    }

    return '<h1>Hello World!</h1>';

    // if ( is_singular() ) {
    //     add_filter( 'the_content', 'wpzoom_rcb_filter_the_content' );
    // }

    // $attributes = WPZOOM_Structured_Data_Helpers()->omit( $attributes, array(
    //     'toInsert',
    //     'activeIconSet',
    //     'showModal',
    //     'searchIcon',
    //     'icons'
    // ) );

    // // Import variables into the current symbol table from an array
    // extract( $attributes );

    // // Get the featured image.
    // if ( has_post_thumbnail() ) {
    //     $thumbnail_id = get_post_thumbnail_id( $post->ID );
    //     $thumbnail_url = $thumbnail_id ? get_the_post_thumbnail_url( $post->ID ) : '';
    // } else {
    //     $thumbnail_url = null;
    // }

    // // Get the author name.
    // if (  ) {
    //     # code...
    // }

    // // Recipe post variables
    // self::$recipe                                   = get_post();
    // self::$stored_data['recipe_ID']                 = get_the_ID( self::$recipe );
    // self::$stored_data['recipe_title']              = get_the_title( self::$recipe );
    // self::$stored_data['recipe_thumbnail_url']      = get_the_post_thumbnail_url( self::$recipe );
    // self::$stored_data['recipe_thumbnail_id']       = get_post_thumbnail_id( self::$recipe );
    // self::$stored_data['recipe_permalink']          = get_the_permalink( self::$recipe );
    // self::$stored_data['recipe_author_name']        = get_the_author_meta( 'display_name', self::$recipe->post_author );
    // self::$stored_data['attachment_id']             = isset( $image['id'] ) ? $image['id'] : self::$stored_data['recipe_thumbnail_id'];
    // self::$stored_data['tasty_pins_pinterest_text'] = get_post_meta( self::$stored_data['attachment_id'], 'tp_pinterest_text', true );

    // // Variables from attributes
    // // add default value if not exists
    // self::$stored_data['recipeTitle']   = isset( $recipeTitle ) ? $recipeTitle : '';
    // self::$stored_data['summary']       = isset( $summary ) ? $summary : '';
    // self::$stored_data['className']     = isset( $className ) ? $className : '';
    // self::$stored_data['hasImage']      = isset( $hasImage ) ? $hasImage : false;
    // self::$stored_data['image']         = isset( $image ) ? $image : array();
    // self::$stored_data['hasVideo']      = isset( $hasVideo ) ? $hasVideo : false;
    // self::$stored_data['video']         = isset( $video ) ? $video : array();
    // self::$stored_data['course']        = isset( $course ) ? $course : array();
    // self::$stored_data['cuisine']       = isset( $cuisine ) ? $cuisine : array();
    // self::$stored_data['difficulty']    = isset( $difficulty ) ? $difficulty : array();
    // self::$stored_data['keywords']      = isset( $keywords ) ? $keywords : array();
    // self::$stored_data['details']       = isset( $details ) ? $details : array();
    // self::$stored_data['ingredients']   = isset( $ingredients ) ? $ingredients : array();
    // self::$stored_data['steps']         = isset( $steps ) ? $steps : array();

    // // Store variables
    // self::$recipeBlockID    = esc_attr( $id );
    // self::$attributes       = $attributes;
    // self::$style            = self::$helpers->get_block_style( self::$stored_data['className'] );
    // self::$settings         = self::$helpers->parse_block_settings( $attributes );

    // self::$stored_data['ingredientsTitle'] = isset( $ingredientsTitle ) ? $ingredientsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_ingredients_title');
    // self::$stored_data['directionsTitle'] = isset( $directionsTitle ) ? $directionsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_steps_title');
    // self::$stored_data['videoTitle'] = isset( $videoTitle ) ? $videoTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_video_title');
    // self::$stored_data['notesTitle'] = isset( $notesTitle ) ? $notesTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_notes_title');

    // $RecipeCardClassName = self::build_recipe_card_classes( self::$stored_data['className'] );
    // $attachment = self::get_recipe_card_attachment();
    // $pin_description = self::get_pinterest_description();
    // $pin_image = self::get_pinterest_image();
    // $custom_author_name = self::get_custom_author_name();
    // $detail_items = self::get_detail_items( self::$stored_data['details'] );
    // $ingredient_items = self::get_ingredient_items( self::$stored_data['ingredients'] );
    // $direction_items = self::get_direction_items( self::$stored_data['steps'] );
    // $recipe_card_video = self::get_video();
    // $food_labels_content_top = self::get_food_labels_content( 'top' );
    // $food_labels_content_bottom = self::get_food_labels_content( 'bottom' );
    // $notes_items = self::get_notes_items();
    // $cta_content = self::get_cta_content();

    // $json_ld = self::get_json_ld();
    // $variables = array(
    //     'id' => self::$recipeBlockID,
    //     'attributes' => self::$attributes,
    //     'settings' => self::$settings,
    //     'stored_data' => self::$stored_data,
    //     'style' => self::$style,
    //     'recipe_permalink' => self::$stored_data['recipe_permalink'],
    //     'RecipeCardClassName' => $RecipeCardClassName,
    //     'attachment' => $attachment,
    //     'pin_description' => $pin_description,
    //     'pin_image' => $pin_image,
    //     'custom_author_name' => $custom_author_name,
    //     'detail_items' => $detail_items,
    //     'ingredient_items' => $ingredient_items,
    //     'direction_items' => $direction_items,
    //     'recipe_card_video' => $recipe_card_video,
    //     'cta_content' => $cta_content,
    //     'notes_items' => $notes_items,
    //     'food_labels_content_top' => $food_labels_content_top,
    //     'food_labels_content_bottom' => $food_labels_content_bottom,
    //     'json_ld' => $json_ld,
    // );
    // $block_template = WPZOOM_Template_Manager::get_template( self::$style, $variables );

    // return $block_template;
}

/**
 * Filter content when rendering recipe card block
 * Add snippets at the top of post content
 *
 * @param string $content Main post content
 * 
 * @return string HTML of post content
 */
function wpzoom_rcb_filter_the_content( $content ) {
    $content = self::$helpers->fix_content_tasty_links_conflict( $content );

    /**
     * Don't append snippets buttons to content if page is built with Elementor
     * 
     * @since 3.2.1
     */
    $elemntor_is_active = class_exists( '\Elementor\Plugin' );
    $is_built_with_elementor = $elemntor_is_active && \Elementor\Plugin::$instance->db->is_built_with_elementor( get_the_ID() );

    if ( $is_built_with_elementor ) {
        return $content;
    }
    
    if ( ! in_the_loop() ) {
        return $content;
    }

    $output = '';

    // Automatically display snippets at the top of post content
    if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_display_snippets') ) {
        $custom_blocks = array(
            'wpzoom-recipe-card/block-jump-to-recipe',
            'wpzoom-recipe-card/block-print-recipe'
        );

        $output .= '<div class="wpzoom-recipe-card-buttons">';

        foreach ( $custom_blocks as $block_name ) {
            if ( $block_name == 'wpzoom-recipe-card/block-jump-to-recipe' ) {
                $attrs = array(
                    'id' => self::$recipeBlockID,
                    'text' => WPZOOM_Settings::get('wpzoom_rcb_settings_jump_to_recipe_text')
                );
                $block = array(
                    'blockName' => $block_name,
                    'attrs' => $attrs,
                    'innerBlocks' => array(),
                    'innerHTML' => '',
                    'innerContent' => array()
                );
                $output .= render_block( $block );
            }
            if ( $block_name == 'wpzoom-recipe-card/block-print-recipe' ) {
                $attrs = array(
                    'id' => self::$recipeBlockID,
                    'text' => WPZOOM_Settings::get('wpzoom_rcb_settings_print_recipe_text')
                );
                $block = array(
                    'blockName' => $block_name,
                    'attrs' => $attrs,
                    'innerBlocks' => array(),
                    'innerHTML' => '',
                    'innerContent' => array()
                );
                $output .= render_block( $block );
            }
        }

        $output .= '</div>';
    }

    return $output . $content;
}

/**
 * Registers the block on server.
 */
function wpzoom_rcb_register_recipe_card_block() {
    // Return early if this function does not exist.
    if ( ! function_exists( 'register_block_type' ) ) {
        return;
    }

    // Return early if this block is already registered
    if ( wpzoom_rcb_block_is_registered( 'wpzoom-recipe-card/block-recipe-card' ) ) {
        return;
    }

    // Load attributes from block-attributes.php
    ob_start();
    include WPZOOM_RCB_PLUGIN_DIR . 'src/blocks/recipe-card/block-attributes.php';
    $metadata = json_encode( ob_get_clean(), true );

    register_block_type(
        'wpzoom-recipe-card/block-recipe-card',
        array(
            'editor_script'   => 'wpzoom-recipe-card-editor',
            'editor_style'    => 'wpzoom-recipe-card-editor',
            'style'           => 'wpzoom-recipe-card-frontend',
            'attributes'      => $metadata['attributes'],
            'render_callback' => 'wpzoom_rcb_render_recipe_card_block',
        )
    );
}
add_action( 'init', 'wpzoom_rcb_register_recipe_card_block' );