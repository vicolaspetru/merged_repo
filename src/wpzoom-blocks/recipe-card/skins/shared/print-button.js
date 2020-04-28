/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const printClasses = classnames(
    'wpzoom-recipe-card-print-link'
);

const PrintButton = ( props ) => {
    const {
        id,
        styles,
    } = props;

    return (
        <div className={ printClasses }>
            <a className="btn-print-link no-print" href={ `#${ id }` } title={ __( 'Print directions...', 'wpzoom-recipe-card' ) } style={ styles }>
                <i className="icon-print-link"></i>
                <span>{ __( 'Print', 'wpzoom-recipe-card' ) }</span>
            </a>
        </div>
    );
};

export default PrintButton;
