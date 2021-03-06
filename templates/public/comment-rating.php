<?php
/**
 * Template to be used for the comment rating.
 *
 * @since       3.0.0
 * 
 * @package     WPZOOM_Recipe_Card_Blocks
 * @subpackage  WPZOOM_Recipe_Card_Blocks/templates/public
 */
?>
<?php if ( is_admin() ): ?>
    <div class="wpzoom-rcb-comment-rating">
        <div class="wpzoom-rcb-comment-rating-stars" style="color:#ffb900">
            <?php
                $rating_stars_items = '';

                for ( $i = 1; $i <= 5; $i++ ) {
                    if ( $i <= $rating ) {
                        $rating_stars_items .= '<span class="dashicons dashicons-star-filled"></span>';
                    } else {
                        $rating_stars_items .= '<span class="dashicons dashicons-star-empty"></span>';
                    }
                }
                echo $rating_stars_items;
            ?>
        </div>
    </div>
<?php else: ?>
    <div class="wpzoom-rcb-comment-rating">
        <div class="wpzoom-rcb-comment-rating-stars">
            <?php
                $rating_stars_items = '';

                for ( $i = 1; $i <= 5; $i++ ) {
                    if ( $i <= $rating ) {
                        $rating_stars_items .= '<span class="fas fa-star"></span>';
                    } else {
                        $rating_stars_items .= '<span class="far fa-star"></span>';
                    }
                }
                echo $rating_stars_items;
            ?>
        </div>
    </div>
<?php endif ?>