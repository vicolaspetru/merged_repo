/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	Button,
	Notice,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Recipe Card Details', 'wpzoom-recipe-card' );

const DetailsSettings = ( props ) => {
	const {
		attributes,
		onChangeDetail,
		onChangeSettings,
		onClickCalculateTotalTime,
	} = props;

	const {
		id,
		details,
		settings: {
			0: {
				displayServings,
				displayPrepTime,
				displayCookingTime,
				displayTotalTime,
				displayCalories,
				adjustableServings,
			},
		},
	} = attributes;

	const isNoticeDismiss = get( attributes, [ 'settings', 1, 'isNoticeDismiss' ] );

	return (
		<PanelBody className="wpzoom-recipe-card-details" initialOpen={ true } title={ PANEL_TITLE }>
			{
				! isNoticeDismiss &&
				<Notice
					status="info"
					onRemove={ () => onChangeSettings( true, 'isNoticeDismiss', 1 ) }
				>
					<p>{ __( 'The following details are used for Schema Markup (Rich Snippets). If you want to hide some details in the post, just turn them off below.', 'wpzoom-recipe-card' ) }</p>
					<p><strong>{ __( 'NEW: you can also add custom details (see next panel below).', 'wpzoom-recipe-card' ) }</strong></p>
				</Notice>
			}
			<ToggleControl
				label={ __( 'Display Servings', 'wpzoom-recipe-card' ) }
				checked={ displayServings }
				onChange={ ( display ) => onChangeSettings( display, 'displayServings' ) }
			/>
			<ToggleControl
				label={ __( 'Enable Adjustable Servings', 'wpzoom-recipe-card' ) }
				checked={ adjustableServings }
				onChange={ ( value ) => onChangeSettings( value, 'adjustableServings' ) }
			/>
			<PanelRow>
				{
					displayServings &&
					<Fragment>
						<TextControl
							id={ `${ id }-yield-label` }
							type="text"
							label={ __( 'Servings Label', 'wpzoom-recipe-card' ) }
							placeholder={ __( 'Servings', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 0, 'label' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 0, 'label' ) }
                    	/>
						<TextControl
							id={ `${ id }-yield-value` }
							type="number"
							label={ __( 'Servings Value', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 0, 'value' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 0, 'value' ) }
                    	/>
						<TextControl
							id={ `${ id }-yield-unit` }
							type="text"
							label={ __( 'Servings Unit', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 0, 'unit' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 0, 'unit' ) }
                    	/>
					</Fragment>
				}
			</PanelRow>
			<ToggleControl
				label={ __( 'Display Preparation Time', 'wpzoom-recipe-card' ) }
				checked={ displayPrepTime }
				onChange={ ( display ) => onChangeSettings( display, 'displayPrepTime' ) }
			/>
			<PanelRow>
				{
					displayPrepTime &&
					<Fragment>
						<TextControl
							id={ `${ id }-preptime-label` }
							type="text"
							label={ __( 'Prep Time Label', 'wpzoom-recipe-card' ) }
							placeholder={ __( 'Prep Time', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 1, 'label' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 1, 'label' ) }
                    	/>
						<TextControl
							id={ `${ id }-preptime-value` }
							type="number"
							label={ __( 'Prep Time Value', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 1, 'value' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 1, 'value' ) }
                    	/>
						<span>{ get( details, [ 1, 'unit' ] ) }</span>
					</Fragment>
				}
			</PanelRow>
			<ToggleControl
				label={ __( 'Display Cooking Time', 'wpzoom-recipe-card' ) }
				checked={ displayCookingTime }
				onChange={ ( display ) => onChangeSettings( display, 'displayCookingTime' ) }
			/>
			<PanelRow>
				{
					displayCookingTime &&
					<Fragment>
						<TextControl
							id={ `${ id }-cookingtime-label` }
							type="text"
							label={ __( 'Cook Time Label', 'wpzoom-recipe-card' ) }
							placeholder={ __( 'Cooking Time', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 2, 'label' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 2, 'label' ) }
                    	/>
						<TextControl
							id={ `${ id }-cookingtime-value` }
							type="number"
							label={ __( 'Cook Time Value', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 2, 'value' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 2, 'value' ) }
                    	/>
						<span>{ get( details, [ 2, 'unit' ] ) }</span>
					</Fragment>
				}
			</PanelRow>
			<ToggleControl
				label={ __( 'Display Total Time', 'wpzoom-recipe-card' ) }
				checked={ displayTotalTime }
				onChange={ ( display ) => onChangeSettings( display, 'displayTotalTime' ) }
			/>
			<PanelRow>
				{
					displayTotalTime &&
					<Fragment>
						<TextControl
							id={ `${ id }-totaltime-label` }
							type="text"
							label={ __( 'Total Time Label', 'wpzoom-recipe-card' ) }
							placeholder={ __( 'Total Time', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 8, 'label' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 8, 'label' ) }
                    	/>
						<TextControl
							id={ `${ id }-totaltime-value` }
							type="number"
							label={ __( 'Total Time Value', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 8, 'value' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 8, 'value' ) }
                    	/>
						<span>{ get( details, [ 8, 'unit' ] ) }</span>
						<Button
							isSecondary
							className="editor-calculate-total-time"
							onClick={ onClickCalculateTotalTime }
                    	>
							{ __( 'Calculate Total Time', 'wpzoom-recipe-card' ) }
						</Button>
						<p className="description">{ __( 'Default value: prepTime + cookTime', 'wpzoom-recipe-card' ) }</p>
					</Fragment>
				}
			</PanelRow>
			<ToggleControl
				label={ __( 'Display Calories', 'wpzoom-recipe-card' ) }
				checked={ displayCalories }
				onChange={ ( display ) => onChangeSettings( display, 'displayCalories' ) }
			/>
			<PanelRow>
				{
					displayCalories &&
					<Fragment>
						<TextControl
							id={ `${ id }-calories-label` }
							type="text"
							label={ __( 'Calories Label', 'wpzoom-recipe-card' ) }
							placeholder={ __( 'Calories', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 3, 'label' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 3, 'label' ) }
                    	/>
						<TextControl
							id={ `${ id }-calories-value` }
							type="number"
							label={ __( 'Calories Value', 'wpzoom-recipe-card' ) }
							value={ get( details, [ 3, 'value' ] ) }
							onChange={ ( newValue ) => onChangeDetail( newValue, 3, 'value' ) }
                    	/>
						<span>{ get( details, [ 3, 'unit' ] ) }</span>
					</Fragment>
				}
			</PanelRow>
		</PanelBody>
	);
};

export default DetailsSettings;
