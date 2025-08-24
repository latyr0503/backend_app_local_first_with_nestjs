import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncController } from '../controllers/sync.controller';
import { SyncService } from '../services/sync.service';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
