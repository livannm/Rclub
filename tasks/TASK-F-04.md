# TASK-F-04 - Formulaire de réservation

## Métadonnées
- Feature ID: `F-04`
- Priorité: `P0`
- Persona: `Visiteur`
- Branche: `feat/F-04-formulaire-reservation`
- Dépendances: aucune

## Objectif
Permettre l'envoi d'une demande de réservation via un formulaire valide avec confirmation utilisateur.

## Plan de tests (à écrire en premier)
- [ ] Base de données mock créée si nécessaire
- [x] Unitaire: validation des champs obligatoires
- [x] Intégration: persistance/envoi de la demande
- [x] E2E: soumission réussie + message de confirmation
- [x] Cas erreur: champs invalides / envoi impossible

## Critères d'acceptation (DoD)
- [x] Le scénario `F-04` de `features.md` passe
- [x] Consentement RGPD obligatoire
- [x] Statut initial `new` correctement assigné
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-04`
- [ ] Validation UX des messages d'erreur et succès
