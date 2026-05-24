# Design System V1.4 - Rclub

## Objectif
Donner un cadre visuel clair à l'agent pour produire une interface premium, cohérente et maintenable, sans dérive de style.

## Direction artistique
- Ambiance: luxe nocturne, moderne, sensuelle, haut de gamme
- Style: minimal, contrasté, élégant
- Couleurs dominantes: noir profond + accents or
- Rendu attendu: lisible, immersif, jamais "bling-bling"

## Décisions validées
- Hero: approche cinématographique avec overlay fort pour plonger le visiteur dans l'atmosphère du club
- Typographie: **Cormorant Garamond** (display/titres) + **DM Sans** (UI/body) — variables CSS `--font-display` et `--font-body`
- Couleur accent or: palette métallique centrée sur `#D4AF37` (`--gold-mid`) avec dégradé `--gold-metallic-*`
- Responsive: priorité absolue à la lisibilité mobile

## Décisions verrouillées V1.2
- Opacité overlay hero: `55%` (référence: `rgba(0, 0, 0, 0.55)`)
- Grille galerie mobile: `2 colonnes compactes` avec gouttière réduite
- Densité interface admin: `confortable` (espacements lisibles, actions bien séparées)

## Décisions V1.3
- Composants majoritairement à angles droits (style 90 deg), sans coins arrondis par défaut
- Carousel 3D homepage (OGL/WebGL) avec cartes événements en perspective

## Décisions V1.4 — Sections sous carousel (homepage)
- **Parcours page d'accueil :** émotion (hero + carousel) → information (infos pratiques) → confiance (expérience) → projection (inside) → conversion (CTA final)
- **Infos pratiques :** grille 4 colonnes desktop, empilées mobile. Valeurs en `font-display` (Cormorant) pour contraster avec les labels body. Accent : liseré doré en haut de section + crochets dorés + barre gauche animée par item.
- **Expérience Rclub :** numéros éditoriaux grands (`clamp(4rem, 7vw, 6rem)`, opacity 0.28, débord gauche). Séparateur fin doré entre numéro et titre. Barre gauche animée bas→haut au survol.
- **Inside the club :** composition 1 grande image + 2 secondaires. Desktop : grid 2fr/1fr. Mobile : empilées. Overlay `rgba(0,0,0,0.55)` sur image principale. Images secondaires : `blurDataURL` dark pour fallback gracieux.
- **CTA final :** bloc centré, bordure `--border-gold`, radial gradient or subtil. Deux boutons : primaire (or métallique) + secondaire (surface sombre).
- **Hiérarchie titres :** `h2.sr-only` dans chaque section sans titre visible — préserve `h1 → h2 → h3` pour les lecteurs d'écran.

## Principes UI non négociables
- Lisibilité d'abord: contraste fort texte/fond
- Un seul accent principal (or) pour guider l'attention
- Peu d'effets visuels, mais soignés (hover, glow léger, transitions courtes)
- Mise en page aérée avec hiérarchie typographique nette
- Cohérence stricte entre pages publiques et admin

## Design tokens (V1)

### Couleurs
- `bg.primary`: `#0A0A0A`
- `bg.secondary`: `#121212`
- `surface.primary`: `#171717`
- `surface.elevated`: `#1F1F1F`
- `text.primary`: `#F5F5F5`
- `text.secondary`: `#B3B3B3`
- `text.muted`: `#8A8A8A`
- `accent.gold`: `#D4AF37`
- `accent.gold.hover`: `#E6C35A`
- `accent.gold.soft`: `rgba(212, 175, 55, 0.15)`
- `border.default`: `#2A2A2A`
- `border.strong`: `#3A3A3A`
- `state.success`: `#2E7D32`
- `state.error`: `#C62828`
- `state.warning`: `#ED6C02`

### Typographie
- Font titre: `"Inter", sans-serif`
- Font texte/UI: `"Inter", sans-serif`
- Échelle:
  - `display`: 56/64
  - `h1`: 40/48
  - `h2`: 32/40
  - `h3`: 24/32
  - `body-lg`: 18/28
  - `body`: 16/24
  - `caption`: 14/20
- Poids: 400 / 500 / 600 / 700

