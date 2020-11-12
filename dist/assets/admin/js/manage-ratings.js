/*global ajaxurl*/
( function( $ ) {
    unapproveRating = function( el ) {
        return 1;
    };

    approveRating = function( el ) {
        return 2;
    };

    deleteRating = function( el ) {
        return 3;
    };

    getUrlArg = function( arg, url = '' ) {
        const results = new RegExp( '[\?&]' + arg + '=([^&#]*)' ).exec( url || window.location.search );
        return ( results !== null ) ? results[ 1 ] || 0 : false;
    };

    ajaxAction = function( data ) {
        $.post( ajaxurl, data, function( r ) {
            console.log( r );
        } );
    };

    $( document ).ready( function() {
        $( document ).on( 'click', '.user-rating span.unapprove a.unapprove, .user-rating span.approve a.approve, .user-rating span.delete a.delete', function( e ) {
            e.preventDefault();

            let el = $( this ),
                url = el.attr( 'href' ),
                action = getUrlArg( 'action', url ),
                postId = getUrlArg( 'post', url ),
                userId = getUrlArg( 'user', url ),
                userIp = getUrlArg( 'ip', url ),
                rating = getUrlArg( 'rating', url ),
                date = getUrlArg( 'date', url ),
                time = getUrlArg( 'time', url ),
                postName = el.parents( '.column-comment' ).next().find( 'a.comments-edit-item-link' ).html(),
                nonce = getUrlArg( '_wpnonce', url );

            const data = {
                action,
                postId,
                userId,
                userIp,
                rating,
                date,
                time,
                nonce,
            };

            if ( 'deleterating' === action && window.confirm( `Do you really want to Delete rating for ${ postName }?` ) ) {
                ajaxAction( data );
            }
            if ( 'approverating' === action || 'unapproverating' === action ) {
                ajaxAction( data );
            }
        } );
    } );
}( jQuery ) );
