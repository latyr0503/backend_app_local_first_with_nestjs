import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from '../services/posts.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '../dto/post.dto';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Post as PostEntity } from '../entities/post.entity';
import { User } from 'src/entities/user.entity';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau post' })
  @ApiResponse({
    status: 201,
    description: 'Post créé avec succès',
    type: PostEntity,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  async create(
    @Body() createPostDto: CreatePostDto,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.postsService.create(createPostDto, tempUser);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les posts avec pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'éléments par page",
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Terme de recherche',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Champ de tri' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Ordre de tri (ASC/DESC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des posts récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get('pinned')
  @ApiOperation({ summary: 'Obtenir les posts épinglés' })
  @ApiResponse({
    status: 200,
    description: 'Posts épinglés récupérés avec succès',
    type: [PostEntity],
  })
  async findPinnedPosts() {
    return this.postsService.findPinnedPosts();
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des posts' })
  @ApiQuery({ name: 'q', required: true, description: 'Terme de recherche' })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche récupérés avec succès',
    type: [PostEntity],
  })
  async searchPosts(@Query('q') searchTerm: string) {
    return this.postsService.searchPosts(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un post spécifique' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({
    status: 200,
    description: 'Post récupéré avec succès',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'Post non trouvé' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: "Obtenir les commentaires d'un post" })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({
    status: 200,
    description: 'Commentaires récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Post non trouvé' })
  async findComments(@Param('id') id: string) {
    return this.postsService.findComments(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({
    status: 200,
    description: 'Post modifié avec succès',
    type: PostEntity,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  // @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Post non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.postsService.update(id, updatePostDto, tempUser);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un post' })
  @ApiParam({ name: 'id', description: 'ID du post' })
  @ApiResponse({ status: 200, description: 'Post supprimé avec succès' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  // @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Post non trouvé' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    // @Request() req: Request & { user: User },
  ) {
    // Créer un utilisateur temporaire pour le développement
    const tempUser = { id: 'temp-user-id' } as User;
    return this.postsService.remove(id, tempUser);
  }
}
