# TASK-F-12 - Changer la vidéo hero

## Métadonnées
- Feature ID: `F-12`
- Priorité: `P1`
- Persona: `Admin`
- Branche: `feat/F-12-update-video-hero`
- Dépendances: `F-07`

## Objectif
Permettre à l'admin de remplacer la vidéo hero de la page d'accueil.

## Plan de tests (à écrire en premier)
- [ ] Unitaire: validation source vidéo
- [ ] Intégration: sauvegarde asset vidéo hero
- [ ] E2E: vidéo remplacée et visible sur accueil
- [ ] Cas erreur: source invalide / indisponible

## Critères d'acceptation (DoD)
- [ ] Le scénario `F-12` de `features.md` passe
- [ ] Le fallback poster est conservé
- [ ] Overlay logo reste visible
- [ ] Tests, lint et typecheck OK
- [ ] `progress.md` mis à jour

## Checklist PR
- [ ] PR liée à `F-12`
- [ ] Vérification performance de chargement vidéo
