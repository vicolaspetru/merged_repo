<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main WPZOOM_Recipe_Card_Block_Gutenberg Class.
 *
 * @since 1.1.0
 */
final class WPZOOM_Recipe_Card_Block_Gutenberg {
	/**
	 * This plugin's instance.
	 *
	 * @var WPZOOM_Recipe_Card_Block_Gutenberg
	 * @since 1.1.0
	 */
	private static $instance;

	/**
	 * Main WPZOOM_Recipe_Card_Block_Gutenberg Instance.
	 *
	 * Insures that only one instance of WPZOOM_Recipe_Card_Block_Gutenberg exists in memory at any one
	 * time. Also prevents needing to define globals all over the place.
	 *
	 * @since 1.1.0
	 * @static
	 * @uses WPZOOM_Recipe_Card_Block_Gutenberg::action_hooks() Load actions hooks.
	 * @return object|WPZOOM_Recipe_Card_Block_Gutenberg The one true WPZOOM_Recipe_Card_Block_Gutenberg
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof WPZOOM_Recipe_Card_Block_Gutenberg ) ) {
			self::$instance = new WPZOOM_Recipe_Card_Block_Gutenberg();
			self::action_hooks();
		}
		return self::$instance;
	}

	/**
	 * Load actions
	 *
	 * @access private
	 * @return void
	 */
	private static function action_hooks() {
		add_filter( 'block_categories', array( __CLASS__, 'add_custom_category' ), 10, 2 );
		add_filter( 'image_size_names_choose', array( __CLASS__, 'custom_image_sizes_choose' ) );
		add_filter( 'wp_get_attachment_image_attributes', array( __CLASS__, 'pinterest_nopin_images' ), 10, 3 );
		add_filter( 'get_avatar', array( __CLASS__, 'pinterest_nopin_author_avatar' ), 10, 6 );

		add_action( 'after_setup_theme', array( __CLASS__, 'register_custom_image_sizes' ) );
		add_action( 'init', array( __CLASS__, 'register_block_types' ) );
		add_action( 'init', array( __CLASS__, 'load_textdomain' ) );
		add_action( 'init', 'WPZOOM_Rating_Stars::set_user_ID' );

		WPZOOM_Taxonomies::init();
	}

	/**
	 * Register Block Types
	 */
	public static function register_block_types() {
		$integrations   = array();
		$integrations[] = new WPZOOM_Structured_Data_Render();

		foreach ( $integrations as $integration ) {
			$integration->register_hooks();
		}
	}

	/**
	 * Register custom image size
	 *
	 * @since 2.1.1
	 */
	public static function register_custom_image_sizes() {
		if ( function_exists( 'fly_add_image_size' ) ) {
			fly_add_image_size( 'wpzoom-rcb-block-header', 				800, 530, true );
			fly_add_image_size( 'wpzoom-rcb-block-header-square', 		530, 530, true );
			fly_add_image_size( 'wpzoom-rcb-block-step-image', 			750 );

			// Add image size for recipe Schema.org markup
			fly_add_image_size( 'wpzoom-rcb-structured-data-1_1', 		500, 500, true );
			fly_add_image_size( 'wpzoom-rcb-structured-data-4_3', 		500, 375, true );
			fly_add_image_size( 'wpzoom-rcb-structured-data-16_9', 		480, 270, true );
		} else {
			add_image_size( 'wpzoom-rcb-block-header', 					800, 530, true );
			add_image_size( 'wpzoom-rcb-block-header-square', 			530, 530, true );
			add_image_size( 'wpzoom-rcb-block-step-image', 				750 );

			// Add image size for recipe Schema.org markup
			add_image_size( 'wpzoom-rcb-structured-data-1_1', 			500, 500, true );
			add_image_size( 'wpzoom-rcb-structured-data-4_3', 			500, 375, true );
			add_image_size( 'wpzoom-rcb-structured-data-16_9', 			480, 270, true );
		}
	}

	/**
	 * Make custom sizes selectable from your WordPress admin
	 *
	 * @since 2.1.1
	 * @param array $size_names  The list of registered sizes
	 * @return array
	 */
	public static function custom_image_sizes_choose( $size_names ) {
		$new_sizes = array(
	        'wpzoom-rcb-block-header' => __( 'Recipe Card Block', 'wpzoom-recipe-card' ),
	        'wpzoom-rcb-block-header-square' => __( 'Recipe Card Block Square', 'wpzoom-recipe-card' ),
	        'wpzoom-rcb-block-step-image' => __( 'Recipe Card Step Image', 'wpzoom-recipe-card' )
	    );
	    return array_merge( $size_names, $new_sizes );
	}

