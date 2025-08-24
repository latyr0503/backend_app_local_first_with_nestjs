# 🍉 Backend WatermelonDB - API Posts et Commentaires

Backend NestJS complet pour une application de posts et commentaires avec synchronisation WatermelonDB.

## 🚀 Fonctionnalités

- **Authentification JWT** avec refresh tokens
- **Gestion des posts** (CRUD complet)
- **Gestion des commentaires** (CRUD complet)
- **Synchronisation WatermelonDB** bidirectionnelle
- **API REST** documentée avec Swagger
- **Validation des données** avec class-validator
- **Base de données PostgreSQL** avec TypeORM
- **Sécurité** avec bcrypt et rate limiting
- **CORS** configuré pour React Native

## 🏗️ Architecture

```
src/
├── controllers/         # Contrôleurs API
├── services/            # Logique métier
├── entities/            # Modèles de données TypeORM
├── dto/                 # Objets de transfert de données
├── modules/             # Modules NestJS
├── guards/              # Guards d'authentification
├── strategies/          # Stratégies Passport
└── interfaces/          # Interfaces TypeScript
```

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd backend-watermelondb
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**

Éditer le fichier `.env` avec vos configurations :
```env
# Configuration de la base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=watermelondb

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Configuration de l'application
NODE_ENV=development
PORT=3000
```

4. **Créer la base de données PostgreSQL**
```sql
CREATE DATABASE watermelondb;
```

5. **Lancer l'application**
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Endpoints

### 🔐 Authentification
- `POST /auth/register` - Inscription utilisateur
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/refresh` - Rafraîchir le token

### 📝 Posts
- `POST /posts` - Créer un post
- `GET /posts` - Lister tous les posts (avec pagination)
- `GET /posts/:id` - Obtenir un post spécifique
- `PUT /posts/:id` - Modifier un post
- `DELETE /posts/:id` - Supprimer un post
- `GET /posts/:id/comments` - Obtenir les commentaires d'un post
- `GET /posts/pinned` - Obtenir les posts épinglés
- `GET /posts/search?q=term` - Rechercher des posts

### 💬 Commentaires
- `POST /comments` - Créer un commentaire
- `GET /comments` - Lister tous les commentaires
- `GET /comments/:id` - Obtenir un commentaire spécifique
- `PUT /comments/:id` - Modifier un commentaire
- `DELETE /comments/:id` - Supprimer un commentaire
- `GET /comments/post/:postId` - Obtenir les commentaires d'un post
- `GET /comments/user/:userId` - Obtenir les commentaires d'un utilisateur

### 🔄 Synchronisation WatermelonDB
- `POST /sync/push` - Pousser les changements locaux
- `POST /sync/pull` - Récupérer les changements du serveur
- `GET /sync/changes` - Obtenir les changements depuis une date
- `GET /sync/status` - Obtenir le statut de la synchronisation

## 🔄 Synchronisation WatermelonDB

### Format de synchronisation

**Requête de synchronisation :**
```typescript
interface SyncRequest {
  lastPulledAt: number;
  changes: {
    posts: {
      created: Post[];
      updated: Post[];
      deleted: string[];
    };
    comments: {
      created: Comment[];
      updated: Comment[];
      deleted: string[];
    };
  };
}
```

**Réponse de synchronisation :**
```typescript
interface SyncResponse {
  changes: {
    posts: {
      created: Post[];
      updated: Post[];
      deleted: string[];
    };
    comments: {
      created: Comment[];
      updated: Comment[];
      deleted: string[];
    };
  };
  timestamp: number;
}
```

### Gestion des conflits

Le système utilise une stratégie de résolution des conflits basée sur les timestamps :
- Les entités plus récentes ont priorité
- Les conflits sont loggés pour analyse
- Possibilité d'implémenter une résolution manuelle

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📖 Documentation API

La documentation Swagger est disponible à l'adresse :
```
http://localhost:3000/api
```

## 🔒 Sécurité

- **JWT** avec expiration courte (15min) et refresh tokens (7 jours)
- **Hachage des mots de passe** avec bcrypt (salt rounds: 10)
- **Validation des données** avec class-validator
- **CORS** configuré pour React Native
- **Rate limiting** (à implémenter)

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-production-jwt-secret
```

### Docker (optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 📝 Exemples d'utilisation

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'
```

### Créer un post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier post",
    "body": "Contenu du post...",
    "isPinned": false
  }'
```

### Synchronisation WatermelonDB
```bash
curl -X POST http://localhost:3000/sync/push \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lastPulledAt": 1640995200000,
    "changes": {
      "posts": {
        "created": [],
        "updated": [],
        "deleted": []
      },
      "comments": {
        "created": [],
        "updated": [],
        "deleted": []
      }
    }
  }'
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Swagger
- Vérifier les logs de l'application

## 🔮 Roadmap

- [ ] Notifications en temps réel (WebSockets)
- [ ] Rate limiting avancé
- [ ] Métriques de performance
- [ ] Tests de charge
- [ ] Monitoring et alerting
- [ ] Cache Redis
- [ ] Logs structurés
- [ ] API GraphQL
