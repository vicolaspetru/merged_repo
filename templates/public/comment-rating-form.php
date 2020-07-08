<?php
/**
 * Template to be used for the comment rating.
 *
 * @since       3.0.0
 * 
 * @package     WPZOOM_Recipe_Card_Blocks
 * @subpackage  WPZOOM_Recipe_Card_Blocks/templates/public
 */
$should_display_comment_rating_form = true;
if ( ! has_block( 'wpzoom-recipe-card/block-recipe-card' ) ) {
    $should_display_comment_rating_form = false;
}

$rating_titles = array(
    esc_html__( 'Don\'t rate this recipe', 'wpzoom-recipe-card' ),
    esc_html__( 'Not at all useful', 'wpzoom-recipe-card' ),
    esc_html__( 'Poor quality', 'wpzoom-recipe-card' ),
    esc_html__( 'Average', 'wpzoom-recipe-card' ),
    esc_html__( 'Good', 'wpzoom-recipe-card' ),
    esc_html__( 'Excellent!', 'wpzoom-recipe-card' )
);

?>
<?php if ( $should_display_comment_rating_form ): ?>
    <div class="wpzoom-rcb-comment-rating-form">
        <label><?php _e( 'Recipe Rating', 'wpzoom-recipe-card' ) ?></label>
        <fieldset class="wpzoom-rcb-comment-rating-stars">
            <label for="wpzoom-rcb-comment-rating-0">
                <input id="wpzoom-rcb-comment-rating-0" class="hidden" type="radio" name="wpzoom-rcb-comment-rating" value="0" checked="checked" />
                <span class="far fa-star" title="<?php echo esc_attr( $rating_titles[ 0 ] ) ?>"></span>
            </label>
            <?php for ( $i = 1; $i <= 5; $i++ ) : ?>
                <label for="wpzoom-rcb-comment-rating-<?php echo esc_attr( $i ) ?>">
                    <input id="wpzoom-rcb-comment-rating-<?php echo esc_attr( $i ) ?>" class="hidden" type="radio" name="wpzoom-rcb-comment-rating" value="<?php echo esc_attr( $i ) ?>" />
                    <span class="far fa-star" title="<?php echo esc_attr( $rating_titles[ $i ] ) ?>"></span>
                </label>
            <?php endfor; ?>
        </fieldset>
    </div>
<?php endif ?>