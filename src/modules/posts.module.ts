import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from '../controllers/posts.controller';
import { PostsService } from '../services/posts.service';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
