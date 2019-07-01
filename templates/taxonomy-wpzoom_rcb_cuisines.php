<?php
/**
 * The Template for displaying cuisines taxonomy
 *
 * This template can be overridden by copying it to {yourtheme}/wpzoom-recipe-card/taxonomy-wpzoom_rcb_cuisines.php.
 *
 *
 * @package WPZOOM Recipe Card Block/Templates
 * @version 1.2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

/**
 * Hook: wpzoom_rcb_before_main_content.
 */
do_action( 'wpzoom_cuisine_before_main_content' );
?>
<header class="wpzoom-rcb-cuisines-header">
	<?php if ( apply_filters( 'wpzoom_cuisine_show_page_title', true ) ) : ?>
		<?php
			$page_title = single_term_title( '', false );
		?>
		<h1 class="wpzoom-rcb-cuisines-header__title page-title"><?php echo apply_filters( 'wpzoom_cuisine_page_title', $page_title ); ?></h1>
	<?php endif; ?>

	<?php
	/**
	 * Hook: wpzoom_rcb_archive_description.
	 */
	do_action( 'wpzoom_cuisine_archive_description' );
	?>
</header>
<?php
if ( have_posts() ) {
	/**
	 * Hook: wpzoom_rcb_before_taxonomy_loop.
	 */
	do_action( 'wpzoom_cuisine_before_taxonomy_loop' );

    echo '<ul class="wpzoom-rcb-cuisines">';

        while ( have_posts() ) :
        	the_post();
        	/**
        	 * Hook: wpzoom_rcb_taxonomy_loop.
        	 */
        	do_action( 'wpzoom_cuisine_taxonomy_loop' );
            get_template_part( 'content-archive', get_post_format() );
        endwhile;

    echo '</ul>';

    /**
     * Hook: wpzoom_rcb_taxonomy_pagination.
     */
    do_action( 'wpzoom_cuisine_taxonomy_pagination' );

	/**
	 * Hook: wpzoom_rcb_after_taxonomy_loop.
	 */
	do_action( 'wpzoom_cuisine_after_taxonomy_loop' );
} else {
	/**
	 * Hook: wpzoom_rcb_no_taxonomies_found.
	 */
	do_action( 'wpzoom_cuisine_no_taxonomies_found' );
}
/**
 * Hook: wpzoom_rcb_after_main_content.
 */
do_action( 'wpzoom_cuisine_after_main_content' );
/**
 * Hook: wpzoom_rcb_sidebar.
 */
do_action( 'wpzoom_cuisine_sidebar' );

get_footer();