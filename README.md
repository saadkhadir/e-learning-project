# 🎓 Plateforme E-Learning

Un projet d'exemple combinant Keycloak (authentification & autorisation), un backend Spring Boot (API REST) et une interface frontend en React. Ce dépôt implémente la gestion de cours avec contrôle d'accès par rôles (ADMIN, STUDENT).

---

## 🧭 Vue d'ensemble

- Backend : Spring Boot (Java) exposant une API REST sous `/api` (port 8081).
- Frontend : React (Create React App) servant l'interface utilisateur (port 3000).
- Auth : Keycloak (serveur d'identité) pour gérer realm, clients et rôles (port 8080).

Architecture :
- Keycloak délivre des JWT utilisés par le backend (Resource Server) et le frontend.
- Le backend expose des endpoints protégés par rôles (ex : `STUDENT`, `ADMIN`).
- Le frontend consomme l'API et attache le token via axios.

---

## 🚀 Prérequis

- Java 17+ et Maven
- Node.js 16+ et npm
- Docker & Docker Compose (optionnel mais recommandé pour un démarrage rapide)
- Keycloak (ou accès à une instance Keycloak)

Ports par défaut :
- Keycloak : http://localhost:8080
- Backend : http://localhost:8083
- Frontend : http://localhost:3000

---

## ⚙️ Configuration Keycloak (résumé)

Créez un realm (ex. `elearning-realm`) et configurez :

- Client public/confidential : `react-client` (utilisé par l'app React)
  - Redirect URI : `http://localhost:3000/*`
  - Service account (si nécessaire)
- Rôles à définir dans le realm : `ADMIN`, `STUDENT`
- Assurez-vous que le token JWT contient `resource_access.react-client.roles` si vous utilisez la configuration actuelle du backend.

Conseil : importer une configuration JSON Keycloak si disponible pour gagner du temps.

---

## 🖥️ Démarrage rapide

Option A — Docker Compose :

1. Vérifiez le fichier `docker-compose.yaml` à la racine (il peut contenir Keycloak, la base de données et les services).
2. Lancer :

   docker-compose up --build

Option B — Lancer localement

1. Keycloak : lancer ou utiliser une instance existante sur `http://localhost:8080`.
2. Backend (API) :

   mvn clean package
   mvn spring-boot:run

   ou :
   java -jar target/<votre-jar>.jar

3. Frontend (React) :

   cd elearning-frontend
   npm install
   npm start

---

## 📦 Structure importante du projet

- /src (backend Spring Boot)
  - controller/CoursController.java  — endpoints REST pour les cours
  - service/CoursSevice{,Impl}.java   — logique métier
  - entity/Cours.java                 — entité JPA
  - config/SecurityConfig.java        — config sécurité JWT & roles

- /elearning-frontend (React)
  - src/Keycloak.js                   — configuration cliente Keycloak
  - src/api/axios.js                  — instance axios qui attache le token
  - src/App.js                        — gestion de l'auth, affichage selon rôle
  - src/components/*                  — UI: CourseList, CourseManagement, UserProfile

---

## 🔐 Sécurité & rôles

- Les routes du backend sont protégées via Spring Security (oauth2 resource server).
- Roles utilisés : `ADMIN`, `STUDENT`.
- Endpoints clés (exemples) :
  - GET /api/cours            — requires STUDENT or ADMIN
  - GET /api/cours/{id}       — requires STUDENT or ADMIN
  - POST /api/cours           — requires ADMIN
  - PUT /api/cours/{id}       — requires ADMIN
  - DELETE /api/cours/{id}    — requires ADMIN
  - GET /api/cours/me         — informations de l'utilisateur connecté (username, email, roles)

Note : le backend lit les rôles via la claim `resource_access.react-client.roles` et les transforme en autorités Spring (SimpleGrantedAuthority).

---

## 🔁 Flux d'authentification (frontend)

- Le frontend utilise `keycloak-js` (fichier `src/Keycloak.js`).
- Après initialisation, le token est envoyé par axios via un interceptor (`elearning-frontend/src/api/axios.js`).
- Les appels 401 déclenchent une tentative de refresh (`keycloak.updateToken`) puis un retry.

---

## 🧪 Tests & développement

- Backend : tests unitaires JUnit (dossier `src/test`)
- Frontend : utilisez `npm test` pour lancer les tests React (setup CRA)

---

## 🐞 Dépannage rapide

- Erreur CORS : vérifiez que `SecurityConfig` expose `http://localhost:3000` et que le frontend utilise le bon port.
- Token non envoyé : assurez-vous que `keycloak.token` est présent avant d'appeler l'API. Le frontend gère un updateToken avant les requêtes importantes.
- 403 Forbidden : vérifiez les rôles dans Keycloak et que l'utilisateur a bien le rôle attendu (`ADMIN` pour modification/création).

---

## 🧾 Exemples de requêtes

- Récupérer la liste des cours (avec token) :

  curl -H "Authorization: Bearer <TOKEN>" http://localhost:8083/api/cours

- Récupérer l'utilisateur courant :

  curl -H "Authorization: Bearer <TOKEN>" http://localhost:8083/api/cours/me

---

