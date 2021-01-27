import jQuery from 'jquery';

( function( $ ) {
	'use scrict';

	function analyzeAmounts( $recipe ) {
		const servings = parseInt( $recipe.find( '.detail-item-adjustable-servings' ).data( 'original-servings' ) );

		if ( servings > 0 ) {
			$recipe.find( '.ingredients-list .wpzoom-rcb-ingredient-amount' ).each( function() {
				// Do this only once
				if ( 0 === $( this ).find( '.wpzoom-rcb-adjustable' ).length ) {
					const amount = $( this ),
						amountValue = amount.text();

					amount.html( '<span class="wpzoom-rcb-adjustable">' + amountValue + '</span>' );
				}
			} );

			$recipe.find( '.wpzoom-rcb-adjustable' ).each( function() {
				// Do this only once
				if ( 'undefined' === typeof $( this ).data( 'original-amount' ) ) {
					let amount = parseAmount( $( this ).text() );
					amount /= servings;

					let _amount = amount;

					if ( ! Number.isSafeInteger( amount ) ) {
						_amount = amount.toFixed( 2 );
					}

					$( this )
						.data( 'original-amount', $( this ).text() )
						.data( 'per-one-serving', _amount );
				}
			} );
		}
	}

	function updateServingSize( $recipe ) {
		const $servingsElement = $recipe.find( '.detail-item-adjustable-servings' ),
			servings = parseInt( $servingsElement.data( 'servings' ) ),
			originalServings = $servingsElement.data( 'original-servings' );

		let $adjustableAmount = $recipe.find( '.wpzoom-rcb-adjustable' );

		if ( 0 === $adjustableAmount.length ) {
			analyzeAmounts( $recipe );
			$adjustableAmount = $recipe.find( '.wpzoom-rcb-adjustable' );
		}

		$adjustableAmount.each( function() {
			const amountElement = $( this );

			if ( servings === originalServings ) {
				amountElement.text( amountElement.data( 'original-amount' ) );
			} else {
				const amount = parseFloat( amountElement.data( 'per-one-serving' ) ) * servings;
				let _amount = amount;

				if ( ! Number.isSafeInteger( amount ) ) {
					_amount = amount.toFixed( 2 );
				}

				if ( ! isNaN( _amount ) ) {
					amountElement.text( _amount );
				}
			}
		} );

		// Update print button attribute
		$( document ).find( '.btn-print-link, .wp-block-wpzoom-recipe-card-block-print-recipe' ).data( 'servings-size', servings );
	}

	function initTextField() {
		$( '<div class="adjustable-quantity-nav"><div class="adjustable-quantity-button adjustable-quantity-up">+</div><div class="adjustable-quantity-button adjustable-quantity-down">-</div></div>' ).insertAfter( '.adjustable-quantity input' );

		$( document ).on( 'input change', 'input.detail-item-adjustable-servings', function() {
			const $servingsElement = $( this ),
				servings = $servingsElement.val(),
				$recipe = $servingsElement.parents( '.wpzoom-recipe-card-block-adjustable-servings' );

			$servingsElement.data( 'servings', servings );

			updateServingSize( $recipe );
		} );
	}

	function parseAmount( amount ) {
		if ( undefined === amount ) {
			return;
		}

		// Use . for decimals
		amount = amount.replace( ',', '.' );

		if ( -1 === amount.indexOf( '/' ) ) {
			return amount;
		}

		// Replace fraction characters with equivalent
		const fractionsRegex = /(\u00BC|\u00BD|\u00BE|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u2158|\u2159|\u215A|\u215B|\u215C|\u215D|\u215E)/;
		const fractionsMap = {
			'\u00BC': ' 1/4', '\u00BD': ' 1/2', '\u00BE': ' 3/4', '\u2150': ' 1/7',
			'\u2151': ' 1/9', '\u2152': ' 1/10', '\u2153': ' 1/3', '\u2154': ' 2/3',
			'\u2155': ' 1/5', '\u2156': ' 2/5', '\u2157': ' 3/5', '\u2158': ' 4/5',
			'\u2159': ' 1/6', '\u215A': ' 5/6', '\u215B': ' 1/8', '\u215C': ' 3/8',
			'\u215D': ' 5/8', '\u215E': ' 7/8',
		};
		amount = amount.replace( fractionsRegex, function( m, vf ) {
			return fractionsMap[ vf ];
		} );

		// Split by spaces
		amount = amount.trim();
		const parts = amount.split( ' ' );

		let result = false;

		if ( '' !== amount ) {
			result = 0;

			// Loop over parts and add values
			for ( let i = 0; i < parts.length; i++ ) {
				if ( '' !== parts[ i ].trim() ) {
					const divisionParts = parts[ i ].split( '/', 2 );
					let partAmount = parseFloat( divisionParts[ 0 ] );

					if ( undefined !== divisionParts[ 1 ] ) {
						const divisor = parseFloat( divisionParts[ 1 ] );

						if ( 0 !== divisor ) {
							partAmount /= divisor;
						}
					}

					result += partAmount;
				}
			}
		}

		return result;
	}

	function buttonQuantityIncrementers() {
		$( '.adjustable-quantity' ).each( function() {
			const $spinner = $( this ),
				$input = $spinner.find( 'input[type="number"]' ),
				$btnUp = $spinner.find( '.adjustable-quantity-up' ),
				$btnDown = $spinner.find( '.adjustable-quantity-down' ),
				min = $input.attr( 'min' ),
				max = $input.attr( 'max' );

			$btnUp.click( function() {
				const oldValue = parseFloat( $input.val() );
				let newVal;

				if ( oldValue >= max ) {
					newVal = oldValue;
				} else {
					newVal = oldValue + 1;
				}
				$spinner.find( 'input' ).val( newVal );
				$spinner.find( 'input' ).trigger( 'change' );
				$spinner.parent().find( '.only-print-visible' ).text( newVal );
			} );

			$btnDown.click( function() {
				const oldValue = parseFloat( $input.val() );
				let newVal;

				if ( oldValue <= min ) {
					newVal = oldValue;
				} else {
					newVal = oldValue - 1;
				}
				$spinner.find( 'input' ).val( newVal );
				$spinner.find( 'input' ).trigger( 'change' );
				$spinner.parent().find( '.only-print-visible' ).text( newVal );
			} );
		} );
	}

	window.setPrintServings = ( servings ) => {
		if ( servings > 0 ) {
			const $recipe = $( document ).find( '.wpzoom-rcb-print' );

			$( '.detail-item-adjustable-servings' ).each( function() {
				$( this ).text( servings );
				$( this ).data( 'servings', servings );
				$( this ).parents( '.detail-item' ).find( 'p.detail-item-value.only-print-visible' ).text( servings );
			} );

			updateServingSize( $recipe );
		}
	};

	$( document ).ready( function() {
		$( '.detail-item-adjustable-servings' ).each( function() {
			const $servingsElement = $( this ),
				servings = $servingsElement.val();

			if ( servings > 0 ) {
				// Save original servings
				$servingsElement.data( 'servings', servings );
				$servingsElement.data( 'original-servings', servings );

				initTextField();
				buttonQuantityIncrementers();
			}
		} );
	} );
}( jQuery ) );
