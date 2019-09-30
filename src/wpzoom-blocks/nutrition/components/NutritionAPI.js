/**
 * External dependencies
 */
import escapeString from 'lodash/escape';
import find from 'lodash/find';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import throttle from 'lodash/throttle';
import unescapeString from 'lodash/unescape';
import uniqBy from 'lodash/uniqBy';

/**
 * WordPress dependencies
 */
const { __, _x, sprintf } = wp.i18n;
const { Component } = wp.element;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

/**
 * Module constants
 */
const API_KEY = '91dc44604fa348b795eeaf8d66f4e9e3';

class ParseIngredients extends Component {
	constructor() {
		super( ...arguments );

		this.onChange = this.onChange.bind( this );
		this.searchTerms = throttle( this.searchTerms.bind( this ), 500 );
		this.findOrCreateTerm = this.findOrCreateTerm.bind( this );

		this.state = {
			loading: false,
			availableTerms: [],
			selectedTerms: [],
		};
	}

	componentDidMount() {
		if ( ! isEmpty( this.props.terms ) ) {
			this.setState( { loading: false } );
			this.initRequest = this.fetchTerms( {
				include: this.props.terms.join( ',' ),
				per_page: -1,
			} );
			this.initRequest.then(
				() => {
					this.setState( { loading: false } );
				},
				( xhr ) => {
					if ( xhr.statusText === 'abort' ) {
						return;
					}
					this.setState( {
						loading: false,
					} );
				}
			);
		}
	}

	componentWillUnmount() {
		invoke( this.initRequest, [ 'abort' ] );
		invoke( this.searchRequest, [ 'abort' ] );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.terms !== this.props.terms ) {
			this.updateSelectedTerms( this.props.terms );
		}
	}

	fetchTerms( params = {} ) {
		const { taxonomy } = this.props;
		const query = { ...DEFAULT_QUERY, ...params };
		const request = apiFetch( {
			path: addQueryArgs( `/wp/v2/${ taxonomy.rest_base }`, query ),
		} );
		request.then( unescapeTerms ).then( ( terms ) => {
			this.setState( ( state ) => ( {
				availableTerms: state.availableTerms.concat(
					terms.filter( ( term ) => ! find( state.availableTerms, ( availableTerm ) => availableTerm.id === term.id ) )
				),
			} ) );
			this.updateSelectedTerms( this.props.terms );
		} );

		return request;
	}

	updateSelectedTerms( terms = [] ) {
		
	}

	onChange( termNames ) {
		
	}

	render() {

		return (
			
		);
	}
}

export default compose(
	withSelect( ( select, { slug } ) => {
		
	} ),
)( ParseIngredients );
