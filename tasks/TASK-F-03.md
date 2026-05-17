# TASK-F-03 - Galerie par événement (visiteur)

## Métadonnées
- Feature ID: `F-03`
- Priorité: `P1`
- Persona: `Visiteur`
- Branche: `feat/F-03-galerie-evenements`
- Dépendances: `F-10` (source événements/médias)

## Objectif
Afficher la galerie photo du site, structurée par événement.

- `/galerie` : liste les événements publiés ayant au moins une photo (image de couverture + titre)
- `/galerie/[slug]` : affiche toutes les photos associées à cet événement

> "Cash Out" est un événement parmi d'autres — il n'y a pas de galerie dédiée à cash-out, mais une galerie générique par événement.

## Plan de tests (à écrire en premier)
- [x] Base de données mock créée si nécessaire
- [x] Unitaire: mapping EventMedia -> galerie
- [x] Intégration: récupération médias par événement
- [x] E2E: navigation /galerie → /galerie/[slug]
- [x] Cas vide: aucune photo pour un événement → non affiché dans /galerie

## Critères d'acceptation (DoD)
- [ ] `/galerie` liste tous les événements publiés ayant des photos
- [ ] `/galerie/[slug]` affiche les photos de l'événement dans l'ordre défini
- [ ] Affichage responsive et performant
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-03`
- [ ] Vérification perf image (lazy/optimisation)
- [ ] Routes `/galerie` et `/galerie/[slug]` opérationnelles
