README (FR)
===========

Ce fichier explique comment démarrer le projet et documente les scripts présents dans les `package.json`.

1) Scripts importants (racine)
- `npm run start:backend` : démarre le backend (exécute `npm run start` dans `backend`).
- `npm run start:frontend` : démarre le frontend (exécute `npm run dev` dans `frontend`).
- `npm run dev` : démarre backend + frontend simultanément via `concurrently` (installé en devDependencies à la racine).

2) Installation des dépendances
- Backend :
  - Se placer dans `backend` puis :

```bash
cd /d C:\Users\defaultuser0\Desktop\projet\backend
npm install
```

- Frontend :
  - Se placer dans `frontend` puis :

```bash
cd /d C:\Users\defaultuser0\Desktop\projet\frontend
npm install
```

- Racine (pour `concurrently`) :

```bash
cd /d C:\Users\defaultuser0\Desktop\projet
npm install
```

3) Pourquoi on ne met pas de commentaires dans `package.json` ?
- Le format `package.json` est du JSON standard qui ne supporte pas les commentaires. Ajouter des commentaires invaliderait le fichier.
- Solution : utiliser un fichier de documentation (comme ce `README-fr.md`) pour expliquer les scripts, dépendances et conventions.

4) Fichiers modifiés récemment
- `frontend/src/pages/dashbord/ManageUsers.jsx` : commentaires en français ajoutés en tête du fichier ; remplacements des boutons texte par des icônes (`react-icons`) ; masque du bouton Supprimer pour les admins.
- `package.json` (racine et `frontend/package.json`) : scripts et dépendances ajoutés. Rappels : ne pas ajouter de commentaires dans ces fichiers JSON.

5) Conseils de sécurité
- L'UI masque la suppression d'admins, mais il faut aussi vérifier côté backend (contrôler le rôle avant suppression).

Si vous voulez que je traduise en français d'autres fichiers JS (ajouter des commentaires), dites-moi lesquels et je les documenterai de la même manière.