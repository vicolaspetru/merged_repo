<?php
/**
 * Rating Stars Class
 *
 * Add rating stars to recipe card.
 *
 * @since   1.1.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPZOOM_Rating_Stars' ) ):

	class WPZOOM_Rating_Stars {
		/**
		 * We need to create a table where to store all ratings for each single post.
		 *
		 * @var string
		 * @since 1.1.0
		 */
		public static $tablename;

		/**
		 * Loads scripts and styles.
		 *
		 * @var WPZOOM_Assets_Manager
		 * @since 1.1.0
		 */
		private $assets_manager;

		/**
		 * Current user ID.
		 * If user is logged in, set current user ID, otherwise generate new random ID
		 *
		 * @since 1.1.0
		 */
		public static $user_ID;

		/**
		 * Who can rate recipes
		 *
		 * @since 2.3.1
		 */
		public $who_can_rate;

		/**
		 * WPZOOM_Rating_Stars constructor.
		 * @since 1.1.0
		 */
		public function __construct() {
			global $wpdb;

			self::$tablename = $wpdb->prefix . 'wpzoom_rating_stars';
			self::$user_ID 	 = self::random_number();

			$this->who_can_rate 	= WPZOOM_Settings::get('wpzoom_rcb_settings_who_can_rate');
			$this->assets_manager 	= WPZOOM_Assets_Manager::instance();

			add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );

			// Do ajax request
			add_action( 'wp_ajax_wpzoom_user_rate_recipe', array( &$this, 'set_rating'), 10, 2 );
			add_action( 'wp_ajax_nopriv_wpzoom_user_rate_recipe', array( &$this, 'set_rating'), 10, 2 );
		}

		/**
		 * Generate random number.
		 *
		 * @param number $length The length of returned value.
		 * @since 1.1.0
		 */
		public static function random_number( $length = 10 ) {
		    $characters = '0123456789';
		    $charactersLength = strlen($characters);
		    $randomNumber = '';
		    for ($i = 0; $i < $length; $i++) {
		        $randomNumber .= $characters[rand(0, $charactersLength - 1)];
		    }
		    return $randomNumber;
		}

		/**
		 * Enqueue Gutenberg block assets for both frontend + backend.
		 *
		 * @since 1.1.0
		 */
		public function block_assets() {
			if ( is_admin() ) {
				return false;
			}

			/**
			 * Load Assets only on single page if option is unchecked
			 * 
			 * @since 3.0.2
			 */
			if ( '1' !== WPZOOM_Settings::get( 'wpzoom_rcb_settings_load_assets_on_all_pages' ) && ! is_single() ) {
			    return false;
			}

			$should_enqueue = has_block( 'wpzoom-recipe-card/block-recipe-card' ) || WPZOOM_Assets_Manager::has_reusable_block( 'wpzoom-recipe-card/block-recipe-card' );

			if ( ! $should_enqueue ) {
			    return false;
			}

			$localize_data = $this->get_localize_data();

			/**
			 * Load if recipe card block is present in post
			 * 
			 * @since 3.0.3
			 */
			wp_enqueue_script(
			    'wpzoom-rating-stars-script',
			    $this->assets_manager->asset_source( 'js', 'wpzoom-rating-stars.js' ),
			    $this->assets_manager->get_dependencies( 'wpzoom-rating-stars-script' ),
			    WPZOOM_RCB_VERSION,
			    true
			);

			// Localize variables
			wp_localize_script( 'wpzoom-rating-stars-script', 'wpzoomRatingStars', $localize_data );
		}

		/**
		 * Insert rating for recipe into Database.
		 * Verifies the AJAX request, to prevent any processing of requests which are passed in by third-party sites or systems.
		 *
		 * @since 1.1.0
		 */
		public function set_rating() {
			check_ajax_referer( 'wpzoom-rating-stars-nonce', 'security' );

			$rating = array();

			$rating['recipe_id'] = isset( $_POST['recipe_id'] ) ? intval( $_POST['recipe_id'] ) : 0;
			$rating['rating'] = isset( $_POST['rating'] ) ? intval( $_POST['rating'] ) : 0;
			$rating['user_id'] = self::get_user_ID();

			if ( 0 >= $rating['rating'] && 5 < $rating['rating'] ) {
				$response = array(
				    'status' => '204',
				    'message' => 'No response',
				);

				wp_send_json_error( $response );
			}

			if ( 'loggedin' === $this->who_can_rate && ! is_user_logged_in() ) {
				$response = array(
				    'status' => '403',
				    'message' => __( 'Only logged in users can rate recipes', 'wpzoom-recipe-card' ),
				);

				wp_send_json_error( $response );
			}

			$result = WPZOOM_Rating_DB::add_or_update_rating( $rating );

			if ( $result ) {
				$response = array(
					'status' => '200',
					'message' => 'OK',
					'rating_avg' => $this->get_rating_average( $rating['recipe_id'] ),
					'rating_total' => $this->get_total_votes( $rating['recipe_id'] ),
				);

				// set cookie
				$this->set_user_rate( $rating['recipe_id'], $rating['rating'] );

				wp_send_json_success( $response );
			}
		}

		/**
		 * Get rating form HTML.
		 *
		 * @param string|number $recipe_ID The recipe id.
		 * @since 1.1.0
		 */
		public function get_rating_form( $recipe_ID ) {
			$output 			= '';
			$rating_stars_items = '';
			$tooltip_message 	= '';
			$data_user_can_rate = 'data-user-can-rate="1"';

			// Get the average vote number and check if user has voted for this post
			$average = $this->get_rating_average( $recipe_ID );
			$total_votes = $this->get_total_votes( $recipe_ID );
			$user_rated = $this->check_user_rate( $recipe_ID );

			for ( $i = 1; $i <= 5; $i++ ) {
				if ( $i <= $average ) {
					$rating_stars_items .= '<li class="fas fa-star"></li>';
				} else {
					$rating_stars_items .= '<li class="far fa-star"></li>';
				}
			}

			$average_content = sprintf(
				'<small class="wpzoom-rating-average">%d</small> <small>%s</small> <small class="wpzoom-rating-total-votes">%d</small> <small>%s</small>',
				$average,
				__( "from", "wpzoom-recipe-card" ), 
				intval( $total_votes ),
				_n( "vote", "votes", intval( $total_votes ), "wpzoom-recipe-card" )
			);

			if ( 'loggedin' === $this->who_can_rate && ! is_user_logged_in() ) {
				$data_user_can_rate = 'data-user-can-rate="0"';
				$tooltip_message = __( 'Only logged in users can rate recipes', 'wpzoom-recipe-card' );
			}

			$rating_stars_classnames = 'wpzoom-rating-stars';

			if ( $user_rated ) {
				$rating_stars_classnames .= ' wpzoom-recipe-user-rated';
			}

			$output = sprintf(
				'<div class="%1$s-container" data-rating="%6$s" data-rating-total="%7$d" data-recipe-id="%8$d" %4$s>
					<ul class="%9$s">%2$s</ul><span class="%1$s-average">%3$s</span>
					<em class="%1$s-tooltip">%5$s</em>
				</div>',
				'wpzoom-rating-stars',
				$rating_stars_items,
				$average_content,
				$data_user_can_rate,
				$tooltip_message,
				$average,
				intval( $total_votes ),
				intval( $recipe_ID ),
				esc_attr( $rating_stars_classnames )
			);

			// Display only average content for AMP template
			if ( WPZOOM_Recipe_Card_Block_Gutenberg::is_AMP() ) {
				$output = $this->get_rating_star( $recipe_ID, __( 'Recipe rating: ', 'wpzoom-recipe-card' ), true );
			}
			
			return $output;
		}

		/**
		 * Get rating star HTML.
		 *
		 * @param string|number $recipe_ID The recipe id.
		 * @param string 		$label The custom label text for rating.
		 * @param boolean 		$container Wrap rating to div container?
		 * @since 1.1.0
		 */
		public function get_rating_star( $recipe_ID, $label = '', $container = false ) {
			// Check if user voted, use the full icon or outline icon if not
			$user_rate = $this->check_user_rate( $recipe_ID );

			if ( $user_rate ) {
				$rate_icon = ' icon-star-full';
			} else {
				$rate_icon = ' icon-star';
			}

			$average = $this->get_rating_average( $recipe_ID );
			$total_votes = $this->get_total_votes( $recipe_ID );
			$average_content = $average > 0 ? sprintf( __( "%s from %s votes", "wpzoom-recipe-card" ), "<i class=\"wpzoom-rating-average\">{$average}</i>", "<i class=\"wpzoom-rating-total-votes\">{$total_votes}</i>" ) : 'N/A';

			$output = sprintf( '<span class="%s-average %s">%s</span>',
				'wpzoom-rating-stars',
				$rate_icon,
				$label . $average_content
			);

			if ( $container ) {
				$output = sprintf( '<div class="%s-container">%s</div>',
					'wpzoom-rating-stars',
					$output
				);
			}

			return $output;
		}

		/**
		 * Get rating average.
		 *
		 * @param string|number $recipe_ID The recipe id.
		 * @since 1.1.0
		 * @return number The average number of sql results.
		 */
		public function get_rating_average( $recipe_ID ) {
			if ( ! $recipe_ID ) {
				return;
			}

			$rating_average = WPZOOM_Rating_DB::get_rating_average( array(
				'where' => 'recipe_id = '. $recipe_ID .' OR post_id = '. $recipe_ID .' AND approved = 1'
			) );

			return $rating_average;
		}

		/**
		 * Get total number of recipe votes.
		 *
		 * @param string|number $recipe_ID The recipe id.
		 * @since 1.1.0
		 * @return number The total number of sql results.
		 */
		public function get_total_votes( $recipe_ID ) {
			if ( ! $recipe_ID ) {
				return;
			}
			
			$ratings = WPZOOM_Rating_DB::get_ratings( array(
				'where' => 'recipe_id = '. $recipe_ID .' OR post_id = '. $recipe_ID .' AND approved = 1'
			) );
			
			return $ratings['total'];
		}

		/**
		 * Get top rated recipes.
		 *
		 * @param array $args The query arguments.
		 * @since 1.1.0
		 * @return array The top rated recipes.
		 */
		public function get_toprated_recipes( $args = array() ) {
			global $wpdb;

			$tablename = self::$tablename;

			// Defaults
			$_where = array(); $where = '';
			$limit = isset( $args['posts_per_page'] ) ? $args['posts_per_page'] : get_option( 'posts_per_page' );

			if ( $limit == '-1' ) {
				$limit = 9999;
			}

			$sql_select = $wpdb->prepare( "
					SELECT recipe_id AS ID, AVG(rating) AS rating
					FROM `$tablename`
					GROUP BY recipe_id
					ORDER BY rating DESC
					LIMIT %d
				",
				$limit
			);

			$sql_results = $wpdb->get_results( $sql_select );

			return $sql_results;
		}

		/**
		 * Get top rated recipes IDs.
		 *
		 * @param object $sql_results The sql object query.
		 * @since 1.1.0
		 * @return array The array of top rated recipe ids.
		 */
		public function get_toprated_recipe_ids( $sql_results ) {
			$recipe_ids = array();

			if ( is_array( $sql_results ) ) {
				foreach ( $sql_results as $key => $post ) {
					array_push( $recipe_ids, $post->ID );
				}
			}

			return $recipe_ids;
		}

		/**
		 * Get user ID.
		 *
		 * @since 1.1.0
		 * @return string|number Current user ID or new generated ID.
		 */
		public static function get_user_ID() {
			$user_ID = self::$user_ID;
			$current_user_id = (int)get_current_user_id();

			// Check for logged in users
			if ( $current_user_id !== 0 ) {
				return $current_user_id;
			}

			if ( false !== ( $not_logged_in_user_ID = get_transient( 'wpzoom_not_logged_user_id_' . $user_ID ) ) ) {
				$user_ID = $not_logged_in_user_ID;
			}

			return intval( $user_ID );
		}

		/**
		 * Set user ID as transient.
		 *
		 * @since 1.1.0
		 */
		public static function set_user_ID() {
			$user_ID = self::get_user_ID();

			if ( 0 !== $user_ID && false === ( $not_logged_user_ID = get_transient( 'wpzoom_not_logged_user_id_' . $user_ID ) ) ) {
				// expires in 7 days
				set_transient( 'wpzoom_not_logged_user_id_' . $user_ID, $user_ID, 7 * DAY_IN_SECONDS );
			}
		}

		/**
		 * Set user rate as transient.
		 *
		 * @since 1.1.0
		 */
		public function set_user_rate( $recipe_ID, $rating ) {
			$user_ID = self::get_user_ID();

			if ( false === ( $user_rating_recipe = get_transient( 'wpzoom_user_rating_recipe_' . $user_ID .'_'. $recipe_ID ) ) ) {
				// expires in one year
				set_transient( 'wpzoom_user_rating_recipe_' . $user_ID .'_'. $recipe_ID, $rating, YEAR_IN_SECONDS );
			}
		}

		/**
		 * Check if user has rated recipe.
		 *
		 * @param string|number $recipe_ID The recipe id.
		 * @since 1.1.0
		 * @return boolean
		 */
		public function check_user_rate( $recipe_ID ) {
			$user_ID = self::get_user_ID();
			return (bool)get_transient( 'wpzoom_user_rating_recipe_' . $user_ID .'_'. $recipe_ID );
		}

		/**
		 * Localize variables to script
		 * 
		 * @since 2.3.1
		 * @return array
		 */
		public function get_localize_data() {
			global $post;

			$localize_data = array(
				// 'recipe_ID'    	   	=> $post->ID,
				// 'user_ID'    	   	=> self::get_user_ID(),
				'ajaxurl'    	   	=> admin_url('admin-ajax.php'),
				'ajax_nonce' 	   	=> wp_create_nonce( "wpzoom-rating-stars-nonce" ),
				// 'user_rated'		=> $this->check_user_rate( $post->ID ),
				// 'rating_average'	=> $this->get_rating_average( $post->ID ),
				// 'rating_total'		=> $this->get_total_votes( $post->ID ),
				// 'top_rated'			=> $this->get_toprated_recipes(),
				'strings'			=> array(
					'recipe_rating'	=> __( "Recipe rating", "wpzoom-recipe-card" ),
					'top_rated'		=> __( "Top rated", "wpzoom-recipe-card" ),
				)
			);

			return $localize_data;
		}
	}

endif;

/**
 * Function to show the rating form or number
 */
function wpzoom_rating_stars( $recipe_ID, $type = 'form', $label = '' ) {
	$wpzoom_rating_stars = new WPZOOM_Rating_Stars();

	if ( $type == 'number' ) {
		return $wpzoom_rating_stars->get_rating_star( $recipe_ID, $label );
	} else {
		return $wpzoom_rating_stars->get_rating_form( $recipe_ID );
	}
}

?>