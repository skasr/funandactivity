# FunAndActivity

Plateforme de réservation d'expériences locales — inspirée d'Airbnb.  
Les hôtes publient des activités, les visiteurs les découvrent, les réservent et échangent avec les hôtes.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Base de données | MySQL |
| Authentification | JWT + bcrypt |
| Carte | Leaflet + OpenStreetMap / Nominatim |
| Style | CSS modulaire par composant |

---

## Fonctionnalités

### Comptes & profil
- Inscription / connexion avec deux rôles : **hôte** et **visiteur**
- Modification du profil (nom, email, mot de passe) depuis le dashboard

### Expériences
- CRUD complet pour les hôtes (créer, modifier, supprimer)
- Upload de photos directement sur le serveur (JPG, PNG, WebP — max 10 Mo)
- Géocodage automatique de la localisation via Nominatim (OpenStreetMap)
- Mini-carte Leaflet sur la page détail

### Recherche & découverte
- Barre de recherche avec debounce (titre, description, ville, nom de l'hôte)
- Filtres : catégorie, prix min/max, tri (récent, prix croissant/décroissant)
- Vue grille ou vue carte interactive avec marqueurs cliquables

### Réservations
- Réserver une expérience (date + nombre de personnes)
- Annuler une réservation depuis le dashboard

### Messagerie
- Conversation entre visiteur et hôte rattachée à une expérience
- Badge de messages non lus dans la navbar (rafraîchissement toutes les 10 s)

### Avis
- Note (1–5 étoiles) et commentaire sur une expérience réservée

### Chatbot
- Assistant intégré : pose 3 questions et suggère des activités adaptées

---

## Structure du projet

```
funandactivity/
├── database.sql
├── backend/
│   ├── server.js
│   ├── .env
│   ├── uploads/              ← photos uploadées
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── middleware/authMiddleware.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── experienceController.js
│       │   ├── reservationController.js
│       │   ├── avisController.js
│       │   └── conversationController.js
│       └── routes/
│           ├── authRoutes.js
│           ├── experienceRoutes.js
│           ├── reservationRoutes.js
│           ├── avisRoutes.js
│           ├── conversationRoutes.js
│           └── uploadRoutes.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── index.css
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ExperienceCard.jsx
        │   ├── MapView.jsx
        │   ├── ProtectedRoute.jsx
        │   └── Chatbot.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Detail.jsx
            ├── Dashboard.jsx
            ├── NewExperience.jsx
            ├── EditExperience.jsx
            ├── Messagerie.jsx
            ├── Conversation.jsx
            └── NotFound.jsx
```

---

## Installation

### Prérequis

- Node.js >= 18
- MySQL en cours d'exécution

### 1. Base de données

Créer une base MySQL et importer le schéma :

```bash
mysql -u root -p funandactivity < database.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=funandactivity
JWT_SECRET=une_cle_secrete
PORT=3000
```

Lancer le serveur :

```bash
npm run dev
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
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| PUT | `/api/auth/profil` | Oui | Modifier son profil |

### Expériences
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/experiences` | Non | Liste (params : `search`, `categorie`, `prix_min`, `prix_max`, `sort`) |
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

### Messagerie
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/conversations` | Oui | Créer ou retrouver une conversation |
| GET | `/api/conversations` | Oui | Toutes ses conversations |
| GET | `/api/conversations/non-lus` | Oui | Nombre de messages non lus |
| GET | `/api/conversations/:id` | Oui | Messages d'une conversation |
| POST | `/api/conversations/:id/messages` | Oui | Envoyer un message |

### Avis
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/experiences/:id/avis` | Non | Avis d'une expérience |
| POST | `/api/experiences/:id/avis` | Oui | Publier un avis |

### Upload
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/upload` | Oui | Uploader une image, retourne son URL |

> Le token JWT est envoyé dans le header `authorization` (sans préfixe Bearer).
