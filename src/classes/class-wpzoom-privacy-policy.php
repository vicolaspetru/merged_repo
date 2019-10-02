<?php
/**
 * Responsible for the privacy policy.
 *
 * @since      2.3.2
 *
 * @package    WPZOOM_Recipe_Card_Block
 * @subpackage WPZOOM_Recipe_Card_Block/src/classes/admin
 */
class WPZOOM_Privacy_Policy {

    /**
     * Register actions and filters.
     *
     * @since 2.3.2
     */
    public static function init() {
        add_action( 'admin_init', array( __CLASS__, 'privacy_policy' ) );
    }

    /**
     * Add text to the privacy policy suggestions.
     *
     * @since 2.3.2
     */
    public static function privacy_policy() {
        if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
            return;
        }

        ob_start();
        include( WPZOOM_RCB_PLUGIN_DIR . 'templates/admin/privacy.php' );
        $content = ob_get_contents();
        ob_end_clean();

        wp_add_privacy_policy_content(
            'WPZOOM Recipe Card PRO',
            wp_kses_post( wpautop( $content, false ) )
        );
    }
}

WPZOOM_Privacy_Policy::init();
