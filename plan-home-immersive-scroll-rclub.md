# Plan d’implémentation — Home Rclub immersive avec apparitions au scroll

## Contexte

L’objectif est de faire évoluer la page d’accueil Rclub vers une expérience plus immersive, plus éditoriale et plus cinématographique.

La page actuelle suit déjà une structure claire : hero cinématographique, carousel d’événements, puis bloc sous carousel composé des sections pratiques, expérience, inside club et CTA final. La nouvelle approche doit conserver la base existante, mais modifier le rythme de lecture sous le carousel.

## État actuel observé dans le repository

Le projet est une application Next.js avec React, Tailwind CSS, GSAP, Motion et next-intl déjà disponibles. Il n’est donc pas nécessaire d’ajouter une librairie d’animation lourde pour cette évolution.

La home actuelle charge dans cet ordre :

1. Hero cinématographique
2. Carousel des prochains événements
3. Bloc `HomeBelowCarousel`

Le bloc `HomeBelowCarousel` affiche actuellement :

1. Infos pratiques
2. Expérience
3. Inside club
4. CTA final

La demande modifie cet ordre :

1. Expérience immersive
2. Infos pratiques
3. Inside club
4. CTA final

Seules les sections **Expérience** et **Infos pratiques** doivent recevoir des apparitions progressives au scroll.

---

# Objectif design

Créer sous le carousel une séquence plus immersive :

**carousel événementiel → expérience narrative → infos pratiques révélées progressivement → projection visuelle → conversion**

Le ressenti attendu :

- plus premium ;
- plus cinématographique ;
- moins “section classique avec cartes alignées” ;
- plus de profondeur au scroll ;
- une découverte progressive, point par point ;
- un rythme mobile très propre.

Le visiteur ne doit pas tout voir d’un coup. Chaque point important doit apparaître au moment où il entre dans la zone de lecture.

---

# Direction artistique

Respecter strictement l’univers Rclub :

- luxe nocturne ;
- noir profond ;
- accent or maîtrisé ;
- typographie élégante déjà en place ;
- bordures fines ;
- angles droits ;
- effets subtils ;
- pas de bling-bling ;
- pas de sur-animation.

L’or doit rester un signal : numéro actif, fine ligne, point de timeline, bordure active, micro-détail. Il ne doit pas devenir un remplissage décoratif partout.

---

# Nouvelle structure de la home sous le carousel

Modifier l’ordre du bloc sous carousel pour obtenir :

1. `HomeExperience`
2. `HomePracticalInfo`
3. `HomeInsideClub`
4. `HomeFinalCta`

Ne pas supprimer `HomeInsideClub` ni `HomeFinalCta`. Ils restent utiles pour la projection visuelle et la conversion.

---

# Nouvelle approche visuelle — Section Expérience

## Rôle

La section Expérience devient une séquence immersive, pas une simple grille de trois cartes.

Elle doit présenter progressivement :

1. Ambiance immersive
2. Service privilégié
3. Programmation sélective

Chaque point doit apparaître au fur et à mesure du scroll.

## Direction visuelle desktop

Créer une composition verticale éditoriale :

- un grand titre d’introduction ;
- trois blocs d’expérience espacés verticalement ;
- chaque bloc peut alterner image et texte ;
- les images doivent être larges, sombres, cadrées comme des scènes ;
- les textes doivent être courts et très lisibles ;
- une ligne verticale ou un repère latéral peut indiquer la progression ;
- le numéro actif doit être en or.

Le rendu doit évoquer une visite progressive du club : on descend dans la page comme on entre dans la nuit.

## Direction visuelle mobile

Sur mobile, éviter les compositions trop complexes.

Utiliser :

- un point d’expérience par écran ou demi-écran ;
- une image immersive au-dessus ou en arrière-plan ;
- texte court ;
- numéro visible ;
- apparition douce quand le bloc entre dans le viewport.

Le mobile doit rester prioritaire. Si un effet est beau sur desktop mais dégrade le mobile, il doit être simplifié.

## Contenu recommandé

### 01 — Ambiance immersive

Texte court :

“Lumière, son et scénographie se rencontrent pour créer une atmosphère unique, pensée pour la nuit.”

Action possible :

“Découvrir l’ambiance”

### 02 — Service privilégié

Texte court :

“Accueil dédié, réservation de table et service sur mesure pour accompagner chaque moment de votre soirée.”

Action possible :

“Réserver une table”

### 03 — Programmation sélective

Texte court :

“DJs invités, soirées signature et événements privés composent une programmation exigeante.”

Action possible :

“Voir l’agenda”

---

# Animation attendue — Expérience

Chaque point d’expérience doit apparaître individuellement au scroll.

Effets autorisés :

- fade in léger ;
- translation verticale courte ;
- image qui gagne légèrement en contraste ;
- ligne or qui se dessine subtilement ;
- numéro qui passe de muted à or ;
- texte qui apparaît après l’image avec un léger délai.

Effets interdits :

- rotation agressive ;
- zoom fort ;
- parallax lourd ;
- apparition trop lente ;
- glow permanent ;
- animation qui bloque la lecture.

La durée doit rester courte et premium. L’effet doit se sentir, pas se faire applaudir.

---

# Nouvelle approche visuelle — Section Infos pratiques

## Rôle

Les infos pratiques doivent arriver après l’expérience.

Elles doivent rassurer l’utilisateur une fois que l’envie est créée.

La section ne doit plus être un simple bloc statique. Chaque information doit apparaître progressivement au scroll.

## Informations à afficher

1. Adresse
2. Horaires
3. Dress code
4. Réservation
5. Itinéraire / contact

## Direction visuelle desktop

Créer un bloc plus scénographique :

- fond sombre profond ;
- bordure fine ;
- titre discret ;
- informations en ligne ou en grille ;
- chaque item apparaît l’un après l’autre ;
- un pictogramme sobre ou un numéro peut accompagner chaque item ;
- CTA itinéraire et réservation visibles à la fin.

Le rendu doit être plus proche d’un panneau d’informations premium que d’un tableau administratif.

## Direction visuelle mobile

Sur mobile :

- chaque info devient une ligne ou une petite card ;
- apparition une par une au scroll ;
- les CTA sont empilés ;
- bouton principal réservation visible ;
- lien itinéraire facile à toucher.

---

# Animation attendue — Infos pratiques

Chaque item doit apparaître progressivement :

- adresse ;
- horaires ;
- dress code ;
- réservation ;
- CTA.

Effet recommandé :

- opacité de 0 à 1 ;
- léger déplacement vertical ;
- bordure qui devient plus visible ;
- accent or sur l’élément actif.

Ne pas animer en permanence. Une fois l’item révélé, il reste stable.

---

# Gestion du scroll

## Comportement attendu

Les apparitions doivent être déclenchées quand l’élément entre dans la zone visible de l’utilisateur.

La section Expérience peut avoir un effet plus immersif, avec un rythme narratif.

La section Infos pratiques doit être plus sobre et plus rapide.

## Recommandation technique

Utiliser prioritairement les outils déjà présents dans le projet :

- Motion pour les apparitions simples ;
- GSAP si l’agent veut créer une timeline scroll plus contrôlée ;
- Intersection Observer si l’agent veut une solution légère sans dépendre d’un système d’animation complexe.

Ne pas ajouter de nouvelle librairie tant que Motion ou GSAP suffisent.

---

# Variante recommandée

## Expérience

Utiliser une approche “scroll narrative” :

- section assez haute ;
- trois moments distincts ;
- image et texte alternés ;
- apparition progressive de chaque moment ;
- progression latérale discrète sur desktop ;
- mobile simplifié en cards verticales immersives.

## Infos pratiques

Utiliser une approche “reveal list” :

- bloc sombre encadré ;
- items révélés un par un ;
- CTA final révélé après les informations ;
- pas de sticky complexe.

Cette combinaison donne du relief sans transformer la page en démonstration technique.

---

# Accessibilité obligatoire

Les animations doivent respecter les préférences utilisateur.

Si `prefers-reduced-motion` est activé :

- afficher tous les éléments directement ;
- supprimer les translations ;
- conserver uniquement l’état final ;
- ne pas bloquer l’accès au contenu.

Chaque lien et bouton doit rester accessible au clavier.

Le focus doit être visible.

Les informations ne doivent pas dépendre uniquement de la couleur or.

Les images doivent avoir des textes alternatifs pertinents.

---

# Performance

Priorité mobile.

Les animations ne doivent pas provoquer de jank.

Éviter :

- animation de propriétés coûteuses ;
- grosses images non optimisées ;
- parallax en continu sur mobile ;
- listener scroll manuel non optimisé.

Privilégier :

- opacité ;
- transform ;
- lazy loading des images ;
- tailles d’images adaptées ;
- déclenchement par intersection plutôt que calcul permanent.

---

# Fichiers à modifier en priorité

## Ordre des sections

Modifier le composant qui orchestre les sections sous carousel :

- `components/home/sections/HomeBelowCarousel.tsx`

Nouvel ordre attendu :

1. `HomeExperience`
2. `HomePracticalInfo`
3. `HomeInsideClub`
4. `HomeFinalCta`

## Section expérience

Modifier :

- `components/home/sections/HomeExperience.tsx`

Objectif : passer d’une grille simple à une séquence immersive avec points révélés au scroll.

## Section infos pratiques

Modifier :

- `components/home/sections/HomePracticalInfo.tsx`

Objectif : transformer le bloc actuel en liste d’informations révélées progressivement.

## Styles globaux

Modifier ou compléter :

- `app/globals.css`

Objectif : ajouter les styles nécessaires pour la nouvelle composition, les états de reveal, les transitions et les variantes responsive.

---

# Fichiers à ne pas modifier sauf nécessité

Éviter de modifier :

- le hero cinématographique ;
- le carousel des événements ;
- la logique serveur de récupération des événements ;
- la logique SEO JSON-LD ;
- les composants admin.

La demande concerne uniquement la partie sous carousel.

---

# Skills et outils utiles pour l’agent Claude

## Skill repo / codebase analysis

À utiliser pour vérifier les fichiers existants avant modification :

- structure de la home ;
- composants existants ;
- conventions CSS ;
- tokens disponibles ;
- dépendances d’animation déjà installées.

## Skill design system

À utiliser pour garantir la cohérence avec :

- couleurs ;
- typographie ;
- bordures ;
- espacement ;
- responsive ;
- règles d’accessibilité.

## Skill animation / motion design

À utiliser pour concevoir les apparitions au scroll :

- timings ;
- easing ;
- reveal progressif ;
- gestion `prefers-reduced-motion` ;
- choix entre Motion, GSAP ou Intersection Observer.

## Skill responsive QA

À utiliser impérativement après implémentation :

- 375 x 812 ;
- 390 x 844 ;
- 768 x 1024 ;
- 1280 x 800.

Vérifier :

- aucun overflow horizontal ;
- lisibilité mobile ;
- CTA accessibles ;
- images bien cadrées ;
- animations fluides.

## Skill accessibility review

À utiliser pour vérifier :

- focus clavier ;
- ordre de lecture ;
- contraste ;
- alt text ;
- contenu disponible sans animation ;
- réduction des animations.

## Skill visual regression / Playwright

À utiliser si disponible pour capturer les breakpoints et comparer avant/après.

L’objectif n’est pas de figer chaque pixel, mais de détecter :

- débordements ;
- sections trop hautes ;
- textes coupés ;
- problèmes de scroll ;
- CTA hors viewport mobile.

---

# Critères de validation

## Expérience

La section est validée si :

- les trois points apparaissent progressivement ;
- le rythme est naturel au scroll ;
- le rendu est plus immersif que la grille actuelle ;
- l’animation reste sobre ;
- le mobile reste lisible et fluide.

## Infos pratiques

La section est validée si :

- chaque info apparaît progressivement ;
- l’ordre de lecture est clair ;
- le bloc reste très lisible ;
- les CTA réservation et itinéraire sont visibles ;
- le rendu est premium, pas administratif.

## Global

La page est validée si :

- le nouvel ordre raconte mieux l’expérience ;
- il n’y a aucun overflow horizontal ;
- les animations ne nuisent pas à l’accessibilité ;
- le design reste cohérent avec le carousel et le hero ;
- l’or reste utilisé avec retenue.

---

# QA obligatoire avant livraison

Tester les viewports suivants :

- 375 x 812
- 390 x 844
- 768 x 1024
- 1280 x 800

À vérifier sur chaque viewport :

- apparition progressive des points expérience ;
- apparition progressive des infos pratiques ;
- lisibilité des titres ;
- lisibilité des textes ;
- boutons accessibles ;
- images non déformées ;
- absence d’overflow horizontal ;
- absence de saut de layout ;
- comportement correct avec réduction des animations.

---

# Instruction finale pour Claude

Implémenter uniquement la refonte immersive des sections sous carousel.

Changer l’ordre pour afficher d’abord l’expérience, puis les infos pratiques.

Transformer `HomeExperience` en séquence narrative immersive avec apparition progressive des trois points au scroll.

Transformer `HomePracticalInfo` en bloc premium où chaque information apparaît progressivement au scroll.

Conserver `HomeInsideClub` et `HomeFinalCta` après ces sections.

Ne pas ajouter de nouvelle librairie si Motion, GSAP ou Intersection Observer suffisent.

Respecter strictement le design system Rclub, le responsive mobile-first, l’accessibilité et `prefers-reduced-motion`.

Le résultat doit donner l’impression que l’utilisateur descend progressivement dans l’univers du club, pas qu’il lit une brochure PDF posée sur un comptoir.
