/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

const renderMetaData = ( meta ) => {
	return ! RichText.isEmpty( meta ) ? meta.filter( ( item ) => item ).join( ', ' ) : __( 'Not added', 'wpzoom-recipe-card' );
};

export default renderMetaData;
