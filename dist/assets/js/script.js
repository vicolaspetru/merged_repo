( function( $, wpzoomRecipeCard ) {
    'use scrict';

    function wpzoom_set_servings_size_to_print_button() {
        const servings_size = $( document ).find( '.wpzoom-recipe-card-print-link .btn-print-link' ).data( 'servings-size' );

        if ( servings_size ) {
            $( document ).find( '.wp-block-wpzoom-recipe-card-block-print-recipe' ).data( 'servings-size', servings_size );
        }
    }

    function wpzoom_print_recipe( recipeID, servings, blockType, blockId ) {
        servings = servings || 0;
        blockType = blockType || 'recipe-card';
        blockId = blockId || 'wpzoom-premium-recipe-card';

        const urlParts = wpzoomRecipeCard.homeURL.split( /\?(.+)/ );
        let printUrl = urlParts[0];

        if ( wpzoomRecipeCard.permalinks ) {
            printUrl += 'wpzoom_rcb_print/' + recipeID + '/';

            if ( urlParts[1] ) {
                printUrl += '?' + urlParts[1];
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

            if ( urlParts[1] ) {
                printUrl += '&' + urlParts[1];
            }
        }

        var print_window = window.open( printUrl, '_blank' );
        print_window.onload = function() {
            print_window.focus();
            print_window.document.title = document.title;
            print_window.history.pushState( '', 'Print Recipe', location.href.replace( location.hash, "" ) );
            print_window.setPrintServings( servings );

            setTimeout( function() {
                print_window.print();
            }, 250 );

            print_window.onfocus = function() {
                setTimeout( function() {
                    print_window.close();
                }, 250 );
            }
        };
    }

    $( document ).ready( function () {

        wpzoom_set_servings_size_to_print_button();

        $( ".wp-block-wpzoom-recipe-card-block-ingredients .ingredients-list li, .wp-block-wpzoom-recipe-card-block-recipe-card .ingredients-list li" ).click( function() {
            $( this ).toggleClass( "ticked" );
        } );

        $( ".wpzoom-recipe-card-print-link .btn-print-link, .wp-block-wpzoom-recipe-card-block-print-recipe" ).each( function() {
            const $printBtn = $( this );

            $printBtn.on( 'click', function( e ) {
                const recipeID = $( this ).data( 'recipe-id' );
                const servings = $( this ).data( 'servings-size' );

                const isRecipeCardBlock = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-recipe-card' ).length;
                const isIngredientsBlock = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-ingredients' ).length;
                const isDirectionsBlock = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-directions' ).length;

                let blockType;
                let blockId;

                if ( isRecipeCardBlock ) {
                    blockType = 'recipe-card';
                    blockId = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-recipe-card' ).attr( 'id' );
                }
                else if ( isIngredientsBlock ) {
                    blockType = 'ingredients-block';
                    blockId = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-ingredients' ).attr( 'id' );
                }
                else if ( isDirectionsBlock ) {
                    blockType = 'directions-block';
                    blockId = $( this ).parents( '.wp-block-wpzoom-recipe-card-block-directions' ).attr( 'id' );
                }

                if ( recipeID ) {
                    e.preventDefault();
                    wpzoom_print_recipe( recipeID, servings, blockType, blockId );
                }
            } )
        } );

    } );

} )( jQuery, wpzoomRecipeCard );