<?php
/**
 * Load assets for our blocks.
 *
 * @since 3.2.1
 *
 * @see https://github.com/godaddy-wordpress/coblocks/blob/master/includes/class-coblocks-block-assets.php
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Load general assets for our blocks.
 *
 * @since 3.2.1
 */
class WPZOOM_Block_Assets {


    /**
     * This plugin's instance.
     *
     * @var WPZOOM_Block_Assets
     */
    private static $instance;

    /**
     * Registers the plugin.
     *
     * @return WPZOOM_Block_Assets
     */
    public static function register() {
        if ( null === self::$instance ) {
            self::$instance = new WPZOOM_Block_Assets();
        }

        return self::$instance;
    }

    /**
     * The Plugin slug.
     *
     * @var string $slug
     */
    private $slug;

    /**
     * The Constructor.
     */
    public function __construct() {
        $this->slug = 'wpzoom-recipe-card';

        add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );
        add_action( 'init', array( $this, 'editor_assets' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'editor_scripts' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'frontend_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'frontend_scripts' ) );
    }

    /**
     * Loads the asset file for the given script or style.
     * Returns a default if the asset file is not found.
     *
     * @param string $filepath The name of the file without the extension.
     *
     * @return array The asset file contents.
     */
    public function get_asset_file( $filepath ) {
        $asset_path = WPZOOM_RCB_PLUGIN_DIR . $filepath . '.asset.php';

        return file_exists( $asset_path )
            ? include $asset_path
            : array(
                'dependencies' => array(),
                'version'      => WPZOOM_RCB_VERSION,
            );
    }

    /**
     * Enqueue block assets for use within Gutenberg.
     *
     * @access public
     */
    public function block_assets() {
        global $post;

        // Only load the front end CSS if a WPZOOM_RCB is in use.
        $has_wpzoom_rcb = ! is_singular();

        if ( ! is_admin() && is_singular() ) {
            $wp_post = get_post( $post );

            // This is similar to has_block() in core, but will match anything
            // in the wpzoom-recipe-card/* namespace.
            if ( $wp_post instanceof WP_Post ) {
                $has_wpzoom_rcb = ! empty(
                    array_filter(
                        array(
                            false !== strpos( $wp_post->post_content, '<!-- wp:wpzoom-recipe-card/' ),
                        )
                    )
                );
            }
        }

        if ( ! $has_wpzoom_rcb && ! $this->is_page_gutenberg() ) {
            return;
        }

        // Styles.
        $name       = $this->slug . '-style';
        $filepath   = 'dist/' . $name;
        $asset_file = $this->get_asset_file( $filepath );
        $rtl        = ! is_rtl() ? '' : '-rtl';

        wp_enqueue_style(
            $this->slug . '-frontend',
            WPZOOM_RCB_PLUGIN_URL . $filepath . $rtl . '.css',
            array(),
            $asset_file['version']
        );

        // Load Google Fonts.
        if ( '1' === WPZOOM_Settings::get( 'enable_google_fonts' ) ) {
            wp_enqueue_style(
                $this->slug . '-google-font',
                'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i&display=swap',
                false
            );
        }
    }

    /**
     * Enqueue block assets for use within Gutenberg.
     *
     * @access public
     */
    public function editor_assets() {
        // Styles.
        $name       = $this->slug . '-editor';
        $filepath   = 'dist/' . $name;
        $asset_file = $this->get_asset_file( $filepath );
        $rtl        = ! is_rtl() ? '' : '-rtl';

        wp_register_style(
            $this->slug . '-editor',
            WPZOOM_RCB_PLUGIN_URL . $filepath . $rtl . '.css',
            array(),
            $asset_file['version']
        );

        // Scripts.
        $name       = $this->slug . '-script';
        $filepath   = 'dist/' . $name;
        $asset_file = $this->get_asset_file( $filepath );

        wp_register_script(
            $this->slug . '-editor',
            WPZOOM_RCB_PLUGIN_URL . $filepath . '.js',
            array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
            $asset_file['version'],
            true
        );

        wp_localize_script(
            $this->slug . '-editor',
            'wpzoomRecipeCard',
            array(
                'pluginURL'             => WPZOOM_RCB_PLUGIN_URL,
                'assetsDir'             => WPZOOM_RCB_PLUGIN_DIR . '/dist/assets',
                'licenseStatus'         => WPZOOM_Settings::get_license_status(),
                'settingOptions'        => ( !empty( $options ) ? $options : WPZOOM_Settings::get_defaults() ),
                'nutritionFactsLabel'   => WPZOOM_Nutrition_Block::$labels
            )
        );

    }

    /**
     * Enqueue front-end assets for blocks.
     *
     * @access public
     * @since 3.2.1
     */
    public function frontend_scripts() {
        global $post;

        // Custom scripts are not allowed in AMP, so short-circuit.
        if ( WPZOOM_Recipe_Card()->is_amp() ) {
            return;
        }

        // Define where the asset is loaded from.
        $dir = WPZOOM_Recipe_Card()->asset_source( 'js' );

        // Define where the vendor asset is loaded from.
        $vendors_dir = WPZOOM_Recipe_Card()->asset_source( 'js', 'vendors' );

        // Scripts for Recipe Card Block.
        if ( $this->is_page_gutenberg() && has_block( $this->slug . '/block-recipe-card' ) ) {
            $attributes = array();
            $wp_post = get_post( $post );

            if ( $wp_post instanceof WP_Post ) {
                $parsed_blocks = parse_blocks( $wp_post->post_content );

                foreach ( $parse_blocks as $key => $block ) {
                    if ( $this->slug . '/block-recipe-card' === $block['blockName'] ) {
                        $attributes = $block['attrs'];
                    }
                }
            }

            echo '<pre>';
            print_r($attributes);
            echo '</pre>';

            wp_enqueue_script(
                $this->slug . '-adjustable-servings',
                $dir . 'wpzoom-adjustable-servings.js',
                array(),
                WPZOOM_RCB_VERSION,
                true
            );

            wp_enqueue_script(
                $this->slug . '-masonry',
                $dir . 'wpzoom-masonry.js',
                array( 'jquery', 'masonry', 'imagesloaded' ),
                WPZOOM_RCB_VERSION,
                true
            );

            wp_enqueue_script(
                'magnific-popup',
                $vendors_dir . '/magnific-popup.js',
                array( 'jquery' ),
                WPZOOM_RCB_VERSION,
                true
            );

            // Load Pinterest script.
            if ( '1' === WPZOOM_Settings::get( 'load_pinterest_script' ) ) {
                wp_enqueue_script(
                    $this->slug . '-pinit',
                    'https://assets.pinterest.com/js/pinit.js',
                    array(),
                    false,
                    true
                );
            }

            // Load FitVids.js
            if ( '1' === WPZOOM_Settings::get( 'load_fitvids_script' ) ) {
                wp_enqueue_script(
                    'fitvids',
                    $vendors_dir . '/fitvids.js',
                    array( 'jquery' ),
                    '1.1',
                    true
                );
            }
        }
    }

    /**
     * Enqueue editor scripts for blocks.
     *
     * @access public
     * @since 3.2.1
     */
    public function editor_scripts() {
        // Define where the vendor asset is loaded from.
        $vendors_dir = WPZOOM_Recipe_Card()->asset_source( 'js', 'vendors' );

        // Load FitVids.js
        if ( '1' === WPZOOM_Settings::get( 'load_fitvids_script' ) ) {
            wp_enqueue_script(
                'fitvids',
                $vendors_dir . '/fitvids.js',
                array( 'jquery' ),
                '1.1',
                true
            );
        }
    }

    /**
     * Return whether a post type should display the Block Editor.
     *
     * @param string $post_type The post_type slug to check.
     */
    protected function is_post_type_gutenberg( $post_type ) {
        return use_block_editor_for_post_type( $post_type );
    }

    /**
     * Return whether the page we are on is loading the Block Editor.
     */
    protected function is_page_gutenberg() {
        if ( ! is_admin() ) {
            return false;
        }

        $admin_page = wp_basename( esc_url( $_SERVER['REQUEST_URI'] ) );

        if ( false !== strpos( $admin_page, 'post-new.php' ) && empty( $_GET['post_type'] ) ) {
            return true;
        }

        if ( false !== strpos( $admin_page, 'post-new.php' ) && isset( $_GET['post_type'] ) && $this->is_post_type_gutenberg( $_GET['post_type'] ) ) {
            return true;
        }

        if ( false !== strpos( $admin_page, 'post.php' ) ) {
            $wp_post = get_post( $_GET['post'] );
            if ( isset( $wp_post ) && isset( $wp_post->post_type ) && $this->is_post_type_gutenberg( $wp_post->post_type ) ) {
                return true;
            }
        }

        if ( false !== strpos( $admin_page, 'revision.php' ) ) {
            $wp_post     = get_post( $_GET['revision'] );
            $post_parent = get_post( $wp_post->post_parent );
            if ( isset( $post_parent ) && isset( $post_parent->post_type ) && $this->is_post_type_gutenberg( $post_parent->post_type ) ) {
                return true;
            }
        }
        return false;
    }
}

WPZOOM_Block_Assets::register();
