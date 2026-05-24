# Plan d’implémentation — Carousel Rclub 3D / Mobile Immersif

## Objectif

Implémenter un composant carousel événementiel premium pour Rclub avec deux rendus distincts :

- **Desktop / tablette large** : carousel 3D avec slide centrale mise en avant.
- **Mobile** : carousel immersif vertical, plein écran ou quasi plein écran, avec image de fond, overlay fort, informations lisibles et CTA visible.

Le composant doit respecter strictement le design system Rclub V1.3.

---

## 1. Créer la structure de composants

Créer les composants suivants :

```txt
components/
  carousel/
    EventCarousel.tsx
    EventCarouselDesktop3D.tsx
    EventCarouselMobileImmersive.tsx
    EventCarouselCard.tsx
    CarouselControls.tsx
    CarouselProgress.tsx
```

Le composant principal `EventCarousel` choisit automatiquement le rendu selon le viewport.

```tsx
<EventCarousel events={events} />
```

---

## 2. Définir le modèle de données

Créer un type événement simple et stable :

```ts
export type EventItem = {
  id: string;
  title: string;
  label?: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  href: string;
  bookingHref?: string;
  status?: "upcoming" | "sold-out" | "past";
};
```

Exemple :

```ts
const events = [
  {
    id: "golden-saturday",
    title: "Golden Saturday",
    label: "Soirée signature",
    dateLabel: "Samedi 24 janvier",
    startTime: "23:00",
    endTime: "06:00",
    imageUrl: "/images/events/golden-saturday.jpg",
    href: "/agenda/golden-saturday",
    bookingHref: "/reservation?event=golden-saturday",
    status: "upcoming",
  },
];
```

---

## 3. Règles responsive

Utiliser deux expériences différentes :

```tsx
<div className="hidden lg:block">
  <EventCarouselDesktop3D events={events} />
</div>

<div className="block lg:hidden">
  <EventCarouselMobileImmersive events={events} />
</div>
```

Breakpoints recommandés :

```txt
Mobile : < 1024px
Desktop 3D : >= 1024px
```

Pourquoi `lg` ? Parce que le carousel 3D devient vite brouillon sous 1024px. Et un carousel 3D brouillon, c’est souvent un carrousel qui a trop cru en lui.

---

## 4. Implémenter le carousel desktop 3D

### Comportement attendu

- Une slide centrale active.
- Deux slides visibles à gauche et à droite.
- Les slides latérales sont :
  - plus petites,
  - légèrement reculées,
  - assombries,
  - inclinées en perspective.
- Navigation par flèches.
- Pagination textuelle ou barre fine.
- Pas d’autoplay obligatoire.
- Swipe ou drag possible si la librairie choisie le permet.

### Option recommandée

Utiliser `framer-motion` pour contrôler proprement les positions.

#### Logique d’index

```ts
const [activeIndex, setActiveIndex] = useState(0);

const previous = () => {
  setActiveIndex((current) =>
    current === 0 ? events.length - 1 : current - 1
  );
};

const next = () => {
  setActiveIndex((current) =>
    current === events.length - 1 ? 0 : current + 1
  );
};
```

Créer une fonction pour calculer la position relative :

```ts
function getRelativeIndex(index: number, activeIndex: number, total: number) {
  let diff = index - activeIndex;

  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  return diff;
}
```

---

## 5. Styles desktop 3D

Pour chaque slide, appliquer un style selon `relativeIndex`.

### Slide active

```ts
{
  x: 0,
  scale: 1,
  rotateY: 0,
  opacity: 1,
  zIndex: 5,
}
```

### Slide gauche proche

```ts
{
  x: "-42%",
  scale: 0.82,
  rotateY: 14,
  opacity: 0.65,
  zIndex: 4,
}
```

### Slide droite proche

```ts
{
  x: "42%",
  scale: 0.82,
  rotateY: -14,
  opacity: 0.65,
  zIndex: 4,
}
```

### Slide gauche éloignée

```ts
{
  x: "-76%",
  scale: 0.68,
  rotateY: 22,
  opacity: 0.32,
  zIndex: 3,
}
```

### Slide droite éloignée

```ts
{
  x: "76%",
  scale: 0.68,
  rotateY: -22,
  opacity: 0.32,
  zIndex: 3,
}
```

Masquer les slides au-delà de `relativeIndex > 2`.

```ts
if (Math.abs(relativeIndex) > 2) {
  return {
    x: 0,
    scale: 0.4,
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none",
  };
}
```

---

## 6. Structure visuelle desktop

Chaque card desktop doit suivre cette structure :

```txt
[ Image événement en fond ]
[ Overlay noir 55% ]
[ Logo R ou marque discrète en haut ]
[ Label événement ]
[ Titre ]
[ Date ]
[ Horaire ]
[ CTA Réserver ]
```

