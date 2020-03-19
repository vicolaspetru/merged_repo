<?php
/**
 * Template to be used for the recipe print page.
 *
 * @since   2.7.2
 * @package WPZOOM_Recipe_Card_Blocks
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
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Libre Franklin:100,100i,200,200i,300,300i,400,400i,600,600i,700,700i"/>
        <link rel="stylesheet" type="text/css" href="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/css/recipe-print.css?ver=' . WPZOOM_RCB_VERSION; ?>"/>
        <script type="text/javascript" src="<?php echo includes_url( '/js/jquery/jquery.js' ); ?>"></script>
        <script type="text/javascript" src="<?php echo WPZOOM_RCB_PLUGIN_URL . 'dist/assets/js/adjustable-servings.js?ver=' . WPZOOM_RCB_VERSION; ?>"></script>
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
