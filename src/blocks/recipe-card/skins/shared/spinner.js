/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Spinner } from '@wordpress/components';

export const loadingSpinnerPlaceholder = (
	<Placeholder
		className="wpzoom-recipe-card-loading-spinner"
		label={ __( 'Loading…', 'wpzoom-recipe-card' ) }
	>
		<Spinner />
	</Placeholder>
);
