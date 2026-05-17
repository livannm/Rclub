# TASK-X-03 - Stats dashboard admin

## Métadonnées
- Feature ID: `X-03`
- Priorité: `P2`
- Persona: `Admin`
- Branche: `feat/X-03-stats-dashboard-admin`
- Dépendances: `F-07`, `F-10`, `F-04`, `F-06`, `F-11`

## Objectif
Afficher des statistiques simples sur le tableau de bord admin afin de donner une vue rapide de l'activité du site.

## Plan de tests (à écrire en premier)
- [x] Unitaire: agrégation des événements totaux/publiés/à venir
- [x] Unitaire: agrégation des demandes réservation/privatisation totales et nouvelles
- [x] Unitaire: agrégation des photos et événements avec photos
- [x] E2E existant: accès admin au dashboard avec section statistiques visible

## Critères d'acceptation (DoD)
- [x] Le dashboard admin affiche un bloc `Statistiques rapides`
- [x] Les compteurs événements incluent total, publiés et à venir publiés
- [x] Les compteurs demandes incluent réservations et privatisations totales/nouvelles
- [x] Les compteurs galerie incluent photos et événements avec photos
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [x] PR liée à `X-03`
- [x] Compteurs découplés dans un service testable
- [x] Dashboard admin reste accessible après authentification

## Notes d'implémentation
- Les compteurs sont centralisés dans `lib/admin-stats/admin-dashboard-stats.ts`.
- L'instance applicative réutilise les services in-memory existants tant que la persistance finale n'est pas branchée.
