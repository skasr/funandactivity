# FunAndActivity

Plateforme de réservation d'activités et d'expériences locales, inspirée d'Airbnb.  
Projet étudiant — React + Node.js + MySQL.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Base de données | MySQL |
| Auth | JWT + bcrypt |
| Style | CSS modulaire (un fichier par composant) |

---

## Fonctionnalités

- **Authentification** — inscription / connexion avec deux rôles : `hote` et `visiteur`
- **Expériences** — CRUD complet (créer, lire, modifier, supprimer)
- **Réservations** — créer et annuler une réservation
- **Page d'accueil** — barre de recherche par mot clé + filtres par catégorie
- **Dashboard hôte** — liste de ses expériences avec boutons Voir / Modifier / Supprimer
- **Dashboard visiteur** — liste de ses réservations avec bouton Annuler
- **Chatbot** — pose 3 questions et suggère des activités adaptées

---

## Structure du projet

```
funandactivity/
├── backend/
│   ├── server.js
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── middleware/authMiddleware.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── experienceController.js
│       │   └── reservationController.js
│       └── routes/
│           ├── authRoutes.js
│           ├── experienceRoutes.js
│           └── reservationRoutes.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ExperienceCard.jsx
        │   ├── ProtectedRoute.jsx
        │   └── Chatbot.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Detail.jsx
            ├── Dashboard.jsx
            ├── NewExperience.jsx
            └── EditExperience.jsx
```

---

## Installation et lancement

### Prérequis

- Node.js >= 18
- MySQL en cours d'exécution

### 1. Base de données

Créer une base MySQL et importer le schéma (tables `users`, `experiences`, `reservations`).

### 2. Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=funandactivity
JWT_SECRET=une_cle_secrete
PORT=3000
```

Lancer le serveur :

```bash
node server.js
```

Le backend tourne sur `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`.

---

## API — routes principales

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |

### Expériences
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/experiences` | Non | Liste (params : `categorie`, `search`) |
| GET | `/api/experiences/:id` | Non | Détail |
| GET | `/api/experiences/mes-experiences` | Oui | Expériences de l'hôte connecté |
| POST | `/api/experiences` | Oui (hôte) | Créer |
| PUT | `/api/experiences/:id` | Oui (hôte) | Modifier |
| DELETE | `/api/experiences/:id` | Oui (hôte) | Supprimer |

### Réservations
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/reservations` | Oui | Créer une réservation |
| GET | `/api/reservations/mes-reservations` | Oui | Réservations du visiteur connecté |
| PUT | `/api/reservations/:id/annuler` | Oui | Annuler une réservation |

> Le token JWT est envoyé dans le header `authorization` (sans préfixe Bearer).
