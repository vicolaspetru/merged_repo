/**
 * External dependencies
 */
import { get } from 'lodash';
import ReactPlayer from 'react-player';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Placeholder } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

class RecipeCardVideo extends Component {
    render() {
        const {
            attributes: {
                hasVideo,
                video,
                videoTitle,
            },
            setAttributes,
            onFocus,
        } = this.props;
        const videoType = get( video, 'type' );

        // TODO: Add reference to video-title and video player
        return (
            <div className="recipe-card-video">
                <RichText
                    tagName="h3"
                    className="video-title"
                    format="string"
                    value={ videoTitle }
                    unstableOnFocus={ () => onFocus( 'videoTitle' ) }
                    onChange={ ( videoTitle ) => setAttributes( { videoTitle } ) }
                    placeholder={ __( 'Write Recipe Video title', 'wpzoom-recipe-card' ) }
                    keepPlaceholderOnFocus={ true }
                />
                {
                    ! hasVideo &&
                    <Placeholder
                        icon="video-alt3"
                        className="wpzoom-recipe-card-video-placeholder"
                        instructions={ __( 'You can add a video here from Recipe Card Video Settings in the right sidebar', 'wpzoom-recipe-card' ) }
                        label={ __( 'Recipe Card Video', 'wpzoom-recipe-card' ) }
                    />
                }
                {
                    hasVideo &&
                    'embed' === videoType &&
                    <Fragment>
                        <ReactPlayer
                            width="100%"
                            height="340px"
                            url={ get( video, 'url' ) }
                        />
                    </Fragment>
                }
                {
                    hasVideo &&
                    'self-hosted' === videoType &&
                    <Fragment>
                        <video
                            controls={ get( video, 'settings.controls' ) }
                            poster={ get( video, 'poster.url' ) }
                            src={ get( video, 'url' ) }
                        />
                    </Fragment>
                }
            </div>
        );
    }
}

export default RecipeCardVideo;
