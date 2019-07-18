/**
 * External dependencies
 */
import has from 'lodash/has';
import filter from 'lodash/filter';
import identity from 'lodash/identity';
import includes from 'lodash/includes';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * Internal dependencies
 */
import HierarchicalTermSelector from './hierarchical-term-selector';
import FlatTermSelector from './flat-term-selector';

export function PostTaxonomies( { postType, taxonomies, taxonomyWrapper = identity } ) {
	const availableTaxonomies = filter( taxonomies, ( taxonomy ) => {
		if ( has( taxonomy, 'types' ) ) {
			return includes( taxonomy.types, postType );
		} else {
			return false;
		}
	} );
	const visibleTaxonomies = filter( availableTaxonomies, ( taxonomy ) => taxonomy.visibility.custom_show_ui );
	return visibleTaxonomies.map( ( taxonomy ) => {
		const TaxonomyComponent = taxonomy.hierarchical ? HierarchicalTermSelector : FlatTermSelector;
		return (
			<Fragment key={ `taxonomy-${ taxonomy.slug }` }>
				{
					taxonomyWrapper(
						<TaxonomyComponent slug={ taxonomy.slug } />,
						taxonomy
					)
				}
			</Fragment>
		);
	} );
}

export default compose( [
	withSelect( ( select, props ) => {
		const { postType, taxonomies } = props;

		return {
			postType: !postType ? select( 'core/editor' ).getCurrentPostType() : postType,
			taxonomies: !taxonomies ? select( 'core' ).getTaxonomies( { per_page: -1 } ) : taxonomies
		};
	} ),
] )( PostTaxonomies );
