import { Request, Response } from 'express';
import { CommentsService } from '../services/CommentService';
import { IResBody } from '../types/api';

export class CommentsController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async getCommentsForPost(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const response: IResBody = await this.commentsService.getCommentsForPost(postId);
    res.status(response.status).json(response);
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    const response: IResBody = await this.commentsService.getCommentById(commentId);
    res.status(response.status).json(response);
  }

  async addCommentToPost(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const commentData = req.body;
    const response: IResBody = await this.commentsService.addCommentToPost(commentData, postId);
    res.status(response.status).json(response);
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    const commentData = req.body;
    //const userId = req.userId; 
    const response: IResBody = await this.commentsService.updateComment(commentId, commentData);
    res.status(response.status).json(response);
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
   // const userId = req.userId; 
    const response: IResBody = await this.commentsService.deleteComment(commentId);
    res.status(response.status).json(response);
  }


  async upVote(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    try {
      const response: IResBody = await this.commentsService.upVote(commentId);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }

  async downVote(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    try {
      const response: IResBody = await this.commentsService.downVote(commentId);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Internal server error', data: error });
    }
  }
}
