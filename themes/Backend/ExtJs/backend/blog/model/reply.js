//{namespace name="backend/blog/view/comment"}
//{block name="backend/blog/model/reply"}

/**
 * Shopware Model - Blog Comment Reply
 *
 * Model for blog comment replies
 * Used for data handling in the reply window
 */
Ext.define('Shopware.apps.Blog.model.Reply', {
    /**
     * Extends the standard Ext Model
     */
    extend: 'Shopware.data.Model',

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
     * The fields used for this model
     * @array
     */
    fields: [
        //{block name="backend/blog/model/reply/fields"}{/block}
        { name: 'id', type: 'int' },
        { name: 'commentId', type: 'int' },
        { name: 'replyText', type: 'string' },
        { name: 'replyName', type: 'string' },
        {
            name: 'replyDate',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        },
        {
            name: 'createdAt',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }
    ]
});

//{/block}

