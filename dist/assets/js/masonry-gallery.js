( function( $ ) {
    'use scrict';

    const W = $( window );
    const B = $( 'body' );
    const D = $( document );

    var $gridGallery = $( '.direction-step-gallery' ),
        $grid = $( '.direction-step-gallery-grid' ),
        desktopGridCol = $gridGallery.data( 'grid-columns' ),
        tabletGridCol = desktopGridCol > 2 ? 3 : 2,
        mobileGridCol = 2,
        gridGutter = 8;

    // Define breakpoints size
    const breakXLarge = 1080;
    const breakMobile = 480;

    function masonry( event, itemSelector, columnWidth ) {
        $grid.imagesLoaded( function() {
            var Masonry = $grid.masonry( {
                itemSelector,
                columnWidth,
                percentPosition: true,
                gutter: gridGutter
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
    function rebuildMasonry( event ) {
        const columnWidth = '.direction-step-gallery-item';

        if ( event === 'ready' ) {
            $gridGallery.addClass( 'is-loading' );
            $gridGallery.append( '<div class="direction-step-gallery-preloader">Loading gallery media...</div>' );
        }

        /**
         * Change `columns` class name for parent element based on the columns
         * provided for big, medium, and small screen devices.
         */
        if ( W.width() >= breakXLarge ) {
            if ( ! $gridGallery.hasClass( `columns-${ desktopGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ tabletGridCol } columns-${ mobileGridCol }` );
                $gridGallery.addClass( `columns-${ desktopGridCol }` );
            }
        }
        else if ( W.width() < breakXLarge && W.width() >= breakMobile ) {
            if ( ! $gridGallery.hasClass( `columns-${ tabletGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ desktopGridCol } columns-${ mobileGridCol }` );
                $gridGallery.addClass( `columns-${ tabletGridCol }` );
            }
        }
        else {
            if ( ! $gridGallery.hasClass( `columns-${ mobileGridCol }` ) ) {
                $gridGallery.removeClass( `columns-${ desktopGridCol } columns-${ tabletGridCol }` );
                $gridGallery.addClass( `columns-${ mobileGridCol }` );
            }
        }

        masonry( event, '.direction-step-gallery-item', columnWidth );
    }

    W.on( 'resize load', function() {
        rebuildMasonry( 'resize load' );
    } );

    D.ready( function () {
        rebuildMasonry( 'ready' );
    } );

} )( jQuery );