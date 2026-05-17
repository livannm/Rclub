# Brief agent

## Mission
Créer le site web du club en t'appuyant sur:
- `project.md` (vision produit)
- `features.md` (scénarios fonctionnels)
- `personna.md` (personas)
- `tech.md` (stack technique)
- `rules.md` (règles de delivery)
- `design.md` (direction artistique et règles UI)

## Méthode de travail attendue
- Travailler feature par feature
- Commencer chaque feature par ses tests
- Considérer une feature terminée uniquement quand tous ses tests passent
- Poser une question dès qu'un point est ambigu
- Suivre la priorité `P0 > P1 > P2` définie dans `features.md`

## Organisation multi-agent (si utilisé)
- Créer un fichier de suivi d'avancement (ex: `progress.md`)
- Définir un orchestrateur + plusieurs agents ouvriers avec scope précis
- Éviter les recouvrements de responsabilités
- Synchroniser régulièrement les décisions techniques dans le fichier de suivi
- Assigner les tâches via les IDs de feature (`F-01`, `F-02`, etc.)
- Garder un seul owner actif par feature pour éviter les conflits de code
- Utiliser les tickets prêts à l'emploi dans `tasks/` (`TASK-F-XX.md`)
- Exécuter le workflow opérationnel défini dans `RUNBOOK.md`

## Qualité et architecture
- Maintenir une architecture propre et lisible
- Favoriser les composants encapsulés et réutilisables
- Refactoriser dès que cela simplifie le code ou réduit la dette technique
- Respecter les schémas de données minimaux documentés dans `project.md`
- Respecter strictement `design.md`, avec angles droits (90 deg) par défaut sur les composants UI

## Livrables minimum par feature
- Tests de la feature
- Implémentation
- Documentation courte de la décision technique
- Mise à jour de `progress.md` (statut, owner, blocages)
- Mise à jour du ticket `tasks/TASK-F-XX.md` (checklists DoD/PR)