	/**
	 * Add custom block category
	 *
	 * @since 1.1.0
	 */
	public static function add_custom_category( $categories, $post ) {
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
	 * Set attribute `data-pin-nopin` to images if option is enabled in the settings page
	 * 
	 * @since 2.9.0
	 * @param  array $atts          Array of attribute values for the image markup, keyed by attribute name
	 * @param  object $attachment   Image attachment post
	 * @param  string|array $size   Image size or array of width and height values
	 * @return array                The array with custom passed attributes
	 */
	public static function pinterest_nopin_images( $args, $attachment, $size ) {
		$nopin = WPZOOM_Settings::get('wpzoom_rcb_settings_nopin_images');
		$pin_custom_image = WPZOOM_Settings::get('wpzoom_rcb_settings_pin_image');
		$block_has_pin_custom_image = WPZOOM_Premium_Recipe_Card_Block::$settings['pin_has_custom_image'];

		if ( '1' === $nopin ) {
			// We don't need to add `data-pin-nopin` attribute to recipe card image
			if ( isset( $args['class'] ) && 'wpzoom-recipe-card-image' !== $args['class'] ) {
		        $args['data-pin-nopin'] = 'true';
			}
		}

		return $args;
	}

	/**
	 * Telling Pinterest to Not Save an author avatar image
	 * 
	 * @since 2.9.0
	 * 
     * @param string $avatar      `<img>` tag for the user's avatar.
     * @param mixed  $id_or_email The Gravatar to retrieve. Accepts a user_id, gravatar md5 hash,
     *                            user email, WP_User object, WP_Post object, or WP_Comment object.
     * @param int    $size        Square avatar width and height in pixels to retrieve.
     * @param string $default     URL for the default image or a default type. Accepts '404', 'retro', 'monsterid',
     *                            'wavatar', 'indenticon','mystery' (or 'mm', or 'mysteryman'), 'blank', or 'gravatar_default'.
     *                            Default is the value of the 'avatar_default' option, with a fallback of 'mystery'.
     * @param string $alt         Alternative text to use in the avatar image tag. Default empty.
     * @param array  $args        Arguments passed to get_avatar_data(), after processing.
     *
	 * @return string|false 	  `<img>` tag for the user's avatar with attribute `data-pin-nopin` if option is enabled. False on failure.
	 */
	public static function pinterest_nopin_author_avatar( $avatar, $id_or_email, $size, $default, $alt, $args ) {
		$nopin = WPZOOM_Settings::get('wpzoom_rcb_settings_nopin_images');

		if ( '1' === $nopin ) {
			$args['extra_attr'] .= ' data-pin-nopin="true"';

			$url2x = get_avatar_url( $id_or_email, array_merge( $args, array( 'size' => $args['size'] * 2 ) ) );
			$url = $args['url'];
			$class = $args['class'];

			$avatar = sprintf(
		        "<img alt='%s' src='%s' srcset='%s' class='%s' height='%d' width='%d' %s/>",
		        esc_attr( $args['alt'] ),
		        esc_url( $url ),
		        esc_url( $url2x ) . ' 2x',
		        esc_attr( $class ),
		        (int) $args['height'],
		        (int) $args['width'],
		        trim( $args['extra_attr'] )
		    );
		}

		return $avatar;
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
		if ( class_exists( 'WPZOOM_Premium_Recipe_Card_Block' ) ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Check if is AMP endpoint
	 * 
	 * @since 2.9.0
	 * @return boolean
	 */
	public static function is_AMP() {
		$ampforwp_is_amp_endpoint = function_exists( 'ampforwp_is_amp_endpoint' ) && ampforwp_is_amp_endpoint();
		$is_amp_endpoint = function_exists( 'is_amp_endpoint' ) && is_amp_endpoint();

		return $ampforwp_is_amp_endpoint || $is_amp_endpoint;
	}

	/**
	 * Load the plugin textdomain
	 *
	 * @since 1.1.0
	 */
	public static function load_textdomain() {
		load_plugin_textdomain(
			'wpzoom-recipe-card',
			false,
			dirname( plugin_basename( WPZOOM_RCB_PLUGIN_DIR ) ) . '/languages/'
		);
	}
}

WPZOOM_Recipe_Card_Block_Gutenberg::instance();
