/**
 * WordPress dependencies
 */
import { withColors } from '@wordpress/block-editor';

/**
 * Generate block colors.
 */
const applyWithColors = withColors(
    'backgroundColor',
    { textColor: 'color' },
    'blockBackgroundColor',
);

export default applyWithColors;
