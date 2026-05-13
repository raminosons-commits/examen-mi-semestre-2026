# API École de Formation

API REST développée avec Node.js, Express, Sequelize et MySQL pour gérer les étudiants, formateurs, cours, inscriptions, génération de description par IA et webhook de paiement.

## Technologies
- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- Swagger/OpenAPI 3.0
- Postman
- OpenAI ou alternative compatible
- Webhook HMAC SHA-256

## Fonctionnalités
- Authentification JWT.
- Gestion des étudiants.
- Gestion des formateurs.
- Gestion des cours.
- Gestion des inscriptions.
- Génération de description marketing par IA.
- Webhook de paiement avec vérification de signature.

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/TON_UTILISATEUR/NOM_DU_REPO.git
cd NOM_DU_REPO
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l’environnement
Créer un fichier `.env` à partir de `.env.example` puis remplir les variables :

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=ecole_formation
JWT_SECRET=your_jwt_secret_here
WEBHOOK_SECRET=secret_examen_2026
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

### 4. Créer la base de données MySQL
```sql
CREATE DATABASE ecole_formation;
```

### 5. Lancer le seed
```bash
node src/seeders/seed.js
```

### 6. Démarrer le serveur
```bash
node index.js
```

## Accès
- API : `http://localhost:3000/api/v1`
- Swagger : `http://localhost:3000/api/documentation` ou l’URL configurée dans mon projet

## Authentification
La connexion se fait avec l’email d’un étudiant.

### Exemple
```http
POST /api/v1/auth/login
```

Body :
```json
{
  "email": "lindo@email.com"
}
```

Le token retourné doit ensuite être envoyé dans le header :
```http
Authorization: Bearer <token>
```

## les endpoints

### Auth
- POST /api/v1/auth/login

### Students
- GET /api/v1/students
- POST /api/v1/students
- GET /api/v1/students/:id
- PUT /api/v1/students/:id
- DELETE /api/v1/students/:id

### Courses
- GET /api/v1/courses
- POST /api/v1/courses
- GET /api/v1/courses/:id
- PUT /api/v1/courses/:id
- DELETE /api/v1/courses/:id
- POST /api/v1/courses/:id/generate-description
- GET /api/v1/courses/:id/description

### Instructors
- GET /api/v1/instructors
- POST /api/v1/instructors

### Enrollments
- POST /api/v1/enrollments
- PATCH /api/v1/enrollments/:id/complete
- GET /api/v1/enrollments

### Webhook
- POST /api/v1/webhooks/payment

## petit remarque
- La description d’un cours est générée une seule fois et réutilisée ensuite.
- Le webhook vérifie une signature HMAC-SHA256.
- Si la signature est invalide, l’API retourne `401`.

## Codes HTTP
- `200` OK
- `201` Created
- `204` No Content
- `401` Unauthorized
- `404` Not Found
- `409` Conflict
- `422` Unprocessable Entity
- `503` Service Unavailable

## Structure du projet
.
├── index.js
├── openapi.yaml
├── README.md
├── .env.example
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   └── utils/
