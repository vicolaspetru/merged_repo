<?php
/**
 * Fired during plugin activation.
 *
 * @since   1.2.0
 * @package WPZOOM Recipe Card Block
 */

/**
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since 1.2.0
 */
class WPZOOM_Plugin_Activator {

	/**
	 * Execute this on activation of the plugin.
	 *
	 * @since 1.2.0
	 */
	public static function activate() {
		// Set up recipe taxonomies.
		WPZOOM_Taxonomies::register_taxonomies();
		WPZOOM_Taxonomies::insert_default_taxonomy_terms();
		flush_rewrite_rules();
	}

	/**
	 * Execute this on deactivation of the plugin.
	 *
	 * @since 2.2.0
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}