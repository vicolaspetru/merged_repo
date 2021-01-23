import jQuery from 'jquery';

jQuery( document ).ready( function( $ ) {
	const ratings = $( '.wpzoom-rcb-comment-rating-stars' );
	const selectedClass = 'fas';

	function toggleStyles( currentInput, stars ) {
		const thisInput = $( currentInput );
		const index = parseInt( thisInput.val() );

		stars.removeClass( selectedClass );
		stars.slice( 0, index + 1 ).addClass( selectedClass );
	}

	// If the ratings exist on the page
	if ( ratings.length !== 0 ) {
		const inputs = ratings.find( 'input[type="radio"]' );
		const labels = ratings.find( 'label' );
		const stars = inputs.next();

		inputs.on( 'change', function( event ) {
			toggleStyles( event.target, stars );
		} );

		labels.hover( function( event ) {
			const $curInput = $( event.currentTarget ).find( 'input' );
			toggleStyles( $curInput, stars );
		}, function() {
			const $currentSelected = ratings.find( 'input[type="radio"]:checked' );
			toggleStyles( $currentSelected, stars );
		} );
	}
} );
