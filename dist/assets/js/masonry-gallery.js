( function( $, wpzoomRecipeCard ) {
    'use scrict';

    const W = $( window );
    const B = $( 'body' );
    const D = $( document );

    let $gridGallery = $( '.direction-step-gallery' ),
        $grid = $( '.direction-step-gallery-grid[data-gallery-masonry-grid="true"]' ),
        desktopGridCol = $gridGallery.data( 'grid-columns' ),
        tabletGridCol = desktopGridCol > 2 ? 3 : 2,
        mobileGridCol = 2,
        gridGutter = 8;

    // Define breakpoints size
    const breakXLarge = 1080;
    const breakMobile = 480;

    function masonry( itemSelector, columnWidth ) {
        $grid.imagesLoaded( function() {
            const Masonry = $grid.masonry( {
                itemSelector,
                columnWidth,
                transitionDuration: '0.2s',
                percentPosition: true,
                gutter: gridGutter,
            } );

            Masonry.on( 'layoutComplete', function() {
                // Remove class `is-loading` and preloader div
                if ( $gridGallery.hasClass( 'is-loading' ) ) {
                    $gridGallery.removeClass( 'is-loading' );
                    $gridGallery.find( '.direction-step-gallery-preloader' ).remove();
                }
            } );
        } );
    }

    /**
     * Reform the masonry
     *
     * Rebuild the masonry grid on every resize and load event after making sure
     * all the images in the grid are completely loaded.
     */
    function rebuildMasonry() {
        const columnWidth = '.direction-step-gallery-item';

        /**
         * Change `columns` class name for parent element based on the columns
         * provided for big, medium, and small screen devices.
         */
        if ( W.width() >= breakXLarge ) {
            if ( ! $gridGallery.hasClass( `columns-${ desktopGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ tabletGridCol } columns-${ mobileGridCol }` );
                $gridGallery.addClass( `columns-${ desktopGridCol }` );
            }
        } else if ( W.width() < breakXLarge && W.width() >= breakMobile ) {
            if ( ! $gridGallery.hasClass( `columns-${ tabletGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ desktopGridCol } columns-${ mobileGridCol }` );
                $gridGallery.addClass( `columns-${ tabletGridCol }` );
            }
        } else {
            if ( ! $gridGallery.hasClass( `columns-${ mobileGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ desktopGridCol } columns-${ tabletGridCol }` );
                $gridGallery.addClass( `columns-${ mobileGridCol }` );
            }
        }

        masonry( '.direction-step-gallery-item', columnWidth );
    }

    window.rebuildPrintMasonry = ( print_window ) => {
        let $gridGallery = $( document ).find( '.direction-step-gallery' ),
            $grid = $( '.direction-step-gallery-grid[data-gallery-masonry-grid="true"]' ),
            gridCol = $gridGallery.data( 'grid-columns' );

        if ( ! $gridGallery.length ) {
            setTimeout( function() {
                print_window.print();
            }, 500 );

            print_window.onfocus = function() {
                setTimeout( function() {
                    print_window.close();
                }, 500 );
            };

            return;
        }

        $gridGallery.removeClass( `columns-${ gridCol }` ).addClass( 'columns-4' );

        $grid.imagesLoaded( function() {
            const PrintMasonry = $grid.masonry( {
                // disable initial layout
                initLayout: false,
                columnWidth: '.direction-step-gallery-item',
                percentPosition: true,
                gutter: 8,
            } );

            // bind event
            PrintMasonry.on( 'layoutComplete', function() {
                // Remove class `is-loading` and preloader div
                if ( $gridGallery.hasClass( 'is-loading' ) ) {
                    $gridGallery.removeClass( 'is-loading' );
                    $gridGallery.find( '.direction-step-gallery-preloader' ).remove();
                }

                setTimeout( function() {
                    print_window.print();
                }, 500 );

                print_window.onfocus = function() {
                    setTimeout( function() {
                        print_window.close();
                    }, 500 );
                };
            } );

            // trigger initial layout
            setTimeout( function() {
                PrintMasonry.masonry();
            }, 250 );
        } );
    };

    W.on( 'resize load', function() {
        rebuildMasonry();
    } );

    D.ready( function() {
        rebuildMasonry();
    } );
}( jQuery, wpzoomRecipeCard ) );
