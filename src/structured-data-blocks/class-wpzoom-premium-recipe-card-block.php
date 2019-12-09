<?php
/**
 * Premium Recipe Card Block
 *
 * @since   1.1.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main WPZOOM_Premium_Recipe_Card_Block Class.
 */
class WPZOOM_Premium_Recipe_Card_Block {
	/**
	 * The post Object.
	 *
	 * @since 1.1.0
	 */
	private $recipe;

	/**
	 * Class instance Structured Data Helpers.
	 *
	 * @var WPZOOM_Structured_Data_Helpers
	 * @since 1.1.0
	 */
	private $structured_data_helpers;

	/**
	 * Class instance Helpers.
	 *
	 * @var WPZOOM_Helpers
	 * @since 1.1.0
	 */
	private static $helpers;

	/**
	 * Class instance WPZOOM Rating Stars.
	 *
	 * @var WPZOOM_Rating_Stars
	 * @since 1.1.0
	 */
	private static $wpzoom_rating;

	/**
	 * Recipe Block ID.
	 *
	 * @since 1.2.0
	 */
	public static $recipeBlockID;

	/**
	 * Block attributes.
	 *
	 * @since 1.1.0
	 */
	public static $attributes;

	/**
	 * Block settings.
	 *
	 * @since 1.1.0
	 */
	public static $settings;

	/**
	 * Block active style.
	 *
	 * @since 1.1.0
	 */
	public static $style;

	/**
	 * The Constructor.
	 */
	public function __construct() {
		$this->structured_data_helpers = new WPZOOM_Structured_Data_Helpers();
		self::$helpers = new WPZOOM_Helpers();
		self::$wpzoom_rating = new WPZOOM_Rating_Stars();
	}

	/**
	 * Registers the premium-recipe-card block as a server-side rendered block.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		if ( wpzoom_rcb_block_is_registered( 'wpzoom-recipe-card/block-recipe-card' ) ) {
			return;
		}

		$attributes = array(
			'id' => array(
			    'type' => 'string',
			    'default' => 'wpzoom-premium-recipe-card'
			),
			'style' => array(
			    'type' => 'string',
			    'default' => WPZOOM_Settings::get('wpzoom_rcb_settings_template'),
			),
			'image' => array(
			    'type' => 'object',
			),
			'hasImage' => array(
			    'type' => 'boolean',
			    'default' => false
			),
			'video' => array(
			    'type' => 'object',
			),
			'hasVideo' => array(
			    'type' => 'boolean',
			    'default' => false
			),
			'videoTitle' => array(
			    'type' => 'string',
			    'selector' => '.video-title',
			    'default' => WPZOOM_Settings::get('wpzoom_rcb_settings_video_title'),
			),
			'recipeTitle' => array(
			    'type' => 'string',
			    'selector' => '.recipe-card-title',
			),
			'summary' => array(
			    'type' => 'string',
			    'selector' => '.recipe-card-summary',
			    'default' => ''
			),
			'jsonSummary' => array(
			    'type' => 'string',
			),
			'course' => array(
			    'type' => 'array',
			    'items' => array(
			    	'type' => 'string'
			    )
			),
			'cuisine' => array(
			    'type' => 'array',
			    'items' => array(
			    	'type' => 'string'
			    )
			),
			'difficulty' => array(
			    'type' => 'array',
			    'items' => array(
			    	'type' => 'string'
			    )
			),
			'keywords' => array(
			    'type' => 'array',
			    'items' => array(
			    	'type' => 'string'
			    )
			),
			'settings' => array(
			    'type' => 'array',
			    'default' => array(
			        array(
			            'primary_color' => WPZOOM_Settings::get('wpzoom_rcb_settings_primary_color'),
			            'icon_details_color' => '#6d767f',
			            'hide_header_image' => false,
			            'print_btn' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_print') === '1',
			            'pin_btn' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_pin') === '1',
			            'pin_has_custom_image' => false,
			            'pin_custom_image' => array(),
			            'pin_custom_text' => '',
			            'custom_author_name' => WPZOOM_Settings::get('wpzoom_rcb_settings_author_custom_name'),
			            'displayCourse' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_course') === '1',
			            'displayCuisine' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_cuisine') === '1',
			            'displayDifficulty' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_difficulty') === '1',
			            'displayAuthor' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_author') === '1',
			            'displayServings' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_servings') === '1',
			            'displayPrepTime' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_preptime') === '1',
			            'displayCookingTime' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_cookingtime') === '1',
			            'displayTotalTime' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_totaltime') === '1',
			            'displayCalories' => WPZOOM_Settings::get('wpzoom_rcb_settings_display_calories') === '1',
			            'headerAlign' => WPZOOM_Settings::get('wpzoom_rcb_settings_heading_content_align'),
			            'ingredientsLayout' => '1-column',
			            'adjustableServings' => WPZOOM_Settings::get('wpzoom_rcb_settings_enable_adjustable_servings') === '1'
			        )
			    ),
			    'items' => array(
			    	'type' => 'object'
			    )
			),
			'details' => array(
			    'type' => 'array',
			    'default' => self::get_details_default(),
			    'items' => array(
			    	'type' => 'object'
			    )
			),
			'toInsert' => array(
			    'type' => 'integer',
			),
			'showModal' => array(
			    'type' => 'boolean',
			    'default' => false
			),
			'icons' => array(
		        'type' => 'object',
		    ),
			'activeIconSet' => array(
			    'type' => 'string',
			    'default' => 'foodicons'
			),
			'searchIcon' => array(
			    'type' => 'string',
			    'default' => ''
			),
			'ingredientsTitle' => array(
			    'type' => 'string',
			    'selector' => '.ingredients-title',
			    'default' => WPZOOM_Settings::get('wpzoom_rcb_settings_ingredients_title'),
			),
			'jsonIngredientsTitle' => array(
			    'type' => 'string',
			),
			'ingredients' => array(
			    'type' => 'array',
			    'default' => self::get_ingredients_default(),
			    'items' => array(
			    	'type' => 'object'
			    )
			),
			'directionsTitle' => array(
			    'type' => 'string',
			    'selector' => '.directions-title',
			    'default' => WPZOOM_Settings::get('wpzoom_rcb_settings_steps_title'),
			),
			'jsonDirectionsTitle' => array(
			    'type' => 'string',
			),
			'steps' => array(
			    'type' => 'array',
			    'default' => self::get_steps_default(),
			    'items' => array(
			    	'type' => 'object'
			    )
			),
			'notesTitle' => array(
			    'type' => 'string',
			    'selector' => '.notes-title',
			    'default' => WPZOOM_Settings::get('wpzoom_rcb_settings_notes_title'),
			),
			'notes' => array(
			    'type' => 'string',
			    'selector' => '.recipe-card-notes-list',
			    'default' => ''
			)
		);

		// Hook server side rendering into render callback
		register_block_type(
			'wpzoom-recipe-card/block-recipe-card', array(
				'attributes' => $attributes,
				'render_callback' => array( $this, 'render' ),
		) );
	}

	/**
	 * Renders the block.
	 *
	 * @param array  $attributes The attributes of the block.
	 * @param string $content    The HTML content of the block.
	 *
	 * @return string The block preceded by its JSON-LD script.
	 */
	public function render( $attributes, $content ) {
		if ( ! is_array( $attributes ) || ! is_singular() ) {
			return $content;
		}

		add_filter( 'the_content', array( $this, 'filter_the_content' ) );

		$attributes = self::$helpers->omit( $attributes, array( 'toInsert', 'activeIconSet', 'showModal', 'searchIcon', 'icons' ) );
		// Import variables into the current symbol table from an array
		extract( $attributes );

		$class = 'wp-block-wpzoom-recipe-card-block-recipe-card';

		// Recipe post variables
		$this->recipe 			= get_post();
		$recipe_ID 				= get_the_ID( $this->recipe );
		$recipe_title 			= get_the_title( $this->recipe );
		$recipe_thumbnail_url 	= get_the_post_thumbnail_url( $this->recipe );
		$recipe_thumbnail_id 	= get_post_thumbnail_id( $this->recipe );
		$recipe_permalink 		= get_the_permalink( $this->recipe );
		$recipe_author_name 	= get_the_author_meta( 'display_name', $this->recipe->post_author );
		$attachment_id 			= isset( $image['id'] ) ? $image['id'] : $recipe_thumbnail_id;
		$tasty_pins_pinterest_text = get_post_meta( $attachment_id, 'tp_pinterest_text', true );

		// Variables from attributes
		// add default value if not exists
		$recipeTitle 	= isset( $recipeTitle ) ? $recipeTitle : '';
		$summary 		= isset( $summary ) ? $summary : '';
		$className 		= isset( $className ) ? $className : '';
		$hasImage 		= isset( $hasImage ) ? $hasImage : false;
		$course 		= isset( $course ) ? $course : array();
		$cuisine 		= isset( $cuisine ) ? $cuisine : array();
		$difficulty 	= isset( $difficulty ) ? $difficulty : array();
		$keywords 		= isset( $keywords ) ? $keywords : array();
		$details 		= isset( $details ) ? $details : array();
		$ingredients 	= isset( $ingredients ) ? $ingredients : array();
		$steps 			= isset( $steps ) ? $steps : array();

		// Store variables
		self::$recipeBlockID = esc_attr( $id );
		self::$attributes 	= $attributes;
		self::$style 		= self::$helpers->get_block_style( $className );
		self::$settings 	= self::$helpers->parse_block_settings( $attributes );

		self::$attributes['ingredientsTitle'] = isset( $ingredientsTitle ) ? $ingredientsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_ingredients_title');
		self::$attributes['directionsTitle'] = isset( $directionsTitle ) ? $directionsTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_steps_title');
		self::$attributes['videoTitle'] = isset( $videoTitle ) ? $videoTitle : WPZOOM_Settings::get('wpzoom_rcb_settings_video_title');

		$class .= strpos( $className, 'is-style' ) === false ? ' is-style-' . self::$style : '';
		$class .= ' header-content-align-' . self::$settings['headerAlign'];
		$class .= $hasImage && isset($image['url']) ? '' : ' recipe-card-noimage';
		$class .= self::$settings['hide_header_image'] ? ' recipe-card-noimage' : '';
		$class .= '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_image') ? ' recipe-card-noimage-print' : '';

