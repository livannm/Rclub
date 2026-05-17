# TASK-F-11 - Gestion photos par événement (admin)

## Métadonnées
- Feature ID: `F-11`
- Priorité: `P1`
- Persona: `Admin`
- Branche: `feat/F-11-gestion-photos-evenements`
- Dépendances: `F-07`, `F-10`

## Objectif
Permettre à l'admin d'uploader, supprimer et réordonner les photos d'un événement depuis sa fiche dans l'espace admin.

> S'applique à tous les événements (pas uniquement "Cash Out").
> L'entité `EventMedia` lie les photos à un événement (`event_id`).

## Plan de tests (à écrire en premier)
- [ ] Base de données mock créée si nécessaire
- [ ] Unitaire: ajout/suppression/réordonnancement EventMedia
- [ ] Intégration: liaison EventMedia <-> Event
- [ ] E2E: upload depuis fiche admin → photo visible dans /galerie/[slug]
- [ ] E2E: suppression → photo disparaît côté visiteur
- [ ] Cas erreur: format média invalide

## Critères d'acceptation (DoD)
- [ ] Upload de photos depuis la fiche admin d'un événement
- [ ] Suppression d'une photo depuis la fiche admin
- [ ] Ordre d'affichage configurable (sort_order)
- [ ] Les photos apparaissent/disparaissent en temps réel côté visiteur
- [ ] Préparation migration Cloudinary respectée (abstraction source média)
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-11`
- [ ] Vérification compression/optimisation image
- [ ] Abstraction média compatible Phase 2 (Cloudinary)
