/**
 * External dependencies
 */
import {
	get,
	isUndefined,
} from 'lodash';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import IconsModal from '../../../../components/icons-modal';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isShallowEqualObjects } from '@wordpress/is-shallow-equal';
import { Component } from '@wordpress/element';
import { TextControl } from '@wordpress/components';

/**
 * A Detail items within a Details block.
 */
export default class DetailItem extends Component {
	/**
	 * Constructs a DetailItem editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @return {void}
	 */
	constructor( props ) {
		super( props );

		this.setLabelRef = this.setLabelRef.bind( this );
		this.onFocusLabel = this.onFocusLabel.bind( this );
		this.setValueRef = this.setValueRef.bind( this );
		this.onFocusValue = this.onFocusValue.bind( this );
		this.onChangeLabel = this.onChangeLabel.bind( this );
		this.onChangeValue = this.onChangeValue.bind( this );
	}

	/**
	 * Pass the detail label editor reference down to the parent component.
	 *
	 * @param {Object} ref Reference to the detail label editor.
	 *
	 * @return {void}
	 */
	setLabelRef( ref ) {
		this.props.editorRef( this.props.index, 'label', ref );
	}

	/**
	 * Handles the focus event on the detail label editor.
	 *
	 * @return {void}
	 */
	onFocusLabel() {
		this.props.onFocus( this.props.index, 'label' );
	}

	/**
	 * Pass the detail value editor reference down to the parent component.
	 *
	 * @param {Object} ref Reference to the detail value editor.
	 *
	 * @return {void}
	 */
	setValueRef( ref ) {
		this.props.editorRef( this.props.index, 'value', ref );
	}

	/**
	 * Handles the focus event on the detail value editor.
	 *
	 * @return {void}
	 */
	onFocusValue() {
		this.props.onFocus( this.props.index, 'value' );
	}

	/**
	 * Handles the on change event on the detail label editor.
	 *
	 * @param {string} newLabel The new detail label.
	 *
	 * @return {void}
	 */
	onChangeLabel( newLabel ) {
		const {
			onChange,
			index,
			item: {
				icon,
				label,
				value,
				unit,
			},
		} = this.props;

		onChange( icon, newLabel, value, unit, icon, label, value, unit, index );
	}

	/**
	 * Handles the on change event on the detail value editor.
	 *
	 * @param {string} newValue The new detail value.
	 *
	 * @return {void}
	 */
	onChangeValue( newValue ) {
		const {
			onChange,
			index,
			item: {
				icon,
				label,
				value,
				unit,
			},
		} = this.props;

		onChange( icon, label, newValue, unit, icon, label, value, unit, index );
	}

	/**
	 * A list wrapper with actions.
	 *
	 * @param {Object} props This component's properties.
	 * @return {Component} Icons Modal Component
	 */
	getOpenModalButton( props ) {
		return (
			<IconsModal { ... { props } } />
		);
	}

	/**
	 * The predefined text for items.
	 *
	 * @param {int} index The item index.
	 * @param {string} key The key index name of object array.
	 *
	 * @return {string} The placeholder text
	 */
	getPlaceholder( index, key = '' ) {
		const { item } = this.props;
		const itemValue = get( item, key );

		const placeholderText = {
			0: { label: __( 'Servings', 'wpzoom-recipe-card' ), value: 4, unit: __( 'servings', 'wpzoom-recipe-card' ) },
			1: { label: __( 'Prep time', 'wpzoom-recipe-card' ), value: 30, unit: __( 'minutes', 'wpzoom-recipe-card' ) },
			2: { label: __( 'Cooking time', 'wpzoom-recipe-card' ), value: 40, unit: __( 'minutes', 'wpzoom-recipe-card' ) },
			3: { label: __( 'Calories', 'wpzoom-recipe-card' ), value: 300, unit: __( 'kcal', 'wpzoom-recipe-card' ) },
			8: { label: __( 'Total time', 'wpzoom-recipe-card' ), value: 0, unit: __( 'minutes', 'wpzoom-recipe-card' ) },
		};

		if ( isUndefined( itemValue ) ) {
			return get( placeholderText, [ index, key ] ) || get( placeholderText, index ) || '';
		}
		return itemValue;
	}

	/**
	 * Perform a shallow equal to prevent every detail item from being rerendered.
	 *
	 * @param {Object} nextProps The next props the component will receive.
	 *
	 * @return {boolean} Whether or not the component should perform an update.
	 */
	shouldComponentUpdate( nextProps ) {
		return ! isShallowEqualObjects( nextProps, this.props );
	}

	render() {
		const {
			index,
			item,
		} = this.props;

		const {
			id,
			icon,
			value,
		} = item;

		return (
			<div className={ `detail-item detail-item-${ index }` } key={ id }>
				{
					icon
						? <div className="detail-item-icon">{ this.getOpenModalButton( this.props ) }</div>
						: <div className="detail-open-modal">{ this.getOpenModalButton( this.props ) }</div>
				}
				<p className="detail-item-label">{ this.getPlaceholder( index, 'label' ) }</p>
				<TextControl
					id={ `${ id }-${ index }-item-amount` }
					type="text"
					placeholder={ this.getPlaceholder( index, 'value' ) }
					value={ value }
					onChange={ this.onChangeValue }
				/>
				<p className="detail-item-unit">{ this.getPlaceholder( index, 'unit' ) }</p>
			</div>
		);
	}
}

DetailItem.propTypes = {
	index: PropTypes.number.isRequired,
	item: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	editorRef: PropTypes.func.isRequired,
	subElement: PropTypes.string,
	isSelected: PropTypes.bool.isRequired,
	isFirst: PropTypes.bool.isRequired,
	isLast: PropTypes.bool.isRequired,
};
