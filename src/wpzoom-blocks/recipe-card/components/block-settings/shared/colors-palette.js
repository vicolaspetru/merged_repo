/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const blockColors = [
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#222222' },
    { name: __( 'Orange', 'wpzoom-recipe-card' ), color: '#FFA921' },
    { name: __( 'Red', 'wpzoom-recipe-card' ), color: '#FF4E6A' },
    { name: __( 'Green', 'wpzoom-recipe-card' ), color: '#B7C662' },
];
const accentBgColors = [
    { name: __( 'Turquoise', 'wpzoom-recipe-card' ), color: '#86C7A7' },
    { name: __( 'Orange', 'wpzoom-recipe-card' ), color: '#FFA921' },
    { name: __( 'Red', 'wpzoom-recipe-card' ), color: '#FF4E6A' },
    { name: __( 'Green', 'wpzoom-recipe-card' ), color: '#B7C662' },
];
const accentColors = [
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#333333' },
];
const pinterestBackgroundColors = [
    { name: __( 'Red', 'wpzoom-recipe-card' ), color: '#C62122' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#222222' },
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
];
const pinterestTextColors = [
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#333333' },
];
const printBackgroundColors = [
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#222222' },
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Orange', 'wpzoom-recipe-card' ), color: '#FFA921' },
];
const printTextColors = [
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#333333' },
];
const metaTextColors = [
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#222222' },
];
const titleColors = [
    { name: __( 'White', 'wpzoom-recipe-card' ), color: '#FFFFFF' },
    { name: __( 'Dark', 'wpzoom-recipe-card' ), color: '#222222' },
];

export {
    blockColors,
    accentBgColors,
    accentColors,
    pinterestBackgroundColors,
    pinterestTextColors,
    printTextColors,
    printBackgroundColors,
    metaTextColors,
    titleColors,
};
