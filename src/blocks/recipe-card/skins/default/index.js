/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import UploadMediaPlaceholder from '../shared/media-placeholder';
import PrintButton from '../shared/print-button';
import PinterestButton from '../shared/pinterest-button';
import renderMetaData from '../shared/render-meta-data';
import SummaryText from '../../components/summary-text';
import Detail from '../../components/detail';
import Ingredient from '../../components/ingredient';
import Direction from '../../components/direction';
import CallToAction from '../../components/call-to-action';
import FoodLabels from '../../components/food-labels';
import Video from '../../components/video';
import Notes from '../../components/notes';
import { generateId } from '@wpzoom/helpers';
import { getCSSSelector } from '../shared/css-selectors';
import { buildInlineStyle } from '../shared/inline-style';
import { printIcon, pinterestIcon } from '../shared/icon';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

/**
 * A Recipe Card block.
 */
class SkinDefault extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			className,
			postAuthor,
			settingOptions,
			isRecipeCardSelected,
			renderTerms,
			setFocus,
			activeStyle,
		} = this.props;

		const {
			wpzoom_rcb_settings_course_taxonomy,
			wpzoom_rcb_settings_cuisine_taxonomy,
			wpzoom_rcb_settings_difficulty_taxonomy,
		} = settingOptions;

		const {
			recipeTitle,
			course,
			cuisine,
			difficulty,
			hasImage,
			image,
			settings: {
				0: {
					primary_color,
					hide_header_image,
					print_btn,
					pin_btn,
					custom_author_name,
					displayCourse,
					displayCuisine,
					displayDifficulty,
					displayAuthor,
				},
			},
		} = attributes;

		let customAuthorName = custom_author_name;
		if ( custom_author_name === '' ) {
			customAuthorName = postAuthor;
		}

		const styles = {
			[ getCSSSelector( activeStyle.name, '.btn-print-link' ) ]: `background-color: ${ primary_color };`,
			[ `${ getCSSSelector( activeStyle.name, '.recipe-card-notes-list' ) } > li::before` ]: `background-color: ${ primary_color }`,
		};

		return (
			<Fragment>
				{ buildInlineStyle( styles ) }
				{ ! hasImage && (
					<UploadMediaPlaceholder
						image={ image }
						hasImage={ hasImage }
						onSelectImage={ this.props.onSelectImage }
						onUploadError={ this.props.onUploadError }
						isRecipeCardSelected={ isRecipeCardSelected }
						noticeUI={ this.props.noticeUI }
					/>
				) }
				{ ( ! hide_header_image && hasImage ) && (
					<div className="recipe-card-image-preview">
						<div className="recipe-card-image">
							<figure>
								<img src={ get( image, [ 'url' ] ) } id={ get( image, [ 'id' ] ) } alt={ recipeTitle } />
								<figcaption>
									<Disabled>
										{ pin_btn && (
											<PinterestButton
												icon={ pinterestIcon }
											/>
										) }
										{ print_btn && (
											<PrintButton
												id={ get( attributes, 'id' ) }
												icon={ printIcon }
											/>
										) }
									</Disabled>
								</figcaption>
							</figure>
						</div>
					</div>
				) }
				<div className="recipe-card-heading">
					<RichText
						className="recipe-card-title"
						tagName="h2"
						format="string"
						value={ recipeTitle }
						unstableOnFocus={ () => setFocus( 'recipeTitle' ) }
						onChange={ ( newTitle ) => setAttributes( { recipeTitle: newTitle } ) }
						placeholder={ __( 'Enter the title of your recipe', 'wpzoom-recipe-card' ) }
						keepPlaceholderOnFocus={ true }
					/>
					{
						displayAuthor &&
						<span className="recipe-card-author">
							{ __( 'Recipe by', 'wpzoom-recipe-card' ) } { customAuthorName }
						</span>
					}
					<Fragment key="recipe-card-metadata">
						{
							displayCourse &&
                            '1' !== wpzoom_rcb_settings_course_taxonomy &&
                            <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( course ) }</mark></span>
						}
						{
							displayCuisine &&
                            '1' !== wpzoom_rcb_settings_cuisine_taxonomy &&
                            <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( cuisine ) }</mark></span>
						}
						{
							displayDifficulty &&
                            '1' !== wpzoom_rcb_settings_difficulty_taxonomy &&
                            <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ renderMetaData( difficulty ) }</mark></span>
						}
					</Fragment>
					<Fragment key="recipe-card-terms">
						{
							displayCourse &&
                            '1' === wpzoom_rcb_settings_course_taxonomy &&
                            <span className="recipe-card-course">{ __( 'Course', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_courses' ) }</mark></span>
						}
						{
							displayCuisine &&
                            '1' === wpzoom_rcb_settings_cuisine_taxonomy &&
                            <span className="recipe-card-cuisine">{ __( 'Cuisine', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_cuisines' ) }</mark></span>
						}
						{
							displayDifficulty &&
                            '1' === wpzoom_rcb_settings_difficulty_taxonomy &&
                            <span className="recipe-card-difficulty">{ __( 'Difficulty', 'wpzoom-recipe-card' ) }: <mark>{ renderTerms( 'wpzoom_rcb_difficulties' ) }</mark></span>
						}
					</Fragment>
					<p className="description">{ __( 'You can add or edit these details in the Block Options on the right →', 'wpzoom-recipe-card' ) }</p>
				</div>
				<Detail
					generateId={ generateId }
					{ ...{ attributes, setAttributes, className } }
				/>
				<FoodLabels
					location="top"
					{ ...{ attributes, setAttributes } }
				/>
				<SummaryText
					onFocus={ setFocus }
					{ ...{ attributes, setAttributes } }
				/>
				<Ingredient
					generateId={ generateId }
					isRecipeCardSelected={ isRecipeCardSelected }
					{ ...{ attributes, setAttributes, className, activeStyle } }
				/>
				<Direction
					generateId={ generateId }
					isRecipeCardSelected={ isRecipeCardSelected }
					{ ...{ attributes, setAttributes, className } }
				/>
				<Video
					onFocus={ setFocus }
					{ ...{ attributes, setAttributes } }
				/>
				<Notes
					onFocus={ setFocus }
					{ ...{ attributes, setAttributes } }
				/>
				<FoodLabels
					location="bottom"
					{ ...{ attributes, setAttributes } }
				/>
				<CallToAction />
			</Fragment>
		);
	}
}

export default SkinDefault;
