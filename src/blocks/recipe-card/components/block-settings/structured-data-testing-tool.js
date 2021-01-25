/**
 * External dependencies
 */
import {
	get,
	isEmpty,
	isUndefined,
} from 'lodash';

/**
 * Internal dependencies
 */
import {
	stripHTML,
	convertMinutesToHours,
} from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	PanelRow,
	Notice,
	Icon,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Structured Data Testing', 'wpzoom-recipe-card' );
const NOT_ADDED = __( 'Not added', 'wpzoom-recipe-card' );
const NOT_DISPLAYED = <Icon icon="hidden" title={ __( 'Not displayed', 'wpzoom-recipe-card' ) } />;

const StructuredDataTestingTool = ( props ) => {
	const {
		attributes,
		noticeData,
		tableData,
		errorDetails,
		warningDetails,
		notDisplayDetails,
	} = props;

	const {
		id,
		hasImage,
		image,
		hasVideo,
		video,
		recipeTitle,
		summary,
		jsonSummary,
		course,
		cuisine,
		keywords,
		details,
		settings: {
			0: {
				displayCourse,
				displayCuisine,
				displayServings,
				displayPrepTime,
				displayCookingTime,
				displayTotalTime,
				displayCalories,
			},
		},
	} = attributes;

	return (
		<PanelBody className="wpzoom-recipe-card-structured-data-testing" initialOpen={ true } title={ PANEL_TITLE }>
			<BaseControl
				id={ `${ id }-counters` }
				help={ __( 'Automatically check Structured Data errors and warnings.', 'wpzoom-recipe-card' ) }
			>
				{
					get( noticeData, 'errors' ).length > 0 &&
					<Notice status="error" isDismissible={ false }>
						<p>{ __( 'Please enter value for required fields: ', 'wpzoom-recipe-card' ) } <strong>{ errorDetails }</strong>.</p>
					</Notice>
				}
				{
					get( noticeData, 'warnings' ).length > 0 &&
					<Notice status="warning" isDismissible={ false }>
						<p>{ __( 'We recommend to add value for following fields: ', 'wpzoom-recipe-card' ) } <strong>{ warningDetails }</strong>.</p>
					</Notice>
				}
				{
					get( noticeData, 'not_display' ).length > 0 &&
					<Notice status="warning" isDismissible={ false }>
						<p>{ __( 'We recommend to display following fields: ', 'wpzoom-recipe-card' ) } <strong>{ notDisplayDetails }</strong>.</p>
					</Notice>
				}
				<PanelRow className={ recipeTitle ? 'text-color-green' : 'text-color-red' }>
					<span>recipeTitle</span>
					<strong>{ recipeTitle }</strong>
				</PanelRow>
				<PanelRow className={ RichText.isEmpty( summary ) ? 'text-color-orange' : 'text-color-green' }>
					<span>description</span>
					<strong>{ ! isUndefined( jsonSummary ) ? stripHTML( jsonSummary ) : NOT_ADDED }</strong>
				</PanelRow>
				<PanelRow className={ ! hasImage ? 'text-color-red' : 'text-color-green' }>
					<span>image</span>
					<strong>{ hasImage ? get( image, 'url' ) : NOT_ADDED }</strong>
				</PanelRow>
				<PanelRow className={ ! hasVideo ? 'text-color-orange' : 'text-color-green' }>
					<span>video</span>
					<strong>{ hasVideo ? get( video, 'url' ) : NOT_ADDED }</strong>
				</PanelRow>
				<PanelRow className={ isEmpty( keywords ) ? 'text-color-orange' : 'text-color-green' }>
					<span>keywords</span>
					<strong>{ ! isEmpty( keywords ) ? keywords.filter( ( item ) => item ).join( ', ' ) : NOT_ADDED }</strong>
				</PanelRow>
				<PanelRow className={ ! displayCourse || isEmpty( course ) ? 'text-color-orange' : 'text-color-green' }>
					<span>recipeCategory</span>
					{
						displayCourse &&
						<strong>{ ! isEmpty( course ) ? course.filter( ( item ) => item ).join( ', ' ) : NOT_ADDED }</strong>
					}
					{
						! displayCourse &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ ! displayCuisine || isEmpty( cuisine ) ? 'text-color-orange' : 'text-color-green' }>
					<span>recipeCuisine</span>
					{
						displayCuisine &&
						<strong>{ ! isEmpty( cuisine ) ? cuisine.filter( ( item ) => item ).join( ', ' ) : NOT_ADDED }</strong>
					}
					{
						! displayCuisine &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ displayServings && get( details, [ 0, 'value' ] ) && 'text-color-green' }>
					<span>recipeYield</span>
					{
						displayServings &&
						<strong>{ get( details, [ 0, 'value' ] ) ? get( details, [ 0, 'value' ] ) + ' ' + get( details, [ 0, 'unit' ] ) : NOT_ADDED }</strong>
					}
					{
						! displayServings &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ ! displayPrepTime || ! get( details, [ 1, 'value' ] ) ? 'text-color-orange' : 'text-color-green' }>
					<span>prepTime</span>
					{
						displayPrepTime &&
						<strong>{ get( details, [ 1, 'value' ] ) ? convertMinutesToHours( get( details, [ 1, 'value' ] ) ) : NOT_ADDED }</strong>
					}
					{
						! displayPrepTime &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ ! displayCookingTime || ! get( details, [ 2, 'value' ] ) ? 'text-color-orange' : 'text-color-green' }>
					<span>cookTime</span>
					{
						displayCookingTime &&
						<strong>{ get( details, [ 2, 'value' ] ) ? convertMinutesToHours( get( details, [ 2, 'value' ] ) ) : NOT_ADDED }</strong>
					}
					{
						! displayCookingTime &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ displayTotalTime && get( details, [ 8, 'value' ] ) && 'text-color-green' }>
					<span>totalTime</span>
					{
						displayTotalTime &&
						<strong>{ get( details, [ 8, 'value' ] ) ? convertMinutesToHours( get( details, [ 8, 'value' ] ) ) : NOT_ADDED }</strong>
					}
					{
						! displayTotalTime &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ ! displayCalories || ! get( details, [ 3, 'value' ] ) ? 'text-color-orange' : 'text-color-green' }>
					<span>calories</span>
					{
						displayCalories &&
						<strong>{ get( details, [ 3, 'value' ] ) ? get( details, [ 3, 'value' ] ) + ' ' + get( details, [ 3, 'unit' ] ) : NOT_ADDED }</strong>
					}
					{
						! displayCalories &&
						<strong>{ NOT_DISPLAYED }</strong>
					}
				</PanelRow>
				<PanelRow className={ ! get( tableData, 'recipeIngredients' ) ? 'text-color-red' : 'text-color-green' }>
					<span>{ __( 'Ingredients', 'wpzoom-recipe-card' ) }</span>
					<strong>{ get( tableData, 'recipeIngredients' ) ? get( tableData, 'recipeIngredients' ) : NOT_ADDED }</strong>
				</PanelRow>
				<PanelRow className={ ! get( tableData, 'recipeInstructions' ) ? 'text-color-red' : 'text-color-green' }>
					<span>{ __( 'Steps', 'wpzoom-recipe-card' ) }</span>
					<strong>{ get( tableData, 'recipeInstructions' ) ? get( tableData, 'recipeInstructions' ) : NOT_ADDED }</strong>
				</PanelRow>
			</BaseControl>
		</PanelBody>
	);
};

export default StructuredDataTestingTool;
