# Board d'exécution V3

## Convention de nommage branches
- `feat/F-07-auth-admin`
- `feat/F-10-crud-evenements`
- `feat/F-01-highlight-prochain-evenement`
- `feat/F-05-agenda-evenements`
- `feat/F-04-formulaire-reservation`
- `feat/F-02-i18n-fr-en`
- `feat/F-09-edition-texte-accueil`
- `feat/F-03-galerie-cash-out`
- `feat/F-06-formulaire-privatisation`
- `feat/F-08-update-logo`
- `feat/F-11-gestion-photos-cash-out`
- `feat/F-12-update-video-hero`

## Premier lot parallèle recommandé

### Lot A (démarrage immédiat)
- Agent A -> `TASK-F-07.md` -> `feat/F-07-auth-admin`
- Agent B -> `TASK-F-10.md` -> `feat/F-10-crud-evenements`
- Agent C -> `TASK-F-02.md` -> `feat/F-02-i18n-fr-en`

### Lot B (après fusion Lot A)
- Agent D -> `TASK-F-01.md` -> `feat/F-01-highlight-prochain-evenement`
- Agent E -> `TASK-F-05.md` -> `feat/F-05-agenda-evenements`
- Agent F -> `TASK-F-09.md` -> `feat/F-09-edition-texte-accueil`

### Lot C
- Agent G -> `TASK-F-04.md` -> `feat/F-04-formulaire-reservation`

## Règle d'or
Un seul owner actif par feature/branche pour éviter les conflits de merge.
