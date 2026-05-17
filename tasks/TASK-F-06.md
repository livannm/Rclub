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
- [ ] Base de données mock créée si nécessaire
- [ ] Unitaire: validation champs obligatoires
- [ ] Intégration: persistance/envoi demande privatisation
- [ ] E2E: soumission réussie + confirmation
- [ ] Cas erreur: données invalides

## Critères d'acceptation (DoD)
- [ ] Le scénario `F-06` de `features.md` passe
- [ ] Consentement RGPD obligatoire
- [ ] Statut initial `new` assigné
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-06`
- [ ] Relecture des libellés métier
