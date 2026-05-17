# TASK-F-07 - Connexion espace admin

## Métadonnées
- Feature ID: `F-07`
- Priorité: `P0`
- Persona: `Admin`
- Branche: `feat/F-07-auth-admin`
- Dépendances: aucune

## Objectif
Permettre à un admin de se connecter et d'accéder à l'espace d'administration sécurisé.

## Plan de tests (à écrire en premier)
- [x] Unitaire: règles d'accès (auth guard)
- [x] Intégration: login réussi/échoué
- [x] E2E: accès dashboard après connexion
- [x] Cas sécurité: route admin inaccessible non authentifié

## Critères d'acceptation (DoD)
- [x] Le scénario `F-07` de `features.md` passe
- [x] Redirection propre vers login si non connecté
- [x] Session sécurisée et expiration gérée
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-07`
- [ ] Notes sécurité ajoutées dans la description PR
