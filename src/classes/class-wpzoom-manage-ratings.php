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
     * The Constructor.
     */
    public function __construct() {
        $page = isset( $_GET['page'] ) ? $_GET['page'] : '';

        if ( is_admin() ) {
            // Only for Manage Ratings page
            add_action( 'wpzoom_rcb_admin_manage_ratings', array( $this, 'manage_ratings' ) );
        }
    }

    /**
     * Generate and display row actions links.
     *
     * @since 3.2.0
     *
     * @param WP_Comment $comment     The comment object.
     * @param string $comment_status  Status for the current listed comments.
     * @return string Row actions output for comments. An empty string
     *                if the current user cannot edit the comment.
     */
    protected function handle_comment_row_actions( $comment, $comment_status = null ) {
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
     * Displays the table with all ratings.
     * 
     * @since 3.2.0
     * 
     * @return string Ratings table
     */
    public function manage_ratings() {
        // check user capabilities
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_die(
                '<h1>' . __( 'You need a higher level of permission.' ) . '</h1>' .
                '<p>' . __( 'Sorry, you are not allowed to edit comments.' ) . '</p>',
                403
            );
        }

        $ratings = WPZOOM_Rating_DB::get_ratings();
        $total_ratings = $ratings['total'];
    ?>
        <div class="wrap">
            <h1 class="wp-heading-inline"><?php _e( 'Ratings', 'wpzoom-recipe-card' ); ?></h1>
            <hr class="wp-header-end">

            <?php
                if ( ! $ratings['ratings'] ) {
                    _e( 'Ratings data not found', 'wpzoom-recipe-card' );
                    return;
                }
            ?>

            <form id="wpzoom-ratings-form" method="get">
                <table class="wp-list-table widefat fixed striped table-view-list wpzoom-ratings">
                    <thead>
                        <tr>
                            <th scope="col" id="author"><?php _e( 'Author', 'wpzoom-recipe-card' ); ?></th>
                            <th scope="col" id="type"><?php _e( 'Type', 'wpzoom-recipe-card' ); ?></th>
                            <th scope="col" id="ip"><?php _e( 'IP', 'wpzoom-recipe-card' ); ?></th>
                            <th scope="col" id="comment" class="column-comment"><?php _e( 'Rating or Comment', 'wpzoom-recipe-card' ); ?></th>
                            <th scope="col" id="post"><?php _e( 'Post', 'wpzoom-recipe-card' ); ?></th>
                            <th scope="col" id="date" class="manage-column column-date"><?php _e( 'Submitted on', 'wpzoom-recipe-card' ); ?></th>
                        </tr>
                    </thead>

                    <tbody id="the-wpzoom-ratings-list">
                        <?php foreach ( $ratings['ratings'] as $rating ): ?>
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

                                $row_classes = array( 'wpzoom-recipe-rating' );
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
                            <tr id="rating-for-post-<?php echo $post->ID ?>" class="<?php echo implode(' ', $row_classes ) ?>">
                                <td data-colname="Author">
                                    <strong>
                                        <?php if ( get_option( 'show_avatars' ) ): ?>
                                            <?php
                                                if ( $user ) {
                                                    $avatar = get_avatar( $user->ID, 32, 'mystery' );

                                                    echo $avatar .' '. $user->data->user_nicename;
                                                } else {
                                                    if ( $comment ) {
                                                        $avatar = get_avatar( $comment, 32, 'mystery' );
                                                    } else if ( $post ) {
                                                        $avatar = get_avatar( $post, 32, 'mystery' );
                                                    }

                                                    if ( isset( $avatar ) ) {
                                                        echo $avatar;
                                                    }
                                                }
                                            ?>
                                        <?php endif ?>
                                    </strong>
                                    <?php if ( $user && ! empty( $user->data->user_email ) && '@' !== $user->data->user_email ): ?>
                                        <br />
                                        <a href="<?php echo esc_url( 'mailto:' . $user->data->user_email ); ?>"><?php echo esc_html( $user->data->user_email ); ?></a><br />
                                    <?php endif ?>
                                </td>
                                <td data-colname="Type">
                                    <?php
                                        if ( $comment ) {
                                            _e( 'Comment Rating', 'wpzoom-recipe-card' );
                                        } else {
                                            _e( 'User Rating', 'wpzoom-recipe-card' );
                                        }
                                    ?>
                                </td>
                                <td data-colname="IP">
                                    <?php
                                        if ( $rating->ip ) {
                                            echo esc_html( $rating->ip );
                                        } else {
                                            _e( 'n/a', 'wpzoom-recipe-card' );
                                        }
                                    ?>
                                </td>
                                <td class="comment column-comment has-row-actions column-primary" data-colname="Rating or Comment">
                                    <?php
                                        if ( $comment ) {
                                            comment_text( $comment );
                                            $comment_status = wp_get_comment_status( $comment );
                                            echo $this->handle_comment_row_actions( $comment, $comment_status );
                                        }
                                    ?>

                                    <?php if ( ! $comment ): ?>
                                        <div class="wpzoom-rcb-comment-rating">
                                            <div class="wpzoom-rcb-comment-rating-stars" style="color:#ffb900">
                                                <?php
                                                    $rating_stars_items = '';

                                                    for ( $i = 1; $i <= 5; $i++ ) {
                                                        if ( $i <= $rating->rating ) {
                                                            $rating_stars_items .= '<span class="dashicons dashicons-star-filled"></span>';
                                                        } else {
                                                            $rating_stars_items .= '<span class="dashicons dashicons-star-empty"></span>';
                                                        }
                                                    }
                                                    echo $rating_stars_items;
                                                ?>
                                            </div>
                                        </div>
                                    <?php endif ?>
                                </td>
                                <td class="response column-response" data-colname="Post">
                                    <?php if ( $post ): ?>
                                        <div class="response-links">
                                            <?php
                                                $post_type_object = get_post_type_object( $post->post_type );
                                            ?>
                                            <a href="<?php echo get_edit_post_link( $post->ID ) ?>" class='comments-edit-item-link'><?php echo esc_html( get_the_title( $post->ID ) ) ?></a>
                                            <a href="<?php echo get_permalink( $post->ID ) ?>" class='comments-view-item-link'><?php esc_html( get_the_title( $post->ID ) ) ?><?php echo $post_type_object->labels->view_item; ?></a>
                                        </div>
                                    <?php endif ?>
                                </td>
                                <td class="date column-date" data-colname="Submitted on">
                                    <?php if ( $comment ): ?>
                                        <?php
                                            $submitted = sprintf(
                                                /* translators: 1: Comment date, 2: Comment time. */
                                                __( '%1$s at %2$s' ),
                                                /* translators: Comment date format. See https://www.php.net/manual/datetime.format.php */
                                                get_comment_date( __( 'Y/m/d' ), $comment ),
                                                /* translators: Comment time format. See https://www.php.net/manual/datetime.format.php */
                                                get_comment_date( __( 'g:i a' ), $comment )
                                            );
                                        ?>
                                        <div class="submitted-on">
                                            <?php
                                                if ( 'approved' === wp_get_comment_status( $comment ) && ! empty( $comment->comment_post_ID ) ) {
                                                    printf(
                                                        '<a href="%s">%s</a>',
                                                        esc_url( get_comment_link( $comment ) ),
                                                        $submitted
                                                    );
                                                } else {
                                                    echo $submitted;
                                                }
                                            ?>
                                        </div>
                                    <?php else: ?>
                                        <div class="submitted-on">
                                            <?php
                                                $submitted = sprintf(
                                                    /* translators: 1: Rating date, 2: Rating time. */
                                                    __( '%1$s at %2$s' ),
                                                    /* translators: Rating date format. See https://www.php.net/manual/datetime.format.php */
                                                    date( __( 'Y/m/d' ), strtotime( $rating->rate_date ) ),
                                                    /* translators: Rating time format. See https://www.php.net/manual/datetime.format.php */
                                                    date( __( 'g:i a' ), strtotime( $rating->rate_date ) )
                                                );

                                                echo $submitted;
                                            ?>
                                        </div>
                                    <?php endif ?>
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