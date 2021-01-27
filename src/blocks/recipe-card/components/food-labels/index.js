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
import { Fragment } from '@wordpress/element';

const iconsSVG = {
	vegan,
	'gluten-free': glutenFree,
	'dairy-free': dairyFree,
	'palm-oil-free': palmOilFree,
	'sugar-free': sugarFree,
	'phosphate-free': phosphateFree,
};

const FoodLabels = ( props ) => {
	const {
		attributes: {
			settings,
		},
		location,
	} = props;
	const displayFoodLabels = get( settings, [ 1, 'displayFoodLabels' ] ) || false;

	const drawIconLabel = () => {
		const foodLabels = get( settings, [ 1, 'foodLabels' ] ) || [];
		const foodLabelsLocation = get( settings, [ 1, 'locationToShowFoodLabels' ] ) || 'top';

		if ( isEmpty( foodLabels ) || location !== foodLabelsLocation ) {
			return null;
		}

		let drawLabels = [];

		drawLabels = foodLabels.map( ( label ) => {
			if ( iconsSVG[ label ] ) {
				return ( <li>{ iconsSVG[ label ] }</li> );
			}
		} );

		return <ul className="food-labels-list">{ drawLabels }</ul>;
	};

	return (
		<Fragment>
			{ displayFoodLabels &&
			<div className="recipe-card-food-labels">
				{ drawIconLabel() }
			</div>
			}
		</Fragment>
	);
};

export default FoodLabels;
