/**
 * External dependencies
 */
import {
    get,
    isString,
} from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ingredientParser from 'ingredients-parser';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isShallowEqualObjects } from '@wordpress/is-shallow-equal';
import { Component, Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';

const parseIngredient = ( ingredient ) =>{
    if ( ! isString( ingredient ) ) {
        return;
    }
    const result = ingredientParser.parse( ingredient );
    return result;
};

/**
 * A Ingredient item within a Ingredient block.
 */
export default class IngredientItem extends Component {
    /**
     * Constructs a IngredientItem editor component.
     *
     * @param {Object} props This component's properties.
     *
     * @returns {void}
     */
    constructor( props ) {
        super( props );

        this.onInsertIngredient = this.onInsertIngredient.bind( this );
        this.onRemoveIngredient = this.onRemoveIngredient.bind( this );
        this.onMoveIngredientUp = this.onMoveIngredientUp.bind( this );
        this.onMoveIngredientDown = this.onMoveIngredientDown.bind( this );
        this.setNameRef = this.setNameRef.bind( this );
        this.onFocusName = this.onFocusName.bind( this );
        this.onFocusAmount = this.onFocusAmount.bind( this );
        this.onFocusUnit = this.onFocusUnit.bind( this );
        this.onChangeName = this.onChangeName.bind( this );
        this.onChangeGroupTitle = this.onChangeGroupTitle.bind( this );
    }

    /**
     * Handles the insert ingredient button action.
     *
     * @returns {void}
     */
    onInsertIngredient() {
        this.props.insertItem( this.props.index );
    }

    /**
     * Handles the remove ingredient button action.
     *
     * @returns {void}
     */
    onRemoveIngredient() {
        this.props.removeItem( this.props.index );
    }

    /**
     * Handles the move ingredient up button action.
     *
     * @returns {void}
     */
    onMoveIngredientUp() {
        if ( this.props.isFirst ) {
            return;
        }
        this.props.onMoveUp( this.props.index );
    }

    /**
     * Handles the move ingredient down button action.
     *
     * @returns {void}
     */
    onMoveIngredientDown() {
        if ( this.props.isLast ) {
            return;
        }
        this.props.onMoveDown( this.props.index );
    }

    /**
     * Pass the ingredient name editor reference down to the parent component.
     *
     * @param {object} ref Reference to the ingredient name editor.
     *
     * @returns {void}
     */
    setNameRef( ref ) {
        this.props.editorRef( this.props.index, 'name', ref );
    }

    /**
     * Handles the focus event on the ingredient name editor.
     *
     * @returns {void}
     */
    onFocusName() {
        this.props.onFocus( this.props.index, 'name' );
    }

    /**
     * Handles the focus event on the ingredient amount editor.
     *
     * @returns {void}
     */
    onFocusAmount() {
        this.props.onFocus( this.props.index, 'amount' );
    }

    /**
     * Handles the focus event on the ingredient unit editor.
     *
     * @returns {void}
     */
    onFocusUnit() {
        this.props.onFocus( this.props.index, 'unit' );
    }

    /**
     * Handles the on change event on the ingredient name editor.
     *
     * @param {string} value The new ingredient name.
     *
     * @returns {void}
     */
    onChangeName( value ) {
        const {
            onChange,
            index,
            item: {
                name,
            },
        } = this.props;

        onChange( value, name, index );
    }

    /**
     * Handles the on change event on the ingredient group title editor.
     *
     * @param {string} value The new ingredient name.
     *
     * @returns {void}
     */
    onChangeGroupTitle( value ) {
        const {
            onChange,
            index,
            item: {
                name,
            },
        } = this.props;

        onChange( value, name, index, true );
    }

    /**
     * The insert and remove item buttons.
     *
     * @returns {Component} The buttons.
     */
    getButtons() {
        return <div className="ingredient-item-button-container">
            { this.getMover() }
            <Button
                className="ingredient-item-button ingredient-item-button-delete editor-inserter__toggle"
                icon="trash"
                label={ __( 'Delete ingredient', 'wpzoom-recipe-card' ) }
                onClick={ this.onRemoveIngredient }
            />
            <Button
                className="ingredient-item-button ingredient-item-button-add editor-inserter__toggle"
                icon="editor-break"
                label={ __( 'Insert ingredient', 'wpzoom-recipe-card' ) }
                onClick={ this.onInsertIngredient }
            />
        </div>;
    }

    /**
     * The mover buttons.
     *
     * @returns {Component} the buttons.
     */
    getMover() {
        return <Fragment>
            <Button
                className="editor-block-mover__control"
                onClick={ this.onMoveIngredientUp }
                icon="arrow-up-alt2"
                label={ __( 'Move item up', 'wpzoom-recipe-card' ) }
                aria-disabled={ this.props.isFirst }
            />
            <Button
                className="editor-block-mover__control"
                onClick={ this.onMoveIngredientDown }
                icon="arrow-down-alt2"
                label={ __( 'Move item down', 'wpzoom-recipe-card' ) }
                aria-disabled={ this.props.isLast }
            />
        </Fragment>;
    }

    /**
     * Perform a shallow equal to prevent every ingredient item from being rerendered.
     *
     * @param {object} nextProps The next props the component will receive.
     *
     * @returns {boolean} Whether or not the component should perform an update.
     */
    shouldComponentUpdate( nextProps ) {
        return ! isShallowEqualObjects( nextProps, this.props );
    }

    /**
     * Renders this component.
     *
     * @returns {Component} The ingredient item editor.
     */
    render() {
        const {
            activeStyle,
            attributes: {
                settings: {
                    0: {
                        primary_color,
                    },
                },
            },
            isSelected,
            isRecipeCardSelected,
            subElement,
            index,
            onParseItem,
            onChangeAmount,
            onChangeUnit,
            item: {
                id,
                name,
                jsonName,
                isGroup,
            },
        } = this.props;

        /*
         * Parse Ingredient item to get unit, amount and ingredient name
         */
        onParseItem( parseIngredient( jsonName ), index );

        let tickStyles = [];

        if ( '' !== primary_color ) {
            if ( 'newdesign' === activeStyle.name || 'simple' === activeStyle.name ) {
                tickStyles = { border: `2px solid ${ primary_color }` };
            }
        }

        const isSelectedName = isSelected && subElement === 'name';
        const isSelectedAmount = isSelected && subElement === 'amount';
        const isSelectedUnit = isSelected && subElement === 'unit';
        const itemClassName = classnames( {
            'ingredient-item': ! isGroup,
            'ingredient-item ingredient-item-group': isGroup,
        } );

        const unit = get( this.props.item, [ 'parse', 'unit' ] );
        const amount = get( this.props.item, [ 'parse', 'amount' ] );

        return (
            <li className={ itemClassName } key={ id }>
                {
                    ! isGroup &&
                    <Fragment>
                        <span className="tick-circle" style={ tickStyles }></span>
                        <div className="ingredient-item-name">
                            <TextControl
                                id={ `${ id }-${ index }-amount` }
                                type="text"
                                placeholder={ __( 'amount', 'wpzoom-recipe-card' ) }
                                value={ amount }
                                onChange={ newValue => onChangeAmount( newValue, amount, index ) }
                                onFocus={ this.onFocusAmount }
                            />
                            <TextControl
                                id={ `${ id }-${ index }-unit` }
                                type="text"
                                placeholder={ __( 'unit', 'wpzoom-recipe-card' ) }
                                value={ unit }
                                onChange={ newValue => onChangeUnit( newValue, unit, index ) }
                                onFocus={ this.onFocusUnit }
                            />
                            <RichText
                                tagName="p"
                                key={ `${ id }-${ index }-name` }
                                value={ name }
                                onChange={ this.onChangeName }
                                placeholder={ __( 'Enter ingredient name', 'wpzoom-recipe-card' ) }
                                unstableOnFocus={ this.onFocusName }
                                keepPlaceholderOnFocus={ true }
                            />
                        </div>
                    </Fragment>
                }
                {
                    isGroup &&
                    <RichText
                        className="ingredient-item-group-title"
                        tagName="p"
                        key={ `${ id }-${ index }-group-title` }
                        value={ name }
                        onChange={ this.onChangeGroupTitle }
                        placeholder={ __( 'Enter group title', 'wpzoom-recipe-card' ) }
                        unstableOnFocus={ this.onFocusName }
                        keepPlaceholderOnFocus={ true }
                    />
                }
                {
                    isRecipeCardSelected &&
                    ( isSelectedName || isSelectedAmount || isSelectedUnit ) &&
                    <div className="ingredient-item-controls-container">
                        { this.getButtons() }
                    </div>
                }
            </li>
        );
    }
}

IngredientItem.propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    insertItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    editorRef: PropTypes.func.isRequired,
    onMoveUp: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    subElement: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
};
