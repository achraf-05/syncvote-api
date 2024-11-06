import { Router } from 'express';
import { CommentsController } from '../controllers/CommentsController';
import authJwt from '../middlewares/authJwt';

export class CommentsRoute {
  private commentsController: CommentsController;

  constructor(commentsController: CommentsController) {
    this.commentsController = commentsController;
  }

  createRouter(): Router {
    const router = Router();

    router.get('/posts/:postId/comments', this.commentsController.getCommentsForPost.bind(this.commentsController));
    
    router.get('/comments/:commentId', this.commentsController.getCommentById.bind(this.commentsController));
    
    router.post('/posts/:postId/comments', authJwt.verifyToken, this.commentsController.addCommentToPost.bind(this.commentsController));
    
    router.put('/comments/:commentId', authJwt.verifyToken, this.commentsController.updateComment.bind(this.commentsController));
    
    router.delete('/comments/:commentId', authJwt.verifyToken, this.commentsController.deleteComment.bind(this.commentsController));

    router.post('/comments/:commentId/upvote', authJwt.verifyToken, this.commentsController.upVote.bind(this.commentsController));

    router.post('/comments/:commentId/downvote', authJwt.verifyToken, this.commentsController.downVote.bind(this.commentsController));

    return router;
  }
}
