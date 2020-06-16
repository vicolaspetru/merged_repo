/**
 * External dependencies
 */
import { get, unescape as unescapeString } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    CheckboxControl,
    BaseControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Module Constants
 */
const PANEL_TITLE = __( 'Food Labels', 'wpzoom-recipe-card' );

const foodLabelsOptions = [
    { label: __( 'Vegan', 'wpzoom-recipe-card' ), id: 'vegan' },
    { label: __( 'Gluten Free', 'wpzoom-recipe-card' ), id: 'gluten-free' },
    { label: __( 'Dairy Free' ), id: 'dairy-free' },
    { label: __( 'Palm Oil Free' ), id: 'palm-oil-free' },
    { label: __( 'Sugar Free' ), id: 'sugar-free' },
    { label: __( 'Phosphate Free' ), id: 'phosphate-free' },
    // { label: __( "Low Fat" ), id: 'low-fat' },
    // { label: __( "High Protein" ), id: 'high-protein' },
    // { label: __( "Keto Option" ), id: 'keto-option' },
    // { label: __( "Nut Free" ), id: 'nut-free' },
    // { label: __( "Whole Grain" ), id: 'whole-grain' }
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

    const renderFoodLabelsCheckbox = ( labels ) => {
        return labels.map( ( foodLabel ) => {
            let newValue = foodLabels ? foodLabels.slice() : [];
            return (
                <div key={ foodLabel.id } className="editor-block__hierarchical-food-labels-choice">
                    <CheckboxControl
                        label={ unescapeString( foodLabel.label ) }
                        checked={ foodLabels && foodLabels.indexOf( foodLabel.id ) !== -1 }
                        onChange={ ( isChecked ) => {
                            const label = foodLabel.id;

                            if ( isChecked ) {
                                newValue = [ ...newValue, label ];
                            } else {
                                delete newValue[ newValue.indexOf( label ) ];
                            }

                            onChangeSettings( newValue, 'foodLabels', 1 );
                        } }
                    />
                </div>
            );
        } );
    };

    return (
        <PanelBody className="wpzoom-recipe-card-food-labels" initialOpen={ true } title={ PANEL_TITLE }>
            <ToggleControl
                label={ __( 'Display Food Labels', 'wpzoom-recipe-card' ) }
                checked={ displayFoodLabels }
                onChange={ ( display ) => onChangeSettings( display, 'displayFoodLabels', 1 ) }
            />
            { displayFoodLabels && (
                <Fragment>
                    <BaseControl
                        id="food-labels-list"
                        label={ __( 'Select Food Labels', 'wpzoom-recipe-card' ) }
                        role="group"
                    >
                        { renderFoodLabelsCheckbox( foodLabelsOptions ) }
                    </BaseControl>
                    <SelectControl
                        label={ __( 'Where to show labels?', 'wpzoom-recipe-card' ) }
                        value={ locationToShowFoodLabels }
                        options={ foodLabelsLocationOptions }
                        onChange={ ( location ) => onChangeSettings( location, 'locationToShowFoodLabels', 1 ) }
                    />
                </Fragment>
            ) }
        </PanelBody>
    );
};

export default FoodLabelsSettings;
