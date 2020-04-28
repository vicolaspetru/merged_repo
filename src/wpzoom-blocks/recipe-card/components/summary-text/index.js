/**
 * Internal dependencies
 */
import { stripHTML } from '@wpzoom/helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, renderToString } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

class RecipeCardSummaryText extends Component {
    /**
     * Perform to prevent notes from being rerendered.
     *
     * @param {object} nextProps The next props the component will receive.
     *
     * @returns {boolean} Whether or not the component should perform an update.
     */
    shouldComponentUpdate( nextProps ) {
        const {
            attributes: {
                summary,
            },
        } = this.props;

        return nextProps.attributes.summary !== summary;
    }

    render() {
        const {
            attributes: {
                summary,
            },
            setAttributes,
            onFocus,
        } = this.props;

        // TODO: Add reference to summary text
        return (
            <RichText
                className="recipe-card-summary"
                tagName="p"
                value={ summary }
                unstableOnFocus={ () => onFocus( 'summary' ) }
                onChange={ ( newSummary ) => setAttributes( {
                    summary: newSummary,
                    jsonSummary: stripHTML( renderToString( newSummary ) ),
                } ) }
                placeholder={ __( 'Enter a short recipe description.', 'wpzoom-recipe-card' ) }
                keepPlaceholderOnFocus={ true }
            />
        );
    }
}

export default RecipeCardSummaryText;