		if ( self::$settings['adjustableServings'] ) {
			$class .= ' wpzoom-recipe-card-block-adjustable-servings';
		}

		$pin_description = strip_tags($recipeTitle);
		if ( 'recipe_summary' === WPZOOM_Settings::get('wpzoom_rcb_settings_pin_description') ) {
			$pin_description = strip_tags( $summary );
		}
		elseif ( 'custom_text' === WPZOOM_Settings::get('wpzoom_rcb_settings_pin_description') ) {
			if ( ! empty( self::$settings['pin_custom_text'] ) ) {
				$pin_description = strip_tags( self::$settings['pin_custom_text'] );
			}
		}

		// compatibility with Tasty Pins plugin
		if ( ! empty( $tasty_pins_pinterest_text ) ) {
			$pin_description = strip_tags( $tasty_pins_pinterest_text );
 		}

		$pin_image = $hasImage ? $image['url'] : $recipe_thumbnail_url;
		if ( 'custom_image' === WPZOOM_Settings::get('wpzoom_rcb_settings_pin_image') ) {
			if ( self::$settings['pin_has_custom_image'] ) {

				$pin_custom_image 	= self::$settings['pin_custom_image'];
				$pin_image 			= $pin_custom_image['url'];

				if ( isset( $pin_custom_image['sizes']['large'] ) ) {
					$pin_image = $pin_custom_image['sizes']['large']['url'];
				}
				elseif ( isset( $pin_custom_image['sizes']['wpzoom-rcb-block-step-image'] ) ) {
					$pin_image = $pin_custom_image['sizes']['wpzoom-rcb-block-step-image']['url'];
				}
				elseif ( isset( $pin_custom_image['sizes']['full'] ) ) {
					$pin_image = $pin_custom_image['sizes']['full']['url'];
				}
			}
		}


		$custom_author_name = $recipe_author_name;
		if ( ! empty( self::$settings['custom_author_name'] ) ) {
			$custom_author_name = self::$settings['custom_author_name'];
		}

		$RecipeCardClassName 	= implode( ' ', array( $class, $className ) );

		$styles = '';

		if ( '' != self::$settings['primary_color'] ) {
			if ( 'default' === self::$style ) {
				$styles = array(
					'background-color' => self::$settings['primary_color'],
				);
			} else if ( 'newdesign' === self::$style ) {
				$styles = array(
					'background-color' => self::$settings['primary_color'],
					'box-shadow' => '0 5px 40px '. self::$settings['primary_color'] . ''
				);
			} else if ( 'simple' === self::$style ) {
				$styles = array(
					'background-color' => self::$settings['primary_color'],
				);
			}
		}
		$printStyles = self::$helpers->render_styles_attributes( $styles );

		$recipe_card_image = '';

		if ( $hasImage && isset( $image['url'] ) ) {
			$img_id = $image['id'];
			$src 	= $image['url'];
			$alt 	= ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) );
			$img_class  = '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_image') ? 'no-print' : '';
			$img_class .= ' wpzoom-recipe-card-image';

			$recipe_card_image = '<div class="recipe-card-image">
				<figure>
					'. sprintf( '<img id="%s" src="%s" alt="%s" class="%s"/>', $img_id, $src, $alt, trim($img_class) ) .'
					<figcaption>
						'.
							( self::$settings['pin_btn'] ? self::get_pinterest_button( array( 'url' => $pin_image ), $recipe_permalink, $pin_description ) : '' ).
							( self::$settings['print_btn'] ? self::get_print_button( $id, array( 'title' => __( "Print directions...", "wpzoom-recipe-card" ), 'style' => $printStyles ) ) : '' )
						.'
		            </figcaption>
				</figure>
			</div>';
		}
		elseif ( ! $hasImage && ! empty( $recipe_thumbnail_url ) ) {
			$img_id = $recipe_thumbnail_id;
			$src 	= $recipe_thumbnail_url;
			$alt 	= ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) );
			$img_class  = '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_image') ? 'no-print' : '';
			$img_class .= ' wpzoom-recipe-card-image';

			$recipe_card_image = '<div class="recipe-card-image">
				<figure>
					'. sprintf( '<img id="%s" src="%s" alt="%s" class="%s"/>', $img_id, $src, $alt, trim($img_class) ) .'
					<figcaption>
						'.
							( self::$settings['pin_btn'] ? self::get_pinterest_button( array( 'url' => $pin_image ), $recipe_permalink, $pin_description ) : '' ).
							( self::$settings['print_btn'] ? self::get_print_button( $id, array( 'title' => __( "Print directions...", "wpzoom-recipe-card" ), 'style' => $printStyles ) ) : '' )
						.'
		            </figcaption>
				</figure>
			</div>';
		}

		$recipe_card_heading = '
			<div class="recipe-card-heading">
				'. sprintf( '<h2 class="%s">%s</h2>', "recipe-card-title", ( $recipeTitle ? strip_tags( $recipeTitle ) : strip_tags( $recipe_title ) ) ) .
				( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_user_ratings') ?
					wpzoom_rating_stars( $recipe_ID ) : ''
				) .
				( self::$settings['displayAuthor'] ? '<span class="recipe-card-author">'. __( "Recipe by", "wpzoom-recipe-card" ) . " " . $custom_author_name .'</span>' : '' ) .
				( self::$settings['displayCourse'] ? $this->get_recipe_terms( 'wpzoom_rcb_courses' ) : '' ) .
				( self::$settings['displayCuisine'] ? $this->get_recipe_terms( 'wpzoom_rcb_cuisines' ) : '' ) .
				( self::$settings['displayDifficulty'] ? $this->get_recipe_terms( 'wpzoom_rcb_difficulties' ) : '' ) .
			'</div>';

		$summary_text = '';
		if ( ! empty( $summary ) ) {
			$summary_class = 'recipe-card-summary';
			$summary_class .= '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_summary_text') ? ' no-print' : '';
			$summary_text = sprintf(
				'<p class="%s">%s</p>',
				esc_attr( $summary_class ),
				$summary
			);
		}

		$details_content = $this->get_details_content( $details );
		$ingredients_content = $this->get_ingredients_content( $ingredients );
		$steps_content = $this->get_steps_content( $steps );
		$recipe_card_video = $this->get_video_content();

		$strip_tags_notes = isset( $notes ) ? strip_tags($notes) : '';
		$notes = str_replace('<li></li>', '', $notes); // remove empty list item
		$notes_content = ! empty($strip_tags_notes) ?
			sprintf(
				'<div class="recipe-card-notes">
					<h3 class="notes-title">%s</h3>
					<ul class="recipe-card-notes-list">%s</ul>
				</div>',
				@$notesTitle,
				@$notes
			) : '';

		$cta_content = self::get_cta_content();

		$footer_copyright = ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_footer_copyright') ? '' :
			'<div class="footer-copyright">
	        	<p>'. __( "Recipe Card plugin by ", "wpzoom-recipe-card" ) .'
	        		<a href="https://www.wpzoom.com/plugins/recipe-card-blocks/" target="_blank" rel="nofollow noopener noreferrer">WPZOOM</a>
	        	</p>
	        </div>'
		);

		if ( 'simple' === self::$style ) {
			// Wrap recipe card heading and details content into one div
			$recipe_card_image 		= '<div class="recipe-card-header-wrap">'. $recipe_card_image;
			$recipe_card_heading 	= '<div class="recipe-card-along-image">'. $recipe_card_heading;
			$details_content 		= $details_content .'</div></div><!-- /.recipe-card-header-wrap -->';
		}

		$block_content = sprintf(
			'<div class="%1$s" id="%2$s">%3$s</div>',
			esc_attr( trim($RecipeCardClassName) ),
			esc_attr( $id ),
			$recipe_card_image .
			$recipe_card_heading .
			$details_content .
			$summary_text .
			$ingredients_content .
			$steps_content .
			$recipe_card_video .
			$notes_content .
			$cta_content .
			$footer_copyright
		);

		$json_ld = $this->get_json_ld( $attributes );

		return '<script type="application/ld+json">' . wp_json_encode( $json_ld ) . '</script>' . $block_content;
	}

	/**
	 * Returns the JSON-LD for a premium-recipe-card block.
	 *
	 * @return array The JSON-LD representation of the premium-recipe-card block.
	 */
	protected function get_json_ld() {
		$attributes = self::$attributes;
		$tag_list  	= wp_get_post_terms( $this->recipe->ID, 'post_tag', array( 'fields' => 'names' ) );
		$cat_list 	= wp_get_post_terms( $this->recipe->ID, 'category', array( 'fields' => 'names' ) );

		$json_ld = array(
			'@context' 		=> 'https://schema.org',
			'@type'    		=> 'Recipe',
			'name'			=> isset( $attributes['recipeTitle'] ) ? $attributes['recipeTitle'] : $this->recipe->post_title,
			'image'			=> '',
			'description' 	=> isset( $attributes['summary'] ) ? $attributes['summary'] : $this->recipe->post_excerpt,
			'keywords'  	=> $tag_list,
			'author' 		=> array(
				'@type'		=> 'Person',
				'name'		=> get_the_author()
			),
			'datePublished' => get_the_time('c'),
			'prepTime' 		=> '',
			'cookTime'		=> '',
			'totalTime' 	=> '',
			'recipeCategory' => $cat_list,
			'recipeCuisine'  => array(),
			'recipeYield'	=> '',
			'nutrition' 	=> array(
				'@type' 	=> 'NutritionInformation'
			),
			'recipeIngredient'	 => array(),
			'recipeInstructions' => array(),
			'aggregateRating' => array(
			    '@type'		  => 'AggregateRating',
			    'ratingValue' => self::$wpzoom_rating->get_rating_average( $this->recipe->ID ),
			    'reviewCount' => self::$wpzoom_rating->get_total_votes( $this->recipe->ID )
			),
			'video'			=> array(
				'@type'			=> 'CreativeWork',
				'name'  		=> isset( $attributes['recipeTitle'] ) ? $attributes['recipeTitle'] : $this->recipe->post_title,
				'description' 	=> isset( $attributes['summary'] ) ? $attributes['summary'] : $this->recipe->post_excerpt,
				'thumbnailUrl' 	=> '',
				'contentUrl' 	=> '',
				'embedUrl' 		=> '',
				'uploadDate' 	=> get_the_time('c'), // by default is post plublish date
				'duration' 		=> '',
			),
		);

		if ( ! empty( $attributes['recipeTitle'] ) ) {
			$json_ld['name'] = $attributes['recipeTitle'];
		}

		if ( ! empty( $attributes['summary'] ) ) {
			$json_ld['description'] = strip_tags( $attributes['summary'] );
		}

		if ( ! empty( $attributes['image'] ) && isset( $attributes['hasImage'] ) && $attributes['hasImage'] ) {
			$json_ld['image'] = $attributes['image']['url'];
		}

		if ( isset( $attributes['video'] ) && ! empty( $attributes['video'] ) && isset( $attributes['hasVideo'] ) && $attributes['hasVideo'] ) {
			$video = $attributes['video'];
			$video_type = isset( $video['type'] ) ? $video['type'] : '';

			if ( isset( $video['title'] ) && ! empty( $video['title'] ) ) {
				$json_ld['video']['name'] = esc_html( $video['title'] );
			}
			if ( isset( $video['caption'] ) && !empty( $video['caption'] ) ) {
				$json_ld['video']['description'] = esc_html( $video['caption'] );
			}
			if ( isset( $video['description'] ) && !empty( $video['description'] ) ) {
				$json_ld['video']['description'] = esc_html( $video['description'] );
			}
			if ( isset( $video['poster']['url'] ) ) {
				$json_ld['video']['thumbnailUrl'] = esc_url( $video['poster']['url'] );
			}
			if ( isset( $video['url'] ) ) {
				if ( 'self-hosted' === $video_type ) {
					$json_ld['video']['contentUrl'] = esc_url( $video['url'] );
					unset( $json_ld['video']['embedUrl'] );
				}
				elseif ( 'embed' === $video_type ) {
					$video_embed_url = $video['url'];

					$json_ld['video']['@type'] = 'VideoObject';

					if ( ! empty( $attributes['image'] ) && isset( $attributes['hasImage'] ) && $attributes['hasImage'] ) {
						$json_ld['video']['thumbnailUrl'] = $attributes['image']['url'];
					}

					if ( strpos( $video['url'], 'youtu' ) ) {
						$video_embed_url = self::$helpers->convert_youtube_url_to_embed( $video['url'] );
					}
					elseif ( strpos( $video['url'] , 'vimeo' ) ) {
						$video_embed_url = self::$helpers->convert_vimeo_url_to_embed( $video['url'] );
					}

					$json_ld['video']['embedUrl'] = esc_url( $video_embed_url );
					unset($json_ld['video']['contentUrl']);
				}
			}
			if ( isset( $video['date'] ) ) {
				$json_ld['video']['uploadDate'] = $video['date'];
			}
		}
		else {

			// we have no video added
			// removed video attribute from json_ld array
			unset( $json_ld['video'] );

		}

		if ( ! empty( $attributes['course'] ) && self::$settings['displayCourse'] ) {
			$json_ld['recipeCategory'] = $attributes['course'];
		}

		if ( ! empty( $attributes['cuisine'] ) && self::$settings['displayCuisine'] ) {
			$json_ld['recipeCuisine'] = $attributes['cuisine'];
		}

		if ( ! empty( $attributes['keywords'] ) ) {
			$json_ld['keywords'] = $attributes['keywords'];
		}

		if ( ! empty( $attributes['details'] ) && is_array( $attributes['details'] ) ) {
			$details = array_filter( $attributes['details'], 'is_array' );

			foreach ( $details as $key => $detail ) {
				if ( $key === 0 ) {
					if ( ! empty( $detail[ 'value' ] ) && self::$settings['displayServings'] ) {
						if ( !is_array( $detail['value'] ) ) {
							$json_ld['recipeYield'] = $detail['value'];

							if ( isset( $detail['unit'] ) && ! empty( $detail['unit'] ) ) {
								$json_ld['recipeYield'] .= ' '.$detail['unit'];
							}
						}
						elseif ( isset( $detail['jsonValue'] ) ) {
							$json_ld['recipeYield'] = $detail['jsonValue'];

							if ( isset( $detail['unit'] ) && ! empty( $detail['unit'] ) ) {
								$json_ld['recipeYield'] .= ' '.$detail['unit'];
							}
						}
					}
				}
				elseif ( $key === 3 ) {
					if ( ! empty( $detail[ 'value' ] ) && self::$settings['displayCalories'] ) {
						if ( !is_array( $detail['value'] ) ) {
							$json_ld['nutrition']['calories'] = $detail['value'] .' cal';
						}
						elseif ( isset( $detail['jsonValue'] ) ) {
							$json_ld['nutrition']['calories'] = $detail['jsonValue'] .' cal';
						}
					}
				}
				elseif ( $key === 1 ) {
					if ( ! empty( $detail[ 'value' ] ) && self::$settings['displayPrepTime'] ) {
						if ( !is_array( $detail['value'] ) ) {
							$prepTime = $this->structured_data_helpers->get_number_from_string( $detail['value'] );
						    $json_ld['prepTime'] = $this->structured_data_helpers->get_period_time( $detail['value'] );
						}
						elseif ( isset( $detail['jsonValue'] ) ) {
							$prepTime = $this->structured_data_helpers->get_number_from_string( $detail['jsonValue'] );
						    $json_ld['prepTime'] = $this->structured_data_helpers->get_period_time( $detail['jsonValue'] );
						}
					}
				}
				elseif ( $key === 2 ) {
					if ( ! empty( $detail[ 'value' ] ) && self::$settings['displayCookingTime'] ) {
						if ( !is_array( $detail['value'] ) ) {
							$cookTime = $this->structured_data_helpers->get_number_from_string( $detail['value'] );
						    $json_ld['cookTime'] = $this->structured_data_helpers->get_period_time( $detail['value'] );
						}
						elseif ( isset( $detail['jsonValue'] ) ) {
							$cookTime = $this->structured_data_helpers->get_number_from_string( $detail['jsonValue'] );
						    $json_ld['cookTime'] = $this->structured_data_helpers->get_period_time( $detail['jsonValue'] );
						}
					}
				}
				elseif ( $key === 8 ) {
					if ( ! empty( $detail[ 'value' ] ) && self::$settings['displayTotalTime'] ) {
						if ( !is_array( $detail['value'] ) ) {
							$json_ld['totalTime'] = $this->structured_data_helpers->get_period_time( $detail['value'] );
						}
						elseif ( isset( $detail['jsonValue'] ) ) {
							$json_ld['totalTime'] = $this->structured_data_helpers->get_period_time( $detail['jsonValue'] );
						}
					}
				}
			}

			if ( empty( $json_ld['totalTime'] ) ) {
				if ( isset( $prepTime, $cookTime ) && ( $prepTime + $cookTime ) > 0 ) {
					$json_ld['totalTime'] = $this->structured_data_helpers->get_period_time( $prepTime + $cookTime );
				}
			}
		}

		if ( ! empty( $attributes['ingredients'] ) && is_array( $attributes['ingredients'] ) ) {
			$ingredients = array_filter( $attributes['ingredients'], 'is_array' );
			foreach ( $ingredients as $ingredient ) {
				$json_ld['recipeIngredient'][] = $this->structured_data_helpers->get_ingredient_json_ld( $ingredient );
			}
		}

		if ( ! empty( $attributes['steps'] ) && is_array( $attributes['steps'] ) ) {
			$steps = array_filter( $attributes['steps'], 'is_array' );
			foreach ( $steps as $step ) {
				$json_ld['recipeInstructions'][] = $this->structured_data_helpers->get_step_json_ld( $step );
			}
		}

		return $json_ld;
	}

	public static function get_details_default() {
		return array(
			array(
				'id' 		=> self::$helpers->generateId( "detail-item" ),
				'iconSet' 	=> 'oldicon',
				'icon' 		=> 'food',
				'label' 	=> __( "Servings", "wpzoom-recipe-card" ),
				'unit' 		=> __( "servings", "wpzoom-recipe-card" ),
				'value'		=> '4'
			),
		    array(
		    	'id' 		=> self::$helpers->generateId( "detail-item" ),
		    	'iconSet' 	=> 'oldicon',
		    	'icon' 		=> 'clock',
		    	'label' 	=> __( "Prep time", "wpzoom-recipe-card" ),
		    	'unit' 		=> __( "minutes", "wpzoom-recipe-card" ),
		    	'value'		=> '30'
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'foodicons',
		        'icon' 		=> 'cooking-food-in-a-hot-casserole',
		        'label' 	=> __( "Cooking time", "wpzoom-recipe-card" ),
		        'unit' 		=> __( "minutes", "wpzoom-recipe-card" ),
		        'value'		=> '40'
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'foodicons',
		        'icon' 		=> 'fire-flames',
		        'label' 	=> __( "Calories", "wpzoom-recipe-card" ),
		        'unit' 		=> __( "kcal", "wpzoom-recipe-card" ),
		        'value'		=> '300'
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'far',
		        'icon' 		=> 'clock',
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'oldicon',
		        'icon' 		=> 'chef-cooking',
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'oldicon',
		        'icon' 		=> 'food-1',
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'fas',
		        'icon' 		=> 'sort-amount-down',
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "detail-item" ),
		        'iconSet' 	=> 'far',
		        'icon' 		=> 'clock',
		        'label' 	=> __( "Total time", "wpzoom-recipe-card" ),
		        'unit' 		=> __( "minutes", "wpzoom-recipe-card" ),
		        'value'		=> '0'
		    ),
		);
	}

	public static function get_ingredients_default() {
		return array(
			array(
				'id' 		=> self::$helpers->generateId( "ingredient-item" ),
				'name' 		=> array(),
			),
		    array(
		    	'id' 		=> self::$helpers->generateId( "ingredient-item" ),
		    	'name' 		=> array(),
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "ingredient-item" ),
		        'name' 		=> array(),
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "ingredient-item" ),
		        'name' 		=> array(),
		    )
		);
	}

	public static function get_steps_default() {
		return array(
			array(
				'id' 		=> self::$helpers->generateId( "direction-step" ),
				'text' 		=> array(),
			),
		    array(
		    	'id' 		=> self::$helpers->generateId( "direction-step" ),
		    	'text' 		=> array(),
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "direction-step" ),
		        'text' 		=> array(),
		    ),
		    array(
		        'id' 		=> self::$helpers->generateId( "direction-step" ),
		        'text' 		=> array(),
		    )
		);
	}

	protected function get_details_content( array $details ) {
		$detail_items = $this->get_detail_items( $details );
		$details_class = 'recipe-card-details';
		$details_class .= '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_details') ? ' no-print' : '';

		if ( !empty($detail_items) ) {
			return sprintf(
				'<div class="%s"><div class="details-items">%s</div></div>',
				esc_attr( $details_class ),
				$detail_items
			);
		} else {
			return '';
		}
	}

	protected function get_detail_items( array $details ) {
		$output = '';

		foreach ( $details as $index => $detail ) {
			$icon = $label = $value = $unit = '';

			if ( 0 === $index && self::$settings['displayServings'] != '1' ) {
				continue;
			} elseif ( 1 === $index && self::$settings['displayPrepTime'] != '1' ) {
				continue;
			} elseif ( 2 === $index && self::$settings['displayCookingTime'] != '1' ) {
				continue;
			} elseif ( 8 === $index && self::$settings['displayTotalTime'] != '1' ) {
				continue;
			} elseif ( 3 === $index && self::$settings['displayCalories'] != '1' ) {
				continue;
			} elseif ( ( 4 === $index || 5 === $index || 6 === $index || 7 === $index ) && empty( $detail['label'] ) ) {
				continue;
			}

			if ( ! empty( $detail[ 'icon' ] ) ) {
				$icon 	 			= $detail['icon'];
				$iconSet 			= isset( $detail['iconSet'] ) ? $detail['iconSet'] : 'oldicon';
				$_prefix 			= isset( $detail['_prefix'] ) && ! empty( $detail['_prefix'] ) ? $detail['_prefix'] : $iconSet;
				$itemIconClasses 	= implode( ' ', array( 'detail-item-icon', $_prefix, $iconSet . '-' . $detail['icon'] ) );
				$styles 			= array();

				if ( '' != self::$settings['primary_color'] ) {
					if ( 'default' === self::$style ) {
						$styles = array(
							'color' => @self::$settings['primary_color']
						);
					} elseif ( 'newdesign' === self::$style ) {
						$styles = array(
							'color' => self::$settings['primary_color']
						);
					} elseif ( 'simple' === self::$style ) {
						$styles = array(
							'color' => self::$settings['primary_color']
						);
					}
				}
				$iconStyles = self::$helpers->render_styles_attributes( $styles );

				$icon = sprintf(
					'<span class="%s" icon-name="%s" iconset="%s" style="%s"></span>',
					$itemIconClasses,
					$icon,
					$iconSet,
					$iconStyles
				);
			}

			if ( ! empty( $detail['label'] ) ) {
				$label = sprintf(
					'<span class="detail-item-label">%s</span>',
					$detail['label']
				);
			}

			if ( ! empty( $detail[ 'value' ] ) ) {
				if ( !is_array( $detail['value'] ) ) {
					$value = sprintf(
						'<p class="detail-item-value">%s</p>',
						$detail['value']
					);
				} elseif ( isset( $detail['jsonValue'] ) ) {
					$value = sprintf(
						'<p class="detail-item-value">%s</p>',
						$detail['jsonValue']
					);
				}
			}
			if ( ! empty( $detail[ 'unit' ] ) ) {
				$unit = sprintf(
					'<span class="detail-item-unit">%s</span>',
					$detail['unit']
				);
			}

			// User has enabled Adjustable Servings?
			if ( 0 === $index && self::$settings['adjustableServings'] ) {
				$value = sprintf(
					'<div class="detail-item-value adjustable-quantity no-print">
						<input class="detail-item-adjustable-servings" type="number" data-servings="%1$s" data-original-servings="%1$s" value="%1$s" min="1" step="1">
					</div><p class="detail-item-value only-print-visible">%1$s</p>',
					$detail['value']
				);
			}

			// convert minutes to hours for 'prep time', 'cook time' and 'total time'
			if ( 1 === $index || 2 === $index || 8 === $index ) {
				if ( ! empty( $detail['value'] ) ) {
					$converts = self::$helpers->convertMinutesToHours( $detail['value'], true );
					if ( ! empty( $converts ) ) {
						$value = $unit = '';
						if ( isset( $converts['hours'] ) ) {
							$value .= sprintf(
								'<p class="detail-item-value">%s</p>',
								$converts['hours']['value']
							);
							$value .= sprintf(
								'<span class="detail-item-unit">%s&nbsp;</span>',
								$converts['hours']['unit']
							);
						}
						if ( isset( $converts['minutes'] ) ) {
							$unit .= sprintf(
								'<p class="detail-item-value">%s</p>',
								$converts['minutes']['value']
							);
							$unit .= sprintf(
								'<span class="detail-item-unit">%s</span>',
								$converts['minutes']['unit']
							);
						}
					}
				}
			}

			$output .= sprintf(
				'<div class="%1$s %1$s-%2$s">%3$s</div>',
				'detail-item',
				$index,
				$icon . $label . $value . $unit
			);
		}

		return force_balance_tags( $output );
	}

	protected function get_ingredients_content( array $ingredients ) {
		$ingredient_items = $this->get_ingredient_items( $ingredients );

		$listClassNames = implode( ' ', array( 'ingredients-list', 'layout-' . self::$settings['ingredientsLayout'] ) );

		return sprintf(
			'<div class="recipe-card-ingredients"><h3 class="ingredients-title">%s</h3><ul class="%s">%s</ul></div>',
			self::$attributes['ingredientsTitle'],
			$listClassNames,
			$ingredient_items
		);
	}

	protected function get_ingredient_items( array $ingredients ) {
		$output = '';

		foreach ( $ingredients as $index => $ingredient ) {
			$tick = $name = '';
			$amount = $unit = '';
			$styles = array();
			$isGroup = isset($ingredient['isGroup']) ? $ingredient['isGroup'] : false;

			if ( isset( $ingredient['parse'] ) ) {
				$amount = isset( $ingredient['parse']['amount'] ) ? $ingredient['parse']['amount'] : '';
				$unit = isset( $ingredient['parse']['unit'] ) ? $ingredient['parse']['unit'] : '';
			}

			if ( !$isGroup ) {
				if ( 'newdesign' === self::$style || 'simple' === self::$style ) {

					if ( '' != self::$settings['primary_color'] ) {
						$styles = array(
							'border' => '2px solid ' . self::$settings['primary_color']
						);
					}

					$tickStyles = self::$helpers->render_styles_attributes( $styles );

					$tick = sprintf(
						'<span class="tick-circle" style="%s"></span>',
						$tickStyles
					);
				} else {
					$tick = '<span class="tick-circle"></span>';
				}

				if ( ! empty( $ingredient[ 'name' ] ) ) {
					$amount = !empty( $amount ) ? sprintf( '<span class="wpzoom-rcb-ingredient-amount">%s</span>', $amount ) : '';
					$unit = !empty( $unit ) ? sprintf( '<span class="wpzoom-rcb-ingredient-unit">%s</span>', $unit ) : '';
					$name = sprintf( '<span class="wpzoom-rcb-ingredient-name">%s</span>', $this->wrap_ingredient_name( $ingredient['name'] ) );

					$name = sprintf(
						'<p class="ingredient-item-name">%s %s %s</p>',
						$amount,
						$unit,
						$name
					);
					$output .= sprintf(
						'<li class="ingredient-item">%s</li>',
						$tick . $name
					);
				}
			} else {
				if ( ! empty( $ingredient[ 'name' ] ) ) {
					$name = sprintf(
						'<strong class="ingredient-item-group-title">%s</strong>',
						$this->wrap_ingredient_name( $ingredient['name'] )
					);
					$output .= sprintf(
						'<li class="ingredient-item ingredient-item-group">%s</li>',
						$tick . $name
					);
				}
			}
		}

		return force_balance_tags( $output );
	}

	protected function get_steps_content( array $steps ) {
		$direction_items = $this->get_direction_items( $steps );

		$listClassNames = implode( ' ', array( 'directions-list' ) );

		return sprintf(
			'<div class="recipe-card-directions"><h3 class="directions-title">%s</h3><ul class="%s">%s</ul></div>',
			self::$attributes['directionsTitle'],
			$listClassNames,
			$direction_items
		);
	}

	protected function get_direction_items( array $steps ) {
		$output = '';

		foreach ( $steps as $index => $step ) {
			$text = '';
			$isGroup = isset($step['isGroup']) ? $step['isGroup'] : false;

			if ( !$isGroup ) {
				if ( ! empty( $step['text'] ) ) {
					$text = $this->wrap_direction_text( $step['text'] );
					$output .= sprintf(
						'<li class="direction-step">%s</li>',
						$text
					);
				}
			} else {
				if ( ! empty( $step['text'] ) ) {
					$text = sprintf(
						'<strong class="direction-step-group-title">%s</strong>',
						$this->wrap_direction_text( $step['text'] )
					);
					$output .= sprintf(
						'<li class="direction-step direction-step-group">%s</li>',
						$text
					);
				}
			}
		}

		return force_balance_tags( $output );
	}

	protected function get_recipe_terms( $taxonomy ) {
		$option_value 	= '0';
		$attributes 	= self::$attributes;
		$render 		= true;

		$className = $label = $terms_output = '';

		extract( $attributes );

		$course 		= isset( $course ) ? $course : array();
		$cuisine 		= isset( $cuisine ) ? $cuisine : array();
		$difficulty 	= isset( $difficulty ) ? $difficulty : array();

		if ( 'wpzoom_rcb_courses' === $taxonomy ) {
			if ( empty( $course ) ) {
				$render = false;
			}
			$terms 			= $course;
			$option_value 	= WPZOOM_Settings::get('wpzoom_rcb_settings_course_taxonomy');
			$className 		= 'recipe-card-course';
			$label 			= __( "Course:", "wpzoom-recipe-card" );
		}
		elseif ( 'wpzoom_rcb_cuisines' === $taxonomy ) {
			if ( empty( $cuisine ) ) {
				$render = false;
			}
			$terms 			= $cuisine;
			$option_value 	= WPZOOM_Settings::get('wpzoom_rcb_settings_cuisine_taxonomy');
			$className 		= 'recipe-card-cuisine';
			$label 			= __( "Cuisine:", "wpzoom-recipe-card" );
		}
		elseif ( 'wpzoom_rcb_difficulties' === $taxonomy ) {
			if ( empty( $difficulty ) ) {
				$render = false;
			}
			$terms 			= $difficulty;
			$option_value 	= WPZOOM_Settings::get('wpzoom_rcb_settings_difficulty_taxonomy');
			$className 		= 'recipe-card-difficulty';
			$label 			= __( "Difficulty:", "wpzoom-recipe-card" );
		}

		if ( $render ) {
			$terms_output = sprintf( '<span class="%s">%s <mark>%s</mark></span>', $className, $label, implode( ', ', $terms ) );
		}

		if ( '1' === $option_value ) {
			$args = array(
				'orderby' => 'name',
				'order' => 'asc'
			);
			$post_terms = wp_get_post_terms( $this->recipe->ID, $taxonomy, $args );

			if ( empty( $post_terms ) ) {
				if ( empty( $terms ) ) return $terms_output;
				
				$term_items = array();
				foreach ( $terms as $term_name ) {
					// Insert term if not exists
					$term = get_term_by( 'name', $term_name, $taxonomy );
					if ( ! $term ) {
						wp_insert_term( $term_name, $taxonomy );
					}

					$term = get_term_by( 'name', $term_name, $taxonomy );
					$term_link = get_term_link( $term, $taxonomy );
					
					if ( ! is_wp_error( $term_link ) ) {
						$term_items[] = sprintf( '<a href="%s" rel="nofollow noreferrer">%s</a>', esc_url( $term_link ), $term_name );
					} else {
						$term_items[] = $term_name;
					}
				}
			} else {
				$terms = $post_terms;
				$term_items = array();

				foreach ( $terms as $term ) {
					$term_link = get_term_link( $term, $taxonomy );
					$term_items[] = sprintf( '<a href="%s" rel="nofollow noreferrer">%s</a>', esc_url( $term_link ), $term->name );
				}
			}

			$terms_output = sprintf( '<span class="%s">%s <mark>%s</mark></span>', $className, $label, implode( ', ', $term_items ) );
		}

		return $terms_output;
	}

	protected function wrap_direction_text( $nodes, $type = '' ) {
		$attributes = self::$attributes;

		if ( ! is_array( $nodes ) ) {
			return $nodes;
		}

		$output = '';
		foreach ( $nodes as $node ) {
			if ( ! is_array( $node ) ) {
				$output .= $node;
			} else {
				$type = isset( $node['type'] ) ? $node['type'] : null;
				$children = isset( $node['props']['children'] ) ? $node['props']['children'] : null;

				$start_tag = $type ? "<$type>" : "";
				$end_tag = $type ? "</$type>" : "";

				if ( 'img' === $type ) {
					$src = isset( $node['props']['src'] ) ? $node['props']['src'] : false;
					if ( $src ) {
						$alt = isset( $node['props']['alt'] ) ? $node['props']['alt'] : '';
						$title = isset( $node['props']['title'] ) ? $node['props']['title'] : ( isset( $attributes['recipeTitle'] ) ? $attributes['recipeTitle'] : $this->recipe->post_title );
						$class = '0' == WPZOOM_Settings::get('wpzoom_rcb_settings_print_show_steps_image') ? 'no-print' : '';
						$class .= ' direction-step-image';
						$img_style = isset($node['props']['style']) ? $node['props']['style'] : '';

						$start_tag = sprintf( '<%s src="%s" title="%s" alt="%s" class="%s" style="%s"/>', $type, $src, $title, $alt, trim($class), $this->parseTagStyle($img_style) );
					} else {
						$start_tag = "";
					}
					$end_tag = "";
				}
				elseif ( 'a' === $type ) {
					$rel 		= isset( $node['props']['rel'] ) ? $node['props']['rel'] : '';
					$aria_label = isset( $node['props']['aria-label'] ) ? $node['props']['aria-label'] : '';
					$href 		= isset( $node['props']['href'] ) ? $node['props']['href'] : '#';
					$target 	= isset( $node['props']['target'] ) ? $node['props']['target'] : '_blank';

					$start_tag = sprintf( '<%s rel="%s" aria-label="%s" href="%s" target="%s">', $type, $rel, $aria_label, $href, $target );
				}
				elseif ( 'br' === $type ) {
					$end_tag = "";
				}

				$output .= $start_tag . $this->wrap_direction_text( $children, $type ) . $end_tag;
			}
		}

		return $output;
	}

	protected function wrap_ingredient_name( $nodes, $type = '' ) {
		$attributes = self::$attributes;

		if ( ! is_array( $nodes ) ) {
			return $nodes;
		}

		$output = '';
		foreach ( $nodes as $node ) {
			if ( ! is_array( $node ) ) {
				$output .= $node;
			} else {
				$type = isset( $node['type'] ) ? $node['type'] : null;
				$children = isset( $node['props']['children'] ) ? $node['props']['children'] : null;

				$start_tag = $type ? "<$type>" : "";
				$end_tag = $type ? "</$type>" : "";

				if ( 'a' === $type ) {
					$rel 		= isset( $node['props']['rel'] ) ? $node['props']['rel'] : '';
					$aria_label = isset( $node['props']['aria-label'] ) ? $node['props']['aria-label'] : '';
					$href 		= isset( $node['props']['href'] ) ? $node['props']['href'] : '#';
					$target 	= isset( $node['props']['target'] ) ? $node['props']['target'] : '_blank';

					$start_tag = sprintf( '<%s rel="%s" aria-label="%s" href="%s" target="%s">', $type, $rel, $aria_label, $href, $target );
				}
				elseif ( 'br' === $type ) {
					$end_tag = "";
				}

				$output .= $start_tag . $this->wrap_ingredient_name( $children, $type ) . $end_tag;
			}
		}

		return $output;
	}

	/**
	 * Get HTML content for recipe video
	 * 
	 * @since 2.2.0
	 * @return void
	 */
	public function get_video_content() {
		$attributes = self::$attributes;
		$hasVideo = isset( $attributes['hasVideo'] ) && $attributes['hasVideo'];
		$output = '';

		if ( ! $hasVideo ) {
			return '';
		}

		$video = isset( $attributes['video'] ) && ! empty( $attributes['video'] ) ? $attributes['video'] : array();
		$video_type = isset( $video['type'] ) ? $video['type'] : '';
		$video_url = isset( $video['url'] ) ? esc_url( $video['url'] ) : '';
		$video_poster = isset( $video['poster']['url'] ) ? esc_url( $video['poster']['url'] ) : '';
		$video_settings = isset( $video['settings'] ) ? $video['settings'] : array();

		if ( 'embed' === $video_type ) {
			$output = wp_oembed_get( $video_url );
		}
		elseif ( 'self-hosted' === $video_type ) {
			$attrs = array();
			foreach ( $video_settings as $attribute => $value ) {
				if ( $value ) {
					$attrs[] = $attribute;
				}
			}
			$attrs = implode( ' ', $attrs );

			$output = sprintf(
				'<video %s src="%s" poster="%s"></video>',
				esc_attr( $attrs ),
				$video_url,
				$video_poster
			);
		}

		return sprintf( '<div class="recipe-card-video no-print"><h3 class="video-title">%s</h3>%s</div>', $attributes['videoTitle'], $output );
	}

	/**
	 * Filter content when rendering recipe card block
	 * Add snippets at the top of post content
	 *
	 * @since 1.2.0
	 * @param string $content Main post content
	 * @return string HTML of post content
	 */
	public function filter_the_content( $content ) {
		if ( ! in_the_loop() ) {
			return $content;
		}

		$output = '';

		// Automatically display snippets at the top of post content
		if ( '1' === WPZOOM_Settings::get('wpzoom_rcb_settings_display_snippets') ) {
			$custom_blocks = array(
				'wpzoom-recipe-card/block-jump-to-recipe',
				'wpzoom-recipe-card/block-print-recipe'
			);
			$output .= '<div class="wpzoom-recipe-card-buttons">';
			foreach ( $custom_blocks as $block_name ) {
				if ( $block_name == 'wpzoom-recipe-card/block-jump-to-recipe' ) {
		    		$attrs = array(
		    			'id' => self::$recipeBlockID,
		    			'text' => WPZOOM_Settings::get('wpzoom_rcb_settings_jump_to_recipe_text')
		    		);
		    		$block = array(
		    			'blockName' => $block_name,
		    			'attrs' => $attrs,
		    			'innerBlocks' => array(),
		    			'innerHTML' => '',
		    			'innerContent' => array()
		    		);
		    		$output .= render_block( $block );
				}
				if ( $block_name == 'wpzoom-recipe-card/block-print-recipe' ) {
		    		$attrs = array(
		    			'id' => self::$recipeBlockID,
		    			'text' => WPZOOM_Settings::get('wpzoom_rcb_settings_print_recipe_text')
		    		);
		    		$block = array(
		    			'blockName' => $block_name,
		    			'attrs' => $attrs,
		    			'innerBlocks' => array(),
		    			'innerHTML' => '',
		    			'innerContent' => array()
		    		);
		    		$output .= render_block( $block );
				}
			}
			$output .= '</div>';
		}

		return $output . $content;
	}

	/**
	 * Parse HTML tag styles
	 *
	 * @since 2.2.0
	 * @param string|array $style Tag styles to parse
	 * @return string 			  CSS styles
	 */
	public function parseTagStyle( $styles ) {
		$css = '';
		if ( is_array( $styles ) ) {
			foreach ( $styles as $property => $value ) {
				$css .= $property.': '.$value.';';
			}
		} elseif ( is_string( $styles ) ) {
			$css = $styles;
		}
		return $css;
	}

	/**
	 * Get HTML for print button
	 * 
	 * @since 2.2.0
	 * 
	 * @param array $media        The recipe media image array which include 'url'
	 * @param string $url         The recipe permalink url
	 * @param string $description The description to display on pinterest board
	 * @param array $attributes   Additional html attributes like ('style' => 'color: red; font-size: inherit')
	 * @return string
	 */
	public static function get_print_button( $content_id, $attributes = array() ) {
		if ( empty( $content_id ) )
			return '';

		$PrintClasses = implode( ' ', array( "wpzoom-recipe-card-print-link" ) );

		$atts = self::$helpers->render_attributes( $attributes );

		$output = sprintf(
			'<div class="%s">
	            <a class="btn-print-link no-print" href="#%s" %s>
	            	<i class="icon-print-link"></i>
	                <span>%s</span>
	            </a>
	        </div>',
			esc_attr( $PrintClasses ),
			esc_attr( $content_id ),
			$atts,
			__( "Print", "wpzoom-recipe-card" )
		);

		return $output;
	}

	/**
	 * Get HTML for pinterest button
	 * 
	 * @since 2.2.0
	 * 
	 * @param array $media        The recipe media image array which include 'url'
	 * @param string $url         The recipe permalink url
	 * @param string $description The description to display on pinterest board
	 * @param array|string $attributes   Additional html attributes: array('style' => 'color: red; font-size: inherit') or 
	 * 									 string 'style="color: red; font-size: inherit"'
	 * @return string
	 */
	public static function get_pinterest_button( $media, $url, $description = '', $attributes = '' ) {
		if ( ! isset(  $media['url'] ) )
			return '';

		$PinterestClasses = implode( ' ', array( "wpzoom-recipe-card-pinit" ) );
		$pinitURL 		  = 'https://www.pinterest.com/pin/create/button/?url=' . esc_url( $url ) .'&media='. esc_url( $media['url'] ) .'&description='. esc_html( $description ) .'';

		$atts = self::$helpers->render_attributes( $attributes );

		$output = sprintf(
			'<div class="%s">
	            <a class="btn-pinit-link no-print" data-pin-do="buttonPin" href="%s" data-pin-custom="true" %s>
	            	<i class="icon-pinit-link"></i>
	            	<span>%s</span>
	            </a>
	        </div>',
	        esc_attr( $PinterestClasses ),
	        esc_url( $pinitURL ),
	        $atts,
	        __( "Pin", "wpzoom-recipe-card" )
		);

		return $output;
	}

	/**
	 * Build Call To Action link
	 * 
	 * @since 2.4.0
	 * 
	 * @param stirng $url 
	 * @param string $attr 
	 * @param string $symbol 
	 * @return string
	 */
	private static function cta_build_link( $url, $attr, $symbol = '@' ) {
        if ( '' == $attr ) {
            return '';
        }

        $target   = WPZOOM_Settings::get( 'wpzoom_rcb_settings_cta_target' );
        $nofollow = WPZOOM_Settings::get( 'wpzoom_rcb_settings_cta_add_nofollow' );

        return sprintf(
        	'<a href="%s" target="%s" %s>%s</a>',
        	$url .'/'. $attr,
        	( 1 == $target ? '_blank' : '_self' ),
        	( 1 == $nofollow ? 'rel="nofollow"' : '' ),
        	$symbol . $attr
        );
    }

    /**
     * Parse Instagram Text
     * 
     * @since 2.4.0
     * 
     * @param string $text 
     * @return string
     */
    private static function cta_parse_instagram_text( $text ) {
        $igURL         	= 'https://www.instagram.com';
        $igHashtagURL  	= 'https://www.instagram.com/explore/tags';
        $igUsername 	= WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_profile' );
        $igHashtag 		= WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_hashtag' );

        $text = str_replace( '%profile%', self::cta_build_link( $igURL, $igUsername ), $text );
        $text = str_replace( '%hashtag%', self::cta_build_link( $igHashtagURL, $igHashtag, '#' ), $text );

        return $text;
    }

    /**
     * Parse Pinterest Text
     * 
     * @since 2.4.0
     * 
     * @param string $text 
     * @return string
     */
    private static function cta_parse_pinterest_text( $text ) {
        $pinURL = 'https://www.pinterest.com';
        $pinUsername = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_profile' );

        $text = str_replace( '%profile%', self::cta_build_link( $pinURL, $pinUsername ), $text );

        return $text;
    }

    /**
     * Get the Call To Action content
     * 
     * @since 2.4.0
     * 
     * @return object
     */
    public static function get_cta_content() {
    	$igUsername = WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_profile' );
    	$igTitle = WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_title' );
    	$igSubtitle = WPZOOM_Settings::get( 'wpzoom_rcb_settings_instagram_cta_subtitle' );

    	$pinUsername = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_profile' );
    	$pinTitle = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_title' );
    	$pinSubtitle = WPZOOM_Settings::get( 'wpzoom_rcb_settings_pinterest_cta_subtitle' );

    	ob_start();
    ?>
    	<?php if ( ! empty( $igUsername ) ): ?>
	    	<div class="recipe-card-cta-instagram no-print">
	    	    <div class="cta-brand-icon"><i class="fab fa-instagram"></i></div>
	    	    <div class="cta-text-wrapper">
	    	        <h3 class="cta-text-title"><?php echo $igTitle ?></h3>
	    	        <p class="cta-text-subtitle"><?php echo self::cta_parse_instagram_text( $igSubtitle ) ?></p>
	    	    </div>
	    	</div>
    	<?php endif ?>

    	<?php if ( ! empty( $pinUsername ) ): ?>
    		<div class="recipe-card-cta-pinterest no-print">
    		    <div class="cta-brand-icon"><i class="fab fa-pinterest"></i></div>
    		    <div class="cta-text-wrapper">
    		        <h3 class="cta-text-title"><?php echo $pinTitle ?></h3>
    		        <p class="cta-text-subtitle"><?php echo self::cta_parse_pinterest_text( $pinSubtitle ) ?></p>
    		    </div>
    		</div>
    	<?php endif ?>
    <?php

    	$content = ob_get_contents();
    	ob_end_clean();

    	return $content;
    }
}