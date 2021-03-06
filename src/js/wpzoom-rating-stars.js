/* global wpzoomRatingStars */

import jQuery from 'jquery';

jQuery( document ).ready( function() {
	const __slice = [].slice;

	( function( $, wpzoomRatingStars ) {
		// eslint-disable-next-line camelcase
		class WPZOOM_Rating_Star {
			constructor( $el, options ) {
				let i,
					_;
				const _this = this;

				this.$el = $el;
				this.defaults = {
					rating: this.$el.parent().data( 'rating' ),
					rating_total: this.$el.parent().data( 'rating-total' ),
					recipe_id: this.$el.parent().data( 'recipe-id' ),
					user_rating: void 0,
					numStars: 5,
					change( e, value ) { }, // eslint-disable-line no-unused-vars
				};
				this.options = $.extend( {}, this.defaults, options );
				const _ref = this.defaults;
				for ( i in _ref ) {
					_ = _ref[ i ]; // eslint-disable-line no-unused-vars
					if ( this.$el.data( i ) !== null ) {
						this.options[ i ] = this.$el.data( i );
					}
				}
				this.$el
					.next()
					.find( 'small.wpzoom-rating-average' )
					.html( this.options.rating );
				this.$el
					.next()
					.find( 'small.wpzoom-rating-total-votes' )
					.html( this.options.rating_total );
				this.syncRating();
				this.$el.on( 'mouseover.starrr', 'li', function( e ) {
					return _this.syncRating(
						_this.$el.find( 'li' ).index( e.currentTarget ) + 1
					);
				} );
				this.$el.on( 'mouseout.starrr', function() {
					return _this.syncRating();
				} );
				this.$el.on( 'click.starrr', 'li', function( e ) {
					const element = $( this );
					return _this.setRating(
						_this.$el.find( 'li' ).index( e.currentTarget ) + 1,
						element
					);
				} );
				this.$el.on( 'starrr:change', this.options.change );
			}
			setRating( rating, element ) {
				// prevent user multiple votes with same rating value
				if (
					element.parent().hasClass( 'wpzoom-recipe-user-rated' ) &&
                    parseInt( this.options.user_rating ) === rating
				) {
					return false;
				}

				const _this = this;
				const recipeId = this.options.recipe_id;
				let ratingAvg = this.options.rating,
					ratingTotal = this.options.rating_total;

				// store user rating
				this.options.user_rating = rating;

				const data = {
					action: 'wpzoom_user_vote_recipe',
					rating,
					recipe_id: recipeId,
					security: wpzoomRatingStars.ajax_nonce,
				};

				element
					.parents( '.wpzoom-rating-stars-container' )
					.addClass( 'is-loading' );

				$.post( wpzoomRatingStars.ajaxurl, data, function( response ) {
					const dataResponse = response.data;
					if ( response.success ) {
						ratingAvg = dataResponse.rating_avg;
						ratingTotal = dataResponse.rating_total;
						element
							.parent()
							.next()
							.find( 'small.wpzoom-rating-average' )
							.html( ratingAvg );
						element
							.parent()
							.data( 'rating', ratingAvg );
						element
							.parent()
							.next()
							.find( 'small.wpzoom-rating-total-votes' )
							.html( ratingTotal );
						element
							.parent()
							.data( 'rating-total', ratingTotal );
						element
							.parents( '.wpzoom-rating-stars-container' )
							.removeClass( 'is-loading' );

						if ( ! element.parent().hasClass( 'wpzoom-recipe-user-rated' ) ) {
							element
								.parent()
								.addClass( 'wpzoom-recipe-user-rated' );
						}
					} else {
						element
							.parents( '.wpzoom-rating-stars-container' )
							.removeClass( 'is-loading' );
						element
							.parents( '.wpzoom-rating-stars-container' )
							.attr( 'data-user-can-rate', '0' );
						element
							.parents( '.wpzoom-rating-stars-container' )
							.find( '.wpzoom-rating-stars-tooltip' )
							.html( dataResponse.message );
					}
				} ).done( function( response ) {
					const dataResponse = response.data;
					if ( response.success ) {
						_this.options.rating = dataResponse.rating_avg;
						_this.options.rating_total = dataResponse.rating_total;
						_this.syncRating();
						return _this.$el.trigger( 'starrr:change', dataResponse.rating_avg );
					}
				} );
			}
			syncRating( rating ) {
				let i, _i, _j, _ref;
				// Make sure we make full stars
				if ( rating ) {
					rating = parseFloat( rating );
				} else {
					rating = parseFloat( this.options.rating );
				}
				if ( rating ) {
					for (
						i = _i = 0, _ref = Math.round( rating );
						0 <= _ref ? _i <= _ref : _i >= _ref;
						i = 0 <= _ref ? ++_i : --_i
					) {
						this.$el
							.find( 'li' )
							.eq( i )
							.removeClass( 'far' )
							.addClass( 'fas' );
					}
				}
				if ( rating && rating < 5 ) {
					for (
						_ref = Math.round( rating ), i = _j = _ref;
						_ref <= 4 ? _j <= 4 : _j >= 4;
						i = _ref <= 4 ? ++_j : --_j
					) {
						this.$el
							.find( 'li' )
							.eq( i )
							.removeClass( 'fas' )
							.addClass( 'far' );
					}
				}
				if ( ! rating ) {
					return this.$el
						.find( 'li' )
						.removeClass( 'fas' )
						.addClass( 'far' );
				}
			}
		}

		return $.fn.extend( {
			starrr() {
				let args, option;

				// eslint-disable-next-line no-unused-expressions
				( option = arguments[ 0 ] ),
				( args = 2 <= arguments.length ? __slice.call( arguments, 1 ) : [] );
				return this.each( function() {
					let data;

					data = $( this ).data( 'star-rating' );
					if ( ! data ) {
						$( this ).data(
							'star-rating',
							( data = new WPZOOM_Rating_Star( $( this ), option ) )
						);
					}
					if ( typeof option === 'string' ) {
						return data[ option ].apply( data, args );
					}
				} );
			},
		} );
	}( jQuery, wpzoomRatingStars ) );

	jQuery( 'ul.wpzoom-rating-stars' ).starrr();
} );
