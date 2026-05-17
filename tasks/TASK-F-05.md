# TASK-F-05 - Agenda des événements

## Métadonnées
- Feature ID: `F-05`
- Priorité: `P0`
- Persona: `Visiteur`
- Branche: `feat/F-05-agenda-evenements`
- Dépendances: `F-10`

## Objectif
Afficher la liste des événements à venir triés par date croissante sur la page Agenda.

## Plan de tests (à écrire en premier)
- [x] Unitaire: tri chronologique
- [x] Intégration: récupération événements publiés à venir
- [x] E2E: affichage agenda depuis menu
- [x] Cas limite: liste vide

## Critères d'acceptation (DoD)
- [x] Le scénario `F-05` de `features.md` passe
- [x] Les événements passés ne s'affichent pas dans "à venir"
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-05`
- [ ] Vérification affichage mobile/desktop
