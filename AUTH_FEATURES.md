# Nouvelles Fonctionnalités d'Authentification

## Vue d'ensemble

Le système d'authentification a été enrichi avec de nouveaux champs pour l'entité utilisateur, offrant une gestion plus complète des profils utilisateurs.

## Nouveaux Champs Utilisateur

### Champs Obligatoires
- **email** : Adresse email unique de l'utilisateur
- **username** : Nom d'utilisateur unique (3-30 caractères)
- **password** : Mot de passe (minimum 6 caractères)
- **phone_number** : Numéro de téléphone de l'utilisateur
- **adresse** : Adresse physique de l'utilisateur
- **sexe** : Genre de l'utilisateur (HOMME ou FEMME)

### Champs Optionnels
- **role** : Rôle de l'utilisateur dans le système (par défaut: AGENT)

## Rôles Utilisateur

Le système supporte 4 rôles différents :

1. **PRODUCTEUR** : Utilisateurs qui produisent du contenu
2. **AGENT** : Utilisateurs de base (rôle par défaut)
3. **GESTIONNAIRE** : Utilisateurs avec des privilèges de gestion
4. **SUPERVISEUR** : Utilisateurs avec des privilèges d'administration

## Endpoints d'Authentification

### 1. Inscription (`POST /auth/register`)

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "password123",
  "phone_number": "+221701234567",
  "adresse": "123 Rue de la Paix, Dakar",
  "sexe": "HOMME",
  "role": "AGENT"
}
```

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username123",
    "phone_number": "+221701234567",
    "adresse": "123 Rue de la Paix, Dakar",
    "sexe": "HOMME",
    "role": "AGENT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### 2. Connexion (`POST /auth/login`)

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :** Même format que l'inscription

### 3. Rafraîchissement du Token (`POST /auth/refresh`)

**Corps de la requête :**
```json
{
  "refreshToken": "refresh_token"
}
```

### 4. Mise à jour du Profil (`PUT /auth/profile`)

**Headers :** `Authorization: Bearer <access_token>`

**Corps de la requête :**
```json
{
  "username": "nouveau_username",
  "phone_number": "+221709876543",
  "adresse": "Nouvelle adresse",
  "sexe": "FEMME",
  "role": "GESTIONNAIRE"
}
```

**Réponse :**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "nouveau_username",
  "phone_number": "+221709876543",
  "adresse": "Nouvelle adresse",
  "sexe": "FEMME",
  "role": "GESTIONNAIRE",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Validation des Données

### Règles de Validation
- **email** : Format email valide et unique
- **username** : 3-30 caractères, unique
- **password** : Minimum 6 caractères
- **phone_number** : Chaîne de caractères
- **adresse** : Chaîne de caractères
- **sexe** : Enum (HOMME ou FEMME)
- **role** : Enum (PRODUCTEUR, AGENT, GESTIONNAIRE, SUPERVISEUR)

### Gestion des Erreurs
- **409 Conflict** : Email ou username déjà utilisé
- **401 Unauthorized** : Identifiants invalides ou token expiré
- **400 Bad Request** : Données de validation invalides

## Sécurité

- Mots de passe hashés avec bcrypt (salt rounds: 10)
- Tokens JWT avec expiration (access: 15min, refresh: 7 jours)
- Validation des tokens avec guard JWT
- Protection des routes sensibles

## Tests

Le service d'authentification inclut des tests unitaires complets couvrant :
- Inscription réussie
- Gestion des conflits (utilisateur existant)
- Connexion réussie
- Gestion des erreurs d'authentification
- Validation des nouveaux champs

## Migration

Si vous avez une base de données existante, assurez-vous de :
1. Ajouter les nouvelles colonnes à la table `users`
2. Définir des valeurs par défaut appropriées
3. Mettre à jour les contraintes de base de données

## Exemple d'Utilisation

```typescript
// Inscription d'un nouveau producteur
const newProducer = await authService.register({
  email: "producteur@example.com",
  username: "producteur123",
  password: "motdepasse123",
  phone_number: "+221701234567",
  adresse: "Ferme de Dakar",
  sexe: Sexe.HOMME,
  role: UserRole.PRODUCTEUR
});

// Mise à jour du profil
const updatedProfile = await authService.updateProfile(userId, {
  phone_number: "+221709876543",
  adresse: "Nouvelle ferme"
});
```
