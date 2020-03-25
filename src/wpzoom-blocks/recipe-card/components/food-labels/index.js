/**
 * External dependencies
 */
import {
    get,
    isEmpty,
} from 'lodash';

/**
 * Internal dependencies
 */
import {
    dairyFree,
    glutenFree,
    palmOilFree,
    phosphateFree,
    sugarFree,
    vegan,
} from './library';

/**
 * WordPress dependencies
 */
import isShallowEqual from '@wordpress/is-shallow-equal';
import { Component } from '@wordpress/element';

const iconsSVG = {
    vegan: vegan,
    'gluten-free': glutenFree,
    'dairy-free': dairyFree,
    'palm-oil-free': palmOilFree,
    'sugar-free': sugarFree,
    'phosphate-free': phosphateFree,
};

export default class FoodLabels extends Component {
    drawIconLabel() {
        const { attributes: { settings } } = this.props;

        const foodLabels = get( settings, [ 1, 'foodLabels' ] ) || [];
        const displayFoodLabels = get( settings, [ 1, 'displayFoodLabels' ] ) || false;
        const foodLabelsLocation = get( settings, [ 1, 'locationToShowFoodLabels' ] ) || 'top';

        if ( isEmpty( foodLabels ) || ! displayFoodLabels || this.props.location !== foodLabelsLocation ) {
            return null;
        }

        let drawLabels = [];

        drawLabels = foodLabels.map( ( label ) => {
            if ( iconsSVG[ label ] ) {
                return ( <li>{ iconsSVG[ label ] }</li> );
            }
        } );

        return <ul className="food-labels-list">{ drawLabels }</ul>;
    }

    /**
     * Perform a shallow equal to prevent every step item from being rerendered.
     *
     * @param {object} nextProps The next props the component will receive.
     *
     * @returns {boolean} Whether or not the component should perform an update.
     */
    shouldComponentUpdate( nextProps ) {
        return ! isShallowEqual( nextProps, this.props );
    }

    render() {
        return (
            <div className="recipe-card-food-labels">
                { this.drawIconLabel() }
            </div>
        );
    }
}
