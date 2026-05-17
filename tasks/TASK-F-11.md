# TASK-F-11 - Gestion photos Cash Out (admin)

## Métadonnées
- Feature ID: `F-11`
- Priorité: `P1`
- Persona: `Admin`
- Branche: `feat/F-11-gestion-photos-cash-out`
- Dépendances: `F-07`, `F-10`

## Objectif
Permettre à l'admin d'ajouter et supprimer les photos de l'événement "Cash Out".

## Plan de tests (à écrire en premier)
- [ ] Unitaire: ajout/suppression média
- [ ] Intégration: liaison média <-> événement
- [ ] E2E: upload puis suppression depuis admin
- [ ] Cas erreur: format média invalide

## Critères d'acceptation (DoD)
- [ ] Les scénarios `F-11` de `features.md` passent
- [ ] Les photos apparaissent/disparaissent côté visiteur
- [ ] Préparation migration Cloudinary respectée
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-11`
- [ ] Vérification de la compression/optimisation image
