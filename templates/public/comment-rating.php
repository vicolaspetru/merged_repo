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
<div class="wpzoom-rcb-comment-rating">
    <ul class="wpzoom-rcb-comment-rating-stars">
        <?php
            $rating_stars_items = '';

            for ( $i = 1; $i <= 5; $i++ ) {
                if ( $i <= $rating ) {
                    $rating_stars_items .= '<li class="fas fa-star"></li>';
                } else {
                    $rating_stars_items .= '<li class="far fa-star"></li>';
                }

                echo $rating_stars_items;
            }
        ?>
    </ul>
</div>