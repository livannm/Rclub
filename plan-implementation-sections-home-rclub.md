# Plan d’implémentation — Sections sous le carousel (page d’accueil Rclub)

## Objectif

Créer les sections situées **sous** le carousel événementiel principal de la page d’accueil (`app/page.tsx`).

Parcours utilisateur cible :

```txt
émotion → information → confiance → projection → conversion
```

Le carousel crée l’impact visuel. Les sections en dessous rassurent, donnent envie de venir, puis orientent naturellement vers la réservation.

**Références obligatoires avant code :**

- `design.md` — Design System V1.3
- `plan-implementation-carousel-rclub.md` — cohérence visuelle avec le carousel
- `app/globals.css` — tokens CSS (`--bg-primary`, `--surface-primary`, `--accent-gold`, etc.)
- `lib/site/contact.ts` — adresse, liens maps (`getClubContact()`)

---

## Direction design (non négociable)

Univers Rclub :

- ambiance luxe nocturne ;
- fond noir profond ;
- accents or maîtrisés (`#D4AF37` / `var(--accent-gold)`) ;
- style moderne, minimal, contrasté ;
- rendu premium, **jamais** bling-bling ;
- composants à angles droits (`border-radius: 0` par défaut) ;
- peu d’effets, interactions propres ;
- **mobile-first** : lisibilité prioritaire.

> L’or guide l’attention. Le noir pose l’ambiance, l’or signe l’expérience.

Ne pas hardcoder de couleurs si les variables CSS existent déjà.

---

## 1. Structure de composants recommandée

Créer un dossier dédié, un composant par section + un orchestrateur optionnel :

```txt
components/
  home/
    sections/
      HomeBelowCarousel.tsx          # assemble toutes les sections (ordre fixe)
      HomePracticalInfo.tsx          # Infos pratiques
      HomeExperience.tsx             # L’expérience Rclub
      HomeInsideClub.tsx             # Inside the club
      HomeSpacesServices.tsx         # Espaces & services (phase 2)
      HomeGalleryPreview.tsx         # Galerie preview (phase 2)
      HomeFinalCta.tsx               # CTA final réservation
```

**Intégration dans la home :**

```tsx
// app/page.tsx — après <UpcomingEventsCarousel />
<HomeBelowCarousel locale={locale} />
```

Ou importer chaque section individuellement dans l’ordre défini ci-dessous.

**i18n :** ajouter les clés dans `messages/fr.json` et `messages/en.json` sous le namespace `Home` (ou `HomeSections` si le namespace grossit).

**Données réutilisables :**

- Adresse / itinéraire : `getClubContact()` → `address`, `mapsUrl`
- Liens CTA : `/reservations`, `/privatisation`, `/galerie`
- Images club : placeholders dans `public/images/home/` ou assets via `siteAssetService` si disponible

---

## 2. Ordre final des sections sur la home

| # | Section | Phase |
|---|---------|-------|
| 1 | Carousel événementiel (`UpcomingEventsCarousel`) | existant |
| 2 | Infos pratiques | 1 |
| 3 | L’expérience Rclub | 1 |
| 4 | Inside the club | 1 |
| 5 | Espaces & services | 2 |
| 6 | Galerie preview | 2 |
| 7 | CTA final réservation | 1 |

L’ordre est **fixe**. Ne pas réorganiser sans validation produit.

---

## 3. Section « Infos pratiques »

### Rôle

Première section sous le carousel. Répondre immédiatement aux questions essentielles :

- où se trouve le club ;
- horaires ;
- dress code ;
- réservation recommandée ou non ;
- accès rapide réservation / itinéraire.

### Contenu (exemple FR — à internationaliser)

| Label | Valeur exemple |
|-------|----------------|
| Adresse | via `getClubContact().address` |
| Horaires | ex. « Ven–Sam 23h–06h » (config ou i18n) |
| Dress code | ex. « Tenue élégante » |
| Réservation | ex. « Fortement recommandée » |

### Design

