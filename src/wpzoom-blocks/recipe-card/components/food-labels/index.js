/* External dependencies */
import isShallowEqual from "@wordpress/is-shallow-equal/objects";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

/* WordPress dependencies */
const { Component } = wp.element;

/* Internal dependencies */
import {
    dairyFree,
    glutenFree,
    palmOilFree,
    phosphateFree,
    sugarFree,
    vegan
} from "./library";

const iconsSVG = {
    'vegan': vegan,
    'gluten-free': glutenFree,
    'dairy-free': dairyFree,
    'palm-oil-free': palmOilFree,
    'sugar-free': sugarFree,
    'phosphate-free': phosphateFree
};

export default class FoodLabels extends Component {
    constructor() {
        super( ...arguments );
    }

    drawIconLabel() {
        const { attributes: { settings } } = this.props;

        let foodLabels = get( settings, [ 1, 'foodLabels' ] ) || [];
        let displayFoodLabels = get( settings, [ 1, 'displayFoodLabels' ] ) || false;
        let foodLabelsLocation = get( settings, [ 1, 'locationToShowFoodLabels' ] ) || 'top';

        if ( isEmpty( foodLabels ) || ! displayFoodLabels || this.props.location !== foodLabelsLocation ) {
            return null;
        }

        let drawLabels = [];

        drawLabels = foodLabels.map( ( label, index ) => {
            if ( iconsSVG[ label ] ) {
                return ( <li>{ iconsSVG[ label ] }</li> );
            }
        } )

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
        )
    }
}