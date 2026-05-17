# TASK-F-06 - Formulaire de privatisation

## Métadonnées
- Feature ID: `F-06`
- Priorité: `P1`
- Persona: `Visiteur`
- Branche: `feat/F-06-formulaire-privatisation`
- Dépendances: aucune

## Objectif
Permettre l'envoi d'une demande de privatisation avec collecte des informations nécessaires.

## Plan de tests (à écrire en premier)
- [x] Base de données mock créée si nécessaire
- [x] Unitaire: validation champs obligatoires
- [x] Intégration: persistance/envoi demande privatisation
- [x] E2E: soumission réussie + confirmation
- [x] Cas erreur: données invalides

## Critères d'acceptation (DoD)
- [x] Le scénario `F-06` de `features.md` passe
- [x] Consentement RGPD obligatoire
- [x] Statut initial `new` assigné
- [x] Tests, lint et typecheck OK
- [x] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-06`
- [ ] Relecture des libellés métier
