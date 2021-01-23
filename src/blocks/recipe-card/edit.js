/*global wpzoomRecipeCard*/

/**
 * External dependencies
 */
import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import SkinDefault from './skins/default';
import SkinSimple from './skins/simple';
import SkinNewDesign from './skins/new-design';
import SkinAccentColorHeader from './skins/accent-color-header';
// import loadingSpinnerPlaceholder from './skins/shared/spinner';
// import ExtraOptionsModal from '../bulk';
import Controls from './controls';
import Inspector from './inspector';
import applyWithColors from './colors';
import { pickRelevantMediaFiles } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { Component, Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { withNotices } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import TokenList from '@wordpress/token-list';

/**
 * Block constants
 */
const applyWithSelect = withSelect( ( select ) => {

} );

const { settingOptions } = wpzoomRecipeCard;
const {
	wpzoom_rcb_settings_template,
	wpzoom_rcb_settings_heading_content_align,
} = settingOptions;

const layoutOptions = [
	{
		name: 'default',
		label: __( 'Default', 'wpzoom-recipe-card' ),
		isDefault: wpzoom_rcb_settings_template === 'default',
	},
	{
		name: 'simple',
		label: __( 'Simple', 'wpzoom-recipe-card' ),
		isDefault: wpzoom_rcb_settings_template === 'simple',
	},
	{
		name: 'newdesign',
		label: __( 'New Design', 'wpzoom-recipe-card' ),
		isDefault: wpzoom_rcb_settings_template === 'newdesign',
	},
	{
		name: 'accent-color-header',
		label: __( 'Accent Header', 'wpzoom-recipe-card' ),
		isDefault: wpzoom_rcb_settings_template === 'accent-color-header',
	},
];

/**
 * Returns the active style from the given className.
 *
 * @param {Array} styles Block style variations.
 * @param {string} className  Class name
 *
 * @return {Object?} The active style.
 */
function getActiveStyle( styles, className ) {
	for ( const style of new TokenList( className ).values() ) {
		if ( style.indexOf( 'is-style-' ) === -1 ) {
			continue;
		}

		const potentialStyleName = style.substring( 9 );
		const activeStyle = find( styles, { name: potentialStyleName } );

		if ( activeStyle ) {
			return activeStyle;
		}
	}

	return find( styles, { isDefault: true } );
}

/**
 * Replaces the active style in the block's className.
 *
 * @param {string}  className   Class name.
 * @param {Object?} activeStyle The replaced style.
 * @param {Object}  newStyle    The replacing style.
 *
 * @return {string} The updated className.
 */
function replaceActiveStyle( className, activeStyle, newStyle ) {
	const list = new TokenList( className );

	if ( activeStyle ) {
		list.remove( 'is-style-' + activeStyle.name );
	}

	list.add( 'is-style-' + newStyle.name );

	return list.value;
}

/**
 * Block edit function
 */
class edit extends Component {
	constructor() {
		super( ...arguments );

		this.updateStyle = this.updateStyle.bind( this );
	}

	componentDidUpdate( prevProps ) {
		const { attributes, setAttributes } = this.props;
		const { settings } = attributes;
		const { headerAlign } = settings[ 0 ];
		const lastHeaderAlign = get( prevProps.attributes, [ settings, 0, headerAlign ] );

		if ( lastHeaderAlign !== headerAlign && headerAlign === undefined ) {
			setAttributes( {
				settings: {
					0: {
						...settings[ 0 ],
						headerAlign: wpzoom_rcb_settings_heading_content_align,
					},
				},
			} );
		}
	}

	updateStyle( style ) {
		const { className, attributes, setAttributes } = this.props;

		const activeStyle = getActiveStyle( layoutOptions, className );
		const updatedClassName = replaceActiveStyle(
			attributes.className,
			activeStyle,
			style
		);

		setAttributes( { className: updatedClassName } );
	}

	// getTextColor( isMaskStyle ) {
	//     const { backgroundColor, textColor } = this.props;

	//     return isMaskStyle ? backgroundColor.color : textColor.color;
	// }

	render() {
		const {
			attributes,
			className,
			isSelected,
		} = this.props;

		const {
			id,
			blockAlignment,
			settings,
		} = attributes;

		const {
			hide_header_image,
			headerAlign,
		} = settings[ 0 ];

		// const {
		//     borderRadius,
		//     customBlockBackgroundColor,
		//     facebook,
		//     hasColors,
		//     houzz,
		//     iconSize,
		//     instagram,
		//     linkedin,
		//     padding,
		//     pinterest,
		//     size,
		//     textAlign,
		//     twitter,
		//     yelp,
		//     youtube,
		// } = attributes;

		// const isMaskStyle = includes( className, 'is-style-mask' );
		// const isCircularStyle = includes( className, 'is-style-circular' );

		const classes = classnames( className,
			`block-alignment-${ blockAlignment }`, {
				'recipe-card-noimage': hide_header_image,
				[ `header-content-align-${ headerAlign }` ]: ! isEmpty( headerAlign ),
				// [ `is-style-${ activeStyle.name }` ]: m === null,
			}
		);

		// const classes = classnames( className,
		//     'wp-block-coblocks-social', {
		//         [ `has-button-size-${ size }` ]: size !== 'med',
		//         'has-colors': hasColors,
		//         'has-background': blockBackgroundColor.color || customBlockBackgroundColor,
		//     } );

		// const buttonClasses = classnames(
		//     'wp-block-button__link',
		//     'wp-block-coblocks-social__button',
		//     {
		//         'has-background': hasColors || backgroundColor.color,
		//         'has-text-color': hasColors || textColor.color,
		//         'has-padding': padding,
		//         [ textColor.class ]: textColor.class,
		//     }
		// );

		// const buttonStyles = {
		//     borderRadius: borderRadius && borderRadius + 'px',
		//     backgroundColor: ! hasColors && ! isMaskStyle && backgroundColor.color,
		//     color: ! hasColors && this.getTextColor( isMaskStyle ),
		//     padding: isCircularStyle && padding + 'px',
		// };

		// const iconStyles = {
		//     height: ( isMaskStyle || isCircularStyle ) && iconSize + 'px',
		//     width: ( isMaskStyle || isCircularStyle ) && iconSize + 'px',
		// };

		// const placeholder = ! (
		//     facebook ||
		//     twitter ||
		//     instagram ||
		//     pinterest ||
		//     linkedin ||
		//     youtube ||
		//     yelp ||
		//     houzz
		// );

		const activeStyle = getActiveStyle( layoutOptions, className );

		return (
			<Fragment>
				{ isSelected && (
					<Controls
						activeStyle={ activeStyle }
						{ ...this.props }
					/>
				) }
				{ isSelected && (
					<Inspector
						activeStyle={ activeStyle }
						layoutOptions={ layoutOptions }
						onUpdateStyle={ this.updateStyle }
						{ ...this.props }
					/>
				) }

				<div className={ classes } id={ id }>
					{ 'default' === activeStyle.name && (
						<SkinDefault
							activeStyle={ activeStyle }
							{ ...this.props }
						/>
					) }

					{ 'simple' === activeStyle.name && (
						<SkinSimple
							activeStyle={ activeStyle }
							{ ...this.props }
						/>
					) }

					{ 'newdesign' === activeStyle.name && (
						<SkinNewDesign
							activeStyle={ activeStyle }
							{ ...this.props }
						/>
					) }

					{ 'accent-color-header' === activeStyle.name && (
						<SkinAccentColorHeader
							activeStyle={ activeStyle }
							{ ...this.props }
						/>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [ applyWithColors ] )( edit );
