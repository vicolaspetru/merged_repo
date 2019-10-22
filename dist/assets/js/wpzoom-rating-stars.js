jQuery(document).ready(function () {
    var __slice = [].slice;

    (function ($, wpzoomRatingStars) {
        class WPZOOM_Rating_Star {
            constructor($el, options) {
                var i,
                    _,
                    _ref,
                    _this = this;
                this.defaults = {
                    rating: void 0,
                    rating_total: void 0,
                    numStars: 5,
                    change: function (e, value) { }
                };
                this.options = $.extend({}, this.defaults, options);
                this.$el = $el;
                _ref = this.defaults;
                for (i in _ref) {
                    _ = _ref[i];
                    if (this.$el.data(i) != null) {
                        this.options[i] = this.$el.data(i);
                    }
                }
                if (wpzoomRatingStars.user_rated) {
                    this.$el.addClass("wpzoom-recipe-user-rated");
                }
                this.$el
                    .next()
                    .find("small.wpzoom-rating-average")
                    .html(this.options.rating);
                this.$el
                    .next()
                    .find("small.wpzoom-rating-total-votes")
                    .html(this.options.rating_total);
                this.syncRating();
                this.$el.on("mouseover.starrr", "li", function (e) {
                    return _this.syncRating(
                        _this.$el.find("li").index(e.currentTarget) + 1
                    );
                });
                this.$el.on("mouseout.starrr", function () {
                    return _this.syncRating();
                });
                this.$el.on("click.starrr", "li", function (e) {
                    var element = $(this);
                    return _this.setRating(
                        _this.$el.find("li").index(e.currentTarget) + 1,
                        element
                    );
                });
                this.$el.on("starrr:change", this.options.change);
            }
            setRating (rating, element) {
                // prevent user multiple votes with same rating value
                if (
                    wpzoomRatingStars.user_rated &&
                    parseInt(this.options.rating) === rating
                ) {
                    return false;
                }
                var _this = this,
                    rating_avg = wpzoomRatingStars.rating_average,
                    rating_total = wpzoomRatingStars.rating_total;
                var data = {
                    action: "wpzoom_user_rate_recipe",
                    rating: rating,
                    recipe_id: wpzoomRatingStars.recipe_ID,
                    security: wpzoomRatingStars.ajax_nonce
                };
                element
                    .parents(".wpzoom-rating-stars-container")
                    .addClass("is-loading");
                $.post(wpzoomRatingStars.ajaxurl, data, function (response) {
                    var data = response.data;
                    if (response.success) {
                        rating_avg = data.rating_avg;
                        rating_total = data.rating_total;
                        element
                            .parent()
                            .next()
                            .find("small.wpzoom-rating-average")
                            .html(rating_avg);
                        element
                            .parent()
                            .next()
                            .find("small.wpzoom-rating-total-votes")
                            .html(rating_total);
                        element
                            .parents(".wpzoom-rating-stars-container")
                            .removeClass("is-loading");
                    } else {
                        element
                            .parents(".wpzoom-rating-stars-container")
                            .removeClass("is-loading");
                        element
                            .parents(".wpzoom-rating-stars-container")
                            .attr("data-user-can-rate", "0");
                        element
                            .parents(".wpzoom-rating-stars-container")
                            .find(".wpzoom-rating-stars-tooltip")
                            .html(data.message);
                    }
                }).done(function (response) {
                    var data = response.data;
                    if (response.success) {
                        _this.options.rating = data.rating_avg;
                        _this.options.rating_total = data.rating_total;
                        _this.syncRating();
                        return _this.$el.trigger("starrr:change", data.rating_avg);
                    }
                });
            }
            syncRating (rating) {
                var i, _i, _j, _ref;
                // Make sure we make full stars
                if (rating) {
                    rating = parseFloat(rating);
                } else {
                    rating = parseFloat(this.options.rating);
                }
                // add class if user has rated
                if (wpzoomRatingStars.user_rated) {
                    this.$el.addClass("wpzoom-recipe-user-rated");
                }
                if (rating) {
                    for (
                        i = _i = 0, _ref = rating;
                        0 <= _ref ? _i <= _ref : _i >= _ref;
                        i = 0 <= _ref ? ++_i : --_i
                    ) {
                        this.$el
                            .find("li")
                            .eq(i)
                            .removeClass("far")
                            .addClass("fas");
                    }
                }
                if (rating && rating < 5) {
                    for (
                        i = _j = rating;
                        rating <= 4 ? _j <= 4 : _j >= 4;
                        i = rating <= 4 ? ++_j : --_j
                    ) {
                        this.$el
                            .find("li")
                            .eq(i)
                            .removeClass("fas")
                            .addClass("far");
                    }
                }
                if (!rating) {
                    return this.$el
                        .find("li")
                        .removeClass("fas")
                        .addClass("far");
                }
            }
        }

        return $.fn.extend({
            starrr: function () {
                var args, option;

                (option = arguments[0]),
                    (args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
                return this.each(function () {
                    var data;

                    data = $(this).data("star-rating");
                    if (!data) {
                        $(this).data(
                            "star-rating",
                            (data = new WPZOOM_Rating_Star($(this), option))
                        );
                    }
                    if (typeof option === "string") {
                        return data[option].apply(data, args);
                    }
                });
            }
        });
    })(jQuery, wpzoomRatingStars);

    jQuery("ul.wpzoom-rating-stars").starrr({
        rating: wpzoomRatingStars.rating_average,
        rating_total: wpzoomRatingStars.rating_total
    });
});