- Bloc compact, premium, très lisible ;
- fond `var(--surface-primary)` ou légèrement distinct de `var(--bg-primary)` ;
- bordure fine `var(--border-default)` ;
- titre discret en or ;
- labels secondaires (`var(--text-secondary)`), valeurs (`var(--text-primary)`) ;
- **CTA principal** : « Réserver une table » → `/reservations` ;
- **Lien secondaire** : « Voir l’itinéraire » → `getClubContact().mapsUrl` (nouvel onglet + `rel="noopener noreferrer"`).

### Layout

```txt
Mobile   : infos empilées ; CTA pleine largeur (min-height 44px)
Desktop  : infos en colonnes (grid 2–4 cols) ; CTA visible sans scroll excessif
```

### Priorité UX

Le bouton réservation doit être visible **immédiatement** après le carousel sur mobile.

---

## 4. Section « L’expérience Rclub »

### Rôle

Transformer l’ambiance du carousel en **trois promesses** claires.

### Contenu — trois cartes

| # | Titre | Description courte |
|---|-------|-------------------|
| 01 | Ambiance immersive | Son premium, lumière maîtrisée, atmosphère nocturne. |
| 02 | Service privilégié | Réservation de table, accueil dédié, accompagnement sur mesure. |
| 03 | Programmation sélective | Soirées signature, DJs invités, événements privés. |

### Design

Par carte :

- numéro en or (`01`, `02`, `03`) — style éditorial, **pas** d’icônes génériques ;
- titre court ;
- description courte (2 lignes max sur mobile) ;
- fond sombre, bordure fine ;
- hover léger bordure/glow sur desktop uniquement.

```txt
Mobile   : cartes empilées, textes courts
Desktop  : grid 3 colonnes (md/lg)
```

---

## 5. Section « Inside the club »

### Rôle

Projection visuelle forte : l’utilisateur doit se dire « je vois l’ambiance ».

### Design

- 1 grande image principale + 2 images secondaires ;
- overlay sombre sur l’image principale (`var(--hero-overlay)` ou `rgba(0,0,0,0.55)`) ;
- phrase courte superposée ;
- titre type : « Une atmosphère pensée pour la nuit ».

### Layout

```txt
Desktop  : composition éditoriale (grande image gauche ou pleine largeur + 2 détails)
Mobile   : grande image en premier ; 2 petites en grille 2 colonnes ; texte lisible ; pas de layout shift
```

### Images

- `next/image` avec `sizes` adaptés ;
- `object-cover`, ratios fixes (ex. principale 16/10, secondaires 1/1) ;
- `alt` descriptifs obligatoires.

### Attention

Si les photos sont médiocres, **réduire** la surface visuelle plutôt que forcer un hero photo faible.

---

## 6. Section « Espaces & services » (phase 2)

### Rôle

Présenter les offres et diriger vers réservation / privatisation.

### Contenu — trois cartes

| Carte | Description | Lien |
|-------|-------------|------|
| Table VIP | Espace dédié, service privilégié | `/reservations` |
| Privatisation | Événement privé ou pro | `/privatisation` |
| Anniversaire & groupe | Célébrations, soirées groupe | `/reservations` ou contact |

### Design

- titre court, mention utile, description brève, lien d’action ;
- fine ligne or ou détail premium ;
- **pas** de photo dans chaque carte si cela alourdit ;
- mobile : cartes empilées, liens tactiles (zone min 44px).

---

## 7. Section « Galerie preview » (phase 2)

### Rôle

Teaser vers `/galerie` — ne pas remplacer la page galerie complète.

### Design

- grille asymétrique desktop : 1 grande + 4 petites ;
- mobile : **2 colonnes compactes**, gouttières réduites, ratio uniforme ;
- lien discret « Voir la galerie » ;
- chargement progressif (`priority` uniquement sur la 1re image visible) ;
- layout stable avant chargement (aspect-ratio / skeleton).

### Performance

Aucun overflow horizontal. Réutiliser les règles galerie du design system (grille 2 colonnes mobile).

