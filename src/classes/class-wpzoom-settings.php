<?php
/**
 * Class Settings Page
 *
 * @since   1.1.0
 * @package WPZOOM Recipe Card Block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for settings page.
 */
class WPZOOM_Settings {
	/**
	 * Option name
	 */
	public static $option = 'wpzoom-recipe-card-settings';

	/**
	 * License Option name
	 */
	public static $license_option = 'wpzoom-recipe-card-license';

	/**
	 * Store all default settings options.
	 *
	 * @static
	 */
	public static $defaults = array();

	/**
	 * Store all settings options.
	 */
	public $settings = array();

	/**
	 * Store License settings options.
	 * @since 2.2.0
	 */
	public $license_settings = array();

	/**
	 * Active Tab.
	 */
	public static $active_tab;

	/**
	 * Class WPZOOM_Settings_Fields instance.
	 */
	public $_fields;

	/**
	 * Store Settings options.
	 */
	public static $options = array();

	/**
	 * Store Settings License options.
	 * @since 2.2.0
	 */
	public static $license_options = array();

	/**
	 * License key
	 */
	public static $license_key = false;

	/**
	 * License status
	 */
	public static $license_status = false;

	/**
	 * The Constructor.
	 */
	public function __construct() {
		global $pagenow;

		self::$options 			= get_option( self::$option );
		self::$license_options 	= get_option( self::$license_option );

		// retrieve our license key from the DB
		self::$license_key 		= isset( self::$license_options['wpzoom_rcb_plugin_license_key'] ) ? trim( self::$license_options['wpzoom_rcb_plugin_license_key'] ) : false;
		self::$license_status 	= isset( self::$license_options['wpzoom_rcb_plugin_license_status'] ) ? self::$license_options['wpzoom_rcb_plugin_license_status'] : false;

		// Check what page we are on.
		$page = isset( $_GET['page'] ) ? $_GET['page'] : '';

		if( is_admin() ) {
		    add_action( 'admin_init', array( $this, 'settings_init' ) );
		    add_action( 'admin_init', array( $this, 'settings_license' ) );
		    add_action( 'admin_init', array( $this, 'set_defaults' ) );
		    add_action( 'admin_init', array( $this, 'activate_license' ) );
		    add_action( 'admin_init', array( $this, 'deactivate_license' ) );
		    add_action( 'init',       array( $this, 'initiate_updater_class' ) );

		    // Do ajax request
			add_action( 'wp_ajax_wpzoom_reset_settings', array( $this, 'reset_settings') );
			add_action( 'wp_ajax_wpzoom_reset_ratings', array( $this, 'reset_ratings') );
			add_action( 'wp_ajax_wpzoom_welcome_banner_close', array( $this, 'welcome_banner_close') );

			// Only load if we are actually on the settings page.
		    if ( WPZOOM_RCB_SETTINGS_PAGE === $page ) {
			    add_action( 'wpzoom_rcb_admin_page', array( $this, 'settings_page' ) );

			    // Include admin scripts & styles
			    add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );

			    // Action for welcome banner
			    add_action( 'wpzoom_rcb_welcome_banner', array( $this, 'welcome' ) );
		    }

	        if( $pagenow !== "admin.php" ) {
	        	// Display admin notices
	        	add_action( 'admin_notices', array( $this, 'admin_notices' ) );
	        }

		    $this->_fields = new WPZOOM_Settings_Fields();
		}
	}

	/**
	 * Set default values for setting options.
	 */
	public function set_defaults() {
		// Set active tab
		self::$active_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'tab-general';

		foreach ( $this->settings as $key => $setting ) {
			if ( isset( $setting['sections'] ) && is_array( $setting['sections'] ) ) {
				foreach ( $setting['sections'] as $section ) {
					if ( isset( $section['fields'] ) && is_array( $section['fields'] ) ) {
						foreach ( $section['fields'] as $field ) {
							if ( isset( $field['args']['default'] ) ) {
								self::$defaults[ $field['id'] ] = (string)$field['args']['default'];
							}
						}
					}
				}
			}
		}

		if ( empty( self::$defaults ) ) {
			return false;
		}

		// If 'wpzoom-recipe-card-settings' is empty update option with defaults values
		if ( empty( self::$options ) ) {
			self::update_option( self::$defaults );
		}

		// If new setting is added, update 'wpzoom-recipe-card-settings' option
		if ( ! empty( self::$options ) ) {
			$new_settings = array_diff_key( self::$defaults, self::$options );
			if ( ! empty( $new_settings ) ) {
				self::update_option( array_merge( self::$options, $new_settings ) );
			}
		}

		return apply_filters( 'wpzoom_rcb_set_settings_defaults', self::$defaults );
	}

	/**
	 * Update option value
	 *
	 * @param string|array $value
	 * @param string $option
	 */
	public static function update_option( $value, $option = '', $autoload = null ) {
		if ( empty( $option ) ) $option = self::$option;

		if ( self::$options !== false ) {
		    // The option already exists, so we just update it.
		    update_option( $option, $value, $autoload );
		} else {
		    // The option hasn't been added yet. We'll add it with $autoload set to 'no'.
		    $deprecated = null;
		    $autoload = 'no';
		    add_option( $option, $value, $deprecated, $autoload );
		}
	}

	/**
	 * Get default values of setting options.
	 *
	 * @static
	 */
	public static function get_defaults() {
		return self::$defaults;
	}

	/**
	 * Get default value by option name
	 *
	 * @param string $option_name
	 * @static
	 * @return boolean
	 */
	public static function get_default_option_value( $option_name ) {
		return isset( self::$defaults[ $option_name ] ) ? self::$defaults[ $option_name ] : false;
	}

	/**
	 * Get license key
	 *
	 * @since 1.2.0
	 * @return string The License key
	 */
	public static function get_license_key() {
		return self::$license_key;
	}

	/**
	 * Get license status
	 *
	 * @since 1.2.0
	 * @return string The License status
	 */
	public static function get_license_status() {
		return self::$license_status;
	}

	/**
	 * Get setting options
	 *
	 * @since 1.2.0
	 * @return array
	 */
	public static function get_settings() {
		return apply_filters( 'wpzoom_rcb_get_settings', self::$options );
	}

	/**
	 * Get setting option value
	 *
	 * @since 1.2.0
	 * @param string $option  Option name
	 * @return string|boolean
	 */
	public static function get( $option ) {
		return isset(self::$options[ $option ]) ? self::$options[ $option ] : false;
	}

	/**
	 * Welcome banner
	 * Show banner after user activate plugin
	 *
	 * @since 1.2.0
	 * @return void
	 */
	public function welcome() {
		$welcome_transient = get_transient('wpzoom_rcb_welcome_banner');

		if ( false === $welcome_transient ) {
			return;
		}

		ob_start();
		?>
		<div id="wpzoom-recipe-card-welcome-banner" class="wpzoom-rcb-welcome">
			<div class="inner-wrap">
				<i class="wpzoom-rcb-welcome-icon dashicons dashicons-yes"></i>
				<h3 class="wpzoom-rcb-welcome-title"><?php _e( "Thank you for installing Recipe Card Blocks!", "wpzoom-recipe-card" ) ?></h3>
				<p class="wpzoom-rcb-welcome-description"><?php _e( "If you need help getting started with Recipe Card Blocks, please click on the links below.", "wpzoom-recipe-card" ) ?></p>
				<div class="wpzoom-rcb-welcome-buttons">
					<a href="https://www.wpzoom.com/documentation/recipe-card-blocks/" target="_blank" class="wpzoom-doc-link"><?php _e( "Documentation", "wpzoom-recipe-card" ) ?></a>
					<a href="https://wordpress.org/support/plugin/recipe-card-blocks-by-wpzoom/" target="_blank" class="wpzoom-support-link"><?php _e( "Support Forum", "wpzoom-recipe-card" ) ?></a>
                    <a href="https://www.wpzoom.com/support/tickets/" target="_blank" class="wpzoom-support-link"><strong><?php _e( "Premium Support", "wpzoom-recipe-card" ) ?></strong></a>
					<?php /* <a href="#" target="_blank" class="wpzoom-pro-link"><?php _e( "Upgrade PRO", "wpzoom-recipe-card" ) ?></a> */ ?>
				</div>
			</div>
			<a href="#wpzoom-recipe-card-welcome-banner" class="wpzoom-rcb-welcome-close"><i class="dashicons dashicons-no-alt"></i><?php _e( "Close", "wpzoom-recipe-card" ) ?></a>
		</div>
		<?php

		$output = ob_get_contents();
		ob_end_clean();

		echo $output;
	}

	/**
	 * Initiate the updater class.
	 * @since 1.2.0
	 * @return void
	 */
	public function initiate_updater_class() {
		// setup the updater
		$plugin_updater = new EDD_SL_Plugin_Updater( WPZOOM_RCB_STORE_URL, WPZOOM_RCB_PLUGIN_FILE, array(
			'version' 	=> WPZOOM_RCB_VERSION,		// current version number
			'license' 	=> self::$license_key,		// license key (used get_option above to retrieve from DB)
			'item_id'   => WPZOOM_RCB_ITEM_ID,		// id of this plugin
			'author' 	=> 'Vicolas Petru',			// author of this plugin
			'url'       => home_url(),
		    'beta'  	=> false 					// set to true if you wish customers to receive update notifications of beta releases
		) );
	}

	/**
	 * Initilize all settings
	 */
	public function settings_init() {
		$soon_badge = '<span class="wpzoom-rcb-badge wpzoom-rcb-field-is_coming_soon">'. __( 'Coming Soon', 'wpzoom-recipe-card' ) .'</span>';

		$this->settings = array(
			'general' => array(
				'tab_id' 		=> 'tab-general',
				'tab_title' 	=> __( 'General', 'wpzoom-recipe-card' ),
				'option_group' 	=> 'wpzoom-recipe-card-settings-general',
				'option_name' 	=> self::$option,
				'sections' 		=> array(
					array(
						'id' 		=> 'wpzoom_section_general',
						'title' 	=> __( 'Defaults', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-general',
						'callback' 	=> array( $this, 'section_defaults_cb' ),
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_course',
								'title' 	=> __( 'Display Course', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_course',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show course by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
									'preview'       => true,
									'preview_pos'	=> 'bottom',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_cuisine',
								'title' 	=> __( 'Display Cuisine', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_cuisine',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show cuisine by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'bottom',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_difficulty',
								'title' 	=> __( 'Display Difficulty', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_difficulty',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show difficulty by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'bottom',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_author',
								'title' 	=> __( 'Display Author', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_author',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show author by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'bottom',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_author_custom_name',
								'title' 	=> __( 'Default Author Name', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_author_custom_name',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'You can add a custom author name for all new Recipe Cards. By default, the post author name is shown.', 'wpzoom-recipe-card' ),
									'default'		=> '',
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_details_title',
								'title' 	=> __( 'Default Details Title', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_details_title',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add your custom Details title.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Details', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_ingredients_title',
								'title' 	=> __( 'Default Ingredients Title', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_ingredients_title',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add your custom Ingredients title for all new Recipe Cards.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Ingredients', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_steps_title',
								'title' 	=> __( 'Default Directions Title', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_steps_title',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add your custom title for Directions section in new Recipe Cards.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Directions', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_video_title',
								'title' 	=> __( 'Recipe Video Title', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_video_title',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add your custom title for Recipe video.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Recipe Video', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_notes_title',
								'title' 	=> __( 'Default Notes Title', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_notes_title',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add your custom Notes title for all new Recipe Cards.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Notes', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_heading_content_align',
								'title' 	=> __( 'Heading content align', 'wpzoom-recipe-card' ),
								'type'		=> 'select',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_heading_content_align',
									'class' 		=> 'wpzoom-rcb-field',
									'default'		=> 'left',
									'options' 		=> array(
										'left' 			=> __( 'Left', 'wpzoom-recipe-card' ),
										'center' 		=> __( 'Center', 'wpzoom-recipe-card' ),
										'right' 		=> __( 'Right', 'wpzoom-recipe-card' ),
									)
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_footer_copyright',
								'title' 	=> __( 'Footer Copyright', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_footer_copyright',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Hide footer copyright text.', 'wpzoom-recipe-card' ),
									'default'		=> true,
									'disabled'		=> false,
                                    'preview'       => true,
                                    'preview_pos'	=> 'bottom',
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_section_recipe_details',
						'title' 	=> __( 'Recipe Details', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-general',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_servings',
								'title' 	=> __( 'Display Servings', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_servings',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show servings by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'bottom',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_preptime',
								'title' 	=> __( 'Display Preparation Time', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_preptime',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show preparation time by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'top',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_cookingtime',
								'title' 	=> __( 'Display Cooking Time', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_cookingtime',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show cooking time by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'top',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_calories',
								'title' 	=> __( 'Display Calories', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_calories',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show calories by default', 'wpzoom-recipe-card' ),
									'default'		=> true,
                                    'preview'       => true,
                                    'preview_pos'	=> 'top',
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_section_rating_features',
						'title' 	=> __( 'Rating Feature', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-general',
						'callback' 	=> array( $this, 'section_rating_feature_cb' ),
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_user_ratings',
								'title' 	=> __( 'User Rating', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_user_ratings',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Allow visitors to vote your recipes.', 'wpzoom-recipe-card' ),
									'default'		=> true,
									'disabled'		=> false,
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_who_can_rate',
								'title' 	=> __( 'Who can rate?', 'wpzoom-recipe-card' ),
								'type'		=> 'select',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_who_can_rate',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Select who can rate your recipes.', 'wpzoom-recipe-card' ),
									'default'		=> 'everyone',
									'options' 		=> array(
										'loggedin' 	=> __( 'Only logged in users can rate recipes', 'wpzoom-recipe-card' ),
										'everyone' 	=> __( 'Everyone can rate recipes', 'wpzoom-recipe-card' ),
									)
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_rating_stars_color',
								'title' 	=> __( 'Rating Stars Color', 'wpzoom-recipe-card' ),
								'type'		=> 'colorpicker',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_rating_stars_color',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Change rating stars color of Recipe Card.', 'wpzoom-recipe-card' ),
									'default'		=> '#F2A123',
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_reset_ratings',
								'title' 	=> __( 'Reset Ratings', 'wpzoom-recipe-card' ),
								'type'		=> 'button',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_reset_ratings',
									'type'			=> 'button',
									'button_type'	=> 'secondary',
									'text' 			=> esc_html__( 'Reset Ratings', 'wpzoom-recipe-card' ),
									'description' 	=> esc_html__( 'Be careful, this action will reset all ratings to zero! NOTE: This action can\'t be reversed.', 'wpzoom-recipe-card' ),
								)
							),
						)
					),
				)
			),
			'appearance' => array(
				'tab_id' 		=> 'tab-appearance',
				'tab_title' 	=> __( 'Appearance', 'wpzoom-recipe-card' ),
				'option_group' 	=> 'wpzoom-recipe-card-settings-appearance',
				'option_name' 	=> self::$option,
				'sections' 		=> array(
					array(
						'id' 		=> 'wpzoom_section_recipe_template',
						'title' 	=> __( 'Recipe Template', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-appearance',
						'callback' 	=> array( $this, 'section_recipe_template_cb' ),
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_template',
								'title' 	=> __( 'Default Template', 'wpzoom-recipe-card' ),
								'type'		=> 'select',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_template',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Default template to use for all Recipe Cards.', 'wpzoom-recipe-card' ),
									'default'		=> 'default',
									'options' 		=> array(
										'default' 	=> __( 'Default', 'wpzoom-recipe-card' ),
										'newdesign' => __( 'New Design', 'wpzoom-recipe-card' ),
										'simple' 	=> __( 'Simple Design', 'wpzoom-recipe-card' ),
									)
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_primary_color',
								'title' 	=> __( 'Default Primary Color', 'wpzoom-recipe-card' ),
								'type'		=> 'colorpicker',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_primary_color',
									'class' 		=> 'wpzoom-rcb-field',
									'default'		=> '#FFA921',
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_section_snippets',
						'title' 	=> __( 'Recipe Buttons', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-appearance',
						'callback' 	=> array( $this, 'section_recipe_snippets' ),
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_snippets',
								'title' 	=> __( 'Automatically add Buttons', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_snippets',
									'class' 		=> 'wpzoom-rcb-field',
									'description'   => __( 'Automatically display buttons above the post content.', 'wpzoom-recipe-card' ),
									'default'		=> false
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_jump_to_recipe_text',
								'title' 	=> __( 'Jump to Recipe Text', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_jump_to_recipe_text',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add custom text for Jump to Recipe button.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Jump to Recipe', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_print_recipe_text',
								'title' 	=> __( 'Print Recipe Text', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_print_recipe_text',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Add custom text for Print Recipe button.', 'wpzoom-recipe-card' ),
									'default'		=> __( 'Print Recipe', 'wpzoom-recipe-card' ),
									'type'			=> 'text'
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_section_print',
						'title' 	=> __( 'Print', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-appearance',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_print',
								'title' 	=> __( 'Display Print Button', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_print',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Print button in recipe card', 'wpzoom-recipe-card' ),
									'default'		=> true
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_print_show_image',
								'title' 	=> __( 'Recipe Image', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_print_show_image',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Recipe Image on print sheet.', 'wpzoom-recipe-card' ),
									'default'		=> true
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_print_show_details',
								'title' 	=> __( 'Recipe Details', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_print_show_details',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Recipe Details (servings, preparation time, cooking time, calories) on print sheet.', 'wpzoom-recipe-card' ),
									'default'		=> true
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_print_show_summary_text',
								'title' 	=> __( 'Summary Text', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_print_show_summary_text',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Recipe Summary text on print sheet.', 'wpzoom-recipe-card' ),
									'default'		=> false
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_print_show_steps_image',
								'title' 	=> __( 'Steps Image', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_print_show_steps_image',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Steps Image on print sheet.', 'wpzoom-recipe-card' ),
									'default'		=> true
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_rcb_settings_pinterest',
						'title' 	=> __( 'Pinterest', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-appearance',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_display_pin',
								'title' 	=> __( 'Display Pin Button', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_display_pin',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Show Pinterest button in recipe card', 'wpzoom-recipe-card' ),
									'default'		=> false
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_pin_image',
								'title' 	=> __( 'Pin Image', 'wpzoom-recipe-card' ),
								'type'		=> 'select',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_pin_image',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Image to use for Pin Recipe.', 'wpzoom-recipe-card' ),
									'default'		=> 'recipe_image',
									'options' 		=> array(
										'recipe_image' => __( 'Recipe Image', 'wpzoom-recipe-card' ),
										'custom_image' => __( 'Custom Image per Recipe (Premium Only)', 'wpzoom-recipe-card' ),
									)
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_pin_description',
								'title' 	=> __( 'Pin Description', 'wpzoom-recipe-card' ),
								'type'		=> 'select',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_pin_description',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Text description to use for Pin Recipe.', 'wpzoom-recipe-card' ),
									'default'		=> 'recipe_name',
									'options' 		=> array(
										'recipe_name' => __( 'Recipe Name', 'wpzoom-recipe-card' ),
										'recipe_summary' => __( 'Recipe Summary', 'wpzoom-recipe-card' ),
										'custom_text' => __( 'Custom Text (Premium Only)', 'wpzoom-recipe-card' ),
									)
								)
							),
						)
					),
					array(
						'id' 		=> 'wpzoom_rcb_settings_google_fonts',
						'title' 	=> __( 'Google Fonts', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-appearance',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_enable_google_fonts',
								'title' 	=> __( 'Enable Google Fonts', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_enable_google_fonts',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'If you check this field, then it means that plugin will load Google Fonts to use them into blocks.', 'wpzoom-recipe-card' ),
									'default'		=> true
								)
							),
						)
					),
				)
			),
			'metadata' => array(
				'tab_id' 		=> 'tab-metadata',
				'tab_title' 	=> __( 'Metadata', 'wpzoom-recipe-card' ),
				'option_group' 	=> 'wpzoom-recipe-card-settings-metadata',
				'option_name' 	=> self::$option,
				'sections' 		=> array(
					array(
						'id' 		=> 'wpzoom_section_taxonomies',
						'title' 	=> __( 'Taxonomies', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-metadata',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_settings_course_taxonomy',
								'title' 	=> __( 'Course', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_course_taxonomy',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Make Course as taxonomy.', 'wpzoom-recipe-card' ),
									'default'		=> false,
									'disabled'		=> true,
									'badge' 		=> $soon_badge,
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_cuisine_taxonomy',
								'title' 	=> __( 'Cuisine', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_cuisine_taxonomy',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Make Cuisine as taxonomy.', 'wpzoom-recipe-card' ),
									'default'		=> false,
									'disabled'		=> true,
									'badge' 		=> $soon_badge,
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_settings_difficulty_taxonomy',
								'title' 	=> __( 'Difficulty', 'wpzoom-recipe-card' ),
								'type'		=> 'checkbox',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_settings_difficulty_taxonomy',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Make Difficulty as taxonomy.', 'wpzoom-recipe-card' ),
									'default'		=> false,
									'disabled'		=> true,
									'badge' 		=> $soon_badge,
								)
							),
						)
					)
				)
			)
		);

		$this->register_settings();
	}

	/**
	 * Add License tab to Settings
	 * Apply to filter 'wpzoom_rcb_before_register_settings'
	 *
	 * @since 1.2.0
	 * @param array $settings
	 * @return array
	 */
	public function settings_license() {
		if ( ! self::$license_key ) {
			$message = __( 'The license key is not inserted.', 'wpzoom-recipe-card' );
		} else {
		    if ( ! get_transient( 'wpzoom_rcb_plugin_license_message' ) ) {
		        set_transient( 'wpzoom_rcb_plugin_license_message', $this->check_license(), (60 * 60 * 24) );
		    }
		    $message = get_transient( 'wpzoom_rcb_plugin_license_message' );
		}

		$this->license_settings = array(
			'license' => array(
				'tab_id' 		=> 'tab-license',
				'tab_title' 	=> __( 'License', 'wpzoom-recipe-card' ),
				'option_group' 	=> 'wpzoom-recipe-card-settings-license',
				'option_name' 	=> self::$license_option,
				'sanitize_callback'	=> array( $this, 'sanitize_license' ),
				'sections' 		=> array(
					array(
						'id' 		=> 'wpzoom_section_license',
						'title' 	=> __( 'License', 'wpzoom-recipe-card' ),
						'page' 		=> 'wpzoom-recipe-card-settings-license',
						'callback' 	=> '__return_false',
						'fields' 	=> array(
							array(
								'id' 		=> 'wpzoom_rcb_plugin_license_key',
								'title' 	=> __( 'License Key', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_plugin_license_key',
									'class' 		=> 'wpzoom-rcb-field',
									'description' 	=> esc_html__( 'Enter your license key', 'wpzoom-recipe-card' ),
									'default'		=> '',
									'type'			=> 'text'
								)
							),
							array(
								'id' 		=> 'wpzoom_rcb_plugin_license_status',
								'title' 	=> __( 'License Status', 'wpzoom-recipe-card' ),
								'type'		=> 'input',
								'args' 		=> array(
									'label_for' 	=> 'wpzoom_rcb_plugin_license_status',
									'class' 		=> 'wpzoom-rcb-field',
									'default'		=> '',
									'type'			=> 'hidden',
									'badge' 		=> '<span class="wpzoom-rcb-badge wpzoom-rcb-field-'. ( !self::$license_status ? 'is_inactive' : 'is_active' ) .'">'. ( !self::$license_status ? __( 'inactive', 'wpzoom-recipe-card' ) : __( 'active', 'wpzoom-recipe-card' ) ) .'</span>' . $message,
								)
							)
						)
					)
				)
			)
		);

		if ( ! empty( trim(self::$license_key) ) ) {
			$this->license_settings['license']['sections'][0]['fields'][2] = array(
				'id' 				=> 'wpzoom_rcb_plugin_activate_license',
				'title' 			=> __( 'Activate License', 'wpzoom-recipe-card' ),
				'type'				=> 'button',
			);

			if ( self::$license_status !== false && self::$license_status == 'valid' ) {
				$this->license_settings['license']['sections'][0]['fields'][2]['args'] = array(
					'label_for' 	=> 'wpzoom_rcb_plugin_license_deactivate',
					'text' 			=> esc_html__( 'Deactivate License', 'wpzoom-recipe-card' ),
					'button_type'	=> 'secondary',
					'nonce'			=> array(
						'action' 	=> 'wpzoom_rcb_plugin_deactivate_license_nonce',
						'name'		=> '_wpzoom_rcb_plugin_license_deactivate_nonce'
					),
				);
			} else {
				$this->license_settings['license']['sections'][0]['fields'][2]['args'] = array(
					'label_for' 	=> 'wpzoom_rcb_plugin_license_activate',
					'text' 			=> esc_html__( 'Activate License', 'wpzoom-recipe-card' ),
					'button_type'	=> 'secondary',
					'nonce'			=> array(
						'action' 	=> 'wpzoom_rcb_plugin_activate_license_nonce',
						'name'		=> '_wpzoom_rcb_plugin_license_activate_nonce'
					),
				);
			}
		}

		$this->register_license_settings();
	}

	/**
	 * Register all Setting options
	 *
	 * @since 1.1.0
	 * @return boolean
	 */
	public function register_settings() {
		// filter hook
		$this->settings = apply_filters( 'wpzoom_rcb_before_register_settings', $this->settings );

		if ( empty( $this->settings ) ) {
			return;
		}

		foreach ( $this->settings as $key => $setting ) {
			$this->register_setting( $setting );
		}

		return true;
	}

	/**
	 * Register License Setting options
	 *
	 * @since 2.2.0
	 * @return boolean
	 */
	public function register_license_settings() {
		// filter hook
		$this->license_settings = apply_filters( 'wpzoom_rcb_before_register_license_settings', $this->license_settings );

		if ( empty( $this->license_settings ) ) {
			return;
		}

		foreach ( $this->license_settings as $key => $setting ) {
			$this->register_setting( $setting );
		}

		return true;
	}

	/**
	 * Register Setting
	 *
	 * @since 2.2.0
	 * @param array $setting
	 * @return void
	 */
	public function register_setting( $setting ) {
		$setting['sanitize_callback'] = isset( $setting['sanitize_callback'] ) ? $setting['sanitize_callback'] : array();
		register_setting( $setting['option_group'], $setting['option_name'], $setting['sanitize_callback'] );

		if ( isset( $setting['sections'] ) && is_array( $setting['sections'] ) ) {
			foreach ( $setting['sections'] as $section ) {
				if ( ! isset( $section['id'] ) ) {
					return;
				}
				add_settings_section( $section['id'], $section['title'], $section['callback'], $section['page'] );

				if ( isset( $section['fields'] ) && is_array( $section['fields'] ) ) {
					foreach ( $section['fields'] as $field ) {
						if ( ! isset( $field['id'] ) ) {
							return;
						}

						if ( method_exists( $this->_fields, $field['type'] ) ) {
							$field['callback'] = array( $this->_fields, $field['type'] );
						} else {
							$field['callback'] = '__return_false';
						}

						add_settings_field( $field['id'], $field['title'], $field['callback'], $section['page'], $section['id'], $field['args'] );
					}
				}
			}
		}
	}

	/**
	 * HTML output for Setting page
	 */
	public function settings_page() {
		// check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
	?>
		<div class="wrap">
			<?php do_action( 'wpzoom_rcb_welcome_banner' ); ?>

			<h1 style="margin-bottom: 15px"><?php echo esc_html( get_admin_page_title() ); ?></h1>

			<?php settings_errors(); ?>

			<?php if ( isset( $_GET['wpzoom_reset_settings'] ) && ! isset( $_GET['settings-updated'] ) ): ?>
				<div class="updated settings-error notice is-dismissible">
					<p><strong>Settings have been successfully reset.</strong></p>
				</div>
			<?php endif; ?>

			<div class="cols-wrap">
				<form id="wpzoom-recipe-card-settings" action="options.php" method="post">
					<ul class="wp-tab-bar">
						<?php foreach ( $this->settings as $setting ): ?>
							<?php if ( $setting['tab_id'] == 'tab-license' ) continue; ?>
							<?php if ( self::$active_tab === $setting['tab_id'] ): ?>
								<li class="wp-tab-active"><a href="?page=wpzoom-recipe-card-settings&tab=<?php echo $setting['tab_id'] ?>"><?php echo $setting['tab_title'] ?></a></li>
							<?php else: ?>
								<li><a href="?page=wpzoom-recipe-card-settings&tab=<?php echo $setting['tab_id'] ?>"><?php echo $setting['tab_title'] ?></a></li>
							<?php endif ?>
						<?php endforeach ?>
						<li id="wpzoom_rcb_btn_save_settings"><?php submit_button( 'Save Settings', 'primary', 'wpzoom_rcb_settings_save', false ); ?></li>
						<li id="wpzoom_rcb_btn_reset_settings"><input type="button" class="button button-secondary" name="wpzoom_rcb_reset_settings" id="wpzoom_rcb_reset_settings" value="Reset Settings"></li>
					</ul>
					<?php foreach ( $this->settings as $setting ): ?>
						<?php if ( $setting['tab_id'] == 'tab-license' ) continue; ?>
						<?php if ( self::$active_tab === $setting['tab_id'] ): ?>
							<div class="wp-tab-panel" id="<?php echo $setting['tab_id'] ?>">
								<?php
									settings_fields( $setting['option_group'] );
									do_settings_sections( $setting['option_group'] );
								?>
							</div>
						<?php else: ?>
							<div class="wp-tab-panel" id="<?php echo $setting['tab_id'] ?>" style="display: none;">
								<?php
									settings_fields( $setting['option_group'] );
									do_settings_sections( $setting['option_group'] );
								?>
							</div>
						<?php endif ?>
					<?php endforeach ?>
				</form>
				<div class="wpz_right-col">
					<div class="license-wrap wpz_license_column">
						<h2 class="headline"><?php _e( 'Activate Your License Key', 'wpzoom-recipe-card' ) ?></h2>
						<?php if ( ! self::$license_key || ! self::$license_status ): ?>
							<p>
							    <?php echo sprintf( __( 'Your license key provides access to <strong>Automatic Updates and Premium addons</strong>. You can find your license in <a href="https://www.wpzoom.com/account/licenses/" target="_blank">WPZOOM Members Area &rarr; Licenses</a>.', 'wpzoom' ) );
							     ?>
							</p>
						<?php endif ?>
						<form id="wpzoom-recipe-card-settings-license" action="options.php" method="post">
							<?php
								settings_fields( 'wpzoom-recipe-card-settings-license' );
								self::do_settings_sections( 'wpzoom-recipe-card-settings-license' );

								submit_button( 'Save License', 'primary', 'wpzoom_rcb_settings_save_license', false );
							?>
						</form>
					</div>

					<div class="license-wrap">
						<h2 class="headline"><?php _e( 'Follow @WPZOOM', 'wpzoom-recipe-card' ) ?></h2>
						<iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Fwpzoom&amp;width=84&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21&amp;appId=610643215638351" width="84" height="21" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowtransparency="true"></iframe>

						<br>
						<br>

						<a href="https://twitter.com/wpzoom" class="twitter-follow-button">Follow @wpzoom</a>
                        <script>!function (d, s, id) {
                                var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                                if (!d.getElementById(id)) {
                                    js = d.createElement(s);
                                    js.id = id;
                                    js.src = p + '://platform.twitter.com/widgets.js';
                                    fjs.parentNode.insertBefore(js, fjs);
                                }
                            }(document, 'script', 'twitter-wjs');</script>
					</div>
				</div>
			</div>
		</div>
	<?php
	}

	/**
	 * Enqueue scripts and styles
	 *
	 * @param string $hook
	 */
	public function scripts( $hook ) {
	    $pos = strpos( $hook, WPZOOM_RCB_SETTINGS_PAGE );

	    if ( $pos === false ) {
	        return;
	    }

	    // Add the color picker css file       
        wp_enqueue_style( 'wp-color-picker' );

	    wp_enqueue_style(
	    	'wpzoom-rcb-admin-style',
	    	untrailingslashit( WPZOOM_RCB_PLUGIN_URL ) . '/dist/assets/admin/css/style.css',
	    	array(),
	    	WPZOOM_RCB_VERSION
	    );

	    wp_enqueue_script(
	    	'wpzoom-rcb-admin-script',
	    	untrailingslashit( WPZOOM_RCB_PLUGIN_URL ) . '/dist/assets/admin/js/script.js',
	    	array( 'jquery', 'wp-color-picker' ),
	    	WPZOOM_RCB_VERSION
	    );

	    wp_localize_script( 'wpzoom-rcb-admin-script', 'WPZOOM_Settings', array(
	    	'ajaxUrl' => admin_url( 'admin-ajax.php' ),
	    	'ajax_nonce' => wp_create_nonce( "wpzoom-reset-settings-nonce" ),
	    ) );

	}

	/**
	 * Sanitize license
	 *
	 * @since 1.2.0
	 * @param array $new
	 * @return array
	 */
	public function sanitize_license( $new ) {
		$old_license = self::$license_key;
		$new_license = isset( $new['wpzoom_rcb_plugin_license_key'] ) ? trim( $new['wpzoom_rcb_plugin_license_key'] ) : $old_license;

		if( $old_license && $old_license != $new_license ) {
			// Delete status from old option array
			// Update options
			if ( self::$license_status ) {
				unset( self::$license_options['wpzoom_rcb_plugin_license_status'] );

				// new license has been entered, so must reactivate
				self::update_option( self::$license_options, self::$license_option );
			}
			// Delete status from new option array
			if ( isset($new['wpzoom_rcb_plugin_license_status']) ) {
				unset($new['wpzoom_rcb_plugin_license_status']);
			}
			// Delete transient
			delete_transient( 'wpzoom_rcb_plugin_license_message' );
		}
		return $new;
	}

	/**
	 * Constructs a renewal link
	 *
	 * @since 1.2.0
	 */
	public function get_renewal_link() {
	    // If a renewal link was passed in the config, use that
	    if ( '' != WPZOOM_RCB_RENEW_URL ) {
	        return WPZOOM_RCB_RENEW_URL;
	    }

	    if ( '' != WPZOOM_RCB_ITEM_ID && self::$license_key ) {
	        $url = esc_url( WPZOOM_RCB_STORE_URL );
	        $url .= '/checkout/?edd_license_key=' . self::$license_key . '&download_id=' . WPZOOM_RCB_ITEM_ID;
	        return $url;
	    }

	    // Otherwise return the WPZOOM_RCB_STORE_URL
	    return WPZOOM_RCB_STORE_URL;
	}

	/**
	 * Check if a license key is still valid
	 *
	 * @since 1.2.0
	 * @return void
	 */
	public function check_license() {
		$api_params = array(
			'edd_action' 	=> 'check_license',
			'license' 		=> self::$license_key,
			'item_name' 	=> urlencode( WPZOOM_RCB_ITEM_NAME ),
			'url'       	=> home_url()
		);

		// Call the custom API.
		$response = wp_remote_post( WPZOOM_RCB_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

		if ( is_wp_error( $response ) )
			return false;

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		// If response doesn't include license data, return
		if ( !isset( $license_data->license ) ) {
		    $message = __( 'Incorrect license key.', 'wpzoom-recipe-card' );
		    return $message;
		}

		// Get expire date
		$expires = false;
		if ( isset( $license_data->expires ) && 'lifetime' != $license_data->expires ) {
		    $expires = date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) );
		    $renew_link = '<a href="' . esc_url( $this->get_renewal_link() ) . '" target="_blank">' . __( 'Renew?', 'wpzoom-recipe-card' ) . '</a>';
		}
		elseif ( isset( $license_data->expires ) && 'lifetime' == $license_data->expires ) {
		    $expires = 'lifetime';
		}

		if ( $license_data->license == 'valid' ) {
		    $message = __( 'License key is active.', 'wpzoom-recipe-card' ) . ' ';
		    if ( ! self::$license_status ) {
		    	$message = '';
		    }
		    if ( isset( $expires ) && 'lifetime' != $expires ) {
		        $message .= sprintf( __( 'Expires %s.', 'wpzoom-recipe-card' ), $expires ) . ' ';
		    }
		    if ( isset( $expires ) && 'lifetime' == $expires ) {
		        $message .= __( 'Lifetime License.', 'wpzoom-recipe-card' );
		    }
		}
		else if ( $license_data->license == 'expired' ) {
		    if ( $expires ) {
		        $message = sprintf( __( 'License key expired %s.', 'wpzoom-recipe-card' ), $expires );
		    } else {
		        $message = __( 'License key has expired.', 'wpzoom-recipe-card' );
		    }
		    if ( $renew_link ) {
		        $message .= ' ' . $renew_link;
		    }
		}
		else if ( $license_data->license == 'invalid' ) {
		    $message = __( 'License key do not match.', 'wpzoom-recipe-card' );
		}
		else if ( $license_data->license == 'inactive' ) {
		    $message = __( 'License is <strong>inactive</strong>. Click on the <strong>Activate License</strong> button to activate it.', 'wpzoom-recipe-card' );
		}
		else if ( $license_data->license == 'disabled' ) {
		    $message = __( 'License key is disabled.', 'wpzoom-recipe-card' );
		}
		else if ( $license_data->license == 'site_inactive' ) {
		    $message = __( 'This license is inactive on this website. Click on the <strong>Activate License</strong> button to activate it.', 'wpzoom' );
		}
		else {
		    $message = __( 'Incorrect license key.', 'wpzoom-recipe-card' );
		}

		return $message;
	}

	/**
	 * Activate a License Key
	 *
	 * @since 1.2.0
	 * @return void
	 */
	public function activate_license() {
		// listen for our activate button to be clicked
		if( isset( $_POST['wpzoom_rcb_plugin_license_activate'] ) ) {
			// run a quick security check
		 	if( ! check_admin_referer( 'wpzoom_rcb_plugin_activate_license_nonce', '_wpzoom_rcb_plugin_license_activate_nonce' ) )
				return; // get out if we didn't click the Activate button

			// data to send in our API request
			$api_params = array(
				'edd_action' => 'activate_license',
				'license'    => self::$license_key,
				'item_id'    => WPZOOM_RCB_ITEM_ID, // The ID of the item in EDD
				'url'        => home_url()
			);

			// Call the custom API.
			$response = wp_remote_post( WPZOOM_RCB_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

			// make sure the response came back okay
			if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
				$message =  ( is_wp_error( $response ) && ! empty( $response->get_error_message() ) ) ? $response->get_error_message() : __( 'An error occurred, please try again.', 'wpzoom-recipe-card' );
			} else {
				$license_data = json_decode( wp_remote_retrieve_body( $response ) );

				if ( false === $license_data->success ) {
					switch( $license_data->error ) {
						case 'expired' :
							$message = sprintf(
								__( 'Your license key expired on %s.', 'wpzoom-recipe-card' ),
								date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) )
							);
							break;
						case 'revoked' :
							$message = __( 'Your license key has been disabled.', 'wpzoom-recipe-card' );
							break;
						case 'missing' :
							$message = __( 'Invalid license.', 'wpzoom-recipe-card' );
							break;
						case 'invalid' :
						case 'site_inactive' :
							$message = __( 'Your license is not active for this URL.', 'wpzoom-recipe-card' );
							break;
						case 'item_name_mismatch' :
							$message = sprintf( __( 'This appears to be an invalid license key for %s.', 'wpzoom-recipe-card' ), WPZOOM_RCB_ITEM_NAME );
							break;
						case 'no_activations_left':
							$message = __( 'Your license key has reached its activation limit.', 'wpzoom-recipe-card' );
							break;
						default :
							$message = __( 'An error occurred, please try again.', 'wpzoom-recipe-card' );
							break;
					}
				}
			}

			// Check if anything passed on a message constituting a failure
			if ( ! empty( $message ) ) {
				$base_url = admin_url( 'admin.php?page=' . WPZOOM_RCB_SETTINGS_PAGE );
				$redirect = add_query_arg( array( 'sl_activation' => 'false', 'message' => urlencode( $message ) ), $base_url );

				wp_redirect( $redirect );
				exit();
			}

			// $license_data->license will be either "valid" or "invalid"
			if ( $license_data && isset($license_data->license) ) {
				self::$license_options['wpzoom_rcb_plugin_license_status'] = $license_data->license;

				self::update_option( self::$license_options, self::$license_option );
				delete_transient( 'wpzoom_rcb_plugin_license_message' );
			}

			$base_url = admin_url( 'admin.php?page=' . WPZOOM_RCB_SETTINGS_PAGE );
			$redirect = add_query_arg( array( 'sl_activation' => 'true', 'message' => urlencode( $message ) ), $base_url );

			wp_redirect( $redirect );
			exit();
		}
	}

	/**
	 * Deactivate a License Key
	 * This will decrease the site count
	 *
	 * @since 1.2.0
	 * @return void
	 */
	public function deactivate_license() {

		// listen for our activate button to be clicked
		if( isset( $_POST['wpzoom_rcb_plugin_license_deactivate'] ) ) {

			// run a quick security check
		 	if( ! check_admin_referer( 'wpzoom_rcb_plugin_deactivate_license_nonce', '_wpzoom_rcb_plugin_license_deactivate_nonce' ) )
				return; // get out if we didn't click the Activate button

			// data to send in our API request
			$api_params = array(
				'edd_action' => 'deactivate_license',
				'license'    => self::$license_key,
				'item_name'  => urlencode( WPZOOM_RCB_ITEM_NAME ), // the name of our product in EDD
				'url'        => home_url()
			);

			// Call the custom API.
			$response = wp_remote_post( WPZOOM_RCB_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

			// make sure the response came back okay
			if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {

				if ( is_wp_error( $response ) ) {
					$message = $response->get_error_message();
				} else {
					$message = __( 'An error occurred, please try again.', 'wpzoom-recipe-card' );
				}

				$base_url = admin_url( 'admin.php?page=' . WPZOOM_RCB_SETTINGS_PAGE );
				$redirect = add_query_arg( array( 'sl_activation' => 'false', 'message' => urlencode( $message ) ), $base_url );

				wp_redirect( $redirect );
				exit();
			}

			// decode the license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			// $license_data->license will be either "deactivated" or "failed"
			if( $license_data->license == 'deactivated' ) {
				unset( self::$license_options['wpzoom_rcb_plugin_license_status'] );

				self::update_option( self::$license_options, self::$license_option );
				delete_transient( 'wpzoom_rcb_plugin_license_message' );
			}

			$base_url = admin_url( 'admin.php?page=' . WPZOOM_RCB_SETTINGS_PAGE );
			$redirect = add_query_arg( array( 'sl_activation' => 'true', 'message' => urlencode( $message ) ), $base_url );

			wp_redirect( $redirect );
			exit();

		}
	}

	/**
	 * This is a means of catching errors from the activation method above and displaying it to the customer
	 *
	 * @since 1.1.0
	 */
	public function admin_notices() {
		if ( isset( $_GET['sl_activation'] ) && ! empty( $_GET['message'] ) ) {

			switch( $_GET['sl_activation'] ) {

				case 'false':
					$message = urldecode( $_GET['message'] );
					?>
					<div class="error">
						<p><?php echo $message; ?></p>
					</div>
					<?php
					break;

				case 'true':
				default:
					// Developers can put a custom success message here for when activation is successful if they way.
					break;

			}
		}
	}

	/**
	 * Reset settings to default values
	 * @since 1.1.0
	 * @return void
	 */
	public function reset_settings() {
		check_ajax_referer( 'wpzoom-reset-settings-nonce', 'security' );

		$defaults = self::get_defaults();

		if ( empty( $defaults ) ) {
			$response = array(
			 	'status' => '304',
			 	'message' => 'NOT',
			);

			wp_send_json_error( $response );
		}

		$response = array(
		 	'status' => '200',
		 	'message' => 'OK',
		);

		self::update_option( $defaults );

		wp_send_json_success( $response );
	}

	/**
	 * Reset all ratings
	 * 
	 * @since 2.3.2
	 * @return void
	 */
	public function reset_ratings() {
		check_ajax_referer( 'wpzoom-reset-settings-nonce', 'security' );

		global $wpdb;

		if ( $wpdb->query('TRUNCATE TABLE ' . WPZOOM_Rating_Stars::$tablename ) ) {

			$response = array(
				'message' => esc_html__( 'All ratings have been reset.', 'wpzoom-recipe-card' )
			);

			wp_send_json_success( $response );
			
		}
	}

	/**
	 * Close Welcome banner
	 *
	 * @since 1.2.0
	 * @return void
	 */
	public function welcome_banner_close() {
		check_ajax_referer( 'wpzoom-reset-settings-nonce', 'security' );

		if ( delete_transient( 'wpzoom_rcb_welcome_banner' ) ) {
			$response = array(
			 	'status' => '200',
			 	'message' => 'OK',
			);
			
			wp_send_json_success( $response );
		}
		else {
			$response = array(
			 	'status' => '304',
			 	'message' => 'NOT',
			);
			
			wp_send_json_error( $response );
		}
	}

	/**
	 * Prints out all settings sections added to a particular settings page
	 *
	 * @since 2.2.0
	 * @param string $page The slug name of the page whose settings sections you want to output.
	 * @return void
	 */
	public static function do_settings_sections( $page ) {
	    global $wp_settings_sections, $wp_settings_fields;

	    if ( ! isset( $wp_settings_sections[ $page ] ) ) {
	        return;
	    }

	    foreach ( (array) $wp_settings_sections[ $page ] as $section ) {
	        if ( $section['title'] ) {
	            echo "<h2 class=\"form-section-title\">{$section['title']}</h2>\n";
	        }

	        if ( $section['callback'] ) {
	            call_user_func( $section['callback'], $section );
	        }

	        if ( ! isset( $wp_settings_fields ) || ! isset( $wp_settings_fields[ $page ] ) || ! isset( $wp_settings_fields[ $page ][ $section['id'] ] ) ) {
	            continue;
	        }
	        echo '<div class="form-wrap">';
	            foreach ( (array) $wp_settings_fields[ $page ][ $section['id'] ] as $field ) {
	                $class = '';

	                if ( ! empty( $field['args']['class'] ) ) {
	                    $class = ' class="' . esc_attr( $field['args']['class'] ) . '"';
	                }

	                echo "<div{$class}>";

	                if ( ! empty( $field['args']['label_for'] ) ) {
	                    echo '<div class="form-row-label"><label for="' . esc_attr( $field['args']['label_for'] ) . '">' . $field['title'] . '</label></div>';
	                } else {
	                    echo '<div class="form-row-label">' . $field['title'] . '</div>';
	                }

	                echo '<div class="form-row-field">';
	                call_user_func( $field['callback'], $field['args'] );
	                echo '</div>';
	                echo '</div>';
	            }
	        echo '</div>';
	    }
	}

	// section callbacks can accept an $args parameter, which is an array.
	// $args have the following keys defined: title, id, callback.
	// the values are defined at the add_settings_section() function.
	public function section_defaults_cb( $args ) {
	?>
	 	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Default configurations for new Recipe Card blocks.', 'wpzoom-recipe-card' ) ?></p>
	<?php
	}

	public function section_rating_feature_cb( $args ) {
	?>
	 	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Recipe Rating shown in the Recipe Card and Recipe Metadata.', 'wpzoom-recipe-card' ) ?></p>
	<?php
	}

	public function section_recipe_template_cb( $args ) {
	?>
	 	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'You will get access to more Recipe Templates with the Premium version.', 'wpzoom-recipe-card' ) ?></p>
	<?php
	}

	public function section_recipe_snippets( $args ) {
	?>
	 	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Display Jump to Recipe and Print Recipe buttons.', 'wpzoom-recipe-card' ) ?></p>
	<?php
	}
}

new WPZOOM_Settings();
