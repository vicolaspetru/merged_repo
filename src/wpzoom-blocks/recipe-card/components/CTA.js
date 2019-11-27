/* External dependencies */
import get from "lodash/get";
import replace from "lodash/replace";
import ReactHtmlParser from 'react-html-parser';

/* WordPress dependencies */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { setting_options } = wpzoomRecipeCard;

const igUsername    = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_profile' );
const igHashtag     = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_hashtag' );
const igTitle       = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_title' );
const igSubtitle    = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_subtitle' );

const pinUsername   = get( setting_options, 'wpzoom_rcb_settings_pinterest_cta_profile' );
const pinTitle      = get( setting_options, 'wpzoom_rcb_settings_pinterest_cta_title' );
const pinSubtitle   = get( setting_options, 'wpzoom_rcb_settings_pinterest_cta_subtitle' );

export default class CTA extends Component {
    constructor() {
        super( ...arguments );
    }

    buildLink( url, attr, symbol = '@' ) {
        if ( '' == attr ) {
            return '';
        }

        const target   = get( setting_options, 'wpzoom_rcb_settings_cta_target' );
        const nofollow = get( setting_options, 'wpzoom_rcb_settings_cta_add_nofollow' );

        return `<a href="${ url }/${ attr }" target="${ 1 == target ? '_blank' : '_self' }" ${ 1 == nofollow ? 'rel="nofollow"' : '' }>${ symbol }${ attr }</a>`;
    }

    buildStyles( brand ) {
        let styles = [];
        let backgroundColor = '';
        let textColor = '';

        if ( 'instagram' === brand ) {
            backgroundColor = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_bg_color' );
            textColor = get( setting_options, 'wpzoom_rcb_settings_instagram_cta_text_color' );
        }
        else if ( 'pinterest' === brand ) {
            backgroundColor = get( setting_options, 'wpzoom_rcb_settings_pinterest_cta_bg_color' );
            textColor = get( setting_options, 'wpzoom_rcb_settings_pinterest_cta_text_color' );
        }

        if ( '' != backgroundColor ) {
            styles = {
                ...styles,
                'background-color': backgroundColor
            }
        }
        if ( '' != textColor ) {
            styles = {
                ...styles,
                'color': textColor
            }
        }

        return styles;
    }

    parseInstagramText( text ) {
        const igURL         = 'https://www.instagram.com';
        const igHashtagURL  = 'https://www.instagram.com/explore/tags';

        text = replace( text, '%profile%', this.buildLink( igURL, igUsername ) );
        text = replace( text, '%hashtag%', this.buildLink( igHashtagURL, igHashtag, '#' ) );

        return ReactHtmlParser( text );
    }

    parsePinterestText( text ) {
        const pinURL = 'https://www.pinterest.com';

        text = replace( text, '%profile%', this.buildLink( pinURL, pinUsername ) );

        return ReactHtmlParser( text );
    }

    render() {
        return (
            <Fragment>
                {
                    '' != igUsername &&
                    <div className="recipe-card-cta-instagram" style={ this.buildStyles( 'instagram' ) }>
                        <div className="cta-brand-icon"><i className="fab fa-instagram"></i></div>
                        <div className="cta-text-wrapper">
                            <h3 className="cta-text-title">{ igTitle }</h3>
                            <p className="cta-text-subtitle">{ this.parseInstagramText( igSubtitle ) }</p>
                        </div>
                    </div>
                }
                {
                    '' != pinUsername &&
                    <div className="recipe-card-cta-pinterest" style={ this.buildStyles( 'pinterest' ) }>
                        <div className="cta-brand-icon"><i className="fab fa-pinterest"></i></div>
                        <div className="cta-text-wrapper">
                            <h3 className="cta-text-title">{ pinTitle }</h3>
                            <p className="cta-text-subtitle">{ this.parsePinterestText( pinSubtitle ) }</p>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}