---

## 8. Section « CTA final réservation »

### Rôle

Clôture de page — dernière opportunité d’action simple.

### Contenu

- **Titre :** « Prêt pour la prochaine soirée ? »
- **Texte :** « Réservez votre table ou contactez-nous pour organiser une expérience privée. »
- **Actions :** bouton « Réserver » (`/reservations`) ; bouton secondaire « Privatiser » (`/privatisation`).

### Design

- grand bloc sombre, bordure fine or ;
- titre fort, texte court, deux CTA ;
- aucune surcharge visuelle ;
- mobile : boutons empilés, pleine largeur.

---

## 9. Priorités d’implémentation

### Phase 1 — Essentiel (livrer en premier)

1. Infos pratiques  
2. L’expérience Rclub  
3. Inside the club  
4. CTA final réservation  

→ Page d’accueil déjà solide sans attendre la phase 2.

### Phase 2 — Enrichissement

1. Espaces & services  
2. Galerie preview  

Ne pas retarder la phase 1 pour ces sections.

---

## 10. Règles responsive obligatoires

Concevoir **d’abord** pour mobile, puis étendre.

Breakpoints à valider :

| Viewport | Largeur |
|----------|---------|
| Mobile S | 375px |
| Mobile M | 390px |
| Tablette | 768px |
| Desktop | 1280px |

Sur mobile :

- [ ] textes critiques courts ;
- [ ] boutons faciles à toucher (min 44×44px) ;
- [ ] images ne cassent jamais la mise en page ;
- [ ] sections aérées sans scroll infini ;
- [ ] galerie preview en 2 colonnes compactes ;
- [ ] **aucun** overflow horizontal.

Container : respecter `max-width` du design system (~1200px) avec padding latéral cohérent.

---

## 11. Règles accessibilité

Pour **chaque** section :

- contrastes forts (texte primaire / secondaire sur fond sombre) ;
- focus visible au clavier (`outline` or — déjà dans `globals.css`) ;
- `alt` pertinents sur toutes les images décoratives/informatives ;
- boutons vs liens : sémantique correcte (`<button>` vs `<a href>`) ;
- information jamais véhiculée **uniquement** par la couleur ;
- taille de texte minimale confortable (≥ 16px corps) ;
- `aria-labelledby` / titres de section (`<section aria-label="…">`) ;
- liens externes : indication accessible si besoin.

---

## 12. Règles motion

### Autorisé

- léger hover bordure ;
- glow or subtil au focus/hover ;
- transition courte (150–250ms, `ease-out`) ;
- léger zoom image au hover desktop.

### Interdit

- animations longues ;
- effets flashy ;
- parallax lourd ;
- apparitions théâtrales ;
- glow permanent partout.

Toujours respecter `prefers-reduced-motion: reduce` (désactiver transforms / zoom).

---

## 13. Critères de validation visuelle

### Mobile (375px)

- [ ] Sections lisibles, CTA visibles et tactiles.
- [ ] Aucun débordement horizontal.
- [ ] Images cadrées proprement.
- [ ] Textes non verbeux.
- [ ] Galerie preview en 2 colonnes (phase 2).

### Tablette (768px)

- [ ] Cartes pas trop étroites.
- [ ] Proportions images cohérentes.
- [ ] Espacements confortables.

### Desktop (1280px)

- [ ] Hiérarchie premium, ni vide ni surchargé.
- [ ] Or maîtrisé (accents, pas décoration partout).
- [ ] Cohérence avec le carousel 3D existant.

### Accessibilité

- [ ] Navigation clavier complète.
- [ ] Focus visible.
- [ ] Contraste suffisant.
- [ ] Descriptions images correctes.

---

## 14. Ordre de travail recommandé pour l’agent

