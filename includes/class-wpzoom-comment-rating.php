<?php
/**
 * Allow users to add rating for recipe from comment form.
 * 
 * @since 3.0.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WPZOOM_Comment_Rating {
    /**
     * Loads scripts and styles.
     *
     * @var WPZOOM_Assets_Manager
     */
    public static $assets_manager;

    /**
     * Register actions and filters.
     */
    public static function init() {
        self::$assets_manager = WPZOOM_Assets_Manager::instance();

        add_filter( 'comment_text', array( __CLASS__, 'add_rating_stars_to_comment' ), 10, 3 );
        add_filter( 'comment_form_field_comment', array( __CLASS__, 'add_rating_stars_to_comment_form' ), 10, 1 );

        add_action( 'enqueue_block_assets', array( __CLASS__, 'block_assets' ) );
        add_action( 'add_meta_boxes_comment', array( __CLASS__, 'add_rating_field_to_comments_edit_page' ) );

        add_action( 'comment_post', array( __CLASS__, 'save_comment_rating' ) );
        add_action( 'edit_comment', array( __CLASS__, 'save_admin_comment_rating' ) );

        add_action( 'trashed_comment', array( __CLASS__, 'update_comment_rating_on_change' ) );
        add_action( 'untrashed_comment', array( __CLASS__, 'update_comment_rating_on_change' ) );
        add_action( 'spammed_comment', array( __CLASS__, 'update_comment_rating_on_change' ) );
        add_action( 'unspammed_comment', array( __CLASS__, 'update_comment_rating_on_change' ) );
        add_action( 'wp_set_comment_status', array( __CLASS__, 'update_comment_rating_on_change' ) );
    }

    /**
     * Add or update rating for a specific comment.
     *
     * @param int $comment_id       ID of the comment.
     * @param int $comment_rating   Rating to add for this comment.
     */
    public static function update_comment_rating( $comment_id, $comment_rating ) {
        $comment_id = intval( $comment_id );
        $comment_rating = intval( $comment_rating );

        if ( $comment_id ) {
            $comment = get_comment( $comment_id );

            if ( $comment ) {
                if ( $comment_rating ) {
                    $rating = array(
                        'rating' => $comment_rating,
                        'rate_date' => $comment->comment_date,
                        'comment_id' => $comment->comment_ID,
                        'user_id' => $comment->user_id,
                        'ip' => $comment->comment_author_IP,
                    );

                    WPZOOM_Rating_DB::add_or_update_rating( $rating );
                } else {
                    WPZOOM_Rating_DB::delete_ratings_for_comment( $comment_id );
                }
            } else {
                WPZOOM_Rating_DB::delete_ratings_for_comment( $comment_id );
            }
        }
    }

    /**
     * Add rating stars to the text of a comment.
     * 
     * @param string $comment_text Text of the current comment.
     * @param object $comment      The comment object.
     * @param array  $args         An array of arguments.
     */
    public static function add_rating_stars_to_comment( $comment_text, $comment = null, $args = array() ) {
        if ( null !== $comment ) {
            $rating_stars_html = '';
            $rating = self::get_rating_by_comment_id( $comment->comment_ID );
            $comment_rating_template = apply_filters( 'wpzoom_rcb_comment_rating_template', WPZOOM_RCB_PLUGIN_DIR . 'templates/public/comment-rating.php' );

            if ( $rating ) {
                ob_start();
                require( $comment_rating_template );
                $rating_stars_html = ob_get_contents();
                ob_end_clean();
            }

            $comment_text = $rating_stars_html . $comment_text;
        }

        return $comment_text;
    }

    /**
     * Add rating stars to the comment field form.
     * 
     * @param string $args_comment_field The content of the comment textarea field.
     */
    public static function add_rating_stars_to_comment_form( $args_comment_field ) {
        global $post, $comment;

        if ( 'loggedin' === WPZOOM_Settings::get('wpzoom_rcb_settings_who_can_rate') && ! is_user_logged_in() ) {
            return $args_comment_field;
        }

        $rating_stars_html = '';
        $comment_id = is_object( $comment ) && isset( $comment->comment_ID ) ? $comment->comment_ID : 0;

        // Pass variables to comment-rating-form template
        $post_ID = $post->ID;
        $rating = self::get_rating_by_comment_id( $comment_id );

        $comment_rating_template = apply_filters( 'wpzoom_rcb_comment_rating_form_template', WPZOOM_RCB_PLUGIN_DIR . 'templates/public/comment-rating-form.php' );

        ob_start();
        require( $comment_rating_template );
        $rating_stars_html = ob_get_contents();
        ob_end_clean();

        $args_comment_field = $rating_stars_html . $args_comment_field;

        return $args_comment_field;
    }

    /**
     * Get rating for a comment by specified comment ID.
     * 
     * @param  int $comment_id The comment ID.
     * @return int             The rating average.
     */
    public static function get_rating_by_comment_id( $comment_id ) {
        $rating = 0;
        $comment_id = intval( $comment_id );

        if ( $comment_id ) {
            $rating_found = get_comment_meta( $comment_id, 'wpzoom-rcb-comment-rating', true );

            // Cache rating for this comment if none can be found.
            if ( '' === $rating_found ) {
                $rating_found = WPZOOM_Rating_DB::get_rating(
                    array(
                        'where' => 'comment_id = ' . $comment_id,
                    )
                );
        
                if ( $rating_found ) {
                    $rating = intval( $rating_found->rating );
                } else {
                    $rating = 0;
                }

                self::update_comment_meta_rating( $comment_id, $rating );
            } else {
                $rating = intval( $rating_found );
            }
        }

        return $rating;
    }

    /**
     * Add comment rating meta box to the comment edit page.
     */
    public static function add_rating_field_to_comments_edit_page() {
        global $comment;

        if ( ! $comment ) {
            return;
        }

        if ( has_block( 'wpzoom-recipe-card/block-recipe-card', $comment->comment_post_ID ) || WPZOOM_Assets_Manager::has_reusable_block( 'wpzoom-recipe-card/block-recipe-card', $comment->comment_post_ID ) ) {
            add_meta_box(
                'wpzoom-rcb-comment-rating',
                __( 'Change comment rating', 'wpzoom-recipe-card' ),
                array( __CLASS__, 'add_rating_field_to_admin_comments_form' ),
                'comment',
                'normal',
                'high'
            );
        }
    }

    /**
     * Add rating field to the admin comment form.
     * 
     * @param object $comment The comment being edited.
     */
    public static function add_rating_field_to_admin_comments_form( $comment ) {
        $post_ID = $comment->comment_post_ID;
        $rating = self::get_rating_by_comment_id( $comment->comment_ID );

        wp_nonce_field( 'comment-rating-' . $comment->comment_ID, 'wpzoom-rcb-comment-rating-nonce', false );

        $template = apply_filters( 'wpzoom_rcb_comment_rating_form_template', WPZOOM_RCB_PLUGIN_DIR . 'templates/public/comment-rating-form.php' );

        require( $template );
    }

    /**
     * Save the comment rating from admin edit page.
     * 
     * @param  int $comment_id The comment id being saved.
     */
    public static function save_admin_comment_rating( $comment_id ) {
        $wpzoom_rcb_comment_rating_nonce = isset( $_POST['wpzoom-rcb-comment-rating-nonce'] ) ? $_POST['wpzoom-rcb-comment-rating-nonce'] : false;

        if ( $wpzoom_rcb_comment_rating_nonce && wp_verify_nonce( sanitize_key( $wpzoom_rcb_comment_rating_nonce ), 'comment-rating-' . $comment_id ) ) {
            $rating = isset( $_POST['wpzoom-rcb-comment-rating'] ) ? intval( $_POST['wpzoom-rcb-comment-rating'] ) : 0;
            self::update_comment_rating( $comment_id, $rating );
        }
    }

    /**
     * Save the comment rating.
     *
     * @param int $comment_id ID of the comment being saved.
     */
    public static function save_comment_rating( $comment_id ) {
        $rating = isset( $_POST['wpzoom-rcb-comment-rating'] ) ? intval( $_POST['wpzoom-rcb-comment-rating'] ) : 0;
        self::update_comment_rating( $comment_id, $rating );
    }

    /**
     * Update the comment rating meta that is used as a cache.
     *
     * @param   int $comment_id ID of the comment.
     * @param   int $rating     Rating to set for this comment.
     */
    public static function update_comment_meta_rating( $comment_id, $rating ) {
        $comment_id = intval( $comment_id );
        $rating = intval( $rating );

        if ( $comment_id ) {
            $comment = get_comment( $comment_id );

            if ( $comment ) {
                update_comment_meta( $comment_id, 'wpzoom-rcb-comment-rating', $rating );
            }
        }
    }

    /**
     * Update recipe rating when comment changes.
     *
     * @param int $comment_id ID of the comment being changed.
     */
    public static function update_comment_rating_on_change( $comment_id ) {
        // Force update in case approval state changed
        $rating = self::get_rating_by_comment_id( $comment_id );
        self::update_comment_rating( $comment_id, $rating );
    }

    /**
     * Enqueue comment rating scripts.
     */
    public static function block_assets() {
        if ( is_admin() ) {
            return false;
        }

        // Don't load scripts if the comment rating is not allowed
        if ( '1' !== WPZOOM_Settings::get('wpzoom_rcb_settings_comment_ratings') ) {
            return false;
        }

        if ( ! is_single() ) {
            return false;
        }

        $should_enqueue = has_block( 'wpzoom-recipe-card/block-recipe-card' ) || WPZOOM_Assets_Manager::has_reusable_block( 'wpzoom-recipe-card/block-recipe-card' );

        if ( ! $should_enqueue ) {
            return false;
        }

        /**
         * Load only on single page and if recipe card block is present in post
         * 
         * @since 3.0.3
         */
        wp_enqueue_script(
            'wpzoom-comment-rating-script',
            self::$assets_manager->asset_source( 'js', 'wpzoom-comment-rating.js' ),
            self::$assets_manager->get_dependencies( 'wpzoom-comment-rating-script' ),
            WPZOOM_RCB_VERSION,
            true
        );
    }
}

WPZOOM_Comment_Rating::init();
