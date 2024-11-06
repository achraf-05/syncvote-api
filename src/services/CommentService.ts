import { IResBody } from '../types/api';
import { FirestoreCollections } from '../types/firestore';
import { Comment } from '../types/entities/Comment';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Post } from '../types/entities/Post';
import { v4 } from 'uuid';


export class CommentsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async getCommentsForPost(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();
    if (!postDoc.exists) return { status: 404, message: 'Post not found' };

    const post = postDoc.data() as Post;
    return {
      status: 200,
      message: 'Comments retrieved successfully',
      data: post.comments || []
    };
  }

  async updateComment(commentId: string, commentData: Partial<Comment>): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    if (!commentDoc.exists) return { status: 404, message: 'Comment not found' };

    const comment = commentDoc.data() as Comment;

    await commentDoc.ref.update({
      ...commentData,
      updatedAt: firestoreTimestamp.now(),
    });

    return { status: 200, message: 'Comment updated successfully' };
  }

  async deleteComment(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    if (!commentDoc.exists) return { status: 404, message: 'Comment not found' };

    const comment = commentDoc.data() as Comment;

    await commentDoc.ref.delete();
    return { status: 200, message: 'Comment deleted successfully' };
  }

  async getCommentById(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    if (!commentDoc.exists) {
      return { status: 404, message: 'Comment not found' };
    }

    const comment = commentDoc.data() as Comment;
    return {
      status: 200,
      message: 'Comment retrieved successfully',
      data: comment,
    };
  }

  async addCommentToPost(commentData: Comment, postId: string): Promise<IResBody> {
    try {
      const postDoc = await this.db.posts.doc(postId).get();
      if (!postDoc.exists) {
        return { status: 404, message: 'Post not found' };
      }
  
      const postData = postDoc.data() as Post;
      if (!postData.comments) {
        postData.comments = [];
      }
  
      const newComment: Comment = {
        id: v4(),
        ...commentData
      };
  
      postData.comments.push(newComment);
  
      await postDoc.ref.update({
        comments: postData.comments
      });
  
      return {
        status: 200,
        message: 'Comment added successfully!',
        data: newComment
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error
      };
    }
  }

  async upVote(commentId: string): Promise<IResBody> {
    try {
      const commentDoc = await this.db.comments.doc(commentId).get();
      if (!commentDoc.exists) return { status: 404, message: 'Comment not found' };

      const comment = commentDoc.data() as Comment;
      const newVoteCount = (comment.voteCount || 0) + 1;

      await commentDoc.ref.update({
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status: 200,
        message: 'Upvote added successfully',
        data: { voteCount: newVoteCount },
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }

  async downVote(commentId: string): Promise<IResBody> {
    try {
      const commentDoc = await this.db.comments.doc(commentId).get();
      if (!commentDoc.exists) return { status: 404, message: 'Comment not found' };

      const comment = commentDoc.data() as Comment;
      const newVoteCount = (comment.voteCount || 0) - 1;

      await commentDoc.ref.update({
        voteCount: newVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status: 200,
        message: 'Downvote added successfully',
        data: { voteCount: newVoteCount },
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }
  
}