### Espacements et dimensions
- Base spacing: 4px
- Échelle: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80
- `radius.none`: 0px (par défaut)
- `radius.sm`: 2px (exception légère)
- `radius.md`: 4px (exception légère)
- `radius.lg`: 8px (usage rare)
- `container.max`: 1200px
- `section.padding.y`: 80px desktop, 56px tablet, 40px mobile

### Ombres et effets
- `shadow.soft`: `0 8px 24px rgba(0, 0, 0, 0.35)`
- `shadow.card`: `0 12px 32px rgba(0, 0, 0, 0.4)`
- `glow.gold.soft`: `0 0 0 1px rgba(212, 175, 55, 0.35), 0 0 24px rgba(212, 175, 55, 0.12)`
- Durées transitions: 150ms à 250ms
- Courbe: `ease-out`

## Implémentation ready (CSS variables)
À poser dans `app/globals.css` ou fichier équivalent:

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --surface-primary: #171717;
  --surface-elevated: #1f1f1f;
  --text-primary: #f5f5f5;
  --text-secondary: #b3b3b3;
  --text-muted: #8a8a8a;
  --accent-gold: #d4af37;
  --accent-gold-hover: #e6c35a;
  --accent-gold-soft: rgba(212, 175, 55, 0.15);
  --border-default: #2a2a2a;
  --border-strong: #3a3a3a;
  --state-success: #2e7d32;
  --state-error: #c62828;
  --state-warning: #ed6c02;

  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --container-max: 1200px;

  --shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-card: 0 12px 32px rgba(0, 0, 0, 0.4);
  --glow-gold-soft: 0 0 0 1px rgba(212, 175, 55, 0.35), 0 0 24px rgba(212, 175, 55, 0.12);

  --hero-overlay: rgba(0, 0, 0, 0.55);
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 250ms ease-out;
}
```

## Implémentation ready (mapping Tailwind)
Si Tailwind est utilisé, mapper au minimum:
- `colors.bg.primary` -> `#0A0A0A`
- `colors.bg.secondary` -> `#121212`
- `colors.surface.primary` -> `#171717`
- `colors.surface.elevated` -> `#1F1F1F`
- `colors.text.primary` -> `#F5F5F5`
- `colors.text.secondary` -> `#B3B3B3`
- `colors.text.muted` -> `#8A8A8A`
- `colors.accent.gold` -> `#D4AF37`
- `colors.accent.goldHover` -> `#E6C35A`
- `colors.border.default` -> `#2A2A2A`
- `colors.border.strong` -> `#3A3A3A`
- `borderRadius.none` -> `0px` (défaut global)
- `borderRadius.sm/md/lg` -> selon tokens (exceptions)
- `boxShadow.soft` et `boxShadow.card` selon tokens
- `container.center = true`, `container.screens.2xl = 1200px`

## Composants prioritaires
L'agent doit créer ces composants réutilisables avant de dupliquer du style:
- `Button` (primary gold, secondary dark, ghost)
- `Input`, `Textarea`, `Select`, `Checkbox` (states: default/focus/error/disabled)
- `Card` (event card, media card)
- `Badge` (date, sold out, upcoming)
- `SectionHeader` (title + subtitle)
- `LanguageSwitcher`
- `Navbar` / `Footer`
- `Modal` (confirmation et prévisualisation média)

## Contrats de composants (minimum)
- `Button`
  - tailles: `sm`, `md`, `lg`
  - variants: `primary`, `secondary`, `ghost`
  - états: `default`, `hover`, `focus-visible`, `disabled`, `loading`
  - coins: `radius.none` par défaut
- `Input` / `Textarea` / `Select`
  - label visible obligatoire
  - message d'erreur sous le champ
  - état focus à contraste élevé
  - coins: `radius.none` par défaut
- `Card`
  - variantes: `event`, `media`, `admin`
  - comportement hover léger (pas de mouvement agressif)
  - coins: `radius.sm` maximum
- `Navbar`
  - mobile: menu simple avec CTA réservation visible
  - desktop: hiérarchie claire, pas plus de 6 entrées principales

