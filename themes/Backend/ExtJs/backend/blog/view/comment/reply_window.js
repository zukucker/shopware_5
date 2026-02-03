//{namespace name="backend/blog/view/comment"}
//{block name="backend/blog/view/comment/reply_window"}

/**
 * Shopware View - Blog Comment Reply Window
 *
 * Window for creating and editing blog comment replies
 */
Ext.define('Shopware.apps.Blog.view.comment.ReplyWindow', {
    /**
     * Extend from the standard window component
     */
    extend: 'Enlight.app.Window',

    /**
     * Alias for easier referencing
     */
    alias: 'widget.blog-comment-reply-window',

    /**
     * Title of the window
     */
    title: '{s name="reply_window_title"}Kommentar beantworten{/s}',

    /**
     * Width of the window
     */
    width: 800,

    /**
     * Height of the window
     */
    height: 600,

    /**
     * Make window modal
     */
    modal: true,

    /**
     * Enable auto-scroll
     */
    autoScroll: true,

    /**
     * Window layout
     */
    layout: 'fit',

    /**
     * Contains all snippets for this component
     */
    snippets: {
        title: '{s name="reply_window_title"}Kommentar beantworten{/s}',
        replyText: '{s name="reply_text"}Antwort{/s}',
        replyName: '{s name="reply_name"}Name (optional){/s}',
        replyDate: '{s name="reply_date"}Antwortdatum{/s}',
        save: '{s name="save"}Speichern{/s}',
        cancel: '{s name="cancel"}Abbrechen{/s}',
        commentText: '{s name="comment_text"}Kommentar{/s}',
        commentAuthor: '{s name="comment_author"}Autor{/s}'
    },

    /**
     * Initialize the component
     */
    initComponent: function() {
        var me = this;

        me.items = me.createItems();
        me.dockedItems = me.createToolbar();

        me.callParent(arguments);

        // Load form data if record exists
        if (me.record) {
            me.formPanel.loadRecord(me.record);
        }
    },

    /**
     * Creates the form items
     *
     * @return Array
     */
    createItems: function() {
        var me = this;

        me.formPanel = Ext.create('Ext.form.Panel', {
            border: false,
            bodyPadding: 10,
            defaults: {
                labelWidth: 155,
                anchor: '100%'
            },
            items: me.createFormFields()
        });

        return [me.formPanel];
    },

    /**
     * Creates the form fields
     *
     * @return Array
     */
    createFormFields: function() {
        var me = this;
        var fields = [];

        // Display comment information (read-only)
        if (me.comment) {
            fields.push({
                xtype: 'fieldset',
                title: '{s name="comment_info"}Kommentar-Information{/s}',
                defaults: {
                    labelWidth: 155,
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: me.snippets.commentAuthor,
                        value: me.comment.get('name') || '-'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Headline',
                        value: Ext.util.Format.ellipsis(me.comment.get('headline'), 100) || '-'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: me.snippets.commentText,
                        value: Ext.util.Format.ellipsis(me.comment.get('content'), 100) || '-'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Datum',
                        value: Ext.util.Format.ellipsis(me.comment.get('creationDate')) || '-'
                    }
                ]
            });
        }

        // Reply form fields
        fields.push({
            xtype: 'fieldset',
            title: '{s name="reply_data"}Antwort{/s}',
            defaults: {
                labelWidth: 155,
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'textarea',
                    name: 'replyText',
                    fieldLabel: me.snippets.replyText,
                    allowBlank: false,
                    height: 120,
                    required: true
                },
                {
                    xtype: 'textfield',
                    name: 'replyName',
                    fieldLabel: me.snippets.replyName,
                    allowBlank: true
                },
                {
                    xtype: 'datefield',
                    name: 'replyDate',
                    fieldLabel: me.snippets.replyDate,
                    format: 'd.m.Y',
                    submitFormat: 'Y-m-d H:i:s',
                    value: new Date(),
                    allowBlank: false
                }
            ]
        });

        // Hidden field for comment ID
        fields.push({
            xtype: 'hidden',
            name: 'commentId',
            value: me.comment ? me.comment.get('id') : null
        });

        return fields;
    },

    /**
     * Creates the toolbar with save and cancel buttons
     *
     * @return Array
     */
    createToolbar: function() {
        var me = this;

        return [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                '->',
                {
                    text: me.snippets.cancel,
                    cls: 'secondary',
                    handler: function() {
                        me.destroy();
                    }
                },
                {
                    text: me.snippets.save,
                    cls: 'primary',
                    handler: function() {
                        me.onSave();
                    }
                }
            ]
        }];
    },

    /**
     * Save handler
     */
    onSave: function() {
        var me = this,
            form = me.formPanel.getForm();

        // Validate form
        if (!form.isValid()) {
            return;
        }

        // Get form values
        var values = form.getValues();

        // Fire save event
        me.fireEvent('saveReply', me, values, me.comment);
    }
});

//{/block}

