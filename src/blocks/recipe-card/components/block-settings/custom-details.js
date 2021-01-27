/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Add Custom Details', 'wpzoom-recipe-card' );

const CustomDetailsSettings = ( props ) => {
	const {
		attributes,
		onChangeDetail,
	} = props;

	const {
		id,
		details,
	} = attributes;

	return (
		<PanelBody className="wpzoom-recipe-card-custom-details" initialOpen={ true } title={ PANEL_TITLE }>
			<PanelRow>
				<TextControl
					id={ `${ id }-custom-detail-1-label` }
					type="text"
					label={ __( 'Custom Label 1', 'wpzoom-recipe-card' ) }
					placeholder={ __( 'Resting Time', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 4, 'label' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 4, 'label' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-1-value` }
					type="text"
					label={ __( 'Custom Value 1', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 4, 'value' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 4, 'value' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-1-unit` }
					type="text"
					label={ __( 'Custom Unit 1', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 4, 'unit' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 4, 'unit' ) }
				/>
				<ToggleControl
					label={ __( 'Is Resting Time field?', 'wpzoom-recipe-card' ) }
					help={ __( 'If option is enabled, this means that the value is used to calculate the Total Time. And unit will be converted from minutes to hours if it\'s needed.', 'wpzoom-recipe-card' ) }
					checked={ get( details, [ 4, 'isRestingTimeField' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 4, 'isRestingTimeField' ) }
				/>
			</PanelRow>
			<PanelRow>
				<TextControl
					id={ `${ id }-custom-detail-2-label` }
					type="text"
					label={ __( 'Custom Label 2', 'wpzoom-recipe-card' ) }
					placeholder={ __( 'Baking Time', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 5, 'label' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 5, 'label' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-2-value` }
					type="text"
					label={ __( 'Custom Value 2', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 5, 'value' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 5, 'value' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-2-unit` }
					type="text"
					label={ __( 'Custom Unit 2', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 5, 'unit' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 5, 'unit' ) }
				/>
			</PanelRow>
			<PanelRow>
				<TextControl
					id={ `${ id }-custom-detail-3-label` }
					type="text"
					label={ __( 'Custom Label 3', 'wpzoom-recipe-card' ) }
					placeholder={ __( 'Serving Size', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 6, 'label' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 6, 'label' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-3-value` }
					type="text"
					label={ __( 'Custom Value 3', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 6, 'value' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 6, 'value' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-3-unit` }
					type="text"
					label={ __( 'Custom Unit 3', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 6, 'unit' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 6, 'unit' ) }
				/>
			</PanelRow>
			<PanelRow>
				<TextControl
					id={ `${ id }-custom-detail-4-label` }
					type="text"
					label={ __( 'Custom Label 4', 'wpzoom-recipe-card' ) }
					placeholder={ __( 'Net Carbs', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 7, 'label' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 7, 'label' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-4-value` }
					type="text"
					label={ __( 'Custom Value 4', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 7, 'value' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 7, 'value' ) }
				/>
				<TextControl
					id={ `${ id }-custom-detail-4-unit` }
					type="text"
					label={ __( 'Custom Unit 4', 'wpzoom-recipe-card' ) }
					value={ get( details, [ 7, 'unit' ] ) }
					onChange={ ( newValue ) => onChangeDetail( newValue, 7, 'unit' ) }
				/>
			</PanelRow>
		</PanelBody>
	);
};

export default CustomDetailsSettings;
