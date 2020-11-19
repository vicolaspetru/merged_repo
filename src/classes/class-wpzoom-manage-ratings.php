<?php
/**
 * Class Manage Ratings Page
 *
 * @since   3.2.0
 * @package WPZOOM_Recipe_Card_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class for manage ratings.
 */
class WPZOOM_Manage_Ratings {

    /**
     * The Manage Ratings page slug.
     *
     * @var string
     */
    public $_page_slug = 'wpzoom-manage-ratings';

    /**
     * The number of unapproved ratings.
     *
     * @var integer
     */
    public $pending_count = 0;

    /**
     * The current list of rating items.
     *
     * @var array
     */
    private $ratings;

    /**
     * Various information needed for displaying the pagination.
     * 
     * @var array
     */
    protected $_pagination_args = array();

    /**
     * Cached pagination output.
     *
     * @var string
     */
    private $_pagination;

    /**
     * The Constructor.
     */
    public function __construct() {
        $page = isset( $_GET['page'] ) ? $_GET['page'] : '';

        add_filter( 'wpzoom_manage_ratings_submenu_item', array( $this, 'submenu_item_bubble' ), 1 );

        // Do ajax request
        add_action( 'wp_ajax_approverating', array( $this, 'approve_rating') );
        add_action( 'wp_ajax_unapproverating', array( $this, 'unapprove_rating') );
        add_action( 'wp_ajax_deleterating', array( $this, 'delete_rating') );

        // Run only on Manage Ratings page
        if ( $this->_page_slug === $page ) {
            // Build Ratings query
            add_action( 'admin_init', array( $this, 'build_query' ) );

            // Add screen options
            add_action( 'current_screen', array( $this, 'add_screen_options' ) );
            add_filter( 'set-screen-option', array( $this, 'set_screen_options' ), 10, 3 );

            // Display HTML content for Manage Ratings page
            add_action( 'wpzoom_rcb_admin_manage_ratings', array( $this, 'display' ) );

            // Include scripts
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

            if ( get_option( 'show_avatars' ) ) {
                add_filter( 'wpzoom_manage_ratings_comment_author', array( $this, 'floated_comment_author_avatar' ), 10, 2 );
                add_filter( 'wpzoom_manage_ratings_author', array( $this, 'floated_rating_author_avatar' ), 10, 2 );
            }
        }
    }

    public function approve_rating() {
        $post_id = isset( $_POST['postId'] ) && wp_validate_boolean( $_POST['postId'] ) ? absint( $_POST['postId'] ) : 0;

        check_ajax_referer( "approve-rating_$post_id", 'nonce' );

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_send_json_error();
        }

        $user_id = isset( $_POST['userId'] ) && wp_validate_boolean( $_POST['userId'] ) ? absint( $_POST['userId'] ) : 0;
        $user_ip = isset( $_POST['userIp'] ) && wp_validate_boolean( $_POST['userIp'] ) ? esc_attr( $_POST['userIp'] ) : '';
        $rating = isset( $_POST['rating'] ) ? absint( $_POST['rating'] ) : 0;
        $date = isset( $_POST['date'] ) ? $_POST['date'] : current_time( 'mysql' );
        $time = isset( $_POST['time'] ) ? $_POST['time'] : '';

        $rating_data = [
            'rating' => $rating,
            'rate_date' => "$date $time",
            'update_date' => current_time( 'mysql' ),
            'approved' => 1,
            'recipe_id' => $post_id,
            'user_id' => $user_id,
            'ip' => $user_ip
        ];

        $result = WPZOOM_Rating_DB::add_or_update_rating( $rating_data );

        if ( ! $result ) {
            wp_send_json_error();
        }

