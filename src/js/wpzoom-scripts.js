/* global wpzoomRecipeCard */

import jQuery from 'jquery';

( function( $, wpzoomRecipeCard ) {
	'use scrict';

	function wpzoomSetServingsSizeToPrintButton() {
		const servingsSize = $( document ).find( '.wpzoom-recipe-card-print-link .btn-print-link' ).data( 'servings-size' );

		if ( servingsSize ) {
			$( document ).find( '.wp-block-wpzoom-recipe-card-block-print-recipe' ).data( 'servings-size', servingsSize );
		}
	}

	function wpzoomPrintRecipe( recipeID, servings, blockType, blockId ) {
		servings = servings || 0;
		blockType = blockType || 'recipe-card';
		blockId = blockId || 'wpzoom-premium-recipe-card';

		const urlParts = wpzoomRecipeCard.homeURL.split( /\?(.+)/ );
		let printUrl = urlParts[ 0 ];

		if ( wpzoomRecipeCard.permalinks ) {
			printUrl += 'wpzoom_rcb_print/' + recipeID + '/';

			if ( urlParts[ 1 ] ) {
				printUrl += '?' + urlParts[ 1 ];
				printUrl += '&block-type=' + blockType;
				printUrl += '&block-id=' + blockId;

				if ( servings ) {
					printUrl += '&servings=' + servings;
				}
			} else {
				printUrl += '?block-type=' + blockType;
				printUrl += '&block-id=' + blockId;

				if ( servings ) {
					printUrl += '&servings=' + servings;
				}
			}
		} else {
			printUrl += '?wpzoom_rcb_print=' + recipeID;
			printUrl += '&block-type=' + blockType;
			printUrl += '&block-id=' + blockId;

			if ( servings ) {
				printUrl += '&servings=' + servings;
			}

			if ( urlParts[ 1 ] ) {
				printUrl += '&' + urlParts[ 1 ];
			}
		}

		const printWindow = window.open( printUrl, '_blank' );
		printWindow.wpzoomRecipeCard = wpzoomRecipeCard;
		printWindow.onload = function() {
			printWindow.focus();
			printWindow.document.title = document.title;
			printWindow.history.pushState( '', 'Print Recipe', location.href.replace( location.hash, '' ) );
			printWindow.setPrintServings( servings );
			printWindow.rebuildPrintMasonry( printWindow );
		};
	}

	$( document ).ready( function() {
		wpzoomSetServingsSizeToPrintButton();

		$( '.wp-block-wpzoom-recipe-card-block-ingredients .ingredients-list li, .wp-block-wpzoom-recipe-card-block-recipe-card .ingredients-list li' ).click( function( e ) {
			// Don't do any actions if clicked on link
			if ( e.target.nodeName === 'A' ) {
				return;
			}
			$( this ).toggleClass( 'ticked' );
		} );

		let instances = 0;

		$( '.wp-block-wpzoom-recipe-card-block-ingredients .ingredients-list li, .wp-block-wpzoom-recipe-card-block-recipe-card .ingredients-list li' ).on( 'mouseover', function( e ) {
			const $ingredientName = $( this ).find( '.ingredient-item-name' );
			const hasStrikeThrough = $ingredientName.hasClass( 'is-strikethrough-active' );

			// Check if strikethrough is disabled
			if ( instances === 0 && ! hasStrikeThrough ) {
				instances = 0;
				return;
			}

			// Remove strike through if hover on link
			if ( e.target.nodeName === 'A' ) {
				$ingredientName.removeClass( 'is-strikethrough-active' );
			} else if ( ! hasStrikeThrough ) {
				$ingredientName.addClass( 'is-strikethrough-active' );
			}

			instances++;
		} );

		$( '.wpzoom-recipe-card-print-link .btn-print-link, .wp-block-wpzoom-recipe-card-block-print-recipe' ).each( function() {
			const $printBtn = $( this );

			$printBtn.on( 'click', function( e ) {
				const $this = $( this );
				const recipeID = $this.data( 'recipe-id' );
				const servings = $this.data( 'servings-size' );

				const isRecipeCardBlock = $this.parents( '.wp-block-wpzoom-recipe-card-block-recipe-card' ).length;
				const isIngredientsBlock = $this.parents( '.wp-block-wpzoom-recipe-card-block-ingredients' ).length;
				const isDirectionsBlock = $this.parents( '.wp-block-wpzoom-recipe-card-block-directions' ).length;
				const isSnippetButton = $this.hasClass( 'wp-block-wpzoom-recipe-card-block-print-recipe' );

				let blockType;
				let blockId;

				if ( isRecipeCardBlock ) {
					blockType = 'recipe-card';
					blockId = $this.parents( '.wp-block-wpzoom-recipe-card-block-recipe-card' ).attr( 'id' );
				} else if ( isIngredientsBlock ) {
					blockType = 'ingredients-block';
					blockId = $this.parents( '.wp-block-wpzoom-recipe-card-block-ingredients' ).attr( 'id' );
				} else if ( isDirectionsBlock ) {
					blockType = 'directions-block';
					blockId = $this.parents( '.wp-block-wpzoom-recipe-card-block-directions' ).attr( 'id' );
				} else if ( isSnippetButton ) {
					blockType = 'recipe-card';
					blockId = $this.attr( 'href' ).substr( 1, $this.attr( 'href' ).length );
				}

				if ( recipeID ) {
					e.preventDefault();
					wpzoomPrintRecipe( recipeID, servings, blockType, blockId );
				}
			} );
		} );

		$( '.recipe-card-image-popup-link' ).magnificPopup( {
			type: 'image',
			closeBtnInside: true,
		} );

		$( '.directions-list' ).magnificPopup( {
			delegate: '.direction-step .direction-step-image-popup-link',
			type: 'image',
			closeBtnInside: true,
			gallery: {
				enabled: true,
			},
		} );
	} );
}( jQuery, wpzoomRecipeCard ) );
