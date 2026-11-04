# Pagination publique et chargement des médias — F-03 / F-05

## Comportement validé

- Agenda avec `past=1` : événements passés **et** à venir, 5 par page, date décroissante.
- Agenda sans `past=1` : événements à venir, le plus proche en premier, sans pagination.
- Galerie : 5 albums publiés avec photos par page, date de l'événement décroissante.
- Album : 24 photos par page, ordre manuel de l'administration conservé.
- Visionneuse : navigation et compteur globaux, zoom et clavier conservés, chargement des pages supplémentaires à la demande.
- Médias : chargement différé hors écran, placeholder anthracite/or, état d'erreur, prise en compte de la réduction des animations.
- Contact : retrait des pictogrammes décoratifs, liens et coordonnées conservés.

## Décisions techniques

- Pagination `count` + `skip` / `take` dans les repositories Prisma, avec le même comportement en mémoire.
- Tri secondaire par identifiant pour départager les dates / positions identiques.
- Filtres année/mois basés sur les soirées du club (midi à midi, Europe/Paris), appliqués avant le comptage et la pagination.
- Paramètre `page` dans l'URL, remise à 1 lors d'un changement de filtre ; pages invalides normalisées et pages hors limites ramenées à la dernière page.
- `albumsPage` conserve la page de la liste lors du retour depuis un album.
- `GET /api/gallery/[slug]?page=N` expose uniquement une page de photos d'un événement publié, localisée selon la langue courante. Aucun changement de schéma ou de stockage des médias.
- Les images natives conservent leurs URL distantes ; les images déjà optimisées par Next gardent cette optimisation. Les éléments prioritaires (logo, bandeau, couverture de détail) restent chargés immédiatement.

## Validation

- [x] Tests de pagination, filtres, tri stable et requêtes Prisma bornées.
- [x] Tests d'accès public et de localisation de l'API photo.
- [x] Tests des images en chargement, depuis le cache et en erreur.
- [x] Parcours navigateur mobile/desktop, FR/EN, navigation inter-pages et nouvelle tentative après échec.
- [x] Compilation de production.
- [x] Revue visuelle ; livraison sur une branche dédiée pour revue en PR.

Les problèmes préexistants de vérification globale sont distingués des résultats de cette évolution dans la description de PR.

Résultats : build de production réussi ; 6 scénarios Playwright validés (exécutions isolées) ; 174/175 tests Vitest passent. Le seul échec Vitest (`admin-dashboard-stats`), les 3 erreurs TypeScript dans `upload-config-api.test.ts` et les erreurs ESLint restantes existaient sur la base `ee2d100` avant cette évolution.
