<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.1.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPZOOM_Assets_Manager' ) ) {
	/**
	 * Main WPZOOM_Assets_Manager Class.
	 *
	 * @since 1.1.0
	 */
	class WPZOOM_Assets_Manager {
		/**
		 * This plugin's instance.
		 *
		 * @var WPZOOM_Assets_Manager
		 * @since 1.1.0
		 */
		private static $instance;

		/**
		 * Provides singleton instance.
		 *
		 * @since 1.1.0
		 * @return self instance
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new WPZOOM_Assets_Manager();
			}

			return self::$instance;
		}

		/**
		 * The base directory path.
		 *
		 * @var string $_dir
		 */
		private $_dir;

		/**
		 * The base URL path.
		 *
		 * @var string $_url
		 */
		private $_url;

		/**
		 * The Plugin version.
		 *
		 * @var string $_slug
		 */
		public $_slug;

		/**
		 * The Constructor.
		 */
		private function __construct() {
			$this->_slug = 'wpzoom-rcb-block';
			$this->_url  = untrailingslashit( WPZOOM_RCB_PLUGIN_URL );

			add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );
			add_action( 'enqueue_block_assets', array( $this, 'load_icon_fonts' ) );
			add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );

			// Include admin scripts & styles
            add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );
		}

		/**
		 * Get array of dependencies.
		 *
		 * @param string|string $handle The handle slug.
		 *
		 * @since 1.1.0
		 */
		public function get_dependencies( $handle ) {
			$dependencies = array();

			if ( $this->_slug . '-js' === $handle ) {
				$dependencies = array( 'wp-editor', 'wp-components', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-compose' );
			}
			elseif ( $this->_slug . '-editor-css' === $handle ) {
				$dependencies = array( 'wp-edit-blocks' );
			}
			elseif ( $this->_slug . '-script' === $handle ) {
				$dependencies = array( 'jquery' );
			}
			elseif ( $this->_slug . '-icon-fonts-css' === $handle ) {
				$dependencies = array( 'wp-edit-blocks' );
			}
			elseif ( 'wpzoom-rating-stars-script' === $handle ) {
				$dependencies = array( 'jquery' );
			}
            elseif ( $this->_slug . '-masonry-gallery' === $handle ) {
                $dependencies = array( 'jquery', 'imagesloaded' );
            }

			return $dependencies;
		}

		/**
		 * Enqueue Gutenberg block assets for both frontend + backend.
		 *
		 * `wp-blocks`: includes block type registration and related functions.
		 *
		 * @since 1.1.0
		 */
		public function block_assets() {
            if ( is_admin() ) {
                
                wp_enqueue_style(
                    $this->_slug . '-style-css', // Handle.
                    $this->asset_source( '', 'blocks.style.build.css' ), // Block style CSS.
                    $this->get_dependencies( $this->_slug . '-style-css' ), // Dependency to include the CSS after it.
                    WPZOOM_RCB_VERSION
                );

                // Enable Google Fonts
                if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_enable_google_fonts') ) {
                    wp_enqueue_style(
                        $this->_slug . '-google-font',
                        'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i',
                        false
                    );
                }

            } else {

                if ( has_block( 'wpzoom-recipe-card/block-details' ) || 
                     has_block( 'wpzoom-recipe-card/block-ingredients' ) || 
                     has_block( 'wpzoom-recipe-card/block-directions' ) || 
                     has_block( 'wpzoom-recipe-card/block-print-recipe' ) || 
                     has_block( 'wpzoom-recipe-card/block-jump-to-recipe' ) || 
                     has_block( 'wpzoom-recipe-card/block-recipe-card' ) ||
                     has_block( 'wpzoom-recipe-card/block-nutrition' )
                ) {

                    // Scripts.
                    wp_enqueue_script(
                        $this->_slug . '-script',
                        $this->asset_source( 'js', 'script.js' ),
                        $this->get_dependencies( $this->_slug . '-script' ),
                        WPZOOM_RCB_VERSION,
                        true
                    );

                    wp_enqueue_script(
                        $this->_slug . '-pinit',
                        'https://assets.pinterest.com/js/pinit.js',
                        array(),
                        false,
                        true
                    );

                    // Styles.
                    wp_enqueue_style(
                        $this->_slug . '-style-css', // Handle.
                        $this->asset_source( '', 'blocks.style.build.css' ), // Block style CSS.
                        $this->get_dependencies( $this->_slug . '-style-css' ), // Dependency to include the CSS after it.
                        WPZOOM_RCB_VERSION
                    );

                    // Enable Google Fonts
                    if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_enable_google_fonts') ) {
                        wp_enqueue_style(
                            $this->_slug . '-google-font',
                            'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i',
                            false
                        );
                    }

                    /**
                     * Localize script data.
                     */
                    $this->localize_script(
                        $this->_slug . '-script',
                        'wpzoomRecipeCard',
                        array(
                            'pluginURL' => WPZOOM_RCB_PLUGIN_URL,
                            'homeURL' => self::get_home_url(),
                            'permalinks' => get_option( 'permalink_structure' ),
                            'ajax_url' => admin_url( 'admin-ajax.php' ),
                            'nonce' => wp_create_nonce( 'wpzoom_rcb' ),
                            'api_nonce' => wp_create_nonce( 'wp_rest' ),
                        )
                    );

                    if ( ! empty( self::get_custom_css() ) ) {
                        wp_add_inline_style( $this->_slug . '-style-css', self::get_custom_css() );
                    }
                    
                }

                if ( has_block( 'wpzoom-recipe-card/block-recipe-card' ) ) {
                    wp_enqueue_script(
                        $this->_slug . '-adjustable-servings',
                        $this->asset_source( 'js', 'adjustable-servings.js' ),
                        $this->get_dependencies( $this->_slug . '-adjustable-servings' ),
                        WPZOOM_RCB_VERSION,
                        true
                    );

                    wp_enqueue_script(
                        $this->_slug . '-masonry-gallery',
                        $this->asset_source( 'js', 'masonry-gallery.js' ),
                        $this->get_dependencies( $this->_slug . '-masonry-gallery' ),
                        WPZOOM_RCB_VERSION,
                        true
                    );
                }

            }
            
		}

		/**
		 * Enqueue Gutenberg block assets for backend editor.
		 *
		 * `wp-blocks`: includes block type registration and related functions.
		 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
		 * `wp-i18n`: To internationalize the block's text.
		 *
		 * @since 1.1.0
		 */
        public function editor_assets() {
            global $post;

        	$options = WPZOOM_Settings::get_settings();

            // Scripts.
            wp_enqueue_script(
                $this->_slug . '-js', // Handle.
                $this->asset_source( '', 'blocks.build.js' ), // Block.build.js: We register the block here. Built with Webpack.
                $this->get_dependencies( $this->_slug . '-js' ), // Dependencies, defined above.
                WPZOOM_RCB_VERSION,
                true // Enqueue the script in the footer.
            );

            wp_enqueue_script(
                $this->_slug . '-masonry-gallery',
                $this->asset_source( 'js', 'masonry-gallery.js' ),
                $this->get_dependencies( $this->_slug . '-masonry-gallery' ),
                WPZOOM_RCB_VERSION,
                true
            );

            // Tell to WordPress that our script contains translations
            // this function was added in 5.0 version
            if ( function_exists( 'wp_set_script_translations' ) ) {
	            wp_set_script_translations( $this->_slug .'-js', WPZOOM_RCB_TEXT_DOMAIN, WPZOOM_RCB_PLUGIN_DIR . 'languages' );
            }

            // Styles.
            wp_enqueue_style(
                $this->_slug . '-editor-css', // Handle.
                $this->asset_source( '', 'blocks.editor.build.css' ), // Block editor CSS.
                $this->get_dependencies( $this->_slug . '-editor-css' ), // Dependency to include the CSS after it.
                WPZOOM_RCB_VERSION
            );

            /**
             * Localize script data.
             */
            $this->localize_script(
                $this->_slug . '-js',
                'wpzoomRecipeCard',
                array(
                    'version' => WPZOOM_RCB_VERSION,
                    'textdomain' => WPZOOM_RCB_TEXT_DOMAIN,
                    'pluginURL' => WPZOOM_RCB_PLUGIN_URL,
                    'post_permalink' => str_replace( '?p=', '', get_the_permalink( $post->ID ) ),
                    'post_thumbnail_url' => get_the_post_thumbnail_url( $post->ID ),
                    'post_thumbnail_id' => get_post_thumbnail_id( $post->ID ),
                    'post_title' => $post->post_title,
                    'post_author_name' => get_the_author_meta( 'display_name', $post->post_author ),
                    'is_pro' => WPZOOM_Recipe_Card_Block_Gutenberg::is_pro(),
                    'license_status' => WPZOOM_Settings::get_license_status(),
                    'setting_options' => ( !empty( $options ) ? $options : WPZOOM_Settings::get_defaults() ),
                    'availableTerms' => array(),
                    'nutritionFactsLabel' => WPZOOM_Nutrition_Block::$labels
                )
            );
        }

        /**
         * Enqueue admin scripts and styles
         *
         * @since 2.2.0
         */
        public function admin_scripts() {
        	wp_enqueue_style(
        		'wpzoom-rcb-admin-css',
        		$this->asset_source( '', 'assets/admin/css/admin.css' ),
        		$this->get_dependencies( 'wpzoom-rcb-admin-css' ),
        		WPZOOM_RCB_VERSION
        	);
        }


		/**
		 * Load icon fonts.
		 *
		 * To make backward compatibility we include icons from version 1.1.0
		 * That's why we named it 'oldicon'
		 *
		 * @since 1.1.0
		 */
		public function load_icon_fonts() {
            // enqueue all icon fonts only in admin panel
            if ( is_admin() ) {

                wp_enqueue_style(
                    $this->_slug . '-icon-fonts-css', // Handle.
                    $this->asset_source( 'css', 'icon-fonts.build.css' ), // Block editor CSS.
                    $this->get_dependencies( $this->_slug . '-icon-fonts-css' ), // Dependency to include the CSS after it.
                    WPZOOM_RCB_VERSION
                );

            }

            if ( ! is_admin() && ( has_block( 'wpzoom-recipe-card/block-details' ) || has_block( 'wpzoom-recipe-card/block-recipe-card' ) ) ) {

                wp_enqueue_style(
                    $this->_slug . '-icon-fonts-css', // Handle.
                    $this->asset_source( 'css', 'icon-fonts.build.css' ), // Block editor CSS.
                    $this->get_dependencies( $this->_slug . '-icon-fonts-css' ), // Dependency to include the CSS after it.
                    WPZOOM_RCB_VERSION
                );

            }
		}

		/**
		 * Source assets.
		 *
		 * @since 1.1.0
		 * @param string|string $type The type of resource.
		 * @param string|string $directory Any extra directories needed.
		 */
		public function asset_source( $type = 'js', $directory = null ) {
			if ( 'js' === $type || 'css' === $type ) {
				return $this->_url . '/dist/assets/' . $type . '/' . $directory;
			} else {
				return $this->_url . '/dist/' . $directory;
			}
		}

		/**
		 * Enqueue localization data.
		 *
		 * @since 1.1.0
		 * @access public
		 */
		public function localize_script( $handle, $name, $data ) {
			wp_localize_script( $handle, $name, $data );
		}

        /**
         * Add custom inline styles from Settings
         * 
         * @since 2.4.0
         */
        public static function get_custom_css() {
            $custom_css = '';

            $rating_stars_color = WPZOOM_Settings::get('wpzoom_rcb_settings_rating_stars_color');
            $cta_ig_bg_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_bg_color' );
            $cta_ig_text_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_text_color' );
            $cta_pin_bg_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_bg_color' );
            $cta_pin_text_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_text_color' );
            $cta_fb_bg_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_facebook_cta_bg_color' );
            $cta_fb_text_color = WPZOOM_Settings::get( 'wpzoom_rcb_settings_facebook_cta_text_color' );

            if ( ! empty( $rating_stars_color ) ) {
                $custom_css .= "
                    .wp-block-wpzoom-recipe-card-block-recipe-card ul.wpzoom-rating-stars>li.fa-star {
                        color: {$rating_stars_color};
                    }";
            }

            if ( ! empty( $cta_ig_bg_color ) || ! empty( $cta_ig_text_color ) ) {
                $custom_css .= "
                    .wp-block-wpzoom-recipe-card-block-recipe-card .recipe-card-cta-instagram {
                        background-color: {$cta_ig_bg_color};
                        color: {$cta_ig_text_color};
                    }";
            }

            if ( ! empty( $cta_pin_bg_color ) || ! empty( $cta_pin_text_color ) ) {
                $custom_css .= "
                    .wp-block-wpzoom-recipe-card-block-recipe-card .recipe-card-cta-pinterest {
                        background-color: {$cta_pin_bg_color};
                        color: {$cta_pin_text_color};
                    }";
            }

            if ( ! empty( $cta_fb_bg_color ) || ! empty( $cta_fb_text_color ) ) {
                $custom_css .= "
                    .wp-block-wpzoom-recipe-card-block-recipe-card .recipe-card-cta-facebook {
                        background-color: {$cta_fb_bg_color};
                        color: {$cta_fb_text_color};
                    }";
            }

            return $custom_css;
        }

        /**
         * Compatibility with multilingual plugins for home URL.
         *
         * @since 2.7.2
         */
        public static function get_home_url() {
            $home_url = home_url();

            // Polylang Compatibility.
            if ( function_exists( 'pll_home_url' ) ) {
                $home_url = pll_home_url();
            }

            // Add trailing slash unless there are query parameters.
            if ( false === strpos( $home_url, '?' ) ) {
                $home_url = trailingslashit( $home_url );
            }

            return $home_url;
        }
	}
}

WPZOOM_Assets_Manager::instance();
