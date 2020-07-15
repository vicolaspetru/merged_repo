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

if ( isset( $post_ID ) ) {
    if ( ! has_block( 'wpzoom-recipe-card/block-recipe-card', $post_ID ) ) {
        $should_display_comment_rating_form = false;
    }
} else {
    if ( ! has_block( 'wpzoom-recipe-card/block-recipe-card' ) ) {
        $should_display_comment_rating_form = false;
    }
}

$rating_titles = array(
    esc_html__( 'Don\'t rate this recipe', 'wpzoom-recipe-card' ),
    esc_html__( 'Not at all useful', 'wpzoom-recipe-card' ),
    esc_html__( 'Poor quality', 'wpzoom-recipe-card' ),
    esc_html__( 'Average', 'wpzoom-recipe-card' ),
    esc_html__( 'Good', 'wpzoom-recipe-card' ),
    esc_html__( 'Excellent!', 'wpzoom-recipe-card' )
);
$rating_stars_filled = '';

?>
<?php if ( $should_display_comment_rating_form ): ?>
    <?php if ( is_admin() ): ?>
        <div class="wpzoom-rcb-comment-rating-form">
            <fieldset class="wpzoom-rcb-comment-rating-stars" style="color:#ffb900">
                <?php for ( $i = 0; $i <= 5; $i++ ) : ?>
                    <label for="wpzoom-rcb-comment-rating-<?php echo esc_attr( $i ) ?>">
                        <input id="wpzoom-rcb-comment-rating-<?php echo esc_attr( $i ) ?>" type="radio" name="wpzoom-rcb-comment-rating" value="<?php echo esc_attr( $i ) ?>" aria-label="<?php echo esc_attr( $rating_titles[ $i ] ) ?>" <?php echo $rating === $i ? 'checked="checked"' : '' ?> />
                        <?php
                            $rating_stars_empty = '';

                            if ( $i === 0 ) {
                                for ( $k = 1; $k <= 5 - $i; $k++ ) {
                                    $rating_stars_empty .= '<span class="dashicons dashicons-star-empty"></span>';
                                }
                            } else {
                                $rating_stars_filled .= '<span class="dashicons dashicons-star-filled"></span>';
                                
                                for ( $k = 1; $k <= 5 - $i; $k++ ) {
                                    $rating_stars_empty .= '<span class="dashicons dashicons-star-empty"></span>';
                                }
                            }

                            echo $rating_stars_filled . $rating_stars_empty;
                        ?>
                    </label>
                    <br>
                <?php endfor; ?>
            </fieldset>
        </div>
    <?php else: ?>
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
<?php endif ?>