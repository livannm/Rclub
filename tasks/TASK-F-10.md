# TASK-F-10 - CRUD événements

## Métadonnées
- Feature ID: `F-10`
- Priorité: `P0`
- Persona: `Admin`
- Branche: `feat/F-10-crud-evenements`
- Dépendances: `F-07`

## Objectif
Permettre à l'admin de créer, modifier et supprimer des événements.

## Plan de tests (à écrire en premier)
- [x] Unitaire: validation modèle Event
- [x] Intégration: endpoints/services create/update/delete
- [x] E2E: parcours CRUD complet en admin
- [x] Cas erreur: slug dupliqué, date invalide

## Critères d'acceptation (DoD)
- [x] Les scénarios `F-10` de `features.md` passent
- [x] Les événements publiés apparaissent côté visiteur
- [x] Gestion `is_published` fonctionnelle
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-10`
- [ ] Schéma de données aligné avec `project.md`
