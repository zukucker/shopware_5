<?php
/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

/**
 * Backend Controller for Blog Comment Reply
 *
 * This controller handles CRUD operations for blog comment replies
 * Extends from Application controller for automatic CRUD handling
 */
class Shopware_Controllers_Backend_BlogCommentReply extends Shopware_Controllers_Backend_Application
{
    /**
     * Model class name for Doctrine operations
     *
     * @var string
     */
    protected $model = \Shopware\Models\Blog\CommentReply::class;

    /**
     * Model alias for queries
     *
     * @var string
     */
    protected $alias = 'commentReply';

    /**
     * Get list of replies for a specific comment
     * 
     * This method returns all replies for a given comment ID
     */
    public function getListAction()
    {
        $commentId = $this->Request()->getParam('commentId');
        $start = (int) $this->Request()->getParam('start', 0);
        $limit = (int) $this->Request()->getParam('limit', 25);

        /** @var \Shopware\Components\Model\ModelManager $modelManager */
        $modelManager = $this->get('models');

        $builder = $modelManager->createQueryBuilder();
        $builder->select(['commentReply'])
            ->from($this->model, 'commentReply')
            ->orderBy('commentReply.replyDate', 'DESC');

        if ($commentId) {
            $builder->where('commentReply.commentId = :commentId')
                ->setParameter('commentId', $commentId);
        }

        // Get total count
        $totalQuery = clone $builder;
        $totalQuery->select('COUNT(commentReply.id)');
        $total = $totalQuery->getQuery()->getSingleScalarResult();

        // Apply pagination
        $builder->setFirstResult($start)
            ->setMaxResults($limit);

        $replies = $builder->getQuery()->getArrayResult();

        $this->View()->assign([
            'success' => true,
            'data' => $replies,
            'total' => $total,
        ]);
    }

    /**
     * Create a new reply
     */
    public function createAction()
    {
        try {
            $params = $this->Request()->getParams();

            // Validate required fields
            if (empty($params['commentId']) || empty($params['replyText'])) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Kommentar-ID und Antworttext sind erforderlich.',
                ]);

                return;
            }

            /** @var \Shopware\Components\Model\ModelManager $modelManager */
            $modelManager = $this->get('models');

            // Check if comment exists
            $comment = $modelManager->find(\Shopware\Models\Blog\Comment::class, $params['commentId']);
            if (!$comment) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Der angegebene Kommentar wurde nicht gefunden.',
                ]);

                return;
            }

            // Create new reply
            $reply = new \Shopware\Models\Blog\CommentReply();
            $reply->setCommentId($params['commentId']);
            $reply->setComment($comment);
            $reply->setReplyText($params['replyText']);

            // Set optional reply name (fallback to current user)
            if (!empty($params['replyName'])) {
                $reply->setReplyName($params['replyName']);
            } else {
                /** @var \Shopware\Models\User\User|null $identity */
                $identity = $this->get('auth')->getIdentity();
                if ($identity) {
                    $reply->setReplyName($identity->getName());
                }
            }

            // Set reply date (use current date if not provided)
            if (!empty($params['replyDate'])) {
                $reply->setReplyDate(new \DateTime($params['replyDate']));
            }

            $modelManager->persist($reply);
            $modelManager->flush();

            $data = $this->getModelData($reply);

            $this->View()->assign([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            $this->View()->assign([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update an existing reply
     */
    public function updateAction()
    {
        try {
            $id = $this->Request()->getParam('id');
            $params = $this->Request()->getParams();

            if (empty($id)) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Keine ID angegeben.',
                ]);

                return;
            }

            /** @var \Shopware\Components\Model\ModelManager $modelManager */
            $modelManager = $this->get('models');

            /** @var \Shopware\Models\Blog\CommentReply|null $reply */
            $reply = $modelManager->find($this->model, $id);

            if (!$reply) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Antwort wurde nicht gefunden.',
                ]);

                return;
            }

            // Update fields
            if (isset($params['replyText'])) {
                $reply->setReplyText($params['replyText']);
            }

            if (isset($params['replyName'])) {
                $reply->setReplyName($params['replyName']);
            }

            if (isset($params['replyDate'])) {
                $reply->setReplyDate(new \DateTime($params['replyDate']));
            }

            $modelManager->flush();

            $data = $this->getModelData($reply);

            $this->View()->assign([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            $this->View()->assign([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Delete a reply
     */
    public function deleteAction()
    {
        try {
            $id = $this->Request()->getParam('id');

            if (empty($id)) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Keine ID angegeben.',
                ]);

                return;
            }

            /** @var \Shopware\Components\Model\ModelManager $modelManager */
            $modelManager = $this->get('models');

            /** @var \Shopware\Models\Blog\CommentReply|null $reply */
            $reply = $modelManager->find($this->model, $id);

            if (!$reply) {
                $this->View()->assign([
                    'success' => false,
                    'message' => 'Antwort wurde nicht gefunden.',
                ]);

                return;
            }

            $modelManager->remove($reply);
            $modelManager->flush();

            $this->View()->assign([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            $this->View()->assign([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Convert model to array for JSON response
     *
     * @param \Shopware\Models\Blog\CommentReply $reply
     *
     * @return array
     */
    private function getModelData($reply)
    {
        return [
            'id' => $reply->getId(),
            'commentId' => $reply->getCommentId(),
            'replyText' => $reply->getReplyText(),
            'replyName' => $reply->getReplyName(),
            'replyDate' => $reply->getReplyDate()->format('Y-m-d H:i:s'),
            'createdAt' => $reply->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}

