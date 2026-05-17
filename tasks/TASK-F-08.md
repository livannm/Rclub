# TASK-F-08 - Changer le logo

## Métadonnées
- Feature ID: `F-08`
- Priorité: `P1`
- Persona: `Admin`
- Branche: `feat/F-08-update-logo`
- Dépendances: `F-07`

## Objectif
Permettre à l'admin de remplacer le logo du site depuis l'interface d'administration.

## Plan de tests (à écrire en premier)
- [ ] Unitaire: validation format/taille fichier
- [ ] Intégration: upload + sauvegarde asset
- [ ] E2E: remplacement logo visible côté visiteur
- [ ] Cas erreur: fichier invalide

## Critères d'acceptation (DoD)
- [ ] Le scénario `F-08` de `features.md` passe
- [ ] Le logo est mis à jour sans casser le layout
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-08`
- [ ] Vérification responsive du nouveau logo