Classe de base :

```tsx
<article className="relative h-[620px] w-[420px] overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-primary)] shadow-card">
```

Image :

```tsx
<img
  src={event.imageUrl}
  alt={event.title}
  className="absolute inset-0 h-full w-full object-cover"
/>
```

Overlay :

```tsx
<div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
<div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
```

Même si le design system évite les gradients flashy, ici un gradient noir fonctionnel est acceptable pour la lisibilité. Il ne doit pas devenir décoratif.

---

## 7. Mobile immersif

### Objectif mobile

Sur mobile, abandonner l’effet 3D. Garder une expérience plus directe :

- Une slide par écran.
- Card verticale immersive.
- Image plein cadre.
- Overlay fort.
- CTA visible sans effort.
- Progression fine en haut.
- Swipe horizontal.

### Layout recommandé

```tsx
<section className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-[var(--bg-primary)]">
  <div className="flex snap-x snap-mandatory overflow-x-auto">
    {events.map(...)}
  </div>
</section>
```

Chaque slide mobile :

```tsx
<article className="relative min-h-[calc(100svh-72px)] w-full shrink-0 snap-center overflow-hidden border border-[var(--border-default)]">
```

Image :

```tsx
<img
  src={event.imageUrl}
  alt={event.title}
  className="absolute inset-0 h-full w-full object-cover"
/>
```

Overlay :

```tsx
<div className="absolute inset-0 bg-[rgba(0,0,0,0.58)]" />
<div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15" />
```

Contenu :

```tsx
<div className="relative z-10 flex min-h-[calc(100svh-72px)] flex-col justify-end px-6 pb-8 pt-6">
  <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-gold)]">
    {event.label}
  </p>

  <h2 className="mt-3 max-w-[12ch] text-4xl font-semibold uppercase leading-tight text-[var(--text-primary)]">
    {event.title}
  </h2>

  <p className="mt-5 text-sm uppercase tracking-[0.18em] text-[var(--accent-gold)]">
    {event.dateLabel}
  </p>

  <p className="mt-2 text-base text-[var(--text-secondary)]">
    {event.startTime} — {event.endTime}
  </p>

  <a className="mt-7 flex h-12 items-center justify-center border border-[var(--accent-gold)] text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
    Réserver
  </a>
</div>
```

---

## 8. Progression mobile

Ajouter une barre de progression en haut, façon stories sobre :

```tsx
<div className="absolute left-6 right-6 top-5 z-20 flex gap-1">
  {events.map((event, index) => (
    <span
      key={event.id}
      className="h-px flex-1 bg-[var(--border-strong)]"
    >
      <span
        className={cn(
          "block h-px bg-[var(--accent-gold)] transition-all",
          index === activeIndex ? "w-full" : "w-0"
        )}
      />
    </span>
  ))}
</div>
```

Sur mobile, garder aussi un compteur discret :

```tsx
<p className="mt-8 text-sm text-[var(--text-muted)]">
  <span className="text-[var(--accent-gold)]">
    {String(activeIndex + 1).padStart(2, "0")}
  </span>{" "}
  / {String(events.length).padStart(2, "0")}
</p>
```

---

## 9. Contrôles communs

Créer `CarouselControls`.

### Flèches

```tsx
<button
  type="button"
  className="flex h-11 w-11 items-center justify-center border border-[var(--border-strong)] bg-[var(--surface-primary)] text-[var(--text-primary)] transition hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]"
>
  ←
</button>
```

Règles :

- `44px` minimum.
- Pas d’arrondi.
- Focus visible.
- Hover léger seulement.

---

## 10. Accessibilité

À respecter impérativement :

- Chaque bouton doit avoir un `aria-label`.
- Le carousel doit avoir un nom accessible.
- Le slide actif peut être annoncé via `aria-live="polite"`.
- Les slides non visibles desktop doivent avoir `aria-hidden`.
- Tous les liens CTA doivent être accessibles au clavier.
- Respecter `prefers-reduced-motion`.

Exemple :

```tsx
<section
  aria-roledescription="carousel"
  aria-label="Événements à venir"
>
```

Sur le slide actif :

```tsx
<article
  aria-roledescription="slide"
  aria-label={`${event.title}, ${event.dateLabel}`}
>
```

---

## 11. Motion

Avec `framer-motion`, utiliser des transitions courtes :

```ts
transition={{
  duration: 0.22,
  ease: "easeOut",
}}
```

Respecter `prefers-reduced-motion` :

```ts
const shouldReduceMotion = useReducedMotion();

transition={
  shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: "easeOut" }
}
```

---

## 12. Tokens CSS à utiliser

Ne pas hardcoder les couleurs hors cas exceptionnel.

Utiliser :

