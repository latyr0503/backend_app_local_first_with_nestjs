import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
    rawBody: true,
    bufferLogs: true,
  });
  app.flushLogs();
  // Configuration CORS universelle
  app.enableCors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle(
      '📌 API Heber Sénégal – Collecte et Gestion des Données Agricoles',
    )
    .setDescription(
      `Cette API permet la digitalisation et la gestion des activités agricoles au sein de la plateforme Heber Sénégal.

Elle fournit des fonctionnalités adaptées aux différents profils utilisateurs :

• Agents de terrain : saisie des données agricoles sur le terrain, même en mode hors-ligne, avec synchronisation automatique.

• Superviseurs : suivi et gestion des agents de terrain, regroupement des équipes, validation et contrôle des données collectées.

• Administrateurs : gestion globale des utilisateurs, des exploitations agricoles et des rapports consolidés.

• Producteurs : consultation et mise à jour de leurs informations agricoles.

L'API est conçue pour supporter un fonctionnement offline-first, avec synchronisation côté backend dès que la connexion est disponible.

Elle expose des endpoints sécurisés pour :
• la gestion des utilisateurs et rôles
• la collecte et consultation des données agricoles
• le suivi des activités sur le terrain
• la génération de rapports et statistiques`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application démarrée sur le port ${port}`);
  console.log(
    `📚 Documentation Swagger disponible sur http://localhost:${port}/api `,
  );
  console.log(`🌐 Accessible depuis l'émulateur sur http://10.0.2.2:${port}`);
}
bootstrap();
