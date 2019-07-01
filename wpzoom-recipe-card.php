<?php
/**
 * Plugin Name: Recipe Card Blocks PRO by WPZOOM
 * Plugin URI: https://demo.wpzoom.com/recipe-card-blocks/
 * Description: Beautiful recipe blocks for Gutenberg to help you to add recipe cards: Ingredients, Directions and more to come.
 * Author: WPZOOM
 * Author URI: https://wpzoom.com
 * Version: 2.2.0
 * Copyright: (c) 2019 WPZOOM
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wpzoom-recipe-card
 * Domain Path: /languages
 *
 * @package   WPZOOM Recipe Card Block
 * @author    Vicolas Petru
 * @license   GPL-2+
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPZOOM_Recipe_Card_Block_Gutenberg_PRO' ) ) :
	/**
	 * Main WPZOOM_Recipe_Card_Block_Gutenberg_PRO Class.
	 *
	 * @since 1.1.0
	 */
	final class WPZOOM_Recipe_Card_Block_Gutenberg_PRO {
		/**
		 * This plugin's instance.
		 *
		 * @var WPZOOM_Recipe_Card_Block_Gutenberg_PRO
		 * @since 1.1.0
		 */
		private static $instance;

		/**
		 * Main WPZOOM_Recipe_Card_Block_Gutenberg_PRO Instance.
		 *
		 * Insures that only one instance of WPZOOM_Recipe_Card_Block_Gutenberg_PRO exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @since 1.1.0
		 * @static
		 * @uses WPZOOM_Recipe_Card_Block_Gutenberg_PRO::define_constants() Setup the constants needed.
		 * @uses WPZOOM_Recipe_Card_Block_Gutenberg_PRO::load_dependencies() Include the required files.
		 * @see WIDGETOPTS()
		 * @return object|WPZOOM_Recipe_Card_Block_Gutenberg_PRO The one true WPZOOM_Recipe_Card_Block_Gutenberg_PRO
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof WPZOOM_Recipe_Card_Block_Gutenberg_PRO ) ) {
				self::$instance = new WPZOOM_Recipe_Card_Block_Gutenberg_PRO();
				self::$instance->define_constants();
				self::$instance->load_dependencies();
				self::$instance->init();
			}
			return self::$instance;
		}

		/**
		 * Setup plugin constants.
		 *
		 * @access private
		 * @since 1.1.0
		 * @return void
		 */
		private function define_constants() {
			/**
			 * Parses the plugin contents to retrieve plugin’s metadata.
			 * @since 2.2.0
			 */
			if ( function_exists( 'get_plugin_data' ) ) {
				$plugin_data = get_plugin_data( __FILE__ );
			} else {
				$plugin_data = get_file_data( __FILE__, array(
					'Version' => 'Version',
				    'TextDomain' => 'Text Domain',
				    'AuthorURI' => 'Author URI'
				), 'plugin' );
			}

			$this->define( 'WPZOOM_RCB_VERSION', $plugin_data['Version'] );
			$this->define( 'WPZOOM_RCB_TEXT_DOMAIN', $plugin_data['TextDomain'] );
			$this->define( 'WPZOOM_RCB_HAS_PRO', true );
			$this->define( 'WPZOOM_RCB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
			$this->define( 'WPZOOM_RCB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
			$this->define( 'WPZOOM_RCB_SD_BLOCKS_DIR', WPZOOM_RCB_PLUGIN_DIR . 'src/structured-data-blocks/' );
			$this->define( 'WPZOOM_RCB_PLUGIN_FILE', __FILE__ );
			$this->define( 'WPZOOM_RCB_PLUGIN_BASE', plugin_basename( __FILE__ ) );
			$this->define( 'WPZOOM_RCB_REVIEW_URL', 'https://wordpress.org/support/plugin/recipe-card-blocks-by-wpzoom/reviews/' );

			// settings ?page url attribute
			$this->define( 'WPZOOM_RCB_SETTINGS_PAGE', 'wpzoom-recipe-card-settings' );
			// this is the URL our updater / license checker pings. This should be the URL of the site with EDD installed
			$this->define( 'WPZOOM_RCB_STORE_URL', $plugin_data['AuthorURI'] );
			$this->define( 'WPZOOM_RCB_RENEW_URL', $plugin_data['AuthorURI'].'/account/licenses/' );
			// the download ID. This is the ID of your product in EDD and should match the download ID visible in your Downloads list
			$this->define( 'WPZOOM_RCB_ITEM_ID', 197189 );
			$this->define( 'WPZOOM_RCB_ITEM_NAME', 'Recipe Card Block PRO' );
		}

		/**
		 * Load actions
		 *
		 * @return void
		 */
		private function init() {
			add_filter( 'block_categories', array( $this, 'add_custom_category' ), 10, 2 );
			add_filter( 'template_include', array( 'WPZOOM_Taxonomies', 'set_template' ) );
			add_filter( 'image_size_names_choose', array( $this, 'custom_image_sizes_choose' ) );

			add_action( 'init', array( $this, 'register_custom_image_sizes' ) );
			add_action( 'init', array( $this, 'register_block_types' ) );
			add_action( 'init', array( $this, 'load_textdomain' ) );
			add_action( 'init', array( 'WPZOOM_Plugin_Activator', 'activate' ) );

			WPZOOM_Taxonomies::init();
		}

		/**
		 * Register custom image size
		 *
		 * @since 2.2.0
		 */
		public function register_custom_image_sizes() {
			add_image_size( 'wpzoom-rcb-block-header', 800, 530, true );
			add_image_size( 'wpzoom-rcb-block-header-square', 530, 530, true );
		}

		/**
		 * Make custom sizes selectable from your WordPress admin
		 *
		 * @since 2.2.0
		 * @param array $size_names  The list of registered sizes
		 * @return array
		 */
		public function custom_image_sizes_choose( $size_names ) {
			$new_sizes = array(
		        'wpzoom-rcb-block-header' => __( 'Recipe Card Block', 'wpzoom-recipe-card' ),
		        'wpzoom-rcb-block-header-square' => __( 'Recipe Card Block Square', 'wpzoom-recipe-card' )
		    );
		    return array_merge( $size_names, $new_sizes );
		}

		/**
		 * Define constant if not already set.
		 *
		 * @param  string|string $name Name of the definition.
		 * @param  string|bool   $value Default value.
		 */
		private function define( $name, $value ) {
			if ( ! defined( $name ) ) {
				define( $name, $value );
			}
		}

		/**
		 * Load all plugin dependecies.
		 *
		 * @access private
		 * @since 1.1.0
		 * @return void
		 */
		private function load_dependencies() {
			/**
			 * @since 1.2.0
			 */
			if( !class_exists( 'EDD_SL_Plugin_Updater' ) ) {
				// load our custom updater if it doesn't already exist 
				include( WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-edd-sl-plugin-updater.php' );
			}

			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-taxonomies.php';
			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-settings-fields.php';
			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-settings.php';

			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-assets-manager.php';
			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-helpers.php';

			if ( self::has_pro() ) {
				require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-recipe-card-pro.php';
			}

			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-structured-data-render.php';
			require_once WPZOOM_RCB_PLUGIN_DIR . 'src/classes/class-wpzoom-plugin-activator.php';
		}

		public function register_block_types() {
			$integrations   = array();
			$integrations[] = new WPZOOM_Structured_Data_Render();

			if ( self::is_pro() ) {
				$integrations[] = new WPZOOM_Recipe_Card_Block_PRO();
			}

			foreach ( $integrations as $integration ) {
				$integration->register_hooks();
			}
		}

		/**
		 * Add custom block category
		 *
		 * @since 1.1.0
		 */
		public function add_custom_category( $categories, $post ) {
			return array_merge(
				$categories,
				array(
					array(
						'slug' => 'wpzoom-recipe-card',
						'title' => __( 'WPZOOM - Recipe Card', 'wpzoom-recipe-card' ),
					),
				)
			);
		}

		/**
		 * Check if pro exists.
		 *
		 * @since 1.1.0
		 * @access public
		 */
		public static function has_pro() {
			if ( true === WPZOOM_RCB_HAS_PRO ) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Check if pro is activated.
		 *
		 * @since 1.1.0
		 * @access public
		 */
		public static function is_pro() {
			if ( class_exists( 'WPZOOM_Recipe_Card_Block_PRO' ) ) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Load the plugin textdomain
		 *
		 * @since 1.1.0
		 */
		public function load_textdomain() {
			load_plugin_textdomain(
				'wpzoom-recipe-card',
				false,
				dirname( plugin_basename( WPZOOM_RCB_PLUGIN_DIR ) ) . '/languages/'
			);
		}
	}
endif;

/**
 * The main function for that returns WPZOOM_Recipe_Card_Block_Gutenberg_PRO
 *
 * Example: <?php $recipe_card_block_pro = new WPZOOM_Recipe_Card_Block_Gutenberg_PRO(); ?>
 *
 * @since 1.1.0
 * @return object|WPZOOM_Recipe_Card_Block_Gutenberg_PRO The one true WPZOOM_Recipe_Card_Block_Gutenberg_PRO Instance.
 */
if ( ! function_exists('recipe_card_block_pro') ) {
	function recipe_card_block_pro() {
		// Deactivate Lite version
		if ( class_exists('WPZOOM_Recipe_Card_Block_Gutenberg') ) {
			deactivate_plugins( plugin_basename( 'recipe-card-blocks-by-wpzoom/wpzoom-recipe-card.php' ) );
		}
		return WPZOOM_Recipe_Card_Block_Gutenberg_PRO::instance();
	}
}

// Get the plugin running. Load on plugins_loaded action to avoid issue on multisite.
if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	add_action( 'plugins_loaded', 'recipe_card_block_pro', 90 );
} else {
	recipe_card_block_pro();
}

register_activation_hook( __FILE__, 'recipe_card_block_pro_plugin_activation' );
register_deactivation_hook( __FILE__, array( 'WPZOOM_Plugin_Activator', 'deactivate' ) );
add_action( 'admin_init', 'recipe_card_block_pro_plugin_activation_redirect' );

/**
 * Add a redirection check on activation.
 *
 * @since 1.2.0
 */
if ( ! function_exists('recipe_card_block_pro_plugin_activation') ) {
	function recipe_card_block_pro_plugin_activation() {
		add_option( 'wpzoom_rcb_do_activation_redirect', true );
		set_transient( 'wpzoom_rcb_welcome_banner', true, 12 * HOUR_IN_SECONDS );
	}
}

/**
 * Redirect to the WPZOOM Recipe Card Getting Started page on single plugin activation
 *
 * @since 1.2.0
 */
if ( ! function_exists('recipe_card_block_pro_plugin_activation_redirect') ) {
	function recipe_card_block_pro_plugin_activation_redirect() {
		if ( get_option( 'wpzoom_rcb_do_activation_redirect', false ) ) {
			delete_option( 'wpzoom_rcb_do_activation_redirect' );
			if ( ! isset( $_GET['activate-multi'] ) ) {
				wp_redirect( 'options-general.php?page=wpzoom-recipe-card-settings' );
			}
		}
	}
}

/**
 * Check block is registered.
 *
 * @since 1.2.1
 */
if ( ! function_exists('wpzoom_rcb_block_is_registered') ) {
	function wpzoom_rcb_block_is_registered( $name ) {
		$WP_Block_Type_Registry = new WP_Block_Type_Registry();
		return $WP_Block_Type_Registry->is_registered( $name );
	}
}