        wp_send_json_success();
    }

    public function unapprove_rating() {
        $post_id = isset( $_POST['postId'] ) && wp_validate_boolean( $_POST['postId'] ) ? absint( $_POST['postId'] ) : 0;

        check_ajax_referer( "approve-rating_$post_id", 'nonce' );

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_send_json_error();
        }

        $user_id = isset( $_POST['userId'] ) && wp_validate_boolean( $_POST['userId'] ) ? absint( $_POST['userId'] ) : 0;
        $user_ip = isset( $_POST['userIp'] ) && wp_validate_boolean( $_POST['userIp'] ) ? esc_attr( $_POST['userIp'] ) : '';
        $rating = isset( $_POST['rating'] ) ? absint( $_POST['rating'] ) : 0;
        $date = isset( $_POST['date'] ) ? $_POST['date'] : current_time( 'mysql' );
        $time = isset( $_POST['time'] ) ? $_POST['time'] : '';

        $rating_data = [
            'rating' => $rating,
            'rate_date' => "$date $time",
            'update_date' => current_time( 'mysql' ),
            'approved' => 0,
            'recipe_id' => $post_id,
            'user_id' => $user_id,
            'ip' => $user_ip
        ];

        $result = WPZOOM_Rating_DB::add_or_update_rating( $rating_data );

        if ( ! $result ) {
            wp_send_json_error();
        }

        wp_send_json_success();
    }

    public function delete_rating() {
        $post_id = isset( $_POST['postId'] ) && wp_validate_boolean( $_POST['postId'] ) ? absint( $_POST['postId'] ) : 0;

        check_ajax_referer( "delete-rating_$post_id", 'nonce' );

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_send_json_error();
        }

        $user_id = isset( $_POST['userId'] ) && wp_validate_boolean( $_POST['userId'] ) ? absint( $_POST['userId'] ) : 0;
        $user_ip = isset( $_POST['userIp'] ) && wp_validate_boolean( $_POST['userIp'] ) ? esc_attr( $_POST['userIp'] ) : '';
        $date = isset( $_POST['date'] ) ? $_POST['date'] : current_time( 'mysql' );
        $time = isset( $_POST['time'] ) ? $_POST['time'] : '';

        if ( $user_id ) {
            $where = 'recipe_id = ' . $post_id . ' AND user_id = ' . $user_id;
        } elseif ( $user_ip ) {
            $where = 'recipe_id = ' . $post_id . ' AND ip = "' . $user_ip . '"';
        } else {
            $where = 'recipe_id = ' . $post_id . ' AND rate_date = "'. $date .' '. $time .'" AND ip = "' . $user_ip . '"';
        }

        // Delete existing ratings
        $existing_ratings = WPZOOM_Rating_DB::get_ratings(array(
            'where' => $where,
        ));
        $existing_ratings_ids = wp_list_pluck( $existing_ratings['ratings'], 'id' );

        if ( 0 < count( $existing_ratings_ids ) ) {
            WPZOOM_Rating_DB::delete_ratings( $existing_ratings_ids );
        } else {
            wp_send_json_error();
        }

        wp_send_json_success();
    }

    public function enqueue_scripts() {
        wp_enqueue_script( 'admin-comments' );

        wp_enqueue_script(
            'wpzoom-manage-ratings',
            untrailingslashit( WPZOOM_RCB_PLUGIN_URL ) . '/dist/assets/admin/js/manage-ratings.js',
            array(),
            WPZOOM_RCB_VERSION
        );
    }

    /**
     * Add screen options.
     */
    public function add_screen_options() {
        add_screen_option(
            'per_page',
            array(
                'option'  => str_replace( '-', '_', $this->_page_slug ) . '_per_page',
                'default' => 20,
                'label'   => esc_html__( 'Ratings per page', 'wpzoom-recipe-card' ),
            )
        );

        get_current_screen()->add_help_tab(
            array(
                'id'      => $this->_page_slug . '-overview',
                'title'   => __( 'Overview' ),
                'content' =>
                        '<p>' . __( 'You can manage ratings made on your site similar to the way you manage posts and other content. This screen is customizable in the same ways as other management screens, and you can act on ratings using the on-hover action links.' ) . '</p>',
            )
        );
        get_current_screen()->add_help_tab(
            array(
                'id'      => $this->_page_slug . '-moderating-comments',
                'title'   => __( 'Moderating Ratings' ),
                'content' =>
                            '<p>' . __( 'A red bar on the left means the rating is waiting for you to moderate it.' ) . '</p>' .
                            '<p>' . __( 'In the <strong>Author</strong> column, the author&#8217;s name, email address, and blog URL is shown.' ) . '</p>' .
                            '<p>' . __( 'In the <strong>Type</strong> column, are displayed the type of rating. There are two types of ratings available: User Rating and Comment Rating. Near the Type column, the <strong>IP</strong> address is shown in and by clicking on this link will show you all the ratings or comments made from this IP address.' ) . '</p>' .
                            '<p>' . __( 'In the <strong>Rating or Comment</strong> column, hovering over any row item gives you options to approve, edit, spam mark, or trash that record from Database.' ) . '</p>' .
                            '<p>' . __( 'In the <strong>Post</strong> column, there are two elements. The text is the name of the post that inspired the comment, and links to the post editor for that entry. The View Post link leads to that post on your live site.' ) . '</p>' .
                            '<p>' . __( 'In the <strong>Submitted on</strong> column, the date and time the rating or comment was left on your site appears. Clicking on the date/time link will take you to that comment on your live site.' ) . '</p>',
            )
        );

        get_current_screen()->set_help_sidebar(
            '<p><strong>' . __( 'For more information:' ) . '</strong></p>' .
            '<p>' . sprintf( '<a href="https://www.wpzoom.com/documentation/recipe-card-blocks">%s</a>', __( 'Documentation on Ratings', 'wpzoom-recipe-card' ) ) . '</p>' .
            '<p>' . sprintf( '<a href="https://www.wpzoom.com/support/">%s</a>', __( 'Support', 'wpzoom-recipe-card' ) ) . '</p>'
        );
    }

    /**
     * Set screen options.
     *
     * @param bool|int $status Screen option value. Default false to skip.
     * @param string   $option The option name.
     * @param int      $value  The number of rows to use.
     */
    public function set_screen_options( $status, $option, $value ) {
        $screen_option_id_per_page = str_replace( '-', '_', $this->_page_slug ) . '_per_page';

        if ( $screen_option_id_per_page === $option ) {
            return min( $value, 999 );
        }

        return $status;
    }

    /**
     * Set pending ratings count.
     */
    public function set_pending_count() {
        $this->pending_count = WPZOOM_Rating_DB::get_ratings(array(
            'where' => 'approved = 0'
        ));
    }

    /**
     * An internal method that sets all the necessary pagination arguments
     * 
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L276
     *
     * @param array|string $args Array or string of arguments with information about the pagination.
     */
    protected function set_pagination_args( $args ) {
        $args = wp_parse_args(
            $args,
            array(
                'total_items' => 0,
                'total_pages' => 0,
                'per_page'    => 0,
            )
        );

        if ( ! $args['total_pages'] && $args['per_page'] > 0 ) {
            $args['total_pages'] = ceil( $args['total_items'] / $args['per_page'] );
        }

        // Redirect if page number is invalid and headers are not already sent.
        if ( ! headers_sent() && $args['total_pages'] > 0 && $this->get_pagenum() > $args['total_pages'] ) {
            wp_redirect( add_query_arg( 'paged', $args['total_pages'] ) );
            exit;
        }

        $this->_pagination_args = $args;
    }

    /**
     * Build ratings query depending on url arguments.
     */
    public function build_query() {
        $query_args = array();

        $search = isset( $_GET['s'] ) ? $_GET['s'] : '';
        $order = isset( $_GET['order'] ) ? $_GET['order'] : 'desc';
        $orderby = isset( $_GET['orderby'] ) ? $_GET['orderby'] : 'rate_date';

        $query_args['where'] = "( ( approved = '0' OR approved = '1' ) )";

        if ( ! empty( $search ) ) {
            $query_args['where'] .= " AND (ip LIKE '%$search%')";
        }
        if ( empty( $search ) && ( $order || $orderby ) ) {
            $query_args['order'] = $order;
            $query_args['orderby'] = $orderby;
        }

        $ratings_per_page = $this->get_per_page();
        $page = $this->get_pagenum();

        if ( isset( $_GET['start'] ) ) {
            $start = $_GET['start'];
        } else {
            $start = ( $page - 1 ) * $ratings_per_page;
        }

        $query_args['offset'] = $start;
        $query_args['limit'] = $ratings_per_page;

        $this->ratings = WPZOOM_Rating_DB::get_ratings( $query_args );

        $this->set_pagination_args(
            array(
                'total_items' => $this->ratings['total'],
                'per_page'    => $ratings_per_page,
            )
        );
    }

    /**
     * Displays search results subtitle.
     */
    public function subtitle_search_results() {
        $search = isset( $_GET['s'] ) ? $_GET['s'] : '';

        if ( ! empty( $search ) ) {
            printf( '<span class="subtitle">%s “%s”</span>', __( 'Search results for' ), esc_html( $search ) );
        }
    }

    /**
     * Displays admin menu item bubble with pending count total value.
     * 
     * @param  string $menu_title The menu item title.
     * @return string             The menu item bubble.
     */
    public function submenu_item_bubble( $menu_title ) {
        if ( current_user_can( 'edit_posts' ) ) {
            $this->set_pending_count();

            $awaiting_mod      = $this->pending_count['total'];
            $awaiting_mod_i18n = number_format_i18n( $awaiting_mod );
            /* translators: %s: Number of ratings. */
            $awaiting_mod_text = sprintf( _n( '%s Rating in moderation', '%s Ratings in moderation', $awaiting_mod ), $awaiting_mod_i18n );

            /* translators: %s: Number of ratings. */
            $output = sprintf( '%s %s', $menu_title, '<span class="awaiting-mod count-' . absint( $awaiting_mod ) . '"><span class="pending-count" aria-hidden="true">' . $awaiting_mod_i18n . '</span><span class="comments-in-moderation-text screen-reader-text">' . $awaiting_mod_text . '</span></span>' );

            return $output;
        }
    }

    /**
     * Adds avatars to comment author names.
     *
     * @param string $name       Comment author name.
     * @param int    $comment_ID Comment ID.
     * @return string Avatar with the user name.
     */
    public function floated_comment_author_avatar( $name, $comment_ID ) {
        $comment = get_comment( $comment_ID );
        $avatar  = get_avatar( $comment, 32, 'mystery' );
        return "$avatar $name";
    }

    /**
     * Adds avatars to rating author names.
     *
     * @param string $name       User author name.
     * @param int    $user_id    User ID.
     * @return string Avatar with the user name.
     */
    public function floated_rating_author_avatar( $name, $user_id ) {
        $avatar  = get_avatar( $user_id, 32, 'mystery' );
        return "$avatar $name";
    }

    /**
     * Generate and display row actions links for comment.
     *
     * @global string $comment_status Status for the current listed comments.
     * 
     * @param WP_Comment $comment     The comment object.
     * @return string Row actions output for comments. An empty string
     *                if the current user cannot edit the comment.
     */
    protected function handle_comment_row_actions( $comment ) {
        global $comment_status;

        if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
            return '';
        }

        $the_comment_status = wp_get_comment_status( $comment );

        $out = '';

        $del_nonce     = esc_html( '_wpnonce=' . wp_create_nonce( "delete-comment_$comment->comment_ID" ) );
        $approve_nonce = esc_html( '_wpnonce=' . wp_create_nonce( "approve-comment_$comment->comment_ID" ) );

        $url = "comment.php?c=$comment->comment_ID";

        $approve_url   = esc_url( $url . "&action=approvecomment&$approve_nonce" );
        $unapprove_url = esc_url( $url . "&action=unapprovecomment&$approve_nonce" );
        $spam_url      = esc_url( $url . "&action=spamcomment&$del_nonce" );
        $unspam_url    = esc_url( $url . "&action=unspamcomment&$del_nonce" );
        $trash_url     = esc_url( $url . "&action=trashcomment&$del_nonce" );
        $untrash_url   = esc_url( $url . "&action=untrashcomment&$del_nonce" );
        $delete_url    = esc_url( $url . "&action=deletecomment&$del_nonce" );

        // Preorder it: Approve | Edit | Spam | Trash.
        $actions = array(
            'approve'   => '',
            'unapprove' => '',
            'edit'      => '',
            'spam'      => '',
            'unspam'    => '',
            'trash'     => '',
            'untrash'   => '',
            'delete'    => '',
        );

        // Not looking at all comments.
        if ( $comment_status && 'all' !== $comment_status ) {
            if ( 'approved' === $the_comment_status ) {
                $actions['unapprove'] = sprintf(
                    '<a href="%s" data-wp-lists="%s" class="vim-u vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                    $unapprove_url,
                    "delete:the-comment-list:comment-{$comment->comment_ID}:e7e7d3:action=dim-comment&amp;new=unapproved",
                    esc_attr__( 'Unapprove this comment' ),
                    __( 'Unapprove' )
                );
            } elseif ( 'unapproved' === $the_comment_status ) {
                $actions['approve'] = sprintf(
                    '<a href="%s" data-wp-lists="%s" class="vim-a vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                    $approve_url,
                    "delete:the-comment-list:comment-{$comment->comment_ID}:e7e7d3:action=dim-comment&amp;new=approved",
                    esc_attr__( 'Approve this comment' ),
                    __( 'Approve' )
                );
            }
        } else {
            $actions['approve'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="vim-a aria-button-if-js" aria-label="%s">%s</a>',
                $approve_url,
                "dim:the-comment-list:comment-{$comment->comment_ID}:unapproved:e7e7d3:e7e7d3:new=approved",
                esc_attr__( 'Approve this comment' ),
                __( 'Approve' )
            );

            $actions['unapprove'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="vim-u aria-button-if-js" aria-label="%s">%s</a>',
                $unapprove_url,
                "dim:the-comment-list:comment-{$comment->comment_ID}:unapproved:e7e7d3:e7e7d3:new=unapproved",
                esc_attr__( 'Unapprove this comment' ),
                __( 'Unapprove' )
            );
        }

        if ( 'trash' === $the_comment_status || 'untrash' === $the_comment_status || 'spam' === $the_comment_status || 'unspam' === $the_comment_status ) {
            $actions['approve'] = '';
            $actions['unapprove'] = '';
        }

        if ( 'spam' !== $the_comment_status ) {
            $actions['spam'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="vim-s vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                $spam_url,
                "delete:the-comment-list:comment-{$comment->comment_ID}::spam=1",
                esc_attr__( 'Mark this comment as spam' ),
                /* translators: "Mark as spam" link. */
                _x( 'Spam', 'verb' )
            );
        } elseif ( 'spam' === $the_comment_status ) {
            $actions['unspam'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="vim-z vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                $unspam_url,
                "delete:the-comment-list:comment-{$comment->comment_ID}:66cc66:unspam=1",
                esc_attr__( 'Restore this comment from the spam' ),
                _x( 'Not Spam', 'comment' )
            );
        }

        if ( 'trash' === $the_comment_status ) {
            $actions['untrash'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="vim-z vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                $untrash_url,
                "delete:the-comment-list:comment-{$comment->comment_ID}:66cc66:untrash=1",
                esc_attr__( 'Restore this comment from the Trash' ),
                __( 'Restore' )
            );
        }

        if ( 'spam' === $the_comment_status || 'trash' === $the_comment_status || ! EMPTY_TRASH_DAYS ) {
            $actions['delete'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="delete vim-d vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                $delete_url,
                "delete:the-comment-list:comment-{$comment->comment_ID}::delete=1",
                esc_attr__( 'Delete this comment permanently' ),
                __( 'Delete Permanently' )
            );
        } else {
            $actions['trash'] = sprintf(
                '<a href="%s" data-wp-lists="%s" class="delete vim-d vim-destructive aria-button-if-js" aria-label="%s">%s</a>',
                $trash_url,
                "delete:the-comment-list:comment-{$comment->comment_ID}::trash=1",
                esc_attr__( 'Move this comment to the Trash' ),
                _x( 'Trash', 'verb' )
            );
        }

        if ( 'spam' !== $the_comment_status && 'trash' !== $the_comment_status ) {
            $actions['edit'] = sprintf(
                '<a href="%s" aria-label="%s">%s</a>',
                "comment.php?action=editcomment&amp;c={$comment->comment_ID}",
                esc_attr__( 'Edit this comment' ),
                __( 'Edit' )
            );

            $format = '<button type="button" data-comment-id="%d" data-post-id="%d" data-action="%s" class="%s button-link" aria-expanded="false" aria-label="%s">%s</button>';
        }

        $actions = array_filter( $actions );
        $always_visible = false;

        $mode = get_user_setting( 'posts_list_mode', 'list' );

        if ( 'excerpt' === $mode ) {
            $always_visible = true;
        }

        $out .= '<div class="' . ( $always_visible ? 'row-actions visible' : 'row-actions' ) . '">';

        $i = 0;

        foreach ( $actions as $action => $link ) {
            ++$i;

            if ( ( ( 'approve' === $action || 'unapprove' === $action ) && 2 === $i )
                || 1 === $i
            ) {
                $sep = '';
            } else {
                $sep = ' | ';
            }

            if ( ( 'untrash' === $action && 'trash' === $the_comment_status ) || ( 'unspam' === $action && 'spam' === $the_comment_status )
            ) {
                if ( '1' == get_comment_meta( $comment->comment_ID, '_wp_trash_meta_status', true ) ) {
                    $action .= ' approve';
                } else {
                    $action .= ' unapprove';
                }
            }

            $out .= "<span class='$action'>$sep$link</span>";
        }

        $out .= '</div>';

        $out .= '<button type="button" class="toggle-row"><span class="screen-reader-text">' . __( 'Show more details' ) . '</span></button>';

        return $out;
    }

    /**
     * Generate and display row actions links for user rating.
     * 
     * @param Object $rating    The rating object.
     * @param WP_Post $post     The post object.
     * @return string Row actions output for user rating. An empty string
     *                if the current user cannot edit the post.
     */
    protected function handle_user_rating_row_actions( $rating, $post ) {
        if ( ! current_user_can( 'edit_post', $post->ID ) ) {
            return '';
        }

        $user_id = $user_ip = '';

        $the_rating_status = $rating->approved ? 'approved' : 'unapproved';
        $user = $rating->user_id ? get_userdata( $rating->user_id ) : 0;

        $out = '';

        $del_nonce     = esc_html( '_wpnonce=' . wp_create_nonce( "delete-rating_$post->ID" ) );
        $approve_nonce = esc_html( '_wpnonce=' . wp_create_nonce( "approve-rating_$post->ID" ) );

        $current_url = set_url_scheme( 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );

        $current_url = remove_query_arg( [
            'action',
            '_wpnonce'
        ], $current_url);

        if ( $user ) {
            $user_id = $user->ID;
        }
        if ( $rating->ip ) {
            $user_ip = $rating->ip;
        }

        $url = add_query_arg( [
                'post' => $post->ID,
                'user' => $user_id,
                'ip'   => $user_ip,
                'rating' => absint( $rating->rating ),
                'date' => date( 'Y-m-d', strtotime( $rating->rate_date ) ),
                'time' => date( 'H:i:s', strtotime( $rating->rate_date ) ),
            ],
            $current_url
        );

        $approve_url   = esc_url( $url . "&action=approverating&$approve_nonce" );
        $unapprove_url = esc_url( $url . "&action=unapproverating&$approve_nonce" );
        $delete_url    = esc_url( $url . "&action=deleterating&$del_nonce" );

        // Preorder it: Approve | Edit | Delete.
        $actions = array(
            'approve'   => '',
            'unapprove' => '',
            'edit'      => '',
            'delete'    => '',
        );

        $actions['approve'] = sprintf(
            '<a href="%s" class="approve aria-button-if-js" aria-label="%s">%s</a>',
            $approve_url,
            esc_attr__( 'Approve this rating', 'wpzoom-recipe-card' ),
            __( 'Approve' )
        );

        $actions['unapprove'] = sprintf(
            '<a href="%s" class="unapprove aria-button-if-js" aria-label="%s">%s</a>',
            $unapprove_url,
            esc_attr__( 'Unapprove this rating', 'wpzoom-recipe-card' ),
            __( 'Unapprove' )
        );

        $actions['delete'] = sprintf(
            '<a href="%s" class="delete aria-button-if-js" aria-label="%s">%s</a>',
            $delete_url,
            esc_attr__( 'Delete this rating permanently', 'wpzoom-recipe-card' ),
            __( 'Delete Permanently' )
        );

        $actions = array_filter( $actions );

        $out .= '<div class="row-actions">';

        $i = 0;

        foreach ( $actions as $action => $link ) {
            ++$i;

            if ( ( ( 'approve' === $action || 'unapprove' === $action ) && 2 === $i )
                || 1 === $i
            ) {
                $sep = '';
            } else {
                $sep = ' | ';
            }

            if ( ( 'untrash' === $action && 'trash' === $the_comment_status ) || ( 'unspam' === $action && 'spam' === $the_comment_status )
            ) {
                if ( '1' == get_comment_meta( $comment->comment_ID, '_wp_trash_meta_status', true ) ) {
                    $action .= ' approve';
                } else {
                    $action .= ' unapprove';
                }
            }

            $out .= "<span class='$action'>$sep$link</span>";
        }

        $out .= '</div>';

        $out .= '<button type="button" class="toggle-row"><span class="screen-reader-text">' . __( 'Show more details' ) . '</span></button>';

        return $out;
    }

    /**
     * Displays the pagination.
     *
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L858
     *
     * @param string $which
     */
    protected function pagination( $which ) {
        if ( empty( $this->_pagination_args ) ) {
            return;
        }

        $total_items     = $this->_pagination_args['total_items'];
        $total_pages     = $this->_pagination_args['total_pages'];

        $output = '<span class="displaying-num">' . sprintf(
            /* translators: %s: Number of items. */
            _n( '%s item', '%s items', $total_items ),
            number_format_i18n( $total_items )
        ) . '</span>';

        $current              = $this->get_pagenum();
        $removable_query_args = wp_removable_query_args();

        $current_url = set_url_scheme( 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );

        $current_url = remove_query_arg( $removable_query_args, $current_url );

        $page_links = array();

        $total_pages_before = '<span class="paging-input">';
        $total_pages_after  = '</span></span>';

        $disable_first = false;
        $disable_last  = false;
        $disable_prev  = false;
        $disable_next  = false;

        if ( 1 == $current ) {
            $disable_first = true;
            $disable_prev  = true;
        }
        if ( 2 == $current ) {
            $disable_first = true;
        }
        if ( $total_pages == $current ) {
            $disable_last = true;
            $disable_next = true;
        }
        if ( $total_pages - 1 == $current ) {
            $disable_last = true;
        }

        if ( $disable_first ) {
            $page_links[] = '<span class="tablenav-pages-navspan button disabled" aria-hidden="true">&laquo;</span>';
        } else {
            $page_links[] = sprintf(
                "<a class='first-page button' href='%s'><span class='screen-reader-text'>%s</span><span aria-hidden='true'>%s</span></a>",
                esc_url( remove_query_arg( 'paged', $current_url ) ),
                __( 'First page' ),
                '&laquo;'
            );
        }

        if ( $disable_prev ) {
            $page_links[] = '<span class="tablenav-pages-navspan button disabled" aria-hidden="true">&lsaquo;</span>';
        } else {
            $page_links[] = sprintf(
                "<a class='prev-page button' href='%s'><span class='screen-reader-text'>%s</span><span aria-hidden='true'>%s</span></a>",
                esc_url( add_query_arg( 'paged', max( 1, $current - 1 ), $current_url ) ),
                __( 'Previous page' ),
                '&lsaquo;'
            );
        }

        if ( 'bottom' === $which ) {
            $html_current_page  = $current;
            $total_pages_before = '<span class="screen-reader-text">' . __( 'Current Page' ) . '</span><span id="table-paging" class="paging-input"><span class="tablenav-paging-text">';
        } else {
            $html_current_page = sprintf(
                "%s<input class='current-page' id='current-page-selector' type='text' name='paged' value='%s' size='%d' aria-describedby='table-paging' /><span class='tablenav-paging-text'>",
                '<label for="current-page-selector" class="screen-reader-text">' . __( 'Current Page' ) . '</label>',
                $current,
                strlen( $total_pages )
            );
        }
        $html_total_pages = sprintf( "<span class='total-pages'>%s</span>", number_format_i18n( $total_pages ) );
        $page_links[]     = $total_pages_before . sprintf(
            /* translators: 1: Current page, 2: Total pages. */
            _x( '%1$s of %2$s', 'paging' ),
            $html_current_page,
            $html_total_pages
        ) . $total_pages_after;

        if ( $disable_next ) {
            $page_links[] = '<span class="tablenav-pages-navspan button disabled" aria-hidden="true">&rsaquo;</span>';
        } else {
            $page_links[] = sprintf(
                "<a class='next-page button' href='%s'><span class='screen-reader-text'>%s</span><span aria-hidden='true'>%s</span></a>",
                esc_url( add_query_arg( 'paged', min( $total_pages, $current + 1 ), $current_url ) ),
                __( 'Next page' ),
                '&rsaquo;'
            );
        }

        if ( $disable_last ) {
            $page_links[] = '<span class="tablenav-pages-navspan button disabled" aria-hidden="true">&raquo;</span>';
        } else {
            $page_links[] = sprintf(
                "<a class='last-page button' href='%s'><span class='screen-reader-text'>%s</span><span aria-hidden='true'>%s</span></a>",
                esc_url( add_query_arg( 'paged', $total_pages, $current_url ) ),
                __( 'Last page' ),
                '&raquo;'
            );
        }

        $pagination_links_class = 'pagination-links';
        $output .= "\n<span class='$pagination_links_class'>" . implode( "\n", $page_links ) . '</span>';

        if ( $total_pages ) {
            $page_class = $total_pages < 2 ? ' one-page' : '';
        } else {
            $page_class = ' no-pages';
        }
        $this->_pagination = "<div class='tablenav-pages{$page_class}'>$output</div>";

        echo $this->_pagination;
    }

    /**
     * @see https://github.com/WordPress/WordPress/blob/0e3147c40e91f6eb1f57585724be173e3c04a719/wp-admin/includes/class-wp-comments-list-table.php#L452
     * 
     * @return array
     */
    public function get_columns() {
        $columns = array();

        $columns['author']  = __( 'Author' );
        $columns['type']  = _x( 'Type', 'column name' );
        $columns['ip']  = _x( 'IP', 'column name' );
        $columns['comment'] = _x( 'Rating or Comment', 'column name' );
        $columns['response'] = __( 'Post' );
        $columns['date'] = _x( 'Submitted on', 'column name' );

        return $columns;
    }

    /**
     * @see https://github.com/WordPress/WordPress/blob/0e3147c40e91f6eb1f57585724be173e3c04a719/wp-admin/includes/class-wp-comments-list-table.php#L527
     * 
     * @return array
     */
    protected function get_sortable_columns() {
        return array(
            'comment'  => array( 'rating', false ),
            'date'     => array( 'rate_date', false ),
        );
    }

    /**
     * Gets the current page number.
     *
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L799
     *
     * @return int
     */
    public function get_pagenum() {
        $pagenum = isset( $_GET['paged'] ) ? absint( $_GET['paged'] ) : 0;

        if ( isset( $this->_pagination_args['total_pages'] ) && $pagenum > $this->_pagination_args['total_pages'] ) {
            $pagenum = $this->_pagination_args['total_pages'];
        }

        return max( 1, $pagenum );
    }

    /**
     * @return int
     */
    public function get_per_page() {
        $ratings_per_page = $this->get_items_per_page( 'wpzoom_manage_ratings_per_page' );
        return $ratings_per_page;
    }

    /**
     * Gets the number of items to display on a single page.
     *
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L818
     *
     * @param string $option
     * @param int    $default
     * @return int
     */
    protected function get_items_per_page( $option, $default = 20 ) {
        $per_page = (int) get_user_option( $option );
        if ( empty( $per_page ) || $per_page < 1 ) {
            $per_page = $default;
        }

        /**
         * Filters the number of items to be displayed on each page of the list table.
         *
         * The dynamic hook name, `$option`, refers to the `per_page` option depending
         * on the type of list table in use. Possible filter names include:
         *
         *  - `wpzoom_manage_ratings_per_page`
         *
         * @param int $per_page Number of items to be displayed. Default 20.
         */
        return (int) apply_filters( "{$option}", $per_page );
    }

    /**
     * Prints column headers, accounting for hidden and sortable columns.
     *
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L1172
     *
     * @param bool $with_id Whether to set the ID attribute or not
     */
    public function print_column_headers( $with_id = true ) {
        $columns = $this->get_columns();
        $sortable = $this->get_sortable_columns();

        $current_url = set_url_scheme( 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );
        $current_url = remove_query_arg( 'paged', $current_url );

        if ( isset( $_GET['orderby'] ) ) {
            $current_orderby = $_GET['orderby'];
        } else {
            $current_orderby = '';
        }

        if ( isset( $_GET['order'] ) && 'desc' === $_GET['order'] ) {
            $current_order = 'desc';
        } else {
            $current_order = 'asc';
        }

        if ( ! empty( $columns['cb'] ) ) {
            static $cb_counter = 1;
            $columns['cb']     = '<label class="screen-reader-text" for="cb-select-all-' . $cb_counter . '">' . __( 'Select All' ) . '</label>'
                . '<input id="cb-select-all-' . $cb_counter . '" type="checkbox" />';
            $cb_counter++;
        }

        foreach ( $columns as $column_key => $column_display_name ) {
            $class = array( 'manage-column', "column-$column_key" );

            if ( 'cb' === $column_key ) {
                $class[] = 'check-column';
            } elseif ( in_array( $column_key, array( 'posts', 'comments', 'links' ), true ) ) {
                $class[] = 'num';
            }

            if ( isset( $sortable[ $column_key ] ) ) {
                list( $orderby, $desc_first ) = $sortable[ $column_key ];

                if ( $current_orderby === $orderby ) {
                    $order = 'asc' === $current_order ? 'desc' : 'asc';

                    $class[] = 'sorted';
                    $class[] = $current_order;
                } else {
                    $order = strtolower( $desc_first );

                    if ( ! in_array( $order, array( 'desc', 'asc' ), true ) ) {
                        $order = $desc_first ? 'desc' : 'asc';
                    }

                    $class[] = 'sortable';
                    $class[] = 'desc' === $order ? 'asc' : 'desc';
                }

                $column_display_name = sprintf(
                    '<a href="%s"><span>%s</span><span class="sorting-indicator"></span></a>',
                    esc_url( add_query_arg( compact( 'orderby', 'order' ), $current_url ) ),
                    $column_display_name
                );
            }

            $tag   = ( 'cb' === $column_key ) ? 'td' : 'th';
            $scope = ( 'th' === $tag ) ? 'scope="col"' : '';
            $id    = $with_id ? "id='$column_key'" : '';

            if ( ! empty( $class ) ) {
                $class = "class='" . implode( ' ', $class ) . "'";
            }

            echo "<$tag $scope $id $class>$column_display_name</$tag>";
        }
    }

    /**
     * @param WP_Comment $comment The comment object.
     */
    public function column_author_comment( $comment ) {
        $author  = get_comment_author( $comment );
        $author_url = get_comment_author_url( $comment );

        $author_url_display = untrailingslashit( preg_replace( '|^http(s)?://(www\.)?|i', '', $author_url ) );
        if ( strlen( $author_url_display ) > 50 ) {
            $author_url_display = wp_html_excerpt( $author_url_display, 49, '&hellip;' );
        }

        echo '<strong>';
        echo apply_filters( 'wpzoom_manage_ratings_comment_author', $author, $comment->comment_ID );
        echo '</strong><br />';
        if ( ! empty( $author_url_display ) ) {
            printf( '<a href="%s">%s</a><br />', esc_url( $author_url ), esc_html( $author_url_display ) );
        }

        if ( current_user_can( 'edit_comment', $comment->comment_ID ) ) {
            if ( ! empty( $comment->comment_author_email ) ) {
                /** This filter is documented in wp-includes/comment-template.php */
                $email = apply_filters( 'comment_email', $comment->comment_author_email, $comment );

                if ( ! empty( $email ) && '@' !== $email ) {
                    printf( '<a href="%1$s">%2$s</a><br />', esc_url( 'mailto:' . $email ), esc_html( $email ) );
                }
            }
        }
    }

    /**
     * @param WP_User $user The user object.
     */
    public function column_author_user( $user ) {
        $author_url = isset( $user->user_url ) ? $user->user_url : '';
        $author_name = isset( $user->display_name ) && ! empty( $user->display_name ) ? $user->display_name : $user->user_nicename;

        $author_url_display = untrailingslashit( preg_replace( '|^http(s)?://(www\.)?|i', '', $author_url ) );
        if ( strlen( $author_url_display ) > 50 ) {
            $author_url_display = wp_html_excerpt( $author_url_display, 49, '&hellip;' );
        }

        echo '<strong>';
        echo apply_filters( 'wpzoom_manage_ratings_author', $author_name, $user->ID );
        echo '</strong><br />';
        if ( ! empty( $author_url_display ) ) {
            printf( '<a href="%s">%s</a><br />', esc_url( $author_url ), esc_html( $author_url_display ) );
        }

        if ( current_user_can( 'edit_posts' ) ) {
            if ( ! empty( $user->user_email ) ) {
                $email = apply_filters( 'wpzoom_manage_ratings_author_email', $user->user_email, $user );

                if ( ! empty( $email ) && '@' !== $email ) {
                    printf( '<a href="%1$s">%2$s</a><br />', esc_url( 'mailto:' . $email ), esc_html( $email ) );
                }
            }
        }
    }

    /**
     * Displays only avatar for unknown user.
     */
    public function column_author_unknown() {
        $avatar = get_avatar(0, 32, 'gravatar_default');
        $name   = __( 'Guest', 'wpzoom-recipe-card' );
        echo "$avatar $name";
    }

    /**
     * Displays the ip of comment author or get from rating object.
     * 
     * @param WP_Comment $comment The comment object.
     * @param Object $rating The rating object.
     */
    public function column_ip( $comment, $rating ) {
        $current_url = set_url_scheme( 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );
        $current_url = remove_query_arg( 'paged', $current_url );

        if ( $comment ) {
            $comment_status = wp_get_comment_status( $comment );
            $author_ip = get_comment_author_IP( $comment );

            if ( $author_ip ) {
                $author_ip_url = add_query_arg(
                    [
                        'page' => $this->_page_slug,
                        's'    => $author_ip,
                    ],
                    $current_url
                );
                if ( 'spam' === $comment_status ) {
                    $author_ip_url = add_query_arg( 'comment_status', 'spam', $author_ip_url );
                }
                printf( '<a href="%1$s">%2$s</a>', esc_url( $author_ip_url ), esc_html( $author_ip ) );
            }
        } else if ( $rating->ip ) {
            $author_ip_url = add_query_arg(
                [
                    'page' => $this->_page_slug,
                    's'    => $rating->ip,
                ],
                $current_url
            );
            printf( '<a href="%1$s">%2$s</a>', esc_url( $author_ip_url ), esc_html( $rating->ip ) );
        } else {
            _e( 'n/a', 'wpzoom-recipe-card' );
        }
    }

    /**
     * Displays the type of rating.
     * 
     * @param WP_Comment $comment The comment object.
     */
    public function column_type( $comment ) {
        if ( $comment ) {
            printf( '<span class="notice notice-info"><strong>%s</strong></span>', esc_html( 'Comment Rating', 'wpzoom-recipe-card' ) );
        } else {
            printf( '<span class="notice notice-success"><strong>%s</strong></span>', esc_html( 'User Rating', 'wpzoom-recipe-card' ) );
        }
    }

    /**
     * Displays the type of rating.
     * 
     * @param WP_Comment $comment The comment object.
     */
    public function column_comment( $comment ) {
        comment_text( $comment );
        echo $this->handle_comment_row_actions( $comment );
    }

    /**
     * Displays the type of rating.
     * 
     * @param Object $rating The rating object.
     * @param WP_Post $post The post object.
     */
    public function column_rating_stars( $rating, $post = 0 ) {
        $out = '';
        $rating_stars_items = '';

        $out .= '<div class="wpzoom-rcb-comment-rating"><div class="wpzoom-rcb-comment-rating-stars" style="color:#ffb900">';

        for ( $i = 1; $i <= 5; $i++ ) {
            if ( $i <= $rating->rating ) {
                $rating_stars_items .= '<span class="dashicons dashicons-star-filled"></span>';
            } else {
                $rating_stars_items .= '<span class="dashicons dashicons-star-empty"></span>';
            }
        }

        $out .= $rating_stars_items;
        $out .= '</div></div>';

        if ( $post ) {
            $out .= '<p></p>';
            $out .= $this->handle_user_rating_row_actions( $rating, $post );
        }

        echo $out;
    }

    /**
     * @param WP_Comment $comment The comment object.
     * @param Object $rating The rating object.
     */
    public function column_date( $comment, $rating ) {
        if ( $comment ) {
            $submitted = sprintf(
                /* translators: 1: Comment date, 2: Comment time. */
                __( '%1$s at %2$s' ),
                /* translators: Comment date format. See https://www.php.net/manual/datetime.format.php */
                get_comment_date( __( 'Y/m/d' ), $comment ),
                /* translators: Comment time format. See https://www.php.net/manual/datetime.format.php */
                get_comment_date( __( 'g:i a' ), $comment )
            );
            echo '<div class="submitted-on">';
            if ( 'approved' === wp_get_comment_status( $comment ) && ! empty( $comment->comment_post_ID ) ) {
                printf(
                    '<a href="%s">%s</a>',
                    esc_url( get_comment_link( $comment ) ),
                    $submitted
                );
            } else {
                echo $submitted;
            }
            echo '</div>';
        } else {
            $submitted = sprintf(
                /* translators: 1: Rating date, 2: Rating time. */
                __( '%1$s at %2$s' ),
                /* translators: Rating date format. See https://www.php.net/manual/datetime.format.php */
                date( __( 'Y/m/d' ), strtotime( $rating->rate_date ) ),
                /* translators: Rating time format. See https://www.php.net/manual/datetime.format.php */
                date( __( 'g:i a' ), strtotime( $rating->rate_date ) )
            );

            echo '<div class="submitted-on">'. $submitted .'</div>';
        }
    }

    /**
     * @param WP_Post $post The post object.
     */
    public function column_response( $post ) {
        if ( ! $post ) {
            return;
        }

        if ( current_user_can( 'edit_post', $post->ID ) ) {
            $post_link  = "<a href='" . get_edit_post_link( $post->ID ) . "' class='comments-edit-item-link'>";
            $post_link .= esc_html( get_the_title( $post->ID ) ) . '</a>';
        } else {
            $post_link = esc_html( get_the_title( $post->ID ) );
        }

        echo '<div class="response-links">';
        if ( 'attachment' === $post->post_type ) {
            $thumb = wp_get_attachment_image( $post->ID, array( 80, 60 ), true );
            if ( $thumb ) {
                echo $thumb;
            }
        }
        echo $post_link;
        $post_type_object = get_post_type_object( $post->post_type );
        echo "<a href='" . get_permalink( $post->ID ) . "' class='comments-view-item-link'>" . $post_type_object->labels->view_item . '</a>';
        echo '</div>';
    }

    /**
     * Displays the table with all ratings.
     * 
     * @return string Ratings table
     */
    public function display() {
        // check user capabilities
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_die(
                '<h1>' . __( 'You need a higher level of permission.' ) . '</h1>' .
                '<p>' . __( 'Sorry, you are not allowed to manage ratings.' ) . '</p>',
                403
            );
        }

        $total_ratings = $this->ratings['total'];
    ?>
        <div class="wrap">
            <h1 class="wp-heading-inline"><?php _e( 'Ratings', 'wpzoom-recipe-card' ); ?></h1>
            <?php $this->subtitle_search_results(); ?>
            <hr class="wp-header-end">

            <?php
                if ( ! $this->ratings['ratings'] ) {
                    _e( 'Ratings data not found', 'wpzoom-recipe-card' );
                    return;
                }
            ?>

            <form id="wpzoom-ratings-form" method="get">
                <table class="wp-list-table widefat striped table-view-list wpzoom-ratings">
                    <thead>
                        <tr>
                            <?php $this->print_column_headers(); ?>
                        </tr>
                    </thead>

                    <tbody id="the-comment-list" data-wp-lists="list:comment">
                        <?php foreach ( $this->ratings['ratings'] as $rating ): ?>
                            <?php
                                $comment = $post = $user = false;
                                $row_classes = array();

                                if ( $rating->user_id ) {
                                    $user = get_userdata( $rating->user_id );
                                }
                                if ( $rating->comment_id ) {
                                    $comment = get_comment( $rating->comment_id );
                                    $comment_status = wp_get_comment_status( $comment );
                                }
                                if ( $rating->post_id ) {
                                    $post = get_post( $rating->post_id );
                                }
                                if ( $rating->recipe_id ) {
                                    $post = get_post( $rating->recipe_id );
                                }

                                if ( $comment ) {
                                    $row_classes['rating-type'] = 'comment-rating';
                                } else {
                                    $row_classes['rating-type'] = 'user-rating';
                                }
                                if ( $rating->approved ) {
                                    $row_classes['status'] = 'approved';
                                } else {
                                    $row_classes['status'] = 'unapproved';
                                }
                                if ( $rating->comment_id && isset( $comment_status ) ) {
                                    $row_classes['status'] = $comment_status;
                                }
                                if ( $total_ratings % 2 === 0 ) {
                                    $row_classes[] = 'even';
                                } else {
                                    $row_classes[] = 'odd';
                                }
                            ?>
                            <tr id="<?php echo ( $comment ? 'comment-'. $comment->comment_ID : 'rating-'. $rating->id ); ?>" class="wpzoom-recipe-rating <?php echo implode(' ', $row_classes ) ?>">
                                <td class="author column-author" data-colname="Author">
                                    <?php
                                        if ( $user ) {
                                            $this->column_author_user( $user );
                                        } else if ( $comment ) {
                                            $this->column_author_comment( $comment );
                                        } else {
                                            $this->column_author_unknown();
                                        }
                                    ?>
                                </td>
                                <td data-colname="Type">
                                    <?php $this->column_type( $comment ); ?>
                                </td>
                                <td data-colname="IP">
                                    <?php $this->column_ip( $comment, $rating ); ?>
                                </td>
                                <td class="comment column-comment has-row-actions column-primary" data-colname="Rating or Comment">
                                    <?php
                                        if ( $comment ) {
                                            $this->column_comment( $comment );
                                        } else {
                                            $this->column_rating_stars( $rating, $post );
                                        }
                                    ?>
                                </td>
                                <td class="response column-response" data-colname="Post">
                                    <?php $this->column_response( $post ); ?>
                                </td>
                                <td class="date column-date" data-colname="Submitted on">
                                    <?php $this->column_date( $comment, $rating ); ?>
                                </td>
                            </tr>
                            <?php --$total_ratings ?>
                        <?php endforeach ?>
                    </tbody>
                </table>

                <?php $this->display_tablenav( 'bottom' ); ?>

            </form>
        </div>
        <div id="ajax-response"></div>
        <?php
        wp_comment_trashnotice();
    }

    /**
     * Generates the table navigation above or below the table
     *
     * @see https://github.com/WordPress/WordPress/blob/727922c8eb60c6011888d6700052090a9de43286/wp-admin/includes/class-wp-list-table.php#L1313
     * @param string $which
     */
    protected function display_tablenav( $which ) {
    ?>
        <div class="tablenav <?php echo esc_attr( $which ); ?>">
            <?php $this->pagination( $which ); ?>
            <br class="clear" />
        </div>
    <?php
    }

}

new WPZOOM_Manage_Ratings();