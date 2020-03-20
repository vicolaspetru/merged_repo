( function( $ ) {
    'use scrict';

    var body = $( 'body' ),
        grid = $( '.direction-step-gallery-grid' ),
        gridCell = $( '.direction-step-gallery-item' ),
        gridGallery = $( '.direction-step-gallery' ),
        desktopGridCol = gridGallery.data( 'grid-columns' ),
        tabletGridCol = desktopGridCol > 2 ? 3 : 2,
        mobileGridCol = 2,
        gridGutter = 8;

    // Define breakpoints size
    const breakXLarge = 1080;
    const breakMobile = 480;

    /**
     * Calculate the masonry
     *
     * Calculate the average of heights of masonry-bricks and then
     * set it as the height of the masonry element.
     *
     * @param grid       Object  The Masonry Element
     * @param gridCell   Object  The Masonry bricks
     * @param gridGutter Integer The Vertical Space between bricks
     * @param dGridCol   Integer Number of columns on big screens
     * @param tGridCol   Integer Number of columns on medium-sized screens
     * @param mGridCol   Integer Number of columns on small screens
     */
    function masonry( grid, gridCell, gridGutter, dGridCol, tGridCol, mGridCol ) {
        var gcLength = gridCell.length, // Total number of cells in the masonry
            gWidth = grid.outerWidth(),
            gHeight = 0, // Initial height of our masonry
            perCol = 1; // Initial gutter size

        /**
         * Change `columns` class name for parent element based on the columns
         * provided for big, medium, and small screen devices.
         */
        if ( body.width() >= breakXLarge ) {
            gridGallery.removeClass( `columns-${ dGridCol } columns-${ tGridCol } columns-${ mGridCol }` );
            gridGallery.addClass( `columns-${ dGridCol }` );
        }
        else if ( body.width() < breakXLarge && body.width() >= breakMobile ) {
            gridGallery.removeClass( `columns-${ dGridCol } columns-${ tGridCol } columns-${ mGridCol }` );
            gridGallery.addClass( `columns-${ tGridCol }` );
        }
        else {
            gridGallery.removeClass( `columns-${ dGridCol } columns-${ tGridCol } columns-${ mGridCol }` );
            gridGallery.addClass( `columns-${ mGridCol }` );
        }

        // Calculate the net height of all the cells in the masonry
        $.each( gridCell, function( key, item ) {
            gHeight += $( item ).outerHeight() + parseInt( gridGutter );
        } )

        /*
         * Calculate and set the masonry height based on the columns
         * provided for big, medium, and small screen devices.
         */
        if ( body.width() >= breakXLarge ) {
            perCol = Math.round( gcLength / dGridCol );
            grid.height( gHeight / dGridCol + ( gWidth / dGridCol / perCol ) + gridGutter * perCol );
        }
        else if ( body.width() < breakXLarge && body.width() >= breakMobile ) {
            perCol = Math.round( gcLength / tGridCol );
            grid.height( gHeight / tGridCol + ( gWidth / tGridCol / perCol ) + gridGutter * perCol );
        }
        else {
            perCol = Math.round( gcLength / mGridCol );
            grid.height( gHeight / mGridCol + ( gWidth / mGridCol / perCol ) + gridGutter * perCol );
        }
    }

    /**
     * Reform the masonry
     *
     * Rebuild the masonry grid on every resize and load event after making sure
     * all the images in the grid are completely loaded.
     */
    function rebuildMasonry() {
        // Insert preloader text dynamically
        gridGallery.addClass( 'is-loading' );
        gridGallery.append( '<div class="direction-step-gallery-preloader">Loading gallery media...</div>' );

        // Grab the pointer to the masonry preloader
        var masonryPreloader = $( document ).find( '.direction-step-gallery-preloader' );

        // Call masonry function every time the window is loaded or resized
        $( window ).on( 'resize load', function() {
            // Check if all the images finished loading
            grid.imagesLoaded( function() {
                var gcLength = gridCell.length;

                // Show the masonry, as it is loaded now
                gridGallery.removeClass( 'is-loading' );

                // Remove the preloader, as it is not needed anymore
                masonryPreloader.remove();

                /*
                 * A maonsry grid with 8px gutter, with 3 columns on desktop,
                 * 3 on tablet, and 2 column on mobile devices.
                 */
                if ( desktopGridCol < gcLength ) {
                    masonry( grid, gridCell, gridGutter, desktopGridCol, tabletGridCol, mobileGridCol );
                }
            } );
        } );
    }

    $( document ).ready( function () {
        rebuildMasonry();
    } );

} )( jQuery );