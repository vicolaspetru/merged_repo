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
     * Register actions and filters.
     */
    public static function init() {
        add_filter( 'comment_text', array( __CLASS__, 'add_rating_stars_to_comment' ), 10, 3 );
        add_filter( 'comment_form_field_comment', array( __CLASS__, 'add_rating_stars_to_comment_form' ), 10, 1 );

        add_action( 'comment_post', array( __CLASS__, 'save_comment_rating' ) );
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
                        'date' => $comment->comment_date,
                        'comment_id' => $comment->comment_ID,
                        'user_id' => $comment->user_id,
                        'ip' => $comment->comment_author_IP,
                        'rating' => $comment_rating,
                    );

                    WPZOOM_Rating_Stars::add_or_update_rating( $rating );
                } else {
                    WPZOOM_Rating_Stars::delete_ratings_for_comment( $comment_id );
                }
            } else {
                WPZOOM_Rating_Stars::delete_ratings_for_comment( $comment_id );
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
        $rating_stars_html = '';
        $rating = 0;
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
     * @param  int $comment_ID The comment ID.
     * @return int             The rating average.
     */
    public static function get_rating_by_comment_id( $comment_ID ) {
        return 4;
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
}

WPZOOM_Comment_Rating::init();

?>