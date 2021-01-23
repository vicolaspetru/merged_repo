/*global ajaxurl*/

import jQuery from 'jquery';

( function( $ ) {
	const unapproveRating = function( el ) {
		if ( el.hasClass( 'unapproved' ) ) {
			el.find( 'span.approve a.approve' ).css( { 'pointer-events': '' } );
		}
	};

	const approveRating = function( el ) {
		if ( el.hasClass( 'approved' ) ) {
			el.find( 'span.unapprove a.unapprove' ).css( { 'pointer-events': '' } );
		}
	};

	const deleteRating = function( el ) {
		el.fadeOut( 300, function() {
			el.remove();
		} );
	};

	const getCount = function( el ) {
		const n = parseInt( el.html().replace( /[^0-9]+/g, '' ), 10 );
		if ( isNaN( n ) ) {
			return 0;
		}
		return n;
	};

	const updateCount = function( el, count ) {
		let n1 = '';
		if ( isNaN( count ) ) {
			return;
		}
		count = count < 1 ? '0' : count.toString();
		if ( count.length > 3 ) {
			while ( count.length > 3 ) {
				n1 = thousandsSeparator + count.substr( count.length - 3 ) + n1;
				count = count.substr( 0, count.length - 3 );
			}
			count = count + n1;
		}
		el.html( count );
	};

	const updatePending = function( diff ) {
		$( '#toplevel_page_wpzoom-recipe-card-settings span.pending-count' ).each( function() {
			const el = $( this );
			let count = getCount( el ) + diff;
			if ( count < 1 ) {
				count = 0;
			}
			el.closest( '.awaiting-mod' )[ 0 === count ? 'addClass' : 'removeClass' ]( 'count-0' );
			updateCount( el, count );
		} );
	};

	const getUrlArg = function( arg, url = '' ) {
		const results = new RegExp( '[\?&]' + arg + '=([^&#]*)' ).exec( url || window.location.search );
		return ( results !== null ) ? results[ 1 ] || 0 : false;
	};

	const ajaxAction = function( data, el ) {
		$.post( ajaxurl, data, function( r ) {
			const elementId = el.attr( 'id' ),
				$element = $( '#' + elementId );
			let diff;

			if ( r.success ) {
				if ( data.action === 'approverating' ) {
					approveRating( $element );
					diff = $element.is( '.approved' ) ? -1 : 1;
				} else if ( data.action === 'unapproverating' ) {
					unapproveRating( $element );
					diff = $element.is( '.unapproved' ) ? 1 : -1;
				} else if ( data.action === 'deleterating' ) {
					deleteRating( $element );
					diff = $element.is( '.negative-diff' ) ? -1 : 0;
				}
				updatePending( diff );
			}
		} );
	};

	$( document ).ready( function() {
		$( document ).on( 'click', '.user-rating span.unapprove a.unapprove, .user-rating span.approve a.approve, .user-rating span.delete a.delete', function( e ) {
			e.preventDefault();

			const el = $( this ),
				url = el.attr( 'href' ),
				id = getUrlArg( 'id', url ),
				action = getUrlArg( 'action', url ),
				postId = getUrlArg( 'post', url ),
				userId = getUrlArg( 'user', url ),
				userIp = getUrlArg( 'ip', url ),
				rating = getUrlArg( 'rating', url ),
				date = getUrlArg( 'date', url ),
				time = getUrlArg( 'time', url ),
				postName = el.parents( '.column-comment' ).next().find( 'a.comments-edit-item-link' ).html(),
				nonce = getUrlArg( '_wpnonce', url );

			const $element = el.closest( 'tr.user-rating' );
			const bg = $element.hasClass( 'unapproved' ) ? '#FFFFE0' : $element.css( 'backgroundColor' );

			const data = {
				action,
				id,
				postId,
				userId,
				userIp,
				rating,
				date,
				time,
				nonce,
			};

			// eslint-disable-next-line no-alert
			if ( 'deleterating' === action && window.confirm( `Do you really want to Delete rating for ${ postName }?` ) ) {
				$element.find( 'span.delete a.delete' ).css( { 'pointer-events': 'none' } );
				if ( $element.is( '.unapproved' ) ) {
					$element.addClass( 'negative-diff' );
				}
				$element.removeClass( 'approved unapproved' )
					.animate( { backgroundColor: '#FAAFAA' }, 300 );
				ajaxAction( data, $element );
			}
			if ( 'approverating' === action ) {
				$element.find( 'span.unapprove a.unapprove' ).css( { 'pointer-events': 'none' } );
				$element.animate( { backgroundColor: '#CCEEBB' }, 300 )
					.animate( { backgroundColor: '' }, 300 )
					.removeClass( 'unapproved' ).addClass( 'approved' );

				ajaxAction( data, $element );
			}
			if ( 'unapproverating' === action ) {
				$element.find( 'span.approve a.approve' ).css( { 'pointer-events': 'none' } );
				$element.animate( { backgroundColor: '#CCEEBB' }, 300 )
					.animate( { backgroundColor: bg }, 300 )
					.removeClass( 'approved' ).addClass( 'unapproved' );

				ajaxAction( data, $element );
			}
		} );
	} );
}( jQuery ) );
