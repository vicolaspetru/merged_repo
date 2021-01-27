/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Inspector controls
 */
export default class Inspector extends Component {
	/**
	 * Renders this component.
	 *
	 * @return {Component} The Ingredient items block settings.
	 */
	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const { print_visibility } = attributes;

		const onChangePrint = ( print_visibility ) => {
			if ( ! print_visibility ) {
				setAttributes( { print_visibility: 'hidden' } );
			} else {
				setAttributes( { print_visibility: 'visible' } );
			}
		};

		return (
			<InspectorControls>
				<PanelBody initialOpen={ true } title={ __( 'Ingredients Settings', 'wpzoom-recipe-card' ) }>
					<ToggleControl
						label={ __( 'Print Button Visibility', 'wpzoom-recipe-card' ) }
						checked={ print_visibility === 'visible' ? true : false }
						onChange={ onChangePrint }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