```css
var(--bg-primary)
var(--surface-primary)
var(--surface-elevated)
var(--text-primary)
var(--text-secondary)
var(--text-muted)
var(--accent-gold)
var(--accent-gold-hover)
var(--border-default)
var(--border-strong)
var(--hero-overlay)
var(--glow-gold-soft)
```

Coins :

```css
border-radius: 0;
```

Exception card média :

```css
border-radius: var(--radius-sm);
```

Mais pour ce carousel, garder plutôt `0px`.

---

## 13. Critères de validation visuelle

Avant de considérer l’implémentation terminée :

### Desktop

- [ ] La slide centrale est clairement prioritaire.
- [ ] Les slides latérales ne concurrencent pas la slide active.
- [ ] Le texte reste lisible sur toutes les images.
- [ ] Les flèches sont visibles mais discrètes.
- [ ] L’or est utilisé uniquement pour guider l’attention.
- [ ] Aucun effet “casino” ou “bling-bling”.

### Mobile

- [ ] Une seule slide dominante.
- [ ] Le CTA réservation est visible sans chercher.
- [ ] Le titre ne dépasse pas 2-3 lignes.
- [ ] Pas d’overflow horizontal parasite.
- [ ] Swipe fluide.
- [ ] Image toujours cropée proprement.
- [ ] Overlay suffisant, même sur image lumineuse.

---

## 14. Ordre de travail recommandé pour l’agent IA

```txt
1. Vérifier que les tokens CSS Rclub existent dans globals.css.
2. Créer le type EventItem.
3. Créer EventCarousel.tsx avec switch responsive desktop/mobile.
4. Implémenter EventCarouselCard.tsx.
5. Implémenter EventCarouselDesktop3D.tsx.
6. Implémenter EventCarouselMobileImmersive.tsx.
7. Ajouter CarouselControls.tsx.
8. Ajouter CarouselProgress.tsx.
9. Ajouter accessibilité clavier/focus/aria.
10. Tester responsive 375, 390, 768, 1280.
11. Ajuster uniquement spacing, overlay et tailles typo.
```

---

## 15. Prompt prêt à donner à l’agent IA

```txt
Implémente un carousel événementiel premium pour Rclub en React/Next/Tailwind.

Contexte design :
- Univers luxe nocturne, minimal, contrasté, noir profond + accent or #D4AF37.
- Coins droits par défaut, pas de border-radius sauf exception UX.
- Overlay hero/card à rgba(0,0,0,0.55).
- Mobile-first, lisibilité prioritaire.
- CTA principal réservation toujours visible.
- Pas d’effet flashy, pas de style bling-bling.

Comportement attendu :
- Desktop >= 1024px : carousel 3D avec slide centrale active, slides latérales inclinées en perspective, assombries et réduites.
- Mobile < 1024px : carousel immersif plein écran ou quasi plein écran, une slide par vue, swipe horizontal, image de fond, overlay sombre, progression fine en haut, CTA visible.
- Flèches carrées 44x44, border fine, hover or léger.
- Pagination sobre : index 01/05 ou barre fine, pas de dots classiques.
- Respect prefers-reduced-motion.
- Accessibilité clavier complète.

Fichiers à créer :
components/carousel/EventCarousel.tsx
components/carousel/EventCarouselDesktop3D.tsx
components/carousel/EventCarouselMobileImmersive.tsx
components/carousel/EventCarouselCard.tsx
components/carousel/CarouselControls.tsx
components/carousel/CarouselProgress.tsx

Type à utiliser :
export type EventItem = {
  id: string;
  title: string;
  label?: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  href: string;
  bookingHref?: string;
  status?: "upcoming" | "sold-out" | "past";
};

Contraintes :
- Utiliser les variables CSS du design system :
  var(--bg-primary), var(--surface-primary), var(--text-primary), var(--text-secondary), var(--text-muted), var(--accent-gold), var(--border-default), var(--border-strong), var(--hero-overlay), var(--glow-gold-soft).
- Ne pas hardcoder des couleurs sauf pour overlay si nécessaire.
- Utiliser framer-motion pour le desktop 3D.
- Sur mobile, privilégier CSS scroll-snap ou une logique swipe simple.
- Aucun overflow horizontal.
- Images en object-cover avec ratio contrôlé.
- CTA hauteur min 44px.

Livrable :
- Code complet des composants.
- Exemple d’utilisation avec un tableau events mocké.
- Classes Tailwind cohérentes avec le design system.
- Vérification responsive 375x812, 390x844, 768x1024, 1280x800.
```

---

## 16. Décision à verrouiller avant code

Choix recommandé :

```txt
Desktop : effet 3D contrôlé avec 5 slides visibles max.
Mobile : pas de 3D, expérience immersive type story/card verticale.
```

C’est le meilleur compromis : premium sur desktop, lisible sur mobile. Parce qu’un carousel 3D sur 375px, c’est souvent une machine à fabriquer du regret.
