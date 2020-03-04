<?php
/**
 * Handle the recipe printing.
 *
 * @since   2.7.2
 * @package WPZOOM_Recipe_Card_Blocks
 */
class WPZOOM_Print {

    /**
     * Register actions and filters.
     */
    public static function init() {
        add_action( 'init', array( __CLASS__, 'print_page' ) );
    }

    public static function print_page() {
        preg_match( '/[\/\?]wpzoom_rcb_print[\/=](\d+)(\/)?(\?.*)?(\/\?.*)?$/', $_SERVER['REQUEST_URI'], $print_url );
        $recipe_id = isset( $print_url[1] ) ? $print_url[1] : false;

        if ( $recipe_id ) {
            // Prevent WP Rocket lazy image loading on print page.
            add_filter( 'do_rocket_lazyload', '__return_false' );

            // Prevent Avada lazy image loading on print page.
            if ( class_exists( 'Fusion_Images' ) && property_exists( 'Fusion_Images', 'lazy_load' ) ) {
                Fusion_Images::$lazy_load = false;
            }

            $recipe_id = intval( $recipe_id );
            $recipe = get_post( $recipe_id );

            $has_WPZOOM_block = false;
            $attributes = array();
            $content = $recipe->post_content;

            // if ( 'publish' !== $recipe->post_status ) {
            //     wp_redirect( home_url() );
            //     exit();
            // }

            if ( has_blocks( $recipe->post_content ) ) {
                $blocks = parse_blocks( $recipe->post_content );

                foreach ( $blocks as $key => $block ) {
                    if ( $block['blockName'] === 'wpzoom-recipe-card/block-recipe-card' ) {
                        $has_WPZOOM_block = true;
                        $attributes = $block['attrs'];
                    }
                }
            }

            if ( $has_WPZOOM_block ) {
                header( 'HTTP/1.1 200 OK' );
                require( WPZOOM_RCB_PLUGIN_DIR . 'templates/public/print.php' );
                flush();
                exit;
            }
        }
    }
}

WPZOOM_Print::init();
