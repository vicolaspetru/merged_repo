/*global WPZOOM_Settings*/

import jQuery from 'jquery';

jQuery( document ).ready( function() {
	( function( $, Settings ) {
		$( '.wp-tab-bar a' ).click( function( event ) {
			event.preventDefault();

			const href = $( this ).attr( 'href' );
			const queryArgs = getUrlVars( href );
			const context = $( this ).closest( '.wp-tab-bar' ).parent(); // Limit effect to the container element.

			$( '.wp-tab-bar li', context ).removeClass( 'wp-tab-active' );
			$( this ).closest( 'li' ).addClass( 'wp-tab-active' );
			$( '.wp-tab-panel', context ).hide();
			$( '#' + queryArgs.tab, context ).show();

			// Change url depending by active tab
			window.history.pushState( '', '', href );
		} );

		// Make setting wp-tab-active optional.
		$( '.wp-tab-bar' ).each( function() {
			if ( $( '.wp-tab-active', this ).length ) {
				$( '.wp-tab-active', this ).click();
			} else {
				$( 'a', this ).first().click();
			}
		} );

		// reset settings to defaults
		$( '#wpzoom_rcb_reset_settings' ).click( function() {
			const data = {
				security: Settings.ajax_nonce,
				action: 'wpzoom_reset_settings',
			};

			// eslint-disable-next-line no-alert
			if ( window.confirm( 'Do you really want to Reset all settings to default?' ) ) {
				$.post( Settings.ajaxUrl, data, function( response ) {
					if ( response.success ) {
						const queryArgs = getUrlVars( window.location.href );

						if ( queryArgs.length > 0 ) {
							window.location.href = window.location.href + '&wpzoom_reset_settings=1';
						} else {
							window.location.href = window.location.href + '?wpzoom_reset_settings=1';
						}
					} else {
						// eslint-disable-next-line no-alert
						alert( 'Something went wrong when tried to reset the settings!' );
					}
				} );
			}
		} );

		// Reset Ratings to zero
		$( '#wpzoom_rcb_settings_reset_ratings' ).click( function() {
			const data = {
				security: Settings.ajax_nonce,
				action: 'wpzoom_reset_ratings',
			};
			const $this = $( this );

			// eslint-disable-next-line no-alert
			if ( window.confirm( 'Do you really want to Reset all ratings?' ) ) {
				$this.val( 'Loading...' );

				$.post( Settings.ajaxUrl, data, function( response ) {
					if ( response.success ) {
						$this.val( 'Done!' );
						$this.prop( 'disabled', true );
						$this.next().html( response.data.message );
					}
				} );
			}
		} );

		// close Welcome banner
		$( '.wpzoom-rcb-welcome-close' ).click( function( e ) {
			e.preventDefault();

			const banner = $( this ).attr( 'href' );
			const data = {
				security: Settings.ajax_nonce,
				action: 'wpzoom_welcome_banner_close',
			};

			$( banner ).fadeOut();

			$.post( Settings.ajaxUrl, data, function( response ) {
				if ( ! response.success ) {
					// eslint-disable-next-line no-alert
					alert( 'Something went wrong!' );
				}
			} );
		} );

		function getUrlVars( $url ) {
			const vars = [];
			let hash;
			const hashes = $url.slice( $url.indexOf( '?' ) + 1 ).split( '&' );
			for ( let i = 0; i < hashes.length; i++ ) {
				hash = hashes[ i ].split( '=' );
				vars.push( hash[ 0 ] );
				vars[ hash[ 0 ] ] = hash[ 1 ];
			}
			return vars;
		}

		// setting field preview
		$( '.wpzoom-rcb-field-preview' ).each( function() {
			const $this = $( this ),
				$field = $( this ).parents( 'fieldset' );
			const thumbnail = $( this ).data( 'preview-thumbnail' ),
				position = $( this ).data( 'preview-position' );

			$( this ).on( 'mouseover', function() {
				if ( $this.hasClass( 'active' ) ) {
					$this.removeClass( 'active' );
					$field.find( '.wpzoom-rcb-field-preview-thumbnail' ).remove();
					return;
				}

				$this.addClass( 'active' );
				$field.append( '<span class="wpzoom-rcb-field-preview-thumbnail preview-position-' + position + '"><img src="' + thumbnail + '" width="400" height="300"></span>' );

				$( '.wpzoom-rcb-field-preview' ).not( this ).parent().find( '.wpzoom-rcb-field-preview-thumbnail' ).remove();
				$( '.wpzoom-rcb-field-preview' ).not( this ).removeClass( 'active' );
			} );

			$( this ).on( 'mouseout', function() {
				if ( $this.hasClass( 'active' ) ) {
					$this.removeClass( 'active' );
					$field.find( '.wpzoom-rcb-field-preview-thumbnail' ).remove();
				}
			} );
		} );

		// Add Color Picker to all inputs that have 'color-field' class
		$( '.wpzoom-rcb-color-picker' ).wpColorPicker( {
			change( event, ui ) {
				const $this = $( this );
				setTimeout( function() {
					$this.val( ui.color.toString().toUpperCase() ); // uppercase color value
				}, 1 );
			},
			palettes: [ '#222222', '#FFA921', '#FF4E6A', '#B7C662' ],
		} );
	}( jQuery, WPZOOM_Settings ) );
} );
