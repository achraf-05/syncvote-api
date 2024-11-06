import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';
import { v4 } from 'uuid';


export class PostsController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  async createPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { title, description, categories } = request.body;

        const postData = {
          title,
          description,
          categories,
          createdBy: request.userId,
        };

        const postResponse = await this.postsService.createPost(postData);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getPosts(request: Request, response: Response): Promise<void> {
    try {
      console.log('Category name');
      console.log(request.query.category);

      const postsResponse = await this.postsService.getPosts();

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getCategories(request: Request, response: Response): Promise<void> {
    try {
      const categoriesResponse = await this.postsService.getCategories();

      response.status(categoriesResponse.status).send({
        ...categoriesResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }


  async getPostById(request: Request, response: Response): Promise<void> {
    try {
      const postResponse = await this.postsService.getPostById(request.params.id);
      response.status(postResponse.status).send(postResponse);
    } catch (error) {
      response.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }

  async updatePost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ status: 400, message: 'Bad request', data: errors.array() });
      return;
    }
  
    if (!request.params.id) {
      response.status(400).json({ status: 400, message: 'Bad request', data: 'Post ID is missing' });
      return;
    }
  
    if (!request.userId) {
      response.status(400).json({ status: 400, message: 'Bad request', data: 'User ID is missing' });
      return;
    }
  
    try {
      const postResponse = await this.postsService.updatePost(
        request.params.id,
        request.body,
        request.userId
      );
      response.status(postResponse.status).send(postResponse);
    } catch (error) {
      response.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }

  async getPostsByUser(request: Request, response: Response): Promise<void> {
    try {
      const postsResponse = await this.postsService.getPostsByUser(request.params.userId);
      response.status(postsResponse.status).send(postsResponse);
    } catch (error) {
      response.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }

  async getPostsByCategory(request: Request, response: Response): Promise<void> {
    try {
      const postsResponse = await this.postsService.getPostsByCategory(request.query.category as string);
      response.status(postsResponse.status).send(postsResponse);
    } catch (error) {
      response.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }

  async deletePost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request',
        data: errors.array(),
      });
      return;
    }

    try {
      const { postId } = request.params;
      const userId = request.userId;

      if (!postId || !userId) {
        response.status(400).json({
          status: 400,
          message: 'Post ID or User ID is missing',
        });
        return;
      }

      const deleteResponse = await this.postsService.deletePost(postId, userId);

      response.status(deleteResponse.status).json(deleteResponse);
      
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

}
