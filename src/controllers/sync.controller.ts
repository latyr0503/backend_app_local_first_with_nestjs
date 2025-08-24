import {
  Controller,
  Post,
  Get,
  Body,
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
  ApiQuery,
} from '@nestjs/swagger';
import { SyncService } from '../services/sync.service';
import { SyncRequest, SyncResponse } from '../dto/sync.dto';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { User } from 'src/entities/user.entity';

@ApiTags('Synchronisation')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Pousser les changements locaux vers le serveur' })
  @ApiResponse({
    status: 200,
    description: 'Changements synchronisés avec succès',
    type: SyncResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Données de synchronisation invalides',
  })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  @HttpCode(HttpStatus.OK)
  async push(
    @Body() syncRequest: SyncRequest,
    // @Request() req: Request & { user: User },
  ) {
    // Log de la synchronisation pour l'utilisateur
    console.log(`Synchronisation push pour l'utilisateur: temp-user-id`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.syncService.push(syncRequest);
  }

  @Post('pull')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les changements du serveur' })
  @ApiQuery({
    name: 'lastPulledAt',
    required: true,
    description: 'Timestamp de la dernière synchronisation',
  })
  @ApiResponse({
    status: 200,
    description: 'Changements récupérés avec succès',
    type: SyncResponse,
  })
  @ApiResponse({ status: 400, description: 'Timestamp invalide' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  @HttpCode(HttpStatus.OK)
  async pull(
    @Query('lastPulledAt') lastPulledAt: string,
    // @Request() req: Request & { user: User },
  ) {
    const timestamp = parseInt(lastPulledAt, 10);
    if (isNaN(timestamp)) {
      throw new Error('Timestamp invalide');
    }

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Synchronisation pull pour l'utilisateur: temp-user-id, depuis: ${new Date(timestamp)}`,
    );
    return this.syncService.pull(timestamp);
  }

  @Get('changes')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtenir les changements depuis une date spécifique',
  })
  @ApiQuery({
    name: 'since',
    required: true,
    description: 'Timestamp depuis lequel récupérer les changements',
  })
  @ApiResponse({
    status: 200,
    description: 'Changements récupérés avec succès',
    type: SyncResponse,
  })
  @ApiResponse({ status: 400, description: 'Timestamp invalide' })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  async getChanges(
    @Query('since') since: string,
    // @Request() req: Request & { user: User },
  ) {
    const timestamp = parseInt(since, 10);
    if (isNaN(timestamp)) {
      throw new Error('Timestamp invalide');
    }

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Récupération des changements pour l'utilisateur: temp-user-id, depuis: ${new Date(timestamp)}`,
    );
    return this.syncService.getChangesSince(timestamp);
  }

  @Get('status')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le statut de la synchronisation' })
  @ApiResponse({
    status: 200,
    description: 'Statut de synchronisation récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        lastSync: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['synced', 'pending', 'error'] },
        pendingChanges: { type: 'number' },
        lastError: { type: 'string' },
      },
    },
  })
  // @ApiResponse({ status: 401, description: 'Non autorisé' })
  getSyncStatus() {
    // @Request() req: Request & { user: User },
    // Simuler un statut de synchronisation
    return {
      lastSync: new Date().toISOString(),
      status: 'synced',
      pendingChanges: 0,
      lastError: null,
    };
  }
}
