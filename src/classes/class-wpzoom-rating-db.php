<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Rating DB class
 *
 * @since 3.0.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

class WPZOOM_Rating_DB {
    /**
     * The version of the rating database table.
     * 
     * @access private
     * @var string $version
     */
    private static $version = '1.0';

    /**
     * The fields in the rating database.
     * 
     * @access private
     * @var array $fields
     */
    private static $fields = array( 'id', 'recipe_id', 'user_id', 'comment_id', 'rating', 'rate_date', 'update_date', 'ip', 'approved' );

    /**
     * Register actions and filters.
     */
    public static function init() {
        add_action( 'plugins_loaded', array( __CLASS__, 'compare_database_version' ), 1 );
    }

    /**
     * Compare the database version.
     * If the $current_version is lower than $version then update database version
     */
    public static function compare_database_version() {
        $current_version = get_option( 'wpzoom_rcb_rating_db_version', '0.0' );

        if ( version_compare( $current_version, self::$version ) < 0 ) {
            self::create_or_update_database( $current_version );
        }
    }

    /**
     * Get the prefixed name of rating database table.
     */
    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'wpzoom_rating_stars';
    }

    /**
     * Create or update the rating database.
     * 
     * @param mixed $from Database version to update from.
     */
    public static function create_or_update_database( $from ) {
        global $wpdb;

        $table_name = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();
        $drop_deprecated_indexes = get_option( 'wpzoom_rcb_rating_db_drop_deprecated_indexes', false );

        if ( ! $drop_deprecated_indexes ) {
            self::drop_deprecated_indexes( $table_name, array( 'post_user' ) );
        }

        $sql = "CREATE TABLE `$table_name` (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            recipe_id bigint(20) unsigned NOT NULL,
            user_id bigint(20) unsigned NOT NULL DEFAULT '0',
            comment_id bigint(20) unsigned NOT NULL,
            post_id bigint(20) unsigned NOT NULL,
            rating tinyint(1) DEFAULT '0' NOT NULL,
            rate_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            update_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            ip varchar(39) DEFAULT '' NOT NULL,
            approved tinyint(1) DEFAULT '1' NOT NULL,
            PRIMARY KEY (id),
            KEY recipe_id (recipe_id),
            KEY post_id (post_id),
            KEY comment_id (comment_id)
            KEY rate_date (rate_date),
        ) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );

        update_option( 'wpzoom_rcb_rating_db_version', self::$version );
    }

    public static function drop_deprecated_indexes( $table_name, $indexes ) {
        global $wpdb;

        $drop_index = '';
        $loop = 1;

        foreach ( $indexes as $index ) {
            if ( $loop < count( $indexes ) ) {
                $drop_index .= "DROP INDEX `$index`, ";
            } else {
                $drop_index .= "DROP INDEX `$index`";
            }
            $loop++;
        }

        if ( empty( $drop_index ) ) {
            return false;
        }

        $sql = $wpdb->prepare(
            "ALTER TABLE %s $drop_index",
            $table_name
        );
        $result = $wpdb->query( $sql );

        update_option( 'wpzoom_rcb_rating_db_drop_deprecated_indexes', $result );
    }

    /**
     * Add or update the rating in the database.
     * 
     * @param array $rating_data The unsanitized rating data to add in the database.
     */
    public static function add_or_update_rating( $rating_data ) {
        $rating = array();

        // Sanitize rating data
        $rating['recipe_id'] = isset( $rating_data['recipe_id'] ) ? intval( $rating_data['recipe_id'] ) : 0;
        $rating['user_id'] = isset( $rating_data['user_id'] ) ? intval( $rating_data['user_id'] ) : 0;
        $rating['comment_id'] = isset( $rating_data['comment_id'] ) ? intval( $rating_data['comment_id'] ) : 0;
        $rating['post_id'] = isset( $rating_data['post_id'] ) ? intval( $rating_data['post_id'] ) : 0;
        $rating['rating'] = isset( $rating_data['rating'] ) ? intval( $rating_data['rating'] ) : 0;
        $rating['rate_date'] = isset( $rating_data['rate_date'] ) && $rating_data['rate_date'] ? $rating_data['rate_date'] : current_time( 'mysql' );
        $rating['update_date'] = isset( $rating_data['update_date'] ) && $rating_data['update_date'] ? $rating_data['update_date'] : current_time( 'mysql' );
        $rating['ip'] = isset( $rating_data['ip'] ) && $rating_data['ip'] ? esc_attr( $rating_data['ip'] ) : '';
        $rating['approved'] = 1;

        // We have comment ID
        if ( $rating['comment_id'] ) {
            $comment = get_comment( $rating['comment_id'] );

            if ( $comment ) {
                $rating['post_id'] = $comment->comment_post_ID;
                $rating['approved'] = '1' === $comment->comment_approved || 'approve' === $comment->comment_approved ? 1 : 0;
            } else {
                $rating['approved'] = 0;
            }
        }

        // Check if rating is between 1 and 5
        if ( 0 < $rating['rating'] && 5 >= $rating['rating'] ) {
            $table_name = self::get_table_name();

            $where = false;

            // Check for existing ratings from this user/ip for this recipe/comment
            if ( $rating['recipe_id'] ) {
                if ( $rating['user_id'] ) {
                    $where = 'recipe_id = ' . $rating['recipe_id'] . ' AND user_id = ' . $rating['user_id'];
                } elseif ( $rating['ip'] ) {
                    $where = 'recipe_id = ' . $rating['recipe_id'] . ' AND ip = "' . $rating['ip'] . '"';
                }
            } elseif ( $rating['comment_id'] ) {
                $where = 'comment_id = ' . $rating['comment_id'];
            }

            // Only continue if it was a valid rating
            if ( $where ) {
                global $wpdb;

                // Delete existing ratings
                $existing_ratings = self::get_ratings(array(
                    'where' => $where,
                ));
                $existing_ratings_ids = wp_list_pluck( $existing_ratings['ratings'], 'id' );

                if ( 0 < count( $existing_ratings_ids ) ) {
                    self::delete_ratings( $existing_ratings_ids );
                }

                // Insert new rating
                $wpdb->insert( $table_name, $rating );

                if ( ! $rating['recipe_id'] ) {
                    WPZOOM_Comment_Rating::update_comment_meta_rating( $rating['comment_id'], $rating['rating'] );
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Delete ratings for a specific comment
     * 
     * @param int $comment_id   The comment id for which to delete ratings.
     */
    public static function delete_ratings_for_comment( $comment_id ) {
        global $wpdb;
        $table_name = self::get_table_name();

        $wpdb->delete( $table_name, array( 'comment_id' => $comment_id ), array( '%d' ) );

        // Update cached rating
        WPZOOM_Comment_Rating::update_comment_meta_rating( $comment_id, 0 );
    }

    /**
     * Query ratings.
     *
     * @param mixed $args Arguments for the query.
     */
    public static function get_ratings( $args ) {
        global $wpdb;

        $table_name = self::get_table_name();

        // Sanitize arguments.
        $order = isset( $args['order'] ) ? strtoupper( $args['order'] ) : '';
        $order = in_array( $order, array( 'ASC', 'DESC' ), true ) ? $order : 'DESC';

        $orderby = isset( $args['orderby'] ) ? strtolower( $args['orderby'] ) : '';
        $orderby = in_array( $orderby, self::$fields, true ) ? $orderby : 'rate_date';

        $offset = isset( $args['offset'] ) ? intval( $args['offset'] ) : 0;
        $limit = isset( $args['limit'] ) ? intval( $args['limit'] ) : 0;

        $where = isset( $args['where'] ) ? trim( $args['where'] ) : '';

        // Query ratings.
        $query_where = $where ? ' WHERE ' . $where : '';
        $query_order = ' ORDER BY ' . $orderby . ' ' . $order;
        $query_limit = $limit ? ' LIMIT ' . $offset . ',' . $limit : '';

        // Count without limit.
        $query_count = 'SELECT count(*) FROM ' . $table_name . $query_where;
        $count = $wpdb->get_var( $query_count );

        // Query ratings.
        $query_ratings = 'SELECT * FROM ' . $table_name . $query_where . $query_order . $query_limit;
        $ratings = $wpdb->get_results( $query_ratings );

        return array(
            'total' => intval( $count ),
            'ratings' => $ratings
        );
    }

    /**
     * Query for 1 specific rating.
     *
     * @param mixed $args Arguments for the query.
     */
    public static function get_rating( $args ) {
        $ratings = self::get_ratings( $args );

        if ( 0 < $ratings['total'] ) {
            return $ratings['ratings'][0];
        } else {
            return false;
        }
    }

    public static function get_rating_average( $args ) {
        $average = 0;
        $ratings = self::get_ratings( $args );

        if ( 0 < $ratings['total'] ) {
            foreach ( $ratings['ratings'] as $key => $rating ) {
                if ( $rating->approved && 0 < $rating->rating ) {
                    $average += intval( $rating->rating );
                }
            }

            $average = $average / $ratings['total'];
        }

        return number_format( $average, 1 );
    }

    /**
     * Delete a set of ratings.
     *
     * @param array $ids Rating IDs to delete.
     */
    public static function delete_ratings( $ids ) {
        global $wpdb;
        $table_name = self::get_table_name();

        if ( is_array( $ids ) ) {
            // Delete all these rating IDs.
            $ids = implode( ',', array_map( 'intval', $ids ) );
            $wpdb->query( 'DELETE FROM ' . $table_name . ' WHERE ID IN (' . $ids . ')' );
        }
    }
}

WPZOOM_Rating_DB::init();

?>