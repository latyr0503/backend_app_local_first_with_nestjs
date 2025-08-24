import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SyncPost {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  subtitle?: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  isPinned: boolean;

  @ApiProperty()
  lastEventAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: string;
}

export class SyncComment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SyncChanges {
  @ApiProperty({ type: [SyncPost] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncPost)
  created: SyncPost[];

  @ApiProperty({ type: [SyncPost] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncPost)
  updated: SyncPost[];

  @ApiProperty({ type: [String] })
  @IsArray()
  deleted: string[];
}

export class SyncRequest {
  @ApiProperty()
  @IsNumber()
  lastPulledAt: number;

  @ApiProperty()
  changes: {
    posts: SyncChanges;
    comments: {
      created: SyncComment[];
      updated: SyncComment[];
      deleted: string[];
    };
  };
}

export class SyncResponse {
  @ApiProperty()
  changes: {
    posts: SyncChanges;
    comments: {
      created: SyncComment[];
      updated: SyncComment[];
      deleted: string[];
    };
  };

  @ApiProperty()
  timestamp: number;
}
