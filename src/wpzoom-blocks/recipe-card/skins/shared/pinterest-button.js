/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const pinterestClasses = classnames(
    'wpzoom-recipe-card-pinit'
);

const PinterestButton = () => {
    return (
        <div className={ pinterestClasses }>
            <a className="btn-pinit-link no-print" data-pin-do="buttonPin" href="#" data-pin-custom="true">
                <i className="icon-pinit-link"></i>
                <span>{ __( 'Pin', 'wpzoom-recipe-card' ) }</span>
            </a>
        </div>
    );
};

export default PinterestButton;
