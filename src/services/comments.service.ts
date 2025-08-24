import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { postId, body } = createCommentDto;

    // Vérifier que le post existe
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    const comment = this.commentRepository.create({
      body,
      postId,
      userId: user.id,
    });

    // Mettre à jour lastEventAt du post
    await this.postRepository.update(postId, {
      lastEventAt: new Date(),
    });

    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['user', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.userId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres commentaires');
    }

    Object.assign(comment, updateCommentDto);

    return this.commentRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires');
    }

    await this.commentRepository.remove(comment);
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { userId },
      relations: ['post'],
      order: { createdAt: 'DESC' },
    });
  }
}
