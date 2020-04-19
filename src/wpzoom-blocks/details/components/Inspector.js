/**
 * External dependencies
 */
import {
    get,
    isUndefined,
} from 'lodash';

/**
 * Internal dependencies
 */
import { stripHTML } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, renderToString } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
    BaseControl,
    PanelBody,
    RangeControl,
    TextControl,
    FormTokenField,
} from '@wordpress/components';

/**
 * Module constants
 */
const coursesToken = [
    __( 'Appetizer & Snaks', 'wpzoom-recipe-card' ),
    __( 'Breakfast & Brunch', 'wpzoom-recipe-card' ),
    __( 'Dessert', 'wpzoom-recipe-card' ),
    __( 'Drinks', 'wpzoom-recipe-card' ),
    __( 'Main Course', 'wpzoom-recipe-card' ),
    __( 'Salad', 'wpzoom-recipe-card' ),
    __( 'Soup', 'wpzoom-recipe-card' ),
];

const cuisinesToken = [
    __( 'American', 'wpzoom-recipe-card' ),
    __( 'Chinese', 'wpzoom-recipe-card' ),
    __( 'French', 'wpzoom-recipe-card' ),
    __( 'Indian', 'wpzoom-recipe-card' ),
    __( 'Italian', 'wpzoom-recipe-card' ),
    __( 'Japanese', 'wpzoom-recipe-card' ),
    __( 'Mediterranean', 'wpzoom-recipe-card' ),
    __( 'Mexican', 'wpzoom-recipe-card' ),
    __( 'Southern', 'wpzoom-recipe-card' ),
    __( 'Thai', 'wpzoom-recipe-card' ),
    __( 'Other world cuisine', 'wpzoom-recipe-card' ),
];

const keywordsToken = [];

/**
 * Inspector controls
 */
export default class Inspector extends Component {
    valuesMinMax( columns ) {
        if ( columns > 4 ) {
            return this.props.setAttributes( { columns: 4 } ); // max value
        } else if ( columns < 2 ) {
            return this.props.setAttributes( { columns: 2 } ); // min value
        } else if ( isUndefined( columns ) ) {
            return this.props.setAttributes( { columns: 4 } ); // default
        }
    }

    /**
     * Renders this component.
     *
     * @returns {Component} The Details block settings.
     */
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            id,
            course,
            cuisine,
            keywords,
            details,
            columns,
        } = attributes;

        this.valuesMinMax( columns );

        const onChangeDetail = ( newValue, index ) => {
            const details = this.props.attributes.details ? this.props.attributes.details.slice() : [];

            details[ index ].value = newValue;
            details[ index ].jsonValue = stripHTML( renderToString( newValue ) );

            setAttributes( { details } );
        };

        return (
            <InspectorControls key="inspector">
                <PanelBody initialOpen={ true } title={ __( 'Details Settings', 'wpzoom-recipe-card' ) }>
                    <RangeControl
                        label={ __( 'Number of Columns', 'wpzoom-recipe-card' ) }
                        help={ __( 'Default', 'wpzoom-recipe-card' ) + ': 4' }
                        value={ columns }
                        onChange={ ( columns ) => setAttributes( { columns } ) }
                        min={ 2 }
                        max={ 4 }
                    />
                    <BaseControl
                        id={ `${ id }-course` }
                        label={ __( 'Course', 'wpzoom-recipe-card' ) }
                        help={ __( 'Type course and press Enter.', 'wpzoom-recipe-card' ) }
                    >
                        <FormTokenField
                            label={ __( 'Add course', 'wpzoom-recipe-card' ) }
                            value={ course }
                            suggestions={ coursesToken }
                            onChange={ newCourse => setAttributes( { course: newCourse } ) }
                            placeholder={ __( 'Type recipe course', 'wpzoom-recipe-card' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-cuisine` }
                        label={ __( 'Cuisine', 'wpzoom-recipe-card' ) }
                        help={ __( 'Type cuisine and press Enter.', 'wpzoom-recipe-card' ) }
                    >
                        <FormTokenField
                            label={ __( 'Add cuisine', 'wpzoom-recipe-card' ) }
                            value={ cuisine }
                            suggestions={ cuisinesToken }
                            onChange={ newCuisine => setAttributes( { cuisine: newCuisine } ) }
                            placeholder={ __( 'Type recipe cuisine', 'wpzoom-recipe-card' ) }
                        />
                    </BaseControl>
                    <BaseControl
                        id={ `${ id }-keywords` }
                        label={ __( 'Keywords', 'wpzoom-recipe-card' ) }
                        help={ __( 'Hint: For multiple keywords add `,` after each keyword (ex: keyword, keyword, keyword).', 'wpzoom-recipe-card' ) }
                    >
                        <FormTokenField
                            label={ __( 'Add keywords', 'wpzoom-recipe-card' ) }
                            value={ keywords }
                            suggestions={ keywordsToken }
                            onChange={ newKeyword => setAttributes( { keywords: newKeyword } ) }
                            placeholder={ __( 'Type recipe keywords', 'wpzoom-recipe-card' ) }
                        />
                    </BaseControl>
                    <TextControl
                        id={ `${ id }-yield` }
                        type="text"
                        label={ __( 'Servings', 'wpzoom-recipe-card' ) }
                        value={ get( details, [ 0, 'value' ] ) }
                        onChange={ newYield => onChangeDetail( newYield, 0 ) }
                    />
                    <TextControl
                        id={ `${ id }-preptime` }
                        type="text"
                        label={ __( 'Preparation time', 'wpzoom-recipe-card' ) }
                        value={ get( details, [ 1, 'value' ] ) }
                        onChange={ newPrepTime => onChangeDetail( newPrepTime, 1 ) }
                    />
                    <TextControl
                        id={ `${ id }-cookingtime` }
                        type="text"
                        label={ __( 'Cooking time', 'wpzoom-recipe-card' ) }
                        value={ get( details, [ 2, 'value' ] ) }
                        onChange={ newCookingTime => onChangeDetail( newCookingTime, 2 ) }
                    />
                    <TextControl
                        id={ `${ id }-calories` }
                        type="text"
                        label={ __( 'Calories', 'wpzoom-recipe-card' ) }
                        value={ get( details, [ 3, 'value' ] ) }
                        onChange={ newCalories => onChangeDetail( newCalories, 3 ) }
                    />
                </PanelBody>
            </InspectorControls>
        );
    }
}
