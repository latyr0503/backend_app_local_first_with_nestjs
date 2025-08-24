import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
  // Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  // ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Comment as CommentEntity } from '../entities/comment.entity';
import { User } from 'src/entities/user.entity';

@ApiTags('Commentaires')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau commentaire' })
  @ApiResponse({
    status: 201,
    description: 'Commentaire créé avec succès',
    type: CommentEntity,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Post non trouvé' })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.commentsService.create(createCommentDto, tempUser);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les commentaires' })
  @ApiResponse({
    status: 200,
    description: 'Liste des commentaires récupérée avec succès',
    type: [CommentEntity],
  })
  async findAll() {
    return this.commentsService.findAll();
  }

  @Get('post/:postId')
  @ApiOperation({ summary: "Obtenir les commentaires d'un post spécifique" })
  @ApiParam({ name: 'postId', description: 'ID du post' })
  @ApiResponse({
    status: 200,
    description: 'Commentaires du post récupérés avec succès',
    type: [CommentEntity],
  })
  async findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: "Obtenir les commentaires d'un utilisateur spécifique",
  })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: "Commentaires de l'utilisateur récupérés avec succès",
    type: [CommentEntity],
  })
  async findByUser(@Param('userId') userId: string) {
    return this.commentsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un commentaire spécifique' })
  @ApiParam({ name: 'id', description: 'ID du commentaire' })
  @ApiResponse({
    status: 200,
    description: 'Commentaire récupéré avec succès',
    type: CommentEntity,
  })
  @ApiResponse({ status: 404, description: 'Commentaire non trouvé' })
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un commentaire' })
  @ApiParam({ name: 'id', description: 'ID du commentaire' })
  @ApiResponse({
    status: 200,
    description: 'Commentaire modifié avec succès',
    type: CommentEntity,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  // @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Commentaire non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.commentsService.update(id, updateCommentDto, tempUser);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un commentaire' })
  @ApiParam({ name: 'id', description: 'ID du commentaire' })
  @ApiResponse({ status: 200, description: 'Commentaire supprimé avec succès' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  // @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Commentaire non trouvé' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.commentsService.remove(id, tempUser);
  }
}
