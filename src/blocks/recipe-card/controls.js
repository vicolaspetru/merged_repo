/**
 * Internal dependencies
 */
import { BulkAddControl } from '../../components/bulk-add-control';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Toolbar } from '@wordpress/components';
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { positionLeft, positionRight, positionCenter } from '@wordpress/icons';

/**
 * Constants
 */
const BLOCK_ALIGNMENT_CONTROLS = [
	{
		icon: positionLeft,
		title: __( 'Align block left', 'wpzoom-recipe-card' ),
		align: 'left',
	},
	{
		icon: positionCenter,
		title: __( 'Align block center', 'wpzoom-recipe-card' ),
		align: 'center',
	},
	{
		icon: positionRight,
		title: __( 'Align block right', 'wpzoom-recipe-card' ),
		align: 'right',
	},
];

class Controls extends Component {
	constructor() {
		super( ...arguments );

		this.onChangeAlignment = this.onChangeAlignment.bind( this );
	}

	componentDidUpdate( prevProps ) {
		const { attributes } = this.props;
		const {
			activeStyle,
			settings: {
				0: {
					headerAlign,
				},
			},
		} = attributes;

		if ( activeStyle !== prevProps.attributes.activeStyle ) {
			if ( 'simple' === activeStyle.name && ( typeof headerAlign === 'undefined' || headerAlign === 'center' ) ) {
				this.onChangeAlignment( 'left' );
			}
		}
	}

	onChangeAlignment( newAlignment ) {
		const {
			attributes: {
				settings,
				blockAlignment,
			},
			setAttributes,
		} = this.props;

		const { 0: { headerAlign } } = settings;
		const newSettings = settings ? settings.slice() : [];

		newSettings[ 0 ] = {
			...newSettings[ 0 ],
			headerAlign: newAlignment === undefined ? headerAlign : newAlignment,
		};

		setAttributes( {
			blockAlignment: newAlignment === undefined ? blockAlignment : newAlignment,
			settings: newSettings,
		} );
	}

	render() {
		const {
			attributes,
			isRTL,
		} = this.props;

		const { blockAlignment } = attributes;

		return (
			<Fragment>
				<BlockControls>
					<AlignmentToolbar
						isRTL={ isRTL }
						alignmentControls={ BLOCK_ALIGNMENT_CONTROLS }
						label={ __( 'Change Block Alignment', 'wpzoom-recipe-card' ) }
						value={ blockAlignment }
						onChange={ this.onChangeAlignment }
					/>
					<Toolbar>
						<BulkAddControl { ...this.props } />
					</Toolbar>
				</BlockControls>
			</Fragment>
		);
	}
}

export default Controls;
