# RUNBOOK V4 - Exécution multi-agent

## Objectif
Exécuter les features rapidement avec un orchestrateur et plusieurs agents, sans conflit de code, en respectant `rules.md`.

## Préflight (obligatoire pour tous)
1. Mettre à jour la branche de base:
   - `git checkout main`
   - `git pull`
2. Vérifier les scripts disponibles:
   - `pnpm run`
3. Installer les dépendances si nécessaire:
   - `pnpm install`

## Conventions
- Une branche par feature: `feat/F-XX-slug-court`
- Un seul owner actif par feature
- Chaque feature commence par ses tests
- PR obligatoire par feature

## Workflow agent (par feature)

### 1) Prise de tâche
1. Ouvrir le ticket `tasks/TASK-F-XX.md`
2. Vérifier les dépendances de la feature dans `features.md`
3. Réserver la tâche dans `progress.md`:
   - `Owner = Agent-X`
   - `Statut = in_progress`

### 2) Création de branche
- `git checkout main && git pull`
- `git checkout -b feat/F-XX-slug-court`

### 3) Implémentation (test-first)
1. Écrire les tests de la feature (créer une base de données mock si nécessaire)
2. Implémenter le minimum pour faire passer les tests
3. Refactor léger si nécessaire

### 4) Vérifications locales
Exécuter les commandes disponibles dans le repo (adapter selon scripts réels):
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

### 5) Commit
Exemple:
- `git add -A`
- `git commit -m "feat(F-XX): implement <short-title> with tests"`

### 6) Push + PR
- `git push -u origin feat/F-XX-slug-court`
- Créer la PR avec:
  - Contexte
  - Solution
  - Preuves de tests
  - Captures UI si concerné

### 7) Mise à jour de suivi
1. Cocher la checklist dans `tasks/TASK-F-XX.md`
2. Mettre à jour `progress.md`:
   - `Statut = review` (ou `done` après validation/fusion)
   - Lien PR
   - Notes de blocage le cas échéant

## Workflow orchestrateur

### Boucle toutes les 30-60 min
1. Vérifier les statuts dans `progress.md`
2. Lever les blocages
3. Réassigner les agents libres vers les tâches prêtes
4. Valider que les dépendances sont respectées (ex: `F-10` avant `F-01`)
5. Mettre à jour le journal des décisions

### Politique de lot
- Lot A: `F-07`, `F-10`, `F-02`
- Lot B: `F-01`, `F-05`, `F-09`
- Lot C: `F-04`
- Puis P1 (`F-03`, `F-06`, `F-08`, `F-11`, `F-12`)

## Règles de blocage (hard stop)
Arrêter et demander arbitrage si:
- Tâche bloquée plus de 15 minutes
- Ambiguïté produit non triviale
- Ressource manquante (texte/logo/média)
- Changement de scope non prévu

## Définition de Done (feature)
- Tests de la feature écrits et passants
- Critères du scénario `features.md` respectés
- Lint/typecheck/build OK
- PR ouverte et prête à review
- `progress.md` + `tasks/TASK-F-XX.md` mis à jour

## Template court de description PR

### Contexte
Feature `F-XX` - <titre>

### Ce qui a été fait
- ...
- ...

### Tests
- [x] Unitaires
- [x] Intégration (avec base de données mock si nécessaire)
- [x] E2E

### Vérifications
- [x] Lint
- [x] Typecheck
- [x] Build

### Impacts
- UI:
- API:
- Données:
