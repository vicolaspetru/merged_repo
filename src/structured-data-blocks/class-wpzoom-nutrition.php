<?php
/**
 * Nutrition Block
 *
 * @since   2.3.2
 * @package WPZOOM Recipe Card Block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main WPZOOM_Nutrition_Block Class.
 */
class WPZOOM_Nutrition_Block {
	/**
	 * The post Object.
	 *
	 * @since 2.3.2
	 */
	private $recipe;

	/**
	 * Class instance Structured Data Helpers.
	 *
	 * @var WPZOOM_Structured_Data_Helpers
	 * @since 2.3.2
	 */
	private $structured_data_helpers;

	/**
	 * Class instance Helpers.
	 *
	 * @var WPZOOM_Helpers
	 * @since 2.3.2
	 */
	private static $helpers;

	/**
	 * Class instance WPZOOM Rating Stars.
	 *
	 * @var WPZOOM_Rating_Stars
	 * @since 2.3.2
	 */
	private static $wpzoom_rating;

	/**
	 * Block attributes.
	 *
	 * @since 2.3.2
	 */
	public static $attributes;

	/**
	 * Block settings.
	 *
	 * @since 2.3.2
	 */
	public static $settings;

	/**
	 * The Constructor.
	 */
	public function __construct() {
		$this->structured_data_helpers = new WPZOOM_Structured_Data_Helpers();
		self::$helpers = new WPZOOM_Helpers();
		self::$wpzoom_rating = new WPZOOM_Rating_Stars();
	}

	/**
	 * Registers the nutrition block as a server-side rendered block.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		if ( wpzoom_rcb_block_is_registered( 'wpzoom-recipe-card/block-nutrition' ) ) {
			return;
		}

		$attributes = array(
			'id' => array(
			    'type' => 'string',
			    'default' => 'wpzoom-recipe-nutrition'
			),
			'data' => array(
			    'type' => 'object'
			),
		);

		// Hook server side rendering into render callback
		register_block_type(
			'wpzoom-recipe-card/block-nutrition', array(
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

		echo '<pre>';
		print_r($attributes);
		echo '</pre>';

		return $content;
	}
}