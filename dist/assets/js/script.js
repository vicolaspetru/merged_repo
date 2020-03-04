( function( $, wpzoomRecipeCard ) {
    'use scrict';

    function wpzoom_set_servings_size_to_print_button() {
        var servings_size = $( document ).find( '.wpzoom-recipe-card-print-link .btn-print-link' ).data( 'servings-size' );
        $( document ).find( '.wp-block-wpzoom-recipe-card-block-print-recipe' ).data( 'servings-size', servings_size );
    }

    function wpzoom_print_recipe( recipe_ID, servings ) {
        const urlParts = wpzoomRecipeCard.homeURL.split( /\?(.+)/ );
        let printUrl = urlParts[0];

        if ( wpzoomRecipeCard.permalinks ) {
            printUrl += 'wpzoom_rcb_print/' + recipe_ID + '/';

            if ( urlParts[1] ) {
                printUrl += '?' + urlParts[1];
                printUrl += '&servings=' + servings;
            } else {
                printUrl += '?servings=' + servings;
            }
        } else {
            printUrl += '?wpzoom_rcb_print=' + recipe_ID;
            printUrl += '&servings=' + servings;

            if ( urlParts[1] ) {
                printUrl += '&' + urlParts[1];
            }
        }

        var print_window = window.open( printUrl, '_blank' );
        print_window.onload = function() {
            print_window.focus();
            print_window.document.title = document.title;
            print_window.history.pushState( '', 'Print Recipe', location.href.replace( location.hash, "" ) );

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

        $( ".wpzoom-recipe-card-print-link .btn-print-link, .wp-block-wpzoom-recipe-card-block-print-recipe" ).click( function( e ) {
            var recipe_ID = $( this ).data( 'recipe-id' ),
                servings = $( this ).data( 'servings-size' );

            if ( recipe_ID ) {
                e.preventDefault();

                wpzoom_print_recipe( recipe_ID, servings );
            }
        } );

    } );

} )( jQuery, wpzoomRecipeCard );