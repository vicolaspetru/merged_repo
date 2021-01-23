/**
 * BLOCK: block-details
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * External dependencies
 */
import { get, times } from 'lodash';

/**
 * Internal dependencies
 */
import FoodIcons from './FoodIcons';

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Returns the component to be used to render
 * the Details block on Wordpress (e.g. not in the editor).
 *
 * @param {object} props the attributes of the Details block.
 *
 * @returns {Component} The component representing a Details block.
 */
export default function LegacyDetails( props ) {
    const { title, details, columns } = props.attributes;
    const detailClasses = 'col-' + columns;

    return (
        <div className={ detailClasses }>
            <RichText.Content
                value={ title }
                tagName="h3"
                className="details-title"
            />
            { times( columns, ( index ) => {
                const icon = get( details, [ index, 'icon' ] );
                const label = get( details, [ index, 'label' ] );
                const value = get( details, [ index, 'value' ] );
                const detailItemClass = 'detail-item detail-item-' + index;

                    return (
                        <div className={ detailItemClass }>
                            { icon ? <span
                                    className="detail-item-icon"
                                    icon-name={ icon }>
                                <FoodIcons icon={ icon } />
                            </span> : ''
                            }
                            { ! RichText.isEmpty( label ) && <RichText.Content
                                    value={ label }
                                    tagName="span"
                                    className="detail-item-label"
                                />
                            }
                            { ! RichText.isEmpty( value ) && <RichText.Content
                                    value={ value }
                                    tagName="p"
                                    className="detail-item-value"
                                />
                            }
                        </div>
                    );
                } )
            }
        </div>
    );
}
