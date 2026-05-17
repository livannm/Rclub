# Règles de travail

## Process de développement
- Chaque feature doit commencer par la définition de ses tests (inclure une base de données mock si nécessaire)
- Chaque feature doit avoir:
  - sa branche dédiée
  - au moins 1 commit dédié
  - sa pull request dédiée
- Une feature est considérée terminée uniquement si tous ses tests passent

## Communication
- Si une demande est ambiguë, poser une question avant d'implémenter
- Si une tâche dépasse 15 minutes sans progression claire, stopper et demander arbitrage
- Si une ressource manquante bloque (média, texte, logo, etc.), lister précisément le besoin

## Qualité de code attendue
- Favoriser le refactor quand cela améliore lisibilité, maintenabilité ou réutilisabilité
- Garder une structure de projet claire: dossiers distincts, composants encapsulés, logique séparée de l'UI
- Éviter les solutions rapides non maintenables ("quick fixes") sans validation

## Définition de "Done" par feature
- Tests écrits et passants
- Critères métier du scénario respectés
- Aucun lint bloquant
- PR prête à être revue
