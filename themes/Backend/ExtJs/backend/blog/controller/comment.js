/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our licensing model, this program can be used
 * under the terms of the GNU Affero General Public License, version 3.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission can be found at and in the LICENSE file you have received
 * along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore, any rights, title and interest in
 * our trademarks remain entirely with the shopware AG.
 *
 * @category   Shopware
 * @package    Blog
 * @subpackage Controller
 * @version    $Id$
 * @author shopware AG
 */

/**
 * Shopware Controller - Blog backend module
 *
 * Media controller of the blog module. Handles all action around the comment part of sub-application
 */
//{namespace name="backend/blog/view/blog"}
//{block name="backend/blog/controller/comment"}
Ext.define('Shopware.apps.Blog.controller.Comment', {
    /**
     * Extend from the standard ExtJS 4
     * @string
     */
    extend: 'Ext.app.Controller',
    /**
     * all references to get the elements by the applicable selector
     */
    refs: [
        { ref: 'commentGrid', selector: 'blog-blog-detail-comments-grid' },
        { ref: 'infoView', selector: 'blog-blog-detail-comments-info_panel dataview[name=infoView]' },
        { ref: 'deleteCommentsButton', selector: 'blog-blog-detail-comments button[action=deleteSelectedComments]' },
        { ref: 'acceptCommentsButton', selector: 'blog-blog-detail-comments button[action=acceptSelectedComments]' }
    ],

    /**
     * Contains all snippets for the controller
     */
    snippets: {
        confirmDeleteSingleBlogCommentTitle: '{s name="message/delete/confirm_single_blog_comment_title"}Delete this blog comment{/s}',
        confirmDeleteSingleBlogComment: '{s name="message/delete/confirm_single_blog_comment"}Are you sure you want to delete the selected blog comment ([0])?{/s}',
        deleteSingleBlogCommentSuccess: '{s name="message/delete/single_blog_comment/success"}The Blog comment has been successfully deleted{/s}',
        deleteSingleBlogCommentError: '{s name="message/delete/single_blog_comment/error"}An error has occurred while deleting the selected blog comment: {/s}',
        confirmDeleteMultipleBlogComments: '{s name="message/delete/multiple_blog_comments"}[0] blog comments selected. Are you sure you want to delete the selected blog comments?{/s}',
        deleteMultipleBlogCommentsSuccess: '{s name="message/delete/multiple_blog_comments/success"}The blog comments have been successfully deleted.{/s}',
        deleteMultipleBlogCommentsError: '{s name="message/delete/multiple_blog_comments/error"}An error has occurred while deleting the selected blog comments: {/s}',

        acceptSingleBlogCommentSuccess: '{s name="message/accept/single_blog_comment/success"}The Blog comment has been successfully accepted{/s}',
        acceptSingleBlogCommentError: '{s name="message/accept/single_blog_comment/error"}An error has occurred while accepting the selected blog comment: {/s}',
        confirmAcceptMultipleBlogCommentsTitle: '{s name="message/accept/multiple_blog_comments_title"}Accepting the selected blog comments?{/s}',
        confirmAcceptMultipleBlogComments: '{s name="message/accept/multiple_blog_comments"}[0] blog comments selected. Are you sure you want to accept the selected blog comments?{/s}',
        acceptMultipleBlogCommentsSuccess: '{s name="message/accept/multiple_blog_comments/success"}The blog comments have been successfully accepted.{/s}',
        acceptMultipleBlogCommentsError: '{s name="message/accept/multiple_blog_comments/error"}An error has occurred while accepting the selected blog comments: {/s}',
        growlMessage: '{s name="growlMessage"}Blog{/s}'
    },

    /**
     * Creates the necessary event listener for this
     * specific controller and opens a new Ext.window.Window
     * to display the sub-application
     *
     * @return void
     */
    init: function () {
        var me = this;
        me.control({
            'blog-blog-detail-comments textfield[action=searchBlogComments]': {
                change: me.onSearchComments
            },
            'blog-blog-detail-comments-grid': {
                deleteBlogComment: me.onDeleteSingleBlogComment,
                acceptBlogComment: me.onAcceptSingleComment,
		replyComment: me.onReplyComment,
                selectionChange: me.onSelectionChange,
                itemclick: me.onGridRowClick
            },
            'blog-blog-detail-comments button[action=deleteSelectedComments]': {
                click: me.onDeleteMultipleBlogComments
            },
            'blog-blog-detail-comments button[action=acceptSelectedComments]': {
                click: me.onAcceptMultipleBlogComments
            },
            'blog-blog-detail-comments button[action=replyComment]': {
                click: me.onReplyMultipleBlogComments
            }
        });
    },


	/**
	 * Opens the reply window for a comment
	 *
	 * @param comment - The comment record to reply to
	 */
	openReplyWindow: function(comment) {
	    var me = this;

		console.error(comment)
	    me.replyWindow = Ext.create('Shopware.apps.Blog.view.comment.ReplyWindow', {
		comment: comment
	    });

	    me.replyWindow.on('saveReply', function(window, values, comment) {
		me.onSaveReply(window, values, comment);
	    });

	    me.replyWindow.show();
	},

	/**
	 * Save handler for reply
	 *
	 * @param window - The reply window
	 * @param values - Form values
	 * @param comment - The comment being replied to
	 */
	onSaveReply: function(window, values, comment) {
	    var me = this;

	    // Show loading mask
	    window.setLoading(true);

	    // Send AJAX request to create reply
	    Ext.Ajax.request({
		url: '{url controller="Blog" action="createReply"}',
		method: 'POST',
		params: values,
		success: function(response) {
		    var result = Ext.decode(response.responseText);

		    window.setLoading(false);

		    if (result.success) {
			Shopware.Notification.createGrowlMessage(
			    '{s name="success_title"}Erfolg{/s}',
			    '{s name="reply_saved"}Die Antwort wurde erfolgreich gespeichert.{/s}',
			    'blog-comment-reply'
			);

			window.destroy();

			// Reload comment store if available
			if (me.getCommentStore) {
			    var store = me.getCommentStore();
			    if (store) {
				store.load();
			    }
			}
		    } else {
			Shopware.Notification.createGrowlMessage(
			    '{s name="error_title"}Fehler{/s}',
			    result.message || '{s name="reply_error"}Die Antwort konnte nicht gespeichert werden.{/s}',
			    'blog-comment-reply'
			);
		    }
		},
		failure: function() {
		    window.setLoading(false);
		    Shopware.Notification.createGrowlMessage(
			'{s name="error_title"}Fehler{/s}',
			'{s name="reply_error_network"}Ein Netzwerkfehler ist aufgetreten.{/s}',
			'blog-comment-reply'
		    );
		}
	    });
	},

	/**
	 * Loads replies for a comment
	 *
	 * @param commentId - The comment ID
	 * @param callback - Callback function
	 */
	loadReplies: function(commentId, callback) {
	    var me = this;

	    Ext.Ajax.request({
		url: '{url controller="Blog" action="getReplies"}',
		method: 'GET',
		params: {
		    commentId: commentId
		},
		success: function(response) {
		    var result = Ext.decode(response.responseText);

		    if (result.success && callback) {
			callback(result.data);
		    }
		},
		failure: function() {
		    Shopware.Notification.createGrowlMessage(
			'{s name="error_title"}Fehler{/s}',
			'{s name="load_replies_error"}Die Antworten konnten nicht geladen werden.{/s}',
			'blog-comment-reply'
		    );
		}
	    });
	},
    /**
     * Filters the grid with the passed search value to find the right blog
     *
     * @param field
     * @param value
     * @return void
     */
    onSearchComments: function (field, value) {
        var me = this,
            searchString = Ext.String.trim(value),
            store = me.subApplication.commentStore;
        store.filters.clear();
        store.currentPage = 1;
        store.filter('filter', searchString);
    },

    /**
     * To activate or disable the grid buttons
     *
     * @param sm - selectionModel
     * @param selection
     * @return void
     */
    onSelectionChange: function (sm, selections) {
        var me = this,
            deleteButton = me.getDeleteCommentsButton(),
            acceptButton = me.getAcceptCommentsButton();

        deleteButton.setDisabled(!selections.length);
        acceptButton.setDisabled(!selections.length);
    },

    /**
     * Event listener which deletes a single blog based on the passed
     * grid (e.g. the grid store) and the row index
     *
     * @param [object] grid - The grid on which the event has been fired
     * @param [integer] rowIndex - Position of the event
     * @return void
     */
    onDeleteSingleBlogComment: function (grid, rowIndex) {
        var me = this,
            store = me.subApplication.commentStore,
            record = store.getAt(rowIndex);
        store.currentPage = 1;
        // we do not just delete - we are polite and ask the user if he is sure.
        Ext.MessageBox.confirm(
            me.snippets.confirmDeleteSingleBlogCommentTitle,
            Ext.String.format(me.snippets.confirmDeleteSingleBlogComment, record.get('headline')), function (response) {
                if (response !== 'yes') {
                    return false;
                }
                record.destroy({
                    callback: function (data, operation) {
                        var records = operation.getRecords(),
                            record = records[0],
                            rawData = record.getProxy().getReader().rawData;

                        if ( operation.success === true ) {
                            Shopware.Notification.createGrowlMessage('', me.snippets.deleteSingleBlogCommentSuccess, me.snippets.growlMessage);
                        } else {
                            Shopware.Notification.createGrowlMessage('', me.snippets.deleteSingleBlogCommentError + rawData.errorMsg, me.snippets.growlMessage);
                        }

                        store.load();
                    }
                });
            });

    },

    /**
     * Event listener method which deletes multiple blog comments
     *
     * @return void
     */
    onDeleteMultipleBlogComments: function () {
        var me = this,
            grid = me.getCommentGrid(),
            sm = grid.getSelectionModel(),
            selection = sm.getSelection(),
            store = me.subApplication.commentStore,
            noOfElements = selection.length;

        store.currentPage = 1;

        // Get the user to confirm the delete process
        Ext.MessageBox.confirm(
            me.snippets.confirmDeleteSingleBlogCommentTitle,
            Ext.String.format(me.snippets.confirmDeleteMultipleBlogComments, noOfElements), function (response) {
                if (response !== 'yes') {
                    return false;
                }
                if (selection.length > 0) {
                    store.remove(selection);
                    store.save({
                        callback: function (batch) {
                            var rawData = batch.proxy.getReader().rawData;
                            if (rawData.success === true) {
                                store.load();
                                Shopware.Notification.createGrowlMessage('', me.snippets.deleteMultipleBlogCommentsSuccess, me.snippets.growlMessage);
                            } else {
                                Shopware.Notification.createGrowlMessage('', me.snippets.deleteMultipleBlogCommentsError + rawData.errorMsg, me.snippets.growlMessage);
                            }
                        }
                    });
                }
            }
        )
    },
    /**
     * Function to answer a comment
     * Is called, when the user presses on the actioncolumn answer-button
     * @param [object] grid - The grid on which the event has been fired
     *
     * @param [integer] rowIndex - Position of the event
     */
	onReplyComment: function(grid, rowIndex){
	var me = this, 
		store = me.subApplication.commentStore,
		record = store.getAt(rowIndex);
		me.openReplyWindow(record)
	},

    onAcceptSingleComment: function(grid, rowIndex){
        var me = this,
            store = me.subApplication.commentStore,
            record = store.getAt(rowIndex);

        var model = Ext.create('Shopware.apps.Blog.model.Comment', record.data);
        //Set active to true, so the comment will be accepted
        model.set('active', true)
        model.save({
            callback: function(data, operation){
                var records = operation.getRecords(),
                    record = records[0],
                    rawData = record.getProxy().getReader().rawData;

                if (operation.success){
                    Shopware.Notification.createGrowlMessage('', me.snippets.acceptSingleBlogCommentSuccess, me.snippets.growlMessage);
                    store.load();
                } else {
                    Shopware.Notification.createGrowlMessage('', me.snippets.acceptSingleBlogCommentError + rawData.errorMsg, me.snippets.growlMessage);
                }
            }
        });
    },

    /**
     * Event listener method which deletes multiple blog comments
     *
     * @return void
     */
    onAcceptMultipleBlogComments: function () {
        var me = this,
            grid = me.getCommentGrid(),
            sm = grid.getSelectionModel(),
            selection = sm.getSelection(),
            store = me.subApplication.commentStore,
            noOfElements = selection.length;

        // Get the user to confirm the delete process
        Ext.MessageBox.confirm(
            me.snippets.confirmAcceptMultipleBlogCommentsTitle,
            Ext.String.format(me.snippets.confirmAcceptMultipleBlogComments, noOfElements), function (response) {
                if (response !== 'yes') {
                    return false;
                }
                if (selection.length > 0) {
                    Ext.each(selection, function(item){
                        item.set('active', true);
                    });

                    store.save({
                        callback: function (batch) {
                            var rawData = batch.proxy.getReader().rawData;
                            if (rawData.success === true) {
                                store.load();
                                Shopware.Notification.createGrowlMessage('', me.snippets.acceptMultipleBlogCommentsSuccess, me.snippets.growlMessage);
                            } else {
                                Shopware.Notification.createGrowlMessage('', me.snippets.acceptMultipleBlogCommentsError + rawData.errorMsg, me.snippets.growlMessage);
                            }
                        }
                    });
                }
            }
        )
    },

    /**
     * Event listener method which deletes multiple blog comments
     *
     * @return void
     */
    onReplyMultipleBlogComments: function () {
        var me = this,
            grid = me.getCommentGrid(),
            sm = grid.getSelectionModel(),
            selection = sm.getSelection(),
            store = me.subApplication.replyStore,
            noOfElements = selection.length;

        // Get the user to confirm the delete process
	// me.openReplyWindow(selection)
        Shopware.Notification.createGrowlMessage('', 'TBA', 'TBA');
    },

    /**
     * Function to display information in the infopanel
     * Is called, when the user clicks a grid-row
     * @param view Contains the view
     * @param record Contains the clicked record
     */
    onGridRowClick: function(view, record){
        var me = this,
            infoView = me.getInfoView();

        infoView.update(record.data);
    }

});
//{/block}
