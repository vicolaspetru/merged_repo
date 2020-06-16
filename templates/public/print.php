<?php
/**
 * Template to be used for the recipe print page.
 *
 * @since       2.7.2
 * 
 * @package     WPZOOM_Recipe_Card_Blocks
 * @subpackage  WPZOOM_Recipe_Card_Blocks/templates/public
 */
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
        <?php
            $custom_css_post_id = get_theme_mod( 'custom_css_post_id' );
            $wp_additional_css_post = get_post( $custom_css_post_id );
            $wp_additional_css = $wp_additional_css_post->post_content;

            if ( ! empty( $wp_additional_css ) ) {
                printf(
                    "<style id='%s-inline-css' type='text/css'>\n%s\n</style>\n",
                    'wpzoom-rcb-print',
                    esc_attr( $wp_additional_css )
                );
            }
        ?>
        <script type="text/javascript" src="<?php echo includes_url( '/js/jquery/jquery.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo includes_url( '/js/imagesloaded.min.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo includes_url( '/js/masonry.min.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo includes_url( '/js/jquery/jquery.masonry.min.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/js/adjustable-servings.js?ver=' . WPZOOM_RCB_VERSION; ?>"></script>
        <script type="text/javascript" src="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/js/masonry-gallery.js?ver=' . WPZOOM_RCB_VERSION; ?>"></script>
    </head>
    <body class="wpzoom-rcb-print" data-recipe-id="<?php echo esc_attr( $recipe_id ); ?>">
        <?php
            if ( ! is_array( $attributes ) ) {
                echo $content;
            } else {
                echo WPZOOM_Print_Template_Manager::get_template( $attributes, $recipe, $blockType );
            }
        ?>
    </body>
</html>
