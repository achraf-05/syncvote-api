import { Post } from '../types/entities/Post';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';
import { v4 } from 'uuid';
import { Comment  } from '../types/entities/Comment';


export class PostsService {
  private db: FirestoreCollections;


  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getPosts(): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getCategories(): Promise<IResBody> {
    return {
      status: 200,
      message: 'Categories retrieved successfully!',
      data: categories
    };
  }

  async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();
    if (!postDoc.exists) return { status: 404, message: 'Post not found' };

    const postData = postDoc.data();
    return {
      status: 200,
      message: 'Post retrieved successfully',
      data: { id: postDoc.id, ...postData }
    };
  }

  async updatePost(postId: string, postData: Partial<Post>, userId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();
    if (!postDoc.exists) return { status: 404, message: 'Post not found' };

    const post = postDoc.data() as Post;
    if (post.createdBy !== userId) return { status: 403, message: 'Not authorized to update this post' };

    await postDoc.ref.update({
      ...postData,
      updatedAt: firestoreTimestamp.now()
    });

    return { status: 200, message: 'Post updated successfully' };
  }

  async deletePost(postId: string, userId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();
    if (!postDoc.exists) return { status: 404, message: 'Post not found' };

    const post = postDoc.data() as Post;
    if (post.createdBy !== userId) return { status: 403, message: 'Not authorized to delete this post' };

    await postDoc.ref.delete();
    return { status: 200, message: 'Post deleted successfully' };
  }

  async getPostsByUser(userId: string): Promise<IResBody> {
    const postsQuery = await this.db.posts.where('createdBy', '==', userId).get();
    const posts = postsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      status: 200,
      message: 'Posts retrieved successfully',
      data: posts
    };
  }

  async getPostsByCategory(category: string): Promise<IResBody> {
    const postsQuery = await this.db.posts.where('categories', 'array-contains', category).get();
    const posts = postsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      status: 200,
      message: 'Posts retrieved successfully',
      data: posts
    };
  }

  async upVote(postId: string): Promise<IResBody> {
    try {
      const postDoc = await this.db.posts.doc(postId).get();
      if (!postDoc.exists) {
        return { status: 404, message: 'Post not found' };
      }
  
      const postData = postDoc.data() as Post;
      const updatedVoteCount = (postData.voteCount || 0) + 1;
  
      await postDoc.ref.update({
        voteCount: updatedVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });
  
      return {
        status: 200,
        message: 'Vote added successfully!',
        data: { id: postId, voteCount: updatedVoteCount },
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }

  async downVote(postId: string): Promise<IResBody> {
    try {
      const postDoc = await this.db.posts.doc(postId).get();
      if (!postDoc.exists) {
        return { status: 404, message: 'Post not found' };
      }
  
      const postData = postDoc.data() as Post;
      const updatedVoteCount = (postData.voteCount || 0) - 1;
  
      const finalVoteCount = updatedVoteCount < 0 ? 0 : updatedVoteCount;
  
      await postDoc.ref.update({
        voteCount: finalVoteCount,
        updatedAt: firestoreTimestamp.now(),
      });
  
      return {
        status: 200,
        message: 'Vote removed successfully!',
        data: { id: postId, voteCount: finalVoteCount },
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


