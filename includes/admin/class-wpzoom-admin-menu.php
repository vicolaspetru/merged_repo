<?php
/**
 * Register admin menu elements.
 *
 * @since   2.2.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for admin menu.
 */
class WPZOOM_Admin_Menu {

	/**
	 * The Constructor.
	 */
	public function __construct() {

		// Let's add menu item with subitems
		add_action( 'admin_menu', array( $this, 'register_menus' ) );
	}

	/**
	 * Register admin menus.
	 */
	public function register_menus() {
		$page_title = esc_html__( 'WPZOOM Recipe Card Settings', 'wpzoom-recipe-card' );

		add_menu_page(
			$page_title,
			apply_filters( 'wpzoom_manage_ratings_submenu_item', esc_html__( 'Recipe Card', 'wpzoom-recipe-card' ) ),
			'manage_options',
			WPZOOM_RCB_SETTINGS_PAGE,
			array( $this, 'admin_page' ),
			'none',
			45
		);

		// WPZOOM Recipe Card sub menu item.
		add_submenu_page(
			WPZOOM_RCB_SETTINGS_PAGE,
			$page_title,
			esc_html__( 'Settings', 'wpzoom-recipe-card' ),
			'manage_options',
			WPZOOM_RCB_SETTINGS_PAGE,
			array( $this, 'admin_page' )
		);

		add_submenu_page(
			WPZOOM_RCB_SETTINGS_PAGE,
			esc_html__( 'Manage Ratings', 'wpzoom-recipe-card' ),
			apply_filters( 'wpzoom_manage_ratings_submenu_item', esc_html__( 'Manage Ratings', 'wpzoom-recipe-card' ) ),
			'manage_options',
			'wpzoom-manage-ratings',
			array( $this, 'manage_ratings' )
		);
	}

	/**
	 * Wrapper for the hook to render our custom settings pages.
	 *
	 * @since 2.2.0
	 */
	public function admin_page() {
		do_action( 'wpzoom_rcb_admin_page' );
	}

	/**
	 * Wrapper for the hook to render manage ratings page.
	 *
	 * @since 3.2.0
	 */
	public function manage_ratings() {
		do_action( 'wpzoom_rcb_admin_manage_ratings' );
	}
}

new WPZOOM_Admin_Menu();
