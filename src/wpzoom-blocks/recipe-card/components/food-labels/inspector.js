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
    ToggleControl,
    SelectControl,
} from '@wordpress/components';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Food Labels', 'wpzoom-recipe-card' );

const foodLabelsOptions = [
    { label: __( 'Select a Food Label', 'wpzoom-recipe-card' ), value: null, disabled: true },
    { label: __( 'Vegan', 'wpzoom-recipe-card' ), value: 'vegan' },
    { label: __( 'Gluten Free', 'wpzoom-recipe-card' ), value: 'gluten-free' },
    { label: __( 'Dairy Free' ), value: 'dairy-free' },
    { label: __( 'Palm Oil Free' ), value: 'palm-oil-free' },
    { label: __( 'Sugar Free' ), value: 'sugar-free' },
    { label: __( 'Phosphate Free' ), value: 'phosphate-free' },
    // { label: __( "Low Fat" ), value: 'low-fat' },
    // { label: __( "High Protein" ), value: 'high-protein' },
    // { label: __( "Keto Option" ), value: 'keto-option' },
    // { label: __( "Nut Free" ), value: 'nut-free' },
    // { label: __( "Whole Grain" ), value: 'whole-grain' }
];

const foodLabelsLocationOptions = [
    { label: __( 'Top (Before Summary text)', 'wpzoom-recipe-card' ), value: 'top' },
    { label: __( 'Bottom (Below Notes)', 'wpzoom-recipe-card' ), value: 'bottom' },
];

const FoodLabelsSettings = ( props ) => {
    const {
        attributes: {
            settings,
        },
        onChangeSettings,
    } = props;

    const foodLabels = get( settings, [ 1, 'foodLabels' ] );
    const displayFoodLabels = get( settings, [ 1, 'displayFoodLabels' ] );
    const locationToShowFoodLabels = get( settings, [ 1, 'locationToShowFoodLabels' ] );

    return (
        <PanelBody className="wpzoom-recipe-card-food-labels" initialOpen={ true } title={ PANEL_TITLE }>
            <ToggleControl
                label={ __( 'Display Food Labels', 'wpzoom-recipe-card' ) }
                checked={ displayFoodLabels }
                onChange={ ( display ) => onChangeSettings( display, 'displayFoodLabels', 1 ) }
            />
            <SelectControl
                multiple
                label={ __( 'Select Food Labels', 'wpzoom-recipe-card' ) }
                help={ __( 'CMD + Click / Ctrl + Click to select multiple labels', 'wpzoom-recipe-card' ) }
                value={ foodLabels }
                options={ foodLabelsOptions }
                onChange={ ( label ) => onChangeSettings( label, 'foodLabels', 1 ) }
            />
            <SelectControl
                label={ __( 'Where to show labels?', 'wpzoom-recipe-card' ) }
                value={ locationToShowFoodLabels }
                options={ foodLabelsLocationOptions }
                onChange={ ( location ) => onChangeSettings( location, 'locationToShowFoodLabels', 1 ) }
            />
        </PanelBody>
    );
};

export default FoodLabelsSettings;
