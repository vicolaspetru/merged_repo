/*global wpzoomRecipeCard*/

/**
 * External dependencies
 */
import { replace, isEmpty } from 'lodash';
import ReactHtmlParser from 'react-html-parser';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';

const { setting_options } = wpzoomRecipeCard;
const {
    wpzoom_rcb_settings_instagram_cta_profile,
    wpzoom_rcb_settings_instagram_cta_hashtag,
    wpzoom_rcb_settings_instagram_cta_title,
    wpzoom_rcb_settings_instagram_cta_subtitle,
    wpzoom_rcb_settings_pinterest_cta_profile,
    wpzoom_rcb_settings_pinterest_cta_title,
    wpzoom_rcb_settings_pinterest_cta_subtitle,
    wpzoom_rcb_settings_facebook_cta_url,
    wpzoom_rcb_settings_facebook_cta_title,
    wpzoom_rcb_settings_facebook_cta_subtitle,
    wpzoom_rcb_settings_cta_target,
    wpzoom_rcb_settings_cta_add_nofollow,
    wpzoom_rcb_settings_instagram_cta_bg_color,
    wpzoom_rcb_settings_instagram_cta_text_color,
    wpzoom_rcb_settings_pinterest_cta_bg_color,
    wpzoom_rcb_settings_pinterest_cta_text_color,
    wpzoom_rcb_settings_facebook_cta_bg_color,
    wpzoom_rcb_settings_facebook_cta_text_color,
} = setting_options;

const igUsername        = wpzoom_rcb_settings_instagram_cta_profile;
const igHashtag         = wpzoom_rcb_settings_instagram_cta_hashtag;
const igTitle           = wpzoom_rcb_settings_instagram_cta_title;
const igSubtitle        = wpzoom_rcb_settings_instagram_cta_subtitle;

const pinUsername       = wpzoom_rcb_settings_pinterest_cta_profile;
const pinTitle          = wpzoom_rcb_settings_pinterest_cta_title;
const pinSubtitle       = wpzoom_rcb_settings_pinterest_cta_subtitle;

const facebookURL       = wpzoom_rcb_settings_facebook_cta_url;
const facebookTitle     = wpzoom_rcb_settings_facebook_cta_title;
const facebookSubtitle  = wpzoom_rcb_settings_facebook_cta_subtitle;

export default class CTA extends Component {
    buildLink( url, attr, symbol = '@' ) {
        const target   = wpzoom_rcb_settings_cta_target;
        const nofollow = wpzoom_rcb_settings_cta_add_nofollow;

        if ( isEmpty( attr ) ) {
            return '';
        }

        return `<a href="${ url }/${ attr }" target="${ 1 === target ? '_blank' : '_self' }" ${ 1 === nofollow ? 'rel="nofollow"' : '' }>${ symbol }${ attr }</a>`;
    }

    buildStyles( brand ) {
        let styles = [];
        let backgroundColor = '';
        let textColor = '';

        if ( 'instagram' === brand ) {
            backgroundColor = wpzoom_rcb_settings_instagram_cta_bg_color;
            textColor = wpzoom_rcb_settings_instagram_cta_text_color;
        } else if ( 'pinterest' === brand ) {
            backgroundColor = wpzoom_rcb_settings_pinterest_cta_bg_color;
            textColor = wpzoom_rcb_settings_pinterest_cta_text_color;
        } else if ( 'facebook' === brand ) {
            backgroundColor = wpzoom_rcb_settings_facebook_cta_bg_color;
            textColor = wpzoom_rcb_settings_facebook_cta_text_color;
        }

        if ( '' !== backgroundColor ) {
            styles = {
                ...styles,
                'background-color': backgroundColor,
            };
        }
        if ( '' !== textColor ) {
            styles = {
                ...styles,
                color: textColor,
            };
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

    parseFacebookText( text ) {
        text = this.buildLink( facebookURL, '', __( 'Like us', 'wpzoom-recipe-card' ) );
        text += ' ' + __( 'on Facebook', 'wpzoom-recipe-card' );

        return ReactHtmlParser( text );
    }

    render() {
        return (
            <Fragment>
                {
                    '' !== igUsername &&
                    <div className="recipe-card-cta-instagram" style={ this.buildStyles( 'instagram' ) }>
                        <div className="cta-brand-icon"><i className="fab fa-instagram"></i></div>
                        <div className="cta-text-wrapper">
                            <h3 className="cta-text-title">{ igTitle }</h3>
                            <p className="cta-text-subtitle">{ this.parseInstagramText( igSubtitle ) }</p>
                        </div>
                    </div>
                }
                {
                    '' !== pinUsername &&
                    <div className="recipe-card-cta-pinterest" style={ this.buildStyles( 'pinterest' ) }>
                        <div className="cta-brand-icon"><i className="fab fa-pinterest"></i></div>
                        <div className="cta-text-wrapper">
                            <h3 className="cta-text-title">{ pinTitle }</h3>
                            <p className="cta-text-subtitle">{ this.parsePinterestText( pinSubtitle ) }</p>
                        </div>
                    </div>
                }
                {
                    '' !== facebookURL &&
                    <div className="recipe-card-cta-facebook" style={ this.buildStyles( 'facebook' ) }>
                        <div className="cta-brand-icon"><i className="fab fa-facebook"></i></div>
                        <div className="cta-text-wrapper">
                            <h3 className="cta-text-title">{ facebookTitle }</h3>
                            <p className="cta-text-subtitle">{ this.parseFacebookText( facebookSubtitle ) }</p>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}
