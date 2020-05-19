<?php
/**
 * Template Manager
 *
 * @since   2.8.2
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPZOOM_Template_Manager' ) ) {
	/**
	 * Main WPZOOM_Template_Manager Class.
	 *
	 * @since 2.8.2
	 */
	class WPZOOM_Template_Manager {
		/**
		 * This plugin's instance.
		 *
		 * @var WPZOOM_Template_Manager
		 * @since 2.8.2
		 */
		private static $instance;

		/**
		 * Provides singleton instance.
		 *
		 * @since 2.8.2
		 * @return self instance
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new WPZOOM_Template_Manager();
                self::action_hooks();
			}

			return self::$instance;
		}

        /**
         * Directory name where custom templates for this plugin should be found in the theme.
         *
         * @since 2.8.2
         * @type string
         */
        protected static $theme_template_directory = 'wpzoom-recipe-card';
     
        /**
         * Reference to the root directory path of this plugin.
         *
         * @since 2.8.2
         * @type string
         */
        protected static $plugin_directory = WPZOOM_RCB_PLUGIN_DIR;

        /**
         * Load actions
         *
         * @access private
         * @return void
         */
        private static function action_hooks() {
            add_filter( 'wpzoom_rcb_templates', __CLASS__ . '::register_templates', 10 );
        }

        /**
         * Register Recipe Card Templates
         * 
         * @since 2.8.2
         * @return array The templates array
         */
        public static function register_templates() {
            $templates = array(
                'default'   => __( 'Default', 'wpzoom-recipe-card' ),
                'newdesign' => __( 'New Design', 'wpzoom-recipe-card' ),
                'simple'    => __( 'Simple Design', 'wpzoom-recipe-card' ),
                'accent-color-header' => __( 'Accent Color Header', 'wpzoom-recipe-card' ),
            );

            return $templates;
        }

        /**
         * Get recipe card template
         * 
         * @since 2.8.2
         * 
         * @param  string $style        The recipe card style name.
         * @param  array $variables     Variables array to be passed to template.
         * @param  string $slug         The recipe card templates slug.
         * @return void                 Template HTML
         */
        public static function get_template( $style = 'default', $variables = array(), $slug = 'rcb' ) {
            ob_start();
            extract( $variables );
            include( self::get_template_part( $slug, $style, false ) );
            $block_content = ob_get_contents();
            ob_end_clean();
            return $block_content;
        }

        /**
         * Get plugin template directory
         * @return string
         */
        public static function get_templates_dir() {
            return WPZOOM_RCB_PLUGIN_DIR . 'templates/recipe/';
        }

        /**
         * Retrieves a template part
         *
         * @since 2.8.2
         *
         * Taken from bbPress
         *
         * @param string $slug
         * @param string $name Optional. Default null
         *
         * @uses  WPZOOM_Template_Manager::locate_template()
         * @uses  load_template()
         * @uses  get_template_part()
         */
        public static function get_template_part( $slug, $name = null, $load = true ) {
            // Execute code for this part
            do_action( 'get_template_part_' . $slug, $slug, $name );
         
            // Setup possible parts
            $templates = array();
            if ( isset( $name ) )
                $templates[] = $slug . '-' . $name . '.php';
            $templates[] = $slug . '.php';
         
            // Allow template parts to be filtered
            $templates = apply_filters( 'wpzoom_rcb_get_template_part', $templates, $slug, $name );
         
            // Return the part that is found
            return self::locate_template( $templates, $load, false );
        }

        /**
         * Retrieve the name of the highest priority template file that exists.
         *
         * Searches in the STYLESHEETPATH before TEMPLATEPATH so that themes which
         * inherit from a parent theme can just overload one file. If the template is
         * not found in either of those, it looks in the theme-compat folder last.
         *
         * Taken from bbPress
         *
         * @since 2.8.2
         *
         * @param string|array $template_names  Template file(s) to search for, in order.
         * @param bool $load                    If true the template file will be loaded if it is found.
         * @param bool $require_once            Whether to require_once or require. Default true.
         *                                      Has no effect if $load is false.
         * @return string                       The template filename if one is located.
         */
        public static function locate_template( $template_names, $load = false, $require_once = true ) {
            // No file found yet
            $located = false;
         
            // Try to find a template file
            foreach ( (array) $template_names as $template_name ) {
         
                // Continue if template is empty
                if ( empty( $template_name ) )
                    continue;
         
                // Trim off any slashes from the template name
                $template_name = ltrim( $template_name, '/' );
         
                // Check child theme first
                if ( file_exists( trailingslashit( get_stylesheet_directory() ) . self::$theme_template_directory . $template_name ) ) {
                    $located = trailingslashit( get_stylesheet_directory() ) . self::$theme_template_directory . $template_name;
                    break;
         
                // Check parent theme next
                } elseif ( file_exists( trailingslashit( get_template_directory() ) . self::$theme_template_directory . $template_name ) ) {
                    $located = trailingslashit( get_template_directory() ) . self::$theme_template_directory . $template_name;
                    break;
         
                // Check theme compatibility last
                } elseif ( file_exists( trailingslashit( self::get_templates_dir() ) . $template_name ) ) {
                    $located = trailingslashit( self::get_templates_dir() ) . $template_name;
                    break;
                }
            }
         
            if ( ( true == $load ) && ! empty( $located ) )
                load_template( $located, $require_once );
         
            return $located;
        }
	}
}

WPZOOM_Template_Manager::instance();
