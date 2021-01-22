<?php
/**
 * Fired during plugin activation.
 *
 * @since   1.2.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

/**
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since 1.2.0
 */
final class WPZOOM_Plugin_Activator {

	/**
	 * Initialize hooks.
	 *
	 * @since 2.2.0
	 * @return void
	 */
	static public function init() {
		// Activation
		register_activation_hook( WPZOOM_RCB_PLUGIN_FILE, array( __CLASS__, 'activate' ) );

		// Deactivation
		register_deactivation_hook( WPZOOM_RCB_PLUGIN_FILE, array( __CLASS__, 'deactivate' ) );
	}

	/**
	 * Execute this on activation of the plugin.
	 *
	 * @since 1.2.0
	 */
	public static function activate() {
		/**
		 * Allow developers to hook activation.
		 * @see wpzoom_recipe_card_activate
		 */
		$activate = apply_filters( 'wpzoom_recipe_card_activate', true );

		if ( $activate ) {
			add_option( 'wpzoom_rcb_do_activation_redirect', true );
			set_transient( 'wpzoom_rcb_welcome_banner', true, 12 * HOUR_IN_SECONDS );

			// Set up recipe taxonomies.
			WPZOOM_Taxonomies::register_taxonomies();
			WPZOOM_Taxonomies::insert_default_taxonomy_terms();
			
			flush_rewrite_rules();
		}
	}

	/**
	 * Execute this on deactivation of the plugin.
	 *
	 * @since 2.2.0
	 */
	public static function deactivate() {
		/**
		 * Allow developers to hook deactivation.
		 * @see wpzoom_recipe_card_deactivate
		 */
		$deactivate = apply_filters( 'wpzoom_recipe_card_deactivate', true );

		if ( $deactivate ) {
			delete_option( 'wpzoom_rcb_do_activation_redirect' );
			delete_transient( 'wpzoom_rcb_welcome_banner' );

			flush_rewrite_rules();
		}
	}
}

WPZOOM_Plugin_Activator::init();