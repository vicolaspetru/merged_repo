<?php
/**
 * Template to be used for the recipe print page.
 *
 * @since   2.7.2
 * @package WPZOOM_Recipe_Card_Blocks
 */

$WPZOOM_Recipe_Card = new WPZOOM_Premium_Recipe_Card_Block();
$structured_data_helpers = new WPZOOM_Structured_Data_Helpers();
$helpers = new WPZOOM_Helpers();

?>
<!DOCTYPE html>
<html <?php echo get_language_attributes(); ?>>
    <head>
        <title><?php echo $recipe->post_title; ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=<?php echo get_bloginfo( 'charset' ); ?>" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex">
        <?php wp_site_icon(); ?>
        <link rel="stylesheet" type="text/css" href="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/css/recipe-print.css?ver=' . WPZOOM_RCB_VERSION; ?>"/>
        <script type="text/javascript" src="<?php echo includes_url( '/js/jquery/jquery.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/js/adjustable-servings.js?ver=' . WPZOOM_RCB_VERSION; ?>"></script>
    </head>
    <body class="wpzoom-rcb-print" data-recipe-id="<?php echo esc_attr( $recipe_id ); ?>">
        <?php
            if ( ! is_array( $attributes ) ) {
                echo $content;
            }

            $attributes = $helpers->omit( $attributes, array( 'toInsert', 'activeIconSet', 'showModal', 'searchIcon', 'icons' ) );
            // Import variables into the current symbol table from an array
            extract( $attributes );

            $class = 'wpzoom-rcb-print-block';

            // Recipe post variables
            $recipe_title           = get_the_title( $recipe );
            $recipe_thumbnail_url   = get_the_post_thumbnail_url( $recipe );
            $recipe_thumbnail_id    = get_post_thumbnail_id( $recipe );
            $recipe_permalink       = get_the_permalink( $recipe );
            $recipe_author_name     = get_the_author_meta( 'display_name', $recipe->post_author );
            $attachment_id          = isset( $image['id'] ) ? $image['id'] : $recipe_thumbnail_id;

            // Variables from attributes
            // add default value if not exists
            $recipeTitle    = isset( $recipeTitle ) ? $recipeTitle : '';
            $summary        = isset( $summary ) ? $summary : '';
            $className      = isset( $className ) ? $className : '';
            $hasImage       = isset( $hasImage ) ? $hasImage : false;
            $course         = isset( $course ) ? $course : array();
            $cuisine        = isset( $cuisine ) ? $cuisine : array();
            $difficulty     = isset( $difficulty ) ? $difficulty : array();
            $keywords       = isset( $keywords ) ? $keywords : array();
            $details        = isset( $details ) ? $details : array();
            $ingredients    = isset( $ingredients ) ? $ingredients : array();
            $steps          = isset( $steps ) ? $steps : array();

            // Store variables
            $settings       = $helpers->parse_block_settings( $attributes );

            $WPZOOM_Recipe_Card::$recipeBlockID = esc_attr( $id );
            $WPZOOM_Recipe_Card::$attributes = $attributes;
            $WPZOOM_Recipe_Card::$settings = $settings;

            $WPZOOM_Recipe_Card::$attributes['ingredientsTitle'] = isset( $ingredientsTitle ) ? $ingredientsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_ingredients_title');
            $WPZOOM_Recipe_Card::$attributes['directionsTitle'] = isset( $directionsTitle ) ? $directionsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_steps_title');
            $WPZOOM_Recipe_Card::$attributes['videoTitle'] = isset( $videoTitle ) ? $videoTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_video_title');

            $class .= $hasImage && isset($image['url']) ? '' : ' recipe-card-noimage';
            $class .= $settings['hide_header_image'] ? ' recipe-card-noimage' : '';
            $class .= '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_image') ? ' recipe-card-noimage-print' : '';

            $custom_author_name = $recipe_author_name;
            if ( ! empty( $settings['custom_author_name'] ) ) {
                $custom_author_name = $settings['custom_author_name'];
            }

            $RecipeCardClassName    = implode( ' ', array( $class, $className ) );

            $recipe_card_image = '';

            if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_image') ) {
                if ( $hasImage && isset( $image['url'] ) ) {
                    $img_id     = $image['id'];
                    $alt        = ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) );
                    $img_class  = ' wpzoom-recipe-card-image';

                    $attachment = wp_get_attachment_image(
                        $img_id,
                        'wpzoom-rcb-block-header-square',
                        false,
                        array(
                            'alt' => $alt,
                            'id' => $image['id'],
                            'class' => trim( $img_class )
                        )
                    );

                    $recipe_card_image = '<div class="recipe-card-image">
                        <figure>
                            '. $attachment .'
                        </figure>
                    </div>';
                }
                elseif ( ! $hasImage && ! empty( $recipe_thumbnail_url ) ) {
                    $img_id     = $recipe_thumbnail_id;
                    $alt        = ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) );
                    $img_class  = ' wpzoom-recipe-card-image';

                    $attachment = wp_get_attachment_image(
                        $img_id,
                        'wpzoom-rcb-block-header-square',
                        false,
                        array(
                            'alt' => $alt,
                            'id' => $recipe_thumbnail_id,
                            'class' => trim( $img_class )
                        )
                    );

                    $recipe_card_image = '<div class="recipe-card-image">
                        <figure>
                            '. $attachment .'
                        </figure>
                    </div>';
                }
            }

            $recipe_card_heading = '
                <div class="recipe-card-heading">
                    '. sprintf( '<h2 class="%s">%s</h2>', "recipe-card-title", ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) ) ) .
                    ( $settings['displayAuthor'] ? '<span class="recipe-card-author">'. __( "Recipe by", "wpzoom-recipe-card" ) . " " . $custom_author_name .'</span>' : '' ) .
                    ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_user_ratings') ?
                        wpzoom_rating_stars( $recipe_id, 'number', __( 'Recipe rating: ', 'wpzoom-recipe-card' ) ) : ''
                    ) .
                    '<div class="recipe-card-terms">'.
                    ( $settings['displayCourse'] ? WPZOOM_Premium_Recipe_Card_Block::get_recipe_terms( 'wpzoom_rcb_courses' ) : '' ) .
                    ( $settings['displayCuisine'] ? WPZOOM_Premium_Recipe_Card_Block::get_recipe_terms( 'wpzoom_rcb_cuisines' ) : '' ) .
                    ( $settings['displayDifficulty'] ? WPZOOM_Premium_Recipe_Card_Block::get_recipe_terms( 'wpzoom_rcb_difficulties' ) : '' ) .
                    '</div>'.
                '</div>';

            $summary_text = '';

            if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_summary_text') ) {
                if ( ! empty( $summary ) ) {
                    $summary_class = 'recipe-card-summary';
                    $summary_text = sprintf(
                        '<p class="%s">%s</p>',
                        esc_attr( $summary_class ),
                        $summary
                    );
                }
            }

            $details_content = WPZOOM_Premium_Recipe_Card_Block::get_details_content( $details );
            $ingredients_content = WPZOOM_Premium_Recipe_Card_Block::get_ingredients_content( $ingredients );
            $steps_content = WPZOOM_Premium_Recipe_Card_Block::get_steps_content( $steps );
            $food_labels_content_top = WPZOOM_Premium_Recipe_Card_Block::get_food_labels_content( 'top' );
            $food_labels_content_bottom = WPZOOM_Premium_Recipe_Card_Block::get_food_labels_content( 'bottom' );

            $strip_tags_notes = isset( $notes ) ? strip_tags($notes) : '';
            $notes = str_replace('<li></li>', '', $notes); // remove empty list item
            $notesTitle = isset( $notesTitle ) ? $notesTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_notes_title');
            $notes_content = ! empty($strip_tags_notes) ?
                sprintf(
                    '<div class="recipe-card-notes">
                        <h3 class="notes-title">%s</h3>
                        <ul class="recipe-card-notes-list">%s</ul>
                    </div>',
                    $notesTitle,
                    $notes
                ) : '';

            $footer_copyright = ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_footer_copyright') ? '' :
                '<div class="footer-copyright">
                    <p>'. __( "Recipe Card plugin by ", "wpzoom-recipe-card" ) .'
                        <a href="https://www.wpzoom.com/plugins/recipe-card-blocks/" target="_blank" rel="nofollow noopener noreferrer">WPZOOM</a>
                    </p>
                </div>'
            );

            // Wrap recipe card heading and details content into one div
            $recipe_card_image      = '<div class="recipe-card-header-wrap">'. $recipe_card_image;
            $recipe_card_heading    = '<div class="recipe-card-along-image">'. $recipe_card_heading;
            $details_content        .= $food_labels_content_top . $food_labels_content_bottom;
            $details_content        = $details_content .'</div></div><!-- /.recipe-card-header-wrap -->';

            $block_content = sprintf(
                '<div class="%1$s" id="%2$s">%3$s</div>',
                esc_attr( trim($RecipeCardClassName) ),
                esc_attr( $recipeBlockID ),
                $recipe_card_image .
                $recipe_card_heading .
                $details_content .
                $summary_text .
                $ingredients_content .
                $steps_content .
                $notes_content .
                $footer_copyright
            );

            echo $block_content;
        ?>
    </body>
</html>
