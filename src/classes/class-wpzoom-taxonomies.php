<?php
/**
 * Register the recipe taxonomies.
 *
 * @since   1.2.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

/**
 * Register the recipe taxonomies.
 *
 * @since 1.2.0
 */
final class WPZOOM_Taxonomies {

	/**
	 * Register actions and filters.
	 *
	 * @since 1.2.0
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_taxonomies' ) );
		add_filter( 'template_include', array( __CLASS__, 'set_template' ) );
		add_filter( 'wpzoom_rcb_get_settings', array( __CLASS__, 'omit_taxonomies' ), 10, 1 );
	}

	/**
	 * Omit uneeded taxonomies
	 * 
	 * @since 2.2.0
	 * @param array $settings  The main settings array
	 * @return array
	 */
	public static function omit_taxonomies( $settings ) {
		$settings['wpzoom_rcb_settings_course_taxonomy'] = '-1';
		$settings['wpzoom_rcb_settings_cuisine_taxonomy'] = '-1';
		$settings['wpzoom_rcb_settings_difficulty_taxonomy'] = '-1';

		return $settings;
	}

	/**
	 * Register the recipe taxonomies.
	 *
	 * @since 1.2.0
	 */
	public static function register_taxonomies() {
		$taxonomies = self::get_taxonomies_to_register();

		if ( ! taxonomy_exists( 'wpzoom_rcb_courses' ) || ! taxonomy_exists( 'wpzoom_rcb_cuisines' ) || ! taxonomy_exists( 'wpzoom_rcb_difficulties' ) ) {
			foreach ( $taxonomies as $taxonomy => $labels ) {
				if ( 
					( 'wpzoom_rcb_courses' === $taxonomy && '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_course_taxonomy') ) ||
					( 'wpzoom_rcb_cuisines' === $taxonomy && '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_cuisine_taxonomy') ) ||
					( 'wpzoom_rcb_difficulties' === $taxonomy && '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_difficulty_taxonomy') )
				) {
					$args = array(
						'labels'            => $labels,
						'hierarchical' 		=> true,
						'public'            => true,
						'show_ui' 			=> false,
						'query_var'         => true,
						'show_in_rest'      => true,
						'show_admin_column' => true,
						'rewrite'           => self::get_rewrite_rule( $taxonomy ),
					);

					// Don't show Difficulties in admin column
					if ( 'wpzoom_rcb_difficulties' === $taxonomy ) {
						$args['show_admin_column'] = false;
					}

					register_taxonomy( $taxonomy, 'post', $args );
					register_taxonomy_for_object_type( $taxonomy, 'post' );
				}
			}
		}
	}

	/**
	 * Get the recipe taxonomies to register.
	 *
	 * @since 1.2.0
	 */
	public static function get_taxonomies_to_register() {
		$taxonomies = apply_filters( 'wpzoom_recipe_taxonomies', array(
			'wpzoom_rcb_courses' => array(
				'name' 				=> _x( 'Courses', 'taxonomy general name' ),
			    'singular_name' 	=> _x( 'Course', 'taxonomy singular name' ),
			    'search_items' 		=> __( 'Search Courses', 'wpzoom-recipe-card' ),
			    'popular_items' 	=> __( 'Popular Courses', 'wpzoom-recipe-card' ),
			    'all_items' 		=> __( 'All Courses', 'wpzoom-recipe-card' ),
			    'parent_item' 		=> __( 'Parent Course', 'wpzoom-recipe-card' ),
			    'parent_item_colon' => __( 'Parent Course:', 'wpzoom-recipe-card' ),
			    'edit_item' 		=> __( 'Edit Course' , 'wpzoom-recipe-card'), 
			    'update_item' 		=> __( 'Update Course', 'wpzoom-recipe-card' ),
			    'add_new_item' 		=> __( 'Add New Course', 'wpzoom-recipe-card' ),
			    'new_item_name' 	=> __( 'New Course Name', 'wpzoom-recipe-card' ),
			    'separate_items_with_commas' 	=> __( 'Separate courses with commas', 'wpzoom-recipe-card' ),
			    'add_or_remove_items' 			=> __( 'Add or remove courses', 'wpzoom-recipe-card' ),
			    'choose_from_most_used' 		=> __( 'Choose from the most used courses', 'wpzoom-recipe-card' ),
			    'menu_name' 		=> __( 'Courses', 'wpzoom-recipe-card' ),
			),
			'wpzoom_rcb_cuisines' => array(
				'name' 				=> _x( 'Cuisines', 'taxonomy general name' ),
				'singular_name' 	=> _x( 'Cuisine', 'taxonomy singular name' ),
				'search_items' 		=> __( 'Search Cuisines', 'wpzoom-recipe-card' ),
				'popular_items' 	=> __( 'Popular Cuisines', 'wpzoom-recipe-card' ),
				'all_items' 		=> __( 'All Cuisines', 'wpzoom-recipe-card' ),
				'parent_item' 		=> __( 'Parent Cuisine', 'wpzoom-recipe-card' ),
			    'parent_item_colon' => __( 'Parent Cuisine:', 'wpzoom-recipe-card' ),
				'edit_item' 		=> __( 'Edit Cuisine' , 'wpzoom-recipe-card'), 
				'update_item' 		=> __( 'Update Cuisine', 'wpzoom-recipe-card' ),
				'add_new_item' 		=> __( 'Add New Cuisine', 'wpzoom-recipe-card' ),
				'new_item_name' 	=> __( 'New Cuisine Name', 'wpzoom-recipe-card' ),
				'separate_items_with_commas' 	=> __( 'Separate cuisines with commas', 'wpzoom-recipe-card' ),
				'add_or_remove_items' 			=> __( 'Add or remove cuisines', 'wpzoom-recipe-card' ),
				'choose_from_most_used' 		=> __( 'Choose from the most used cuisines', 'wpzoom-recipe-card' ),
				'menu_name' 		=> __( 'Cuisines', 'wpzoom-recipe-card' ),
			),
			'wpzoom_rcb_difficulties' => array(
				'name' 				=> _x( 'Difficulties', 'taxonomy general name' ),
				'singular_name' 	=> _x( 'Difficulty', 'taxonomy singular name' ),
				'search_items' 		=>  __( 'Search Difficulties', 'wpzoom-recipe-card' ),
				'popular_items' 	=> __( 'Popular Difficulties', 'wpzoom-recipe-card' ),
				'all_items' 		=> __( 'All Difficulties', 'wpzoom-recipe-card' ),
				'parent_item' 		=> __( 'Parent Difficulty', 'wpzoom-recipe-card' ),
			    'parent_item_colon' => __( 'Parent Difficulty:', 'wpzoom-recipe-card' ),
				'edit_item' 		=> __( 'Edit Difficulty' , 'wpzoom-recipe-card'), 
				'update_item' 		=> __( 'Update Difficulty', 'wpzoom-recipe-card' ),
				'add_new_item' 		=> __( 'Add New Difficulty', 'wpzoom-recipe-card' ),
				'new_item_name' 	=> __( 'New Difficulty Name', 'wpzoom-recipe-card' ),
				'separate_items_with_commas' 	=> __( 'Separate difficulties with commas', 'wpzoom-recipe-card' ),
				'add_or_remove_items' 			=> __( 'Add or remove difficulties', 'wpzoom-recipe-card' ),
				'choose_from_most_used' 		=> __( 'Choose from the most used difficulties', 'wpzoom-recipe-card' ),
				'menu_name' 		=> __( 'Difficulties', 'wpzoom-recipe-card' ),
			)
		));

		return $taxonomies;
	}

	/**
	 * Get the recipe taxonomies.
	 *
	 * @since 1.2.0
	 */
	public static function get_taxonomies() {
		$taxonomies = self::get_taxonomies_to_register();
		return $taxonomies;
	}

	/**
	 * Check if a recipe taxonomy exists.
	 *
	 * @since    1.2.0
	 * @param    mixed $taxonomy Name of the taxonomy to check.
	 */
	public static function exists( $taxonomy ) {
		$taxonomies = self::get_taxonomies_to_register();
		return array_key_exists( $taxonomy, $taxonomies );
	}

	/**
	 * Get rewrite rule for "pretty permalinks"
	 * 
	 * @param 	string $taxonomy 
	 * @return 	array
	 */
	public static function get_rewrite_rule( $taxonomy ) {
		if ( $taxonomy === 'wpzoom_rcb_courses' ) {
			return array( 'slug' => 'course' );
		}
		elseif ( $taxonomy === 'wpzoom_rcb_cuisines' ) {
			return array( 'slug' => 'cuisine' );
		}
		elseif ( $taxonomy === 'wpzoom_rcb_difficulties' ) {
			return array( 'slug' => 'difficulty' );
		}

		return false;
	}

	/**
	 * Insert default terms for recipe taxonomies.
	 *
	 * @since 1.2.0
	 */
	public static function insert_default_taxonomy_terms() {
		if ( taxonomy_exists( 'wpzoom_rcb_courses' ) ) {
			wp_insert_term( __( 'Appetizers', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Snacks', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Breakfast', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Brunch', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Dessert', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Drinks', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Dinner', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Main', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Lunch', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Salads', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Sides', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
			wp_insert_term( __( 'Soups', 'wpzoom-recipe-card' ), 'wpzoom_rcb_courses' );
		}

		if ( taxonomy_exists( 'wpzoom_rcb_cuisines' ) ) {
			wp_insert_term( __( 'American', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Chinese', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'French', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Indian', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Italian', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Japanese', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Mediterranean', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Mexican', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Southern', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Thai', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
			wp_insert_term( __( 'Other world cuisine', 'wpzoom-recipe-card' ), 'wpzoom_rcb_cuisines' );
		}

		if ( taxonomy_exists( 'wpzoom_rcb_difficulties' ) ) {
			wp_insert_term( __( 'Easy', 'wpzoom-recipe-card' ), 'wpzoom_rcb_difficulties' );
			wp_insert_term( __( 'Medium', 'wpzoom-recipe-card' ), 'wpzoom_rcb_difficulties' );
			wp_insert_term( __( 'Difficult', 'wpzoom-recipe-card' ), 'wpzoom_rcb_difficulties' );
		}
	}

	public static function set_template( $template ){
		$taxonomies = self::get_taxonomies();

	    //Add option for plugin to turn this off? If so just return $template

	    //Check if the taxonomy is being viewed 
	    //Suggested: check also if the current template is 'suitable'

		foreach ( $taxonomies as $taxonomy => $labels ) {
		    if( is_tax( $taxonomy ) ) {
    		    //Check if exist a file in the active theme
    		    if( file_exists( trailingslashit( get_stylesheet_directory() ) . "wpzoom-recipe-card/taxonomy-$taxonomy.php" ) ) {
    	            $template = trailingslashit( get_stylesheet_directory() ) . "wpzoom-recipe-card/taxonomy-$taxonomy.php";
    	        }
    	        //Loads the default from our plugin
    	        else {
    	            $template = WPZOOM_RCB_PLUGIN_DIR . "templates/taxonomy-$taxonomy.php";
    	        }
		    	break;
		    }
		}

	    return $template;
	}
}
