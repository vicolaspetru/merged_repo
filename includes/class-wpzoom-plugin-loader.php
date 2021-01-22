<?php
/**
 * Responsible to prevent multiple loads of plugin.
 *
 * @since 2.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Plugin Loader Class
 */
class WPZOOM_Plugin_Loader {

	/**
	 * This plugin's instance.
	 *
	 * @var WPZOOM_Plugin_Loader
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 *
	 * @return WPZOOM_Plugin_Loader
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new WPZOOM_Plugin_Loader();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Load the plugin if it's not already loaded, otherwise
	 * show an admin notice.
	 *
	 * @since 2.2.0
	 * @return void
	 */
	public function init() {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$lite_dirname   = 'recipe-card-blocks-by-wpzoom';
		$lite_active    = is_plugin_active( $lite_dirname . '/wpzoom-recipe-card.php' );
		$plugin_dirname = basename( dirname( dirname( dirname( __FILE__ ) ) ) );
		$is_network 	= is_network_admin();

		if ( $lite_active && $plugin_dirname != $lite_dirname ) {
			deactivate_plugins( array( $lite_dirname . '/wpzoom-recipe-card.php' ), false, $is_network );
			return;
		}
		elseif ( class_exists( 'WPZOOM_Recipe_Card_Block_Gutenberg' ) ) {
			add_action( 'admin_notices', array( $this, 'double_install_admin_notice' ) );
			add_action( 'network_admin_notices',array( $this, 'double_install_admin_notice' ) );
			return;
		}
	}

	/**
	 * Shows an admin notice if another version of the plugin
	 * has already been loaded before this one.
	 *
	 * @since 2.2.0
	 * @return void
	 */
	public function double_install_admin_notice() {
		/* translators: %s: plugins page link */
		$message = __( 'You currently have two versions of Recipe Card Block active on this site. Please <a href="%s">deactivate one</a> before continuing.', 'wpzoom-recipe-card' );

		$this->render_admin_notice( sprintf( $message, admin_url( 'plugins.php' ) ), 'error' );
	}

	/**
	 * Renders an admin notice.
	 *
	 * @since 2.2.0
	 * @access private
	 * @param string $message
	 * @param string $type
	 * @return void
	 */
	private function render_admin_notice( $message, $type = 'update' ) {
		if ( ! is_admin() ) {
			return;
		}
		elseif ( ! is_user_logged_in() ) {
			return;
		}
		elseif ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		echo '<div class="' . $type . '">';
		echo '<p>' . $message . '</p>';
		echo '</div>';
	}
}

WPZOOM_Plugin_Loader::register();
