/* External dependencies */
import PropTypes from "prop-types";

/* External dependencies */
import IconsModal from "./IconsModal";
import get from "lodash/get";

/* WordPress dependencies */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText } = wp.blockEditor;
const { IconButton } = wp.components;

/**
 * A Detail items within a Details block.
 */
export default class DetailItem extends Component {

	/**
	 * Constructs a DetailItem editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.setLabelRef    			= this.setLabelRef.bind( this );
		this.onFocusLabel   			= this.onFocusLabel.bind( this );
		this.setValueRef    			= this.setValueRef.bind( this );
		this.onFocusValue   			= this.onFocusValue.bind( this );
		this.onChangeLabel  			= this.onChangeLabel.bind( this );
		this.onChangeValue  			= this.onChangeValue.bind( this );
	}

	/**
	 * Pass the detail label editor reference down to the parent component.
	 *
	 * @param {object} ref Reference to the detail label editor.
	 *
	 * @returns {void}
	 */
	setLabelRef( ref ) {
		this.props.editorRef( this.props.index, "label", ref );
	}

	/**
	 * Handles the focus event on the detail label editor.
	 *
	 * @returns {void}
	 */
	onFocusLabel() {
		this.props.onFocus( this.props.index, "label" );
	}

	/**
	 * Pass the detail value editor reference down to the parent component.
	 *
	 * @param {object} ref Reference to the detail value editor.
	 *
	 * @returns {void}
	 */
	setValueRef( ref ) {
		this.props.editorRef( this.props.index, "value", ref );
	}

	/**
	 * Handles the focus event on the detail value editor.
	 *
	 * @returns {void}
	 */
	onFocusValue() {
		this.props.onFocus( this.props.index, "value" );
	}

	/**
	 * Handles the on change event on the detail label editor.
	 *
	 * @param {string} newLabel The new detail label.
	 *
	 * @returns {void}
	 */
	onChangeLabel( newLabel ) {
		const {
			onChange,
			index,
			item: {
				icon,
				label,
				value,
				unit
			},
		} = this.props;

		onChange( icon, newLabel, value, unit, icon, label, value, unit, index );
	}

	/**
	 * Handles the on change event on the detail value editor.
	 *
	 * @param {string} newValue The new detail value.
	 *
	 * @returns {void}
	 */
	onChangeValue( newValue ) {
		const {
			onChange,
			index,
			item: {
				icon,
				label,
				value,
				unit
			},
		} = this.props;

		onChange( icon, label, newValue, unit, icon, label, value, unit, index );
	}

	/**
	 * A list wrapper with actions.
	 *
	 * @param {object} props This component's properties.
	 *
	 * @returns {Component}
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
	 * @returns {Component}
	 */
	static getPlaceholder( index, key = '' ) {
		let newIndex = index % 4;

		const placeholderText = {
		    0: { label: __( "Servings", "wpzoom-recipe-card" ), value: 4, unit: __( "servings", "wpzoom-recipe-card" ) },
		    1: { label: __( "Prep time", "wpzoom-recipe-card" ), value: 30, unit: __( "minutes", "wpzoom-recipe-card" ) },
		    2: { label: __( "Cooking time", "wpzoom-recipe-card" ), value: 40, unit: __( "minutes", "wpzoom-recipe-card" ) },
		    3: { label: __( "Calories", "wpzoom-recipe-card" ), value: 300, unit: __( "kcal", "wpzoom-recipe-card" ) },
		}

		return key !== '' ? get( placeholderText, [ newIndex, key ] ) : get( placeholderText, [ newIndex ] );
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The detail item editor.
	 */
	render() {
		const { 
			attributes, 
			setAttributes, 
			className,
			index,
			item,
			isSelected,
			subElement
		} = this.props;

		const {
			id,
			icon,
			label,
			value,
			unit
		} = item;

		const isSelectedLabel = isSelected && subElement === "label";
		const isSelectedValue = isSelected && subElement === "value";
		const isSelectedUnit = isSelected && subElement === "unit";

		return (
			<div className={ `detail-item detail-item-${ index }` } key={ id }>
				{
					icon ?
						<div className="detail-item-icon">{ this.getOpenModalButton( this.props ) }</div>
						: <div className="detail-open-modal">{ this.getOpenModalButton( this.props ) }</div>
				}
				<p className="detail-item-label">{ DetailItem.getPlaceholder( index, 'label' ) }</p>
				<RichText
				    className="detail-item-value"
				    tagName="p"
				    unstableOnSetup={ this.setValueRef }
				    key={ `${ id }-value` }
				    value={ value }
				    onChange={ this.onChangeValue }
				    // isSelected={ isSelectedValue }
				    placeholder={ DetailItem.getPlaceholder( index, 'value' ) }
				    unstableOnFocus={ this.onFocusValue }
				    keepPlaceholderOnFocus={ true }
				/>
				<p className="detail-item-unit">{ DetailItem.getPlaceholder( index, 'unit' ) }</p>
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
	subElement: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isFirst: PropTypes.bool.isRequired,
	isLast: PropTypes.bool.isRequired,
};