import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import {
  SyncRequest,
  SyncResponse,
  SyncChanges,
  SyncConflict,
} from '../interfaces/sync.interface';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async push(syncRequest: SyncRequest): Promise<SyncResponse> {
    const startTime = Date.now();
    this.logger.log('Début de la synchronisation push');

    try {
      // Traiter les posts
      const postChanges = await this.processPostChanges(
        syncRequest.changes.posts,
      );

      // Traiter les commentaires
      const commentChanges = await this.processCommentChanges(
        syncRequest.changes.comments,
      );

      const processingTime = Date.now() - startTime;
      this.logger.log(`Synchronisation push terminée en ${processingTime}ms`);

      return {
        changes: {
          posts: postChanges,
          comments: commentChanges,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('Erreur lors de la synchronisation push:', error);
      throw error;
    }
  }

  async pull(lastPulledAt: number): Promise<SyncResponse> {
    const startTime = Date.now();
    this.logger.log('Début de la synchronisation pull');

    try {
      const lastPulledDate = new Date(lastPulledAt);

      // Récupérer les posts modifiés
      const posts = await this.postRepository.find({
        where: [{ createdAt: lastPulledDate }, { updatedAt: lastPulledDate }],
        relations: ['user'],
      });

      // Récupérer les commentaires modifiés
      const comments = await this.commentRepository.find({
        where: [{ createdAt: lastPulledDate }, { updatedAt: lastPulledDate }],
        relations: ['user', 'post'],
      });

      const processingTime = Date.now() - startTime;
      this.logger.log(`Synchronisation pull terminée en ${processingTime}ms`);

      return {
        changes: {
          posts: {
            created: posts.filter((p) => p.createdAt >= lastPulledDate),
            updated: posts.filter(
              (p) =>
                p.updatedAt >= lastPulledDate && p.createdAt < lastPulledDate,
            ),
            deleted: [],
          },
          comments: {
            created: comments.filter((c) => c.createdAt >= lastPulledDate),
            updated: comments.filter(
              (c) =>
                c.updatedAt >= lastPulledDate && c.createdAt < lastPulledDate,
            ),
            deleted: [],
          },
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('Erreur lors de la synchronisation pull:', error);
      throw error;
    }
  }

  private async processPostChanges(changes: SyncChanges): Promise<SyncChanges> {
    const { created, updated, deleted } = changes;
    const processedChanges: SyncChanges = {
      created: [],
      updated: [],
      deleted: [],
    };

    // Traiter les créations
    if (created.length > 0) {
      for (const postData of created) {
        try {
          const post = this.postRepository.create(postData);
          const savedPost = await this.postRepository.save(post);
          processedChanges.created.push(savedPost);
        } catch (error) {
          this.logger.error(
            `Erreur lors de la création du post ${postData.id}:`,
            error,
          );
        }
      }
    }

    // Traiter les mises à jour
    if (updated.length > 0) {
      for (const postData of updated) {
        try {
          const existingPost = await this.postRepository.findOne({
            where: { id: postData.id },
          });

          if (existingPost) {
            // Gérer les conflits de synchronisation
            const conflict = await this.resolvePostConflict(
              existingPost,
              postData,
            );
            if (conflict.resolution === 'server') {
              Object.assign(existingPost, postData);
              const savedPost = await this.postRepository.save(existingPost);
              processedChanges.updated.push(savedPost);
            }
          }
        } catch (error) {
          this.logger.error(
            `Erreur lors de la mise à jour du post ${postData.id}:`,
            error,
          );
        }
      }
    }

    // Traiter les suppressions
    if (deleted.length > 0) {
      for (const postId of deleted) {
        try {
          const existingPost = await this.postRepository.findOne({
            where: { id: postId },
          });

          if (existingPost) {
            await this.postRepository.remove(existingPost);
            processedChanges.deleted.push(postId);
          }
        } catch (error) {
          this.logger.error(
            `Erreur lors de la suppression du post ${postId}:`,
            error,
          );
        }
      }
    }

    return processedChanges;
  }

  private async processCommentChanges(
    changes: SyncChanges,
  ): Promise<SyncChanges> {
    const { created, updated, deleted } = changes;
    const processedChanges: SyncChanges = {
      created: [],
      updated: [],
      deleted: [],
    };

    // Traiter les créations
    if (created.length > 0) {
      for (const commentData of created) {
        try {
          const comment = this.commentRepository.create(commentData);
          const savedComment = await this.commentRepository.save(comment);
          processedChanges.created.push(savedComment);
        } catch (error) {
          this.logger.error(
            `Erreur lors de la création du commentaire ${commentData.id}:`,
            error,
          );
        }
      }
    }

    // Traiter les mises à jour
    if (updated.length > 0) {
      for (const commentData of updated) {
        try {
          const existingComment = await this.commentRepository.findOne({
            where: { id: commentData.id },
          });

          if (existingComment) {
            const conflict = await this.resolveCommentConflict(
              existingComment,
              commentData,
            );
            if (conflict.resolution === 'server') {
              Object.assign(existingComment, commentData);
              const savedComment =
                await this.commentRepository.save(existingComment);
              processedChanges.updated.push(savedComment);
            }
          }
        } catch (error) {
          this.logger.error(
            `Erreur lors de la mise à jour du commentaire ${commentData.id}:`,
            error,
          );
        }
      }
    }

    // Traiter les suppressions
    if (deleted.length > 0) {
      for (const commentId of deleted) {
        try {
          const existingComment = await this.commentRepository.findOne({
            where: { id: commentId },
          });

          if (existingComment) {
            await this.commentRepository.remove(existingComment);
            processedChanges.deleted.push(commentId);
          }
        } catch (error) {
          this.logger.error(
            `Erreur lors de la suppression du commentaire ${commentId}:`,
            error,
          );
        }
      }
    }

    return processedChanges;
  }

  private async resolvePostConflict(
    serverPost: Post,
    clientPost: any,
  ): Promise<SyncConflict> {
    // Stratégie simple : le serveur gagne si le client est plus ancien
    if (new Date(clientPost.updatedAt) < serverPost.updatedAt) {
      return {
        entityType: 'post',
        entityId: serverPost.id,
        localVersion: clientPost,
        serverVersion: serverPost,
        resolution: 'server',
      };
    }

    return {
      entityType: 'post',
      entityId: serverPost.id,
      localVersion: clientPost,
      serverVersion: serverPost,
      resolution: 'local',
    };
  }

  private async resolveCommentConflict(
    serverComment: Comment,
    clientComment: any,
  ): Promise<SyncConflict> {
    if (new Date(clientComment.updatedAt) < serverComment.updatedAt) {
      return {
        entityType: 'comment',
        entityId: serverComment.id,
        localVersion: clientComment,
        serverVersion: serverComment,
        resolution: 'server',
      };
    }

    return {
      entityType: 'comment',
      entityId: serverComment.id,
      localVersion: clientComment,
      serverVersion: serverComment,
      resolution: 'local',
    };
  }

  async getChangesSince(timestamp: number): Promise<SyncResponse> {
    const date = new Date(timestamp);

    const posts = await this.postRepository.find({
      where: [{ createdAt: date }, { updatedAt: date }],
      relations: ['user'],
    });

    const comments = await this.commentRepository.find({
      where: [{ createdAt: date }, { updatedAt: date }],
      relations: ['user', 'post'],
    });

    return {
      changes: {
        posts: {
          created: posts.filter((p) => p.createdAt >= date),
          updated: posts.filter(
            (p) => p.updatedAt >= date && p.createdAt < date,
          ),
          deleted: [],
        },
        comments: {
          created: comments.filter((c) => c.createdAt >= date),
          updated: comments.filter(
            (c) => c.updatedAt >= date && c.createdAt < date,
          ),
          deleted: [],
        },
      },
      timestamp: Date.now(),
    };
  }
}
