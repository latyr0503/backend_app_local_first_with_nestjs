import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '../dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      userId: user.id,
      lastEventAt: new Date(),
    });

    return this.postRepository.save(post);
  }

  async findAll(query: PostQueryDto) {
    const {
      page = '1',
      limit = '10',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .addSelect('COUNT(comments.id)', 'commentCount')
      .groupBy('post.id')
      .addGroupBy('user.id')
      .addGroupBy('comments.id');

    if (search) {
      queryBuilder.where(
        '(post.title ILIKE :search OR post.body ILIKE :search OR post.subtitle ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`post.${sortBy}`, sortOrder).skip(skip).take(limitNum);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.userId !== user.id) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres posts',
      );
    }

    Object.assign(post, {
      ...updatePostDto,
      lastEventAt: new Date(),
    });

    return this.postRepository.save(post);
  }

  async remove(id: string, user: User): Promise<void> {
    const post = await this.findOne(id);

    if (post.userId !== user.id) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres posts',
      );
    }

    await this.postRepository.remove(post);
  }

  async findComments(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    return post.comments;
  }

  async findPinnedPosts(): Promise<Post[]> {
    return this.postRepository.find({
      where: { isPinned: true },
      relations: ['user'],
      order: { lastEventAt: 'DESC' },
    });
  }

  async searchPosts(searchTerm: string): Promise<Post[]> {
    return this.postRepository.find({
      where: [
        { title: ILike(`%${searchTerm}%`) },
        { body: ILike(`%${searchTerm}%`) },
        { subtitle: ILike(`%${searchTerm}%`) },
      ],
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
