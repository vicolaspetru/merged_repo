/**
 * External dependencies
 */
import {
    get,
    isUndefined,
    replace,
} from 'lodash';

/**
 * Internal dependencies
 */
import { filterIcons } from '@wpzoom/utils';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Button,
    Modal,
    TabPanel,
    SelectControl,
    TextControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { withState } from '@wordpress/compose';

/**
 * Module constants
 */
const iconsSets = [
    { label: __( 'Foodicons', 'wpzoom-recipe-card' ), value: 'foodicons' },
    { label: __( 'Dashicons', 'wpzoom-recipe-card' ), value: 'dashicons' },
    { label: __( 'Font Awesome 5', 'wpzoom-recipe-card' ), value: 'fa' },
    { label: __( 'Genericons', 'wpzoom-recipe-card' ), value: 'genericons' },
    { label: __( 'Old Food icons', 'wpzoom-recipe-card' ), value: 'oldicon' },
];

/**
 * A Icons Modal within a Details block.
 *
 * @returns {Component} The tab content
 */
function IconsModal(
    {
        isOpen,
        toInsert,
        searchIcon,
        activeIconSet,
        activeTab,
        props,
        setState,
    }
) {
    const {
        attributes,
        setAttributes,
        item,
    } = props;

    const {
        details,
        settings: {
            0: {
                primary_color,
            },
        },
    } = attributes;

    let { iconSet, _prefix } = item;
    const { icon } = item;

    if ( isUndefined( iconSet ) ) {
        iconSet = 'oldicon';
    }

    _prefix = _prefix || iconSet;

    const iconStyles = '' !== primary_color ? { color: `${ primary_color }` } : [];
    const activeIcon = get( details, [ toInsert, 'icon' ] );

    /**
     * Handles the on change event on the detail icon editor.
     *
     * @param {object} event        Document event.
     * @param {string} iconSet      The new icon set name.
     * @param {string} iconName     The new icon.
     * @param {string} _prefix       The icon name prefix (used for Font Awesome 5).
     *
     * @returns {void}
     */
    function onChangeIcon( event, iconSet, iconName, _prefix = '' ) {
        const { type, target } = event;
        const details = attributes.details ? attributes.details.slice() : [];

        // If the index exceeds the number of items, don't change anything.
        if ( toInsert >= details.length ) {
            return;
        }

        // Rebuild the item with the newly made changes.
        details[ toInsert ] = {
            ...details[ toInsert ],
            icon: iconName,
            iconSet,
            _prefix,
        };

        setAttributes( { details } );

        if ( type === 'click' && target.classList.contains( 'wpzoom-recipe-card-icons__single-element' ) ) {
            setState( { isOpen: false } );
        }
    }

    /**
     * Change Icon Set
     *
     * @param {string} iconSet The icon set
     */
    const onChangeIconSet = ( iconSet ) => {
        let tabName = 'regular';

        if ( 'fa' === iconSet ) {
            if ( 'fas' === _prefix ) {
                tabName = 'solid';
            } else if ( 'fab' === _prefix ) {
                tabName = 'brands';
            }
        }

        setState( { activeIconSet: iconSet, activeTab: tabName } );
    };

    /**
     * Open Modal
     */
    const onOpenModal = () => {
        let tabName = 'regular';

        if ( 'fa' === props.item.iconSet ) {
            if ( 'fas' === _prefix ) {
                tabName = 'solid';
            } else if ( 'fab' === _prefix ) {
                tabName = 'brands';
            }
        }

        setState( { isOpen: true, toInsert: props.index, activeIconSet: props.item.iconSet || 'foodicons', activeTab: tabName } );
    };

    /**
     * Select Tab
     *
     * @param {string} tabName The tab name
     */
    const onSelectTab = ( tabName ) => {
        setState( { activeTab: tabName } );
    };

    /**
     * Display Icons Grid
     *
     * @param {string} tabName The tab name
     * @returns {Component} The tab content
     */
    function iconsGrid( tabName = 'regular' ) {
        return Object.keys( filterIcons( searchIcon ) ).map( iconSet =>
            <div
                key={ iconSet }
                className={ `wpzoom-recipe-card-icon_kit ${ iconSet }-wrapper` }
                style={ { display: activeIconSet === iconSet ? 'block' : 'none' } }
            >
                {
                    filterIcons( searchIcon )[ iconSet ].map( icon => {
                        let iconClassNames = [ 'wpzoom-recipe-card-icons__single-element', `${ iconSet }`, `${ iconSet }-${ icon }` ].filter( ( item ) => item ).join( ' ' );

                        if ( 'fa' === iconSet ) {
                            let iconPrefix;

                            if ( 'solid' === tabName ) {
                                iconPrefix = 'fas';
                            } else if ( 'brands' === tabName ) {
                                iconPrefix = 'fab';
                            } else {
                                iconPrefix = 'far';
                            }

                            if ( icon.indexOf( iconPrefix ) !== -1 ) {
                                icon = replace( icon, `${ iconPrefix } ${ iconSet }-`, '' );
                                iconClassNames = [ 'wpzoom-recipe-card-icons__single-element', iconPrefix, `${ iconSet }-${ icon }` ].filter( ( item ) => item ).join( ' ' );

                                return (
                                    <span
                                        className={ `${ iconClassNames } ${ activeIcon === icon ? 'icon-element-active' : '' }` }
                                        onClick={ ( e ) => onChangeIcon( e, iconSet, icon, iconPrefix ) }>
                                    </span>
                                );
                            }
                        } else {
                            return (
                                <span
                                    className={ `${ iconClassNames } ${ activeIcon === icon ? 'icon-element-active' : '' }` }
                                    onClick={ ( e ) => onChangeIcon( e, iconSet, icon ) }>
                                </span>
                            );
                        }
                    } )
                }
            </div>
        );
    }

    return (
        <Fragment>
            <Button
                icon={ ! icon && 'insert' }
                onClick={ onOpenModal }
                className="editor-inserter__toggle"
                label={ __( 'Add icon', 'wpzoom-recipe-card' ) }
            >
                {
                    icon &&
                    <span className={ `${ _prefix } ${ iconSet }-${ icon }` } style={ iconStyles }></span>
                }
            </Button>
            {
                isOpen &&
                <Modal
                    title={ __( 'Modal with Icons library', 'wpzoom-recipe-card' ) }
                    onRequestClose={ () => setState( { isOpen: false } ) }
                >
                    <div className="wpzoom-recipe-card-modal-form" style={ { width: 720 + 'px', maxHeight: 525 + 'px' } }>
                        <div className="form-group">
                            <TextControl
                                label={ __( 'Enter icon name', 'wpzoom-recipe-card' ) }
                                value={ searchIcon }
                                onChange={ ( iconName ) => setState( { searchIcon: iconName } ) }
                            />
                            <SelectControl
                                label={ __( 'Select Icon Kit', 'wpzoom-recipe-card' ) }
                                value={ activeIconSet }
                                options={ iconsSets }
                                onChange={ onChangeIconSet }
                            />
                        </div>
                        <div className="modal-icons-wrapper">
                            {
                                'fa' === activeIconSet &&
                                <TabPanel
                                    className="modal-icons_kit-tab-panel"
                                    activeClass="active-tab"
                                    initialTabName={ activeTab }
                                    onSelect={ onSelectTab }
                                    tabs={ [
                                        {
                                            name: 'regular',
                                            title: __( 'Regular', 'wpzoom-recipe-card' ),
                                            className: 'tab-regular',
                                            content: iconsGrid( 'regular' ),
                                        },
                                        {
                                            name: 'solid',
                                            title: __( 'Solid', 'wpzoom-recipe-card' ),
                                            className: 'tab-solid',
                                            content: iconsGrid( 'solid' ),
                                        },
                                        {
                                            name: 'brands',
                                            title: __( 'Brands', 'wpzoom-recipe-card' ),
                                            className: 'tab-brands',
                                            content: iconsGrid( 'brands' ),
                                        },
                                    ] }
                                >
                                    {
                                        ( tab ) => {
                                            return ( tab.content );
                                        }
                                    }
                                </TabPanel>
                            }
                            {
                                'fa' !== activeIconSet &&
                                <TabPanel
                                    className="modal-icons_kit-tab-panel"
                                    activeClass="active-tab"
                                    initialTabName={ activeTab }
                                    onSelect={ onSelectTab }
                                    tabs={ [
                                        {
                                            name: 'regular',
                                            title: __( 'All Icons', 'wpzoom-recipe-card' ),
                                            className: 'tab-regular',
                                            content: iconsGrid( 'regular' ),
                                        },
                                    ] }
                                >
                                    {
                                        ( tab ) => {
                                            return ( tab.content );
                                        }
                                    }
                                </TabPanel>
                            }
                        </div>
                    </div>
                </Modal>
            }
        </Fragment>
    );
}

export default withState( {
    searchIcon: '',
    activeIconSet: '',
    activeTab: 'regular',
    isOpen: false,
    toInsert: 0,
} )( IconsModal );
