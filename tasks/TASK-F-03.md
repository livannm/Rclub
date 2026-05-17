# TASK-F-03 - Galerie Cash Out (visiteur)

## Métadonnées
- Feature ID: `F-03`
- Priorité: `P1`
- Persona: `Visiteur`
- Branche: `feat/F-03-galerie-cash-out`
- Dépendances: `F-10` (source événements/médias)

## Objectif
Afficher les photos liées à l'événement "Cash Out" sur la galerie visiteur.

## Plan de tests (à écrire en premier)
- [x] Base de données mock créée si nécessaire
- [x] Unitaire: mapping photos -> galerie
- [x] Intégration: récupération médias événement
- [x] E2E: navigation vers galerie Cash Out
- [x] Cas vide: aucune photo disponible

## Critères d'acceptation (DoD)
- [x] Le scénario `F-03` de `features.md` passe
- [x] Affichage responsive et performant
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-03`
- [ ] Vérification perf image (lazy/optimisation)
