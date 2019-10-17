(function($){
    'use scrict';

    function analyzeAmounts( $recipe ) {
        var servings = parseInt( $recipe.find('.detail-item-adjustable-servings').data('original-servings') );

        if ( servings > 0 ) {
            $recipe.find('.ingredients-list .wpzoom-rcb-ingredient-amount').each(function(){
                // Do this only once
                if ( 0 === $(this).find('.wpzoom-rcb-adjustable').length ) {
                    var amount = $(this),
                        amountValue = amount.text();

                    amount.html('<span class="wpzoom-rcb-adjustable">' + amountValue + '</span>');
                }
            })

            $recipe.find('.wpzoom-rcb-adjustable').each(function() {
                // Do this only once
                if ( 'undefined' == typeof $(this).data('original-amount') ) {
                    var amount = parseAmount( $(this).text() );
                        amount /= servings;

                    $(this)
                        .data('original-amount', $(this).text())
                        .data('per-one-serving', amount);
                }
            })
        }
    }

    function updateServingSize( $recipe ) {
        var $servingsElement = $recipe.find('.detail-item-adjustable-servings'),
            servings = parseInt( $servingsElement.data('servings') ),
            originalServings = $servingsElement.data('original-servings');

        var $adjustableAmount = $recipe.find('.wpzoom-rcb-adjustable');
        
        if ( 0 == $adjustableAmount.length ) {
            analyzeAmounts( $recipe );
            $adjustableAmount = $recipe.find('.wpzoom-rcb-adjustable');
        }

        $adjustableAmount.each(function() {
            var amountElement = $(this);

            if ( servings == originalServings ) {
                amountElement.text( amountElement.data('original-amount') );
            }
            else {
                var amount = parseFloat( amountElement.data('per-one-serving') ) * servings;

                if ( !isNaN( amount ) ) {
                    amountElement.text( amount );
                }
            }
        })
    }

    function initTextField() {
        $(document).on('input change', 'input.detail-item-adjustable-servings', function() {
            var $servingsElement = $(this),
                servings = $servingsElement.val(),
                $recipe = $servingsElement.parents('#wpzoom-premium-recipe-card');

            $servingsElement.data('servings', servings);

            updateServingSize( $recipe );
        })
    }

    function parseAmount( amount ) {
        if ( undefined === amount ) {
            return;
        }

        // Use . for decimals
        amount = amount.replace(',', '.');

        if ( -1 === amount.indexOf('/') ) {
            return amount;
        }

        // Replace fraction characters with equivalent
        var fractionsRegex = /(\u00BC|\u00BD|\u00BE|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u2158|\u2159|\u215A|\u215B|\u215C|\u215D|\u215E)/;
        var fractionsMap = {
            '\u00BC': ' 1/4', '\u00BD': ' 1/2', '\u00BE': ' 3/4', '\u2150': ' 1/7',
            '\u2151': ' 1/9', '\u2152': ' 1/10', '\u2153': ' 1/3', '\u2154': ' 2/3',
            '\u2155': ' 1/5', '\u2156': ' 2/5', '\u2157': ' 3/5', '\u2158': ' 4/5',
            '\u2159': ' 1/6', '\u215A': ' 5/6', '\u215B': ' 1/8', '\u215C': ' 3/8',
            '\u215D': ' 5/8', '\u215E': ' 7/8'
        };
        amount = amount.replace(fractionsRegex, function(m, vf) {
            return fractionsMap[vf];
        });

        // Split by spaces
        amount = amount.trim();
        var parts = amount.split(' ');

        var result = false;

        if ( '' !== amount ) {
            result = 0;

            // Loop over parts and add values
            for ( var i = 0; i < parts.length; i++ ) {

                if ( '' !== parts[i].trim() ) {

                    var divisionParts = parts[i].split('/', 2);
                    var partAmount = parseFloat( divisionParts[0] );

                    if ( undefined !== divisionParts[1] ) {

                        var divisor = parseFloat( divisionParts[1] );

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

    $(document).ready(function () {
        $('.detail-item-adjustable-servings').each(function() {
            var $servingsElement = $(this),
                servings = $servingsElement.val();

            if ( servings > 0 ) {
                // Save original servings
                $servingsElement.data('servings', servings);
                $servingsElement.data('original-servings', servings);

                initTextField();
            }
        });
    })

})(jQuery);