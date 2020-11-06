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

    public $page_slug = 'wpzoom-manage-ratings';

    public $pending_count = 0;

    private $ratings;

    /**
     * The Constructor.
     */
    public function __construct() {
        $page = isset( $_GET['page'] ) ? $_GET['page'] : '';

        // Run only on Manage Ratings page
        if ( $this->page_slug === $page ) {
            $this->set_pending_count();
            $this->build_query();

            if ( get_option( 'show_avatars' ) ) {
                add_filter( 'wpzoom_manage_ratings_comment_author', array( $this, 'floated_comment_author_avatar' ), 10, 2 );
                add_filter( 'wpzoom_manage_ratings_author', array( $this, 'floated_rating_author_avatar' ), 10, 2 );
            }

            if ( is_admin() ) {
                // Only for Manage Ratings page
                add_action( 'wpzoom_rcb_admin_manage_ratings', array( $this, 'display' ) );
                add_filter( 'wpzoom_manage_ratings_submenu_item', array( $this, 'submenu_item_bubble' ), 1 );
            }
        }
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

        $this->ratings = WPZOOM_Rating_DB::get_ratings( $query_args );
    }

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
        if ( ! $this->pending_count['total'] ) {
            return $menu_title;
        }
        return sprintf( '%s <span class="awaiting-mod">%d</span>', $menu_title, $this->pending_count['total'] );
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
     * @param int    $user_ID    User ID.
     * @return string Avatar with the user name.
     */
    public function floated_rating_author_avatar( $name, $user_ID ) {
        $avatar  = get_avatar( $user_ID, 32, 'mystery' );
        return "$avatar $name";
    }

    /**
     * Generate and display row actions links.
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
        echo get_avatar(0, 32, 'gravatar_default');
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
                    array(
                        'page' => $this->page_slug,
                        's'    => $author_ip,
                    ),
                    $current_url
                );
                if ( 'spam' === $comment_status ) {
                    $author_ip_url = add_query_arg( 'comment_status', 'spam', $author_ip_url );
                }
                printf( '<a href="%1$s">%2$s</a>', esc_url( $author_ip_url ), esc_html( $author_ip ) );
            }
        } else if ( $rating->ip ) {
            $author_ip_url = add_query_arg(
                array(
                    'page' => $this->page_slug,
                    's'    => $rating->ip,
                ),
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
     * @param WP_Comment $comment The comment object.
     */
    public function column_rating_stars( $rating ) {
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
                '<p>' . __( 'Sorry, you are not allowed to edit comments.' ) . '</p>',
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
                <table class="wp-list-table widefat fixed striped table-view-list wpzoom-ratings">
                    <thead>
                        <tr>
                            <?php $this->print_column_headers(); ?>
                        </tr>
                    </thead>

                    <tbody id="the-comment-list" data-wp-lists="list:comment">
                        <?php foreach ( $this->ratings['ratings'] as $rating ): ?>
                            <?php
                                $comment = $post = $user = false;

                                if ( $rating->user_id ) {
                                    $user = get_userdata( $rating->user_id );
                                }
                                if ( $rating->comment_id ) {
                                    $comment = get_comment( $rating->comment_id );
                                }
                                if ( $rating->post_id ) {
                                    $post = get_post( $rating->post_id );
                                }
                                if ( $rating->recipe_id ) {
                                    $post = get_post( $rating->recipe_id );
                                }

                                $row_classes = array();
                                if ( $rating->comment_id ) {
                                    $row_classes[] = 'comment-rating';
                                }
                                if ( $rating->approved ) {
                                    $row_classes[] = 'approved';
                                } else {
                                    $row_classes[] = 'unapproved';
                                }
                                if ( $total_ratings % 2 === 0 ) {
                                    $row_classes[] = 'even';
                                } else {
                                    $row_classes[] = 'odd';
                                }
                            ?>
                            <tr id="<?php echo ( $comment ? 'comment-'. $comment->comment_ID : ( $post ? 'post-'. $post->ID : 'recipe-rating' ) ); ?>" class="wpzoom-recipe-rating <?php echo implode(' ', $row_classes ) ?>">
                                <td class="column-author" data-colname="Author">
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
                                            $this->column_rating_stars( $rating );
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


            </form>
        </div>
        <?php
    }

}

new WPZOOM_Manage_Ratings();