## Règle de bordures (angles droits)
- Par défaut: aucun arrondi (`border-radius: 0`)
- Exceptions autorisées seulement si gain UX clair (ex: feedback focus, media crop):
  - composants formulaire: max `2px`
  - cards/media: max `4px`
- Interdit: styles pill/capsule très arrondis pour les composants principaux

## Règles UX par page (V1)

### Accueil
- Hero vidéo plein écran avec overlay sombre marqué (cinématographique)
- Logo visible sans nuire à la lisibilité du texte
- Bloc "prochain événement" au-dessus de la ligne de flottaison
- CTA principal: réservation
- Overlay hero par défaut: `rgba(0, 0, 0, 0.55)` (ajustement ponctuel possible entre 0.50 et 0.60 selon la vidéo)

### Agenda
- Tri chronologique clair
- Carte événement compacte, lisible mobile
- Dates très visibles, actions évidentes (détails / réserver)

### Galerie
- Grille immersive avec lightbox ou preview
- Chargement progressif des médias
- Éviter le layout shift
- Mobile: 2 colonnes compactes, ratio uniforme des vignettes

### Réservation / Privatisation
- Formulaire en 1 colonne mobile, 2 colonnes desktop si utile
- Labels explicites, erreurs accessibles, feedback succès net
- Consentement RGPD visible avant submit

### Admin
- Interface sobre et efficace (moins "marketing", plus "outil")
- Structure: navigation latérale + contenu principal
- Actions CRUD explicites, états vides utiles
- Densité confortable: pas de tables surchargées, marges régulières, boutons d'action clairement séparés

## Responsive et accessibilité
- Mobile-first
- Breakpoints recommandés: 640 / 768 / 1024 / 1280
- Taille texte mini: 14px
- Focus visible au clavier sur tous les éléments interactifs
- Contraste WCAG AA minimum pour textes essentiels
- Pas d'information transmise uniquement par la couleur

## Contraintes responsive prioritaires
- L'agent doit concevoir d'abord en viewport mobile (375px), puis étendre tablette/desktop
- Aucun texte critique ne doit dépasser 2-3 lignes sur mobile dans les blocs principaux
- Les CTA principaux doivent rester visibles sans zoom (taille cible min 44px en hauteur)
- Les formulaires doivent être utilisables au pouce (espacement vertical confortable, erreurs proches des champs)
- La navbar mobile doit rester simple (menu court, accès direct réservation)
- Les médias (images/vidéos) ne doivent jamais casser la mise en page (ratio contrôlé + fallback)
- Les performances mobile sont prioritaires (poids médias, lazy loading, tailles adaptées)
- Toute feature UI est refusée si le rendu mobile est dégradé, même si desktop est correct

## Motion guidelines
- Animations discrètes et utiles (fade/slide léger)
- Éviter animations longues ou agressives
- Respecter `prefers-reduced-motion`

## Do / Don't pour l'agent

### Do
- Réutiliser les tokens et composants
- Favoriser la sobriété visuelle
- Vérifier rendu mobile avant desktop polish
- Garder les pages cohérentes entre elles
- Tester systématiquement les écrans mobile courants avant validation d'une feature

### Don't
- Multiplier les couleurs d'accent
- Ajouter des gradients flashy non validés
- Utiliser des ombres très fortes partout
- Mélanger trop de styles de boutons/inputs

## Workflow design recommandé
1. Poser le layout global + tokens
2. Créer la librairie de composants de base
3. Implémenter les pages P0
4. Ajuster micro-interactions et accessibilité
5. Harmoniser l'admin avec la même base visuelle

## Validation design rapide (check obligatoire par feature UI)
- [ ] Hero lisible sur mobile avec overlay 55%
- [ ] CTA principal visible sans scroll excessif sur mobile
- [ ] Formulaire utilisable au pouce (inputs, erreurs, bouton submit)
- [ ] Galerie stable visuellement (pas de saut de layout)
- [ ] Contrastes conformes aux règles du document

## QA responsive obligatoire (avant PR)
- [ ] `375x812` (mobile standard)
- [ ] `390x844` (mobile grand format)
- [ ] `768x1024` (tablette)
- [ ] `1280x800` (desktop)
- [ ] Aucun overflow horizontal
- [ ] Navigation possible au clavier
