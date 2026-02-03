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

namespace Shopware\Models\Blog;

use Doctrine\ORM\Mapping as ORM;
use Shopware\Components\Model\ModelEntity;

/**
 * Shopware Blog Comment Reply Model
 *
 * @ORM\Entity(repositoryClass="Repository")
 * @ORM\Table(name="s_blog_comments_reply")
 */
class CommentReply extends ModelEntity
{
    /**
     * OWNING SIDE
     * Inverse side of relation between comment reply and blog comment
     *
     * @var \Shopware\Models\Blog\Comment
     *
     * @ORM\ManyToOne(targetEntity="Shopware\Models\Blog\Comment", inversedBy="replies")
     * @ORM\JoinColumn(name="comment_id", referencedColumnName="id", nullable=false)
     */
    protected $comment;

    /**
     * Primary Key - autoincrement value
     *
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * ID of the commented blog article
     *
     * @var int
     *
     * @ORM\Column(name="comment_id", type="integer", nullable=false)
     */
    private $commentId;

    /**
     * Contains the reply text
     *
     * @var string
     *
     * @ORM\Column(name="reply_text", type="text", nullable=false)
     */
    private $replyText;

    /**
     * Contains the name of the person who replied (optional)
     *
     * @var string|null
     *
     * @ORM\Column(name="reply_name", type="string", length=255, nullable=true)
     */
    private $replyName;

    /**
     * Date when the reply was created
     *
     * @var \DateTimeInterface
     *
     * @ORM\Column(name="reply_date", type="datetime", nullable=false)
     */
    private $replyDate;

    /**
     * Timestamp when the reply was created
     *
     * @var \DateTimeInterface
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * Class constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->replyDate = new \DateTime();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set comment id
     *
     * @param int $commentId
     *
     * @return CommentReply
     */
    public function setCommentId($commentId)
    {
        $this->commentId = $commentId;

        return $this;
    }

    /**
     * Get comment id
     *
     * @return int
     */
    public function getCommentId()
    {
        return $this->commentId;
    }

    /**
     * Set reply text
     *
     * @param string $replyText
     *
     * @return CommentReply
     */
    public function setReplyText($replyText)
    {
        $this->replyText = $replyText;

        return $this;
    }

    /**
     * Get reply text
     *
     * @return string
     */
    public function getReplyText()
    {
        return $this->replyText;
    }

    /**
     * Set reply name
     *
     * @param string|null $replyName
     *
     * @return CommentReply
     */
    public function setReplyName($replyName)
    {
        $this->replyName = $replyName;

        return $this;
    }

    /**
     * Get reply name
     *
     * @return string|null
     */
    public function getReplyName()
    {
        return $this->replyName;
    }

    /**
     * Set reply date
     *
     * @param \DateTimeInterface|string $replyDate
     *
     * @return CommentReply
     */
    public function setReplyDate($replyDate)
    {
        if (!$replyDate instanceof \DateTimeInterface) {
            $replyDate = new \DateTime($replyDate);
        }
        $this->replyDate = $replyDate;

        return $this;
    }

    /**
     * Get reply date
     *
     * @return \DateTimeInterface
     */
    public function getReplyDate()
    {
        return $this->replyDate;
    }

    /**
     * Set created at timestamp
     *
     * @param \DateTimeInterface|string $createdAt
     *
     * @return CommentReply
     */
    public function setCreatedAt($createdAt)
    {
        if (!$createdAt instanceof \DateTimeInterface) {
            $createdAt = new \DateTime($createdAt);
        }
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get created at timestamp
     *
     * @return \DateTimeInterface
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set comment
     *
     * @param \Shopware\Models\Blog\Comment|null $comment
     *
     * @return CommentReply
     */
    public function setComment($comment = null)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment
     *
     * @return \Shopware\Models\Blog\Comment|null
     */
    public function getComment()
    {
        return $this->comment;
    }
}

