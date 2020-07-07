/**
 * External dependencies
 */
import { replace, includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

const fixTastyLinksConflict = ( notes ) => {
    if ( ! includes( notes, '\\u003c' ) && includes( notes, 'u003c' ) ) {
        notes = replace( notes, /u003c/g, '<' );
    }
    if ( ! includes( notes, '\\u003e' ) && includes( notes, 'u003e' ) ) {
        notes = replace( notes, /u003e/g, '>' );
    }

    return notes;
};

class RecipeCardNotes extends Component {
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
                notesTitle,
                notes,
            },
        } = this.props;

        return nextProps.attributes.notesTitle !== notesTitle || nextProps.attributes.notes !== notes;
    }

    render() {
        const {
            attributes: {
                notesTitle,
                notes,
            },
            setAttributes,
            onFocus,
        } = this.props;

        const newNotesValue = fixTastyLinksConflict( notes );

        // TODO: Add reference to notes-title and notes list
        return (
            <div className="recipe-card-notes">
                <RichText
                    tagName="h3"
                    className="notes-title"
                    format="string"
                    value={ notesTitle }
                    unstableOnFocus={ () => onFocus( 'notesTitle' ) }
                    onChange={ ( notesTitle ) => setAttributes( { notesTitle } ) }
                    placeholder={ __( 'Write Notes title', 'wpzoom-recipe-card' ) }
                    keepPlaceholderOnFocus={ true }
                />
                <RichText
                    className="recipe-card-notes-list"
                    tagName="ul"
                    multiline="li"
                    value={ newNotesValue }
                    unstableOnFocus={ () => onFocus( 'notes' ) }
                    onChange={ ( newNote ) => setAttributes( { notes: newNote } ) }
                    placeholder={ __( 'Enter Note text for your recipe.', 'wpzoom-recipe-card' ) }
                    keepPlaceholderOnFocus={ true }
                />
                <p className="description">{ __( 'Press Enter to add new note.', 'wpzoom-recipe-card' ) }</p>
            </div>
        );
    }
}

export default RecipeCardNotes;
