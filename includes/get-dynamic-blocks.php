<?php
/**
 * Loads dynamic blocks for server-side rendering.
 *
 * @see https://github.com/godaddy-wordpress/coblocks/blob/master/includes/get-dynamic-blocks.php 
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register server-side code for individual blocks.
 * 
 * @since x.x.x
 */
foreach ( glob( dirname( dirname( __FILE__ ) ) . '/src/blocks/*/index.php' ) as $wpzoom_rcb_block_logic ) {
    require_once $wpzoom_rcb_block_logic;
}