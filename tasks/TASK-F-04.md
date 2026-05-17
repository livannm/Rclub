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
- [ ] Unitaire: validation des champs obligatoires
- [ ] Intégration: persistance/envoi de la demande
- [ ] E2E: soumission réussie + message de confirmation
- [ ] Cas erreur: champs invalides / envoi impossible

## Critères d'acceptation (DoD)
- [ ] Le scénario `F-04` de `features.md` passe
- [ ] Consentement RGPD obligatoire
- [ ] Statut initial `new` correctement assigné
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-04`
- [ ] Validation UX des messages d'erreur et succès