```txt
1. Lire design.md et vérifier les tokens dans app/globals.css.
2. Ajouter les clés i18n HomeSections (fr + en).
3. Créer HomePracticalInfo.tsx (getClubContact, CTA, grid responsive).
4. Créer HomeExperience.tsx (3 cartes numérotées 01–03).
5. Créer HomeInsideClub.tsx (composition images + overlay + titre).
6. Créer HomeFinalCta.tsx (bloc bordure or, 2 CTA).
7. Créer HomeBelowCarousel.tsx (compose phase 1 dans le bon ordre).
8. Intégrer dans app/page.tsx sous UpcomingEventsCarousel.
9. Tester 375, 390, 768, 1280 — corriger overflow et espacements uniquement.
10. Phase 2 : HomeSpacesServices.tsx puis HomeGalleryPreview.tsx.
11. Vérifier accessibilité clavier et prefers-reduced-motion.
```

**Ne pas :**

- multiplier les fichiers CSS ad hoc — privilégier Tailwind + variables CSS ;
- introduire de nouvelles dépendances sans approbation ;
- dupliquer la logique contact — utiliser `getClubContact()` ;
- casser le carousel ou le hero existants.

---

## 15. Prompt prêt à donner à l’agent

```txt
Implémente les sections sous le carousel de la page d’accueil Rclub (Next.js App Router, React, Tailwind, next-intl).

Contexte :
- Fichier page : app/page.tsx (carousel déjà présent via UpcomingEventsCarousel).
- Design system : design.md V1.3 — noir profond, or #D4AF37, coins droits, premium sobre.
- Tokens CSS : var(--bg-primary), var(--surface-primary), var(--text-primary), var(--text-secondary), var(--accent-gold), var(--border-default), var(--hero-overlay).
- Contact : lib/site/contact.ts → getClubContact() pour adresse et mapsUrl.

Parcours : émotion (carousel) → information → confiance → projection → conversion.

Phase 1 — créer dans components/home/sections/ :
- HomePracticalInfo.tsx — adresse, horaires, dress code, réservation, CTA "Réserver une table", lien "Voir l'itinéraire"
- HomeExperience.tsx — 3 cartes 01/02/03 sans icônes génériques
- HomeInsideClub.tsx — 1 grande image + 2 petites, overlay, titre éditorial
- HomeFinalCta.tsx — "Prêt pour la prochaine soirée ?", CTA Réserver + Privatiser
- HomeBelowCarousel.tsx — assemble dans l'ordre : PracticalInfo → Experience → InsideClub → FinalCta

Phase 2 (après validation phase 1) :
- HomeSpacesServices.tsx — Table VIP, Privatisation, Anniversaire & groupe
- HomeGalleryPreview.tsx — grille teaser vers /galerie, 2 colonnes mobile

Contraintes :
- Mobile-first ; aucun overflow horizontal ; CTA min-height 44px.
- next/image avec sizes et alt ; ratios fixes pour éviter layout shift.
- i18n : messages/fr.json et messages/en.json.
- prefers-reduced-motion respecté ; focus clavier visible.
- Pas d'effet bling-bling ; hover discret desktop uniquement.
- Réutiliser les patterns du carousel (bordures fines, surfaces sombres).

Intégration :
- Importer HomeBelowCarousel dans app/page.tsx après UpcomingEventsCarousel.

Livrable :
- Composants complets + clés i18n + intégration page.
- Vérification responsive 375, 390, 768, 1280.
```

---

## 16. Décisions à verrouiller avant code

| Sujet | Recommandation |
|-------|----------------|
| Horaires / dress code | Constantes i18n ou config env — pas en dur dans le JSX |
| Images Inside the club | Placeholders `public/images/home/` jusqu’à assets définitifs |
| Orchestrateur | `HomeBelowCarousel` pour un seul point d’intégration dans `app/page.tsx` |
| Namespace i18n | `HomeSections` si `Home` devient trop chargé |

---

## 17. Instruction finale

Implémenter sobre, premium, mobile-first.

Une seule grammaire visuelle partout : fond noir, surfaces sombres, bordures fines, or discret, typo claire, coins droits.

Le résultat doit évoquer un **club haut de gamme**, pas une landing festival EDM 2014.
