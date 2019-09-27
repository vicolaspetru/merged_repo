/* External dependencies */
import get from "lodash/get";
import ceil from "lodash/ceil";
import filter from "lodash/filter";
import forEach from "lodash/forEach";
import indexOf from "lodash/indexOf";
import metadata from "./NutritionFactsLabel.js";

/* WordPress dependencies */
const { __, _x, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const {
    TextControl,
    PanelBody,
    Button
} = wp.components;
const { InspectorControls } = wp.blockEditor;

/* Import CSS. */
import '../style.scss';
import '../editor.scss';


class Nutrition extends Component {
    constructor( props ) {
        super( ...arguments );

        this.preFillData            = this.preFillData.bind( this );
        this.onChangeData           = this.onChangeData.bind( this );

        this.state = {
            isDataPreFill: false,
            reloadValues: false
        }
    }

    preFillData() {
        const {
            setAttributes,
            attributes: {
                data
            },
            blockData: {
                details
            }
        } = this.props;

        if ( this.state.isDataPreFill ) {
            return;
        }

        const servings  = get( details, [ 0, 'value' ] );
        const calories  = get( details, [ 3, 'value' ] );

        if ( this.state.reloadValues ) {
            data['servings'] = servings ? servings : data['servings'];
            data['calories'] = calories ? calories : data['calories'];
        }

        if ( ! get( data, 'servings' ) ) {
            data['servings'] = servings;
        }
        if ( ! get( data, 'calories' ) ) {
            data['calories'] = calories;
        }

        setAttributes( { ...data } );

        this.setState( { isDataPreFill: true } );
    }

    onChangeData( newValue, index ) {
        const {
            setAttributes,
            attributes: {
                data
            }
        } = this.props;

        data[ index ] = newValue;
        setAttributes( { ...data } );
    }

    drawNutritionLabels() {
        const { id, data } = this.props.attributes;
        const { labels } = metadata;

        return labels.map( ( label, index ) => {
            return (
                <TextControl
                    id={ `${ id }-${ label.id }` }
                    instanceId={ `${ id }-${ label.id }` }
                    type="number"
                    label={ label.label }
                    value={ get( data, label.id ) }
                    onChange={ newValue => this.onChangeData( newValue, label.id ) }
                />
            );
        } );
    }
    
    drawNutrientsList() {
        const { data } = this.props.attributes;
        const { labels } = metadata;

        return labels.map( ( label, index ) => {
            let value = get( data, label.id );

            if ( index <= 12 ) {
                return;
            }

            if ( ! value ) {
                return;
            }

            return (
                <li>
                    <strong>{ label.label } <span className="nutrition-facts-right"><span className="nutrition-facts-percent nutrition-facts-label" data-label-type={ label.id }>{ value }</span>%</span></strong>
                </li>
            );
        } );
    }

    drawNutritionFacts() {
        const { data } = this.props.attributes;
        const { labels } = metadata;

        return (
            <Fragment>
                <p>
                    {
                        get( data, get( labels, [ 1, "id" ] ) ) &&
                        <Fragment>
                            <span className="nutrition-facts-serving">{ `${ get( data, get( labels, [ 1, "id" ] ) ) } ${ __( "servings per container", "wpzoom-recipe-card" ) }` }</span>
                        </Fragment>
                    }
                </p>
                <p>
                    {
                        get( data, get( labels, [ 0, "id" ] ) ) &&
                        <Fragment>
                            <strong className="nutrition-facts-serving-size">{ get( labels, [ 0, "label" ] ) }</strong>
                            <strong className="nutrition-facts-label nutrition-facts-right" data-label-type={ get( labels, [ 0, "id" ] ) }>{ get( data, get( labels, [ 0, "id" ] ) ) }g</strong>
                        </Fragment>
                    }
                </p>
                <hr className="nutrition-facts-hr"/>
                <ul>
                    <li>
                        <strong className="nutrition-facts-amount-per-serving">{ __( "Amount Per Serving", "wpzoom-recipe-card" ) }</strong>
                        {
                            get( data, get( labels, [ 2, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-calories">{ get( labels, [ 2, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label nutrition-facts-right">{ get( data, get( labels, [ 2, "id" ] ) ) }</strong>
                            </Fragment>
                        }
                    </li>
                    <li className="nutrition-facts-spacer"></li>
                    <li className="nutrition-facts-no-border"><strong className="nutrition-facts-right">% { __( "Daily Value", "wpzoom-recipe-card" ) } *</strong></li>
                    <li>
                        {
                            get( data, get( labels, [ 3, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 3, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 3, "id" ] ) }> { get( data, get( labels, [ 3, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 3, "id" ] ) }-measurement` }>g</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 3, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 3, "id" ] ) ) / get( labels, [ 3, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                        <ul>
                            <li>
                                {
                                    get( data, get( labels, [ 4, "id" ] ) ) &&
                                    <Fragment>
                                        <strong className="nutrition-facts-label">{ get( labels, [ 4, "label" ] ) }</strong>
                                        <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 4, "id" ] ) }> { get( data, get( labels, [ 4, "id" ] ) ) } </strong>
                                        <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 4, "id" ] ) }-measurement` }>g</strong>
                                        <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 4, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 4, "id" ] ) ) / get( labels, [ 4, "pdv" ] ) ) * 100 ) }</span>%</strong>
                                    </Fragment>
                                }
                            </li>
                            <li>
                                {
                                    get( data, get( labels, [ 5, "id" ] ) ) &&
                                    <Fragment>
                                        <strong className="nutrition-facts-label">{ get( labels, [ 5, "label" ] ) }</strong>
                                        <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 5, "id" ] ) }> { get( data, get( labels, [ 5, "id" ] ) ) } </strong>
                                        <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 5, "id" ] ) }-measurement` }>g</strong>
                                    </Fragment>
                                }
                            </li>
                        </ul>
                    </li>
                    <li>
                        {
                            get( data, get( labels, [ 6, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 6, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 6, "id" ] ) }> { get( data, get( labels, [ 6, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 6, "id" ] ) }-measurement` }>mg</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 6, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 6, "id" ] ) ) / get( labels, [ 6, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                    </li>
                    <li>
                        {
                            get( data, get( labels, [ 7, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 7, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 7, "id" ] ) }> { get( data, get( labels, [ 7, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 7, "id" ] ) }-measurement` }>mg</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 7, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 7, "id" ] ) ) / get( labels, [ 7, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                    </li>
                    <li>
                        {
                            get( data, get( labels, [ 8, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 8, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 8, "id" ] ) }> { get( data, get( labels, [ 8, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 8, "id" ] ) }-measurement` }>mg</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 8, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 8, "id" ] ) ) / get( labels, [ 8, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                    </li>
                    <li>
                        {
                            get( data, get( labels, [ 9, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 9, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 9, "id" ] ) }> { get( data, get( labels, [ 9, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 9, "id" ] ) }-measurement` }>g</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 9, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 9, "id" ] ) ) / get( labels, [ 9, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                        <ul>
                            <li>
                                {
                                    get( data, get( labels, [ 10, "id" ] ) ) &&
                                    <Fragment>
                                        <strong className="nutrition-facts-label">{ get( labels, [ 10, "label" ] ) }</strong>
                                        <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 10, "id" ] ) }> { get( data, get( labels, [ 10, "id" ] ) ) } </strong>
                                        <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 10, "id" ] ) }-measurement` }>g</strong>
                                        <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 10, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 10, "id" ] ) ) / get( labels, [ 10, "pdv" ] ) ) * 100 ) }</span>%</strong>
                                    </Fragment>
                                }
                            </li>
                            <li>
                                {
                                    get( data, get( labels, [ 11, "id" ] ) ) &&
                                    <Fragment>
                                        <strong className="nutrition-facts-label">{ get( labels, [ 11, "label" ] ) }</strong>
                                        <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 11, "id" ] ) }> { get( data, get( labels, [ 11, "id" ] ) ) } </strong>
                                        <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 11, "id" ] ) }-measurement` }>g</strong>
                                    </Fragment>
                                }
                            </li>
                        </ul>
                    </li>
                    <li>
                        {
                            get( data, get( labels, [ 12, "id" ] ) ) &&
                            <Fragment>
                                <strong className="nutrition-facts-heading">{ get( labels, [ 12, "label" ] ) }</strong>
                                <strong className="nutrition-facts-label" data-label-type={ get( labels, [ 12, "id" ] ) }> { get( data, get( labels, [ 12, "id" ] ) ) } </strong>
                                <strong className="nutrition-facts-label" data-label-type={ `${ get( labels, [ 12, "id" ] ) }-measurement` }>g</strong>
                                <strong className="nutrition-facts-right"><span className="nutrition-facts-percent" data-label-type={ get( labels, [ 12, "id" ] ) }>{ ceil( ( get( data, get( labels, [ 12, "id" ] ) ) / get( labels, [ 12, "pdv" ] ) ) * 100 ) }</span>%</strong>
                            </Fragment>
                        }
                    </li>
                </ul>
                <hr className="nutrition-facts-hr"/>
                <ul className="nutrition-facts-bottom">
                    { this.drawNutrientsList() }
                </ul>
            </Fragment>
        );
        
    }

    render() {
        const {
            className,
            attributes: {
                id,
                data
            }
        } = this.props;

        this.preFillData();

        return (
            <div id={ id }>
                <div className={ `${ className }-information` }>
                    <h3>{ __( "Nutrition Information", "wpzoom-recipe-card" ) }</h3>
                    { this.drawNutritionLabels() }
                </div>
                <div className={ className }>
                    <h2>{ __( "Nutrition Facts", "wpzoom-recipe-card" ) }</h2>
                    { this.drawNutritionFacts() }
                    <p className="nutrition-facts-daily-value-text">* { __( "The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.", "wpzoom-recipe-card" ) }</p>
                </div>
                <Button
                    className={ `${ className }-reload-values` }
                    title={ __( "In case you made some changes to Recipe Card, press button to Reload values.", "wpzoom-recipe-card" ) }
                    isDefault
                    isLarge
                    onClick={ () => this.setState( { reloadValues: true, isDataPreFill: false } ) }
                >
                    { __( "Reload Values", "wpzoom-recipe-card" ) }
                </Button>
            </div>
        );
    }
}

const applyWithSelect = withSelect( ( select, props ) => {
    const {
        getBlocks
    } = select('core/block-editor');

    const blocksList        = getBlocks();
    const recipeCardBlock   = filter( blocksList, function( item ) { return "wpzoom-recipe-card/block-recipe-card" === item.name } );

    return {
        blockData: get( recipeCardBlock, [ 0, 'attributes' ] ) || {}
    };
} );

export default compose(
    applyWithSelect
)( Nutrition );