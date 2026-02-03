//{namespace name="backend/blog/view/comment"}
//{block name="backend/blog/store/reply"}

/**
 * Shopware Store - Blog Comment Reply
 *
 * Store for loading and managing blog comment replies
 */
Ext.define('Shopware.apps.Blog.store.Reply', {
    /**
     * Extend the standard store
     */
    extend: 'Shopware.store.Listing',

    /**
     * Configure the data communication
     * @object
     */
    configure: function() {
        return {
            controller: 'BlogCommentReply'
        };
    },

    /**
     * Define the used model for this store
     * @string
     */
    model: 'Shopware.apps.Blog.model.Reply',

    /**
     * Number of records per page
     */
    pageSize: 25
});

//{/block}

