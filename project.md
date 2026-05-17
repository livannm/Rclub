# Projet - Site web du club

## Vision
Créer un site web premium pour une boîte de nuit réputée à Strasbourg, avec une direction artistique noir/or, une ambiance luxueuse et une navigation claire.

## Objectifs principaux
- Présenter le club et ses événements de manière attractive
- Permettre aux visiteurs de faire des demandes de réservation et de privatisation
- Fournir un espace admin simple pour mettre à jour les contenus (textes, logo, médias, événements)
- Fournir un socle technique propre, maintenable et extensible

## Pages attendues (MVP)
- Accueil
- Agenda des événements
- Galerie (`/galerie`) → liste des événements ayant des photos
- Galerie d'un événement (`/galerie/[slug]`) → photos de cet événement
- Réservations
- Contact

## Exigences fonctionnelles clés
- Le site est en français par défaut
- Le site doit être basculable en anglais (FR/EN)
- La page d'accueil doit mettre en avant le prochain événement à venir (calculé selon la date)
- Le hero de la page d'accueil est une vidéo avec le logo du club superposé
- Les demandes de réservation doivent pouvoir être envoyées depuis le site

## Schémas de données minimaux (v1)

### Entité: Event
- `id`: UUID
- `slug`: string unique (URL friendly)
- `title_fr`: string (obligatoire)
- `title_en`: string (obligatoire)
- `description_fr`: text (obligatoire)
- `description_en`: text (obligatoire)
- `starts_at`: datetime (obligatoire)
- `ends_at`: datetime (optionnel)
- `location`: string (optionnel, défaut = nom du club)
- `cover_image_url`: string (obligatoire — uploadée par l'admin depuis son espace)
- `hero_video_url`: string (optionnel)
- `ticket_url`: string (optionnel)
- `is_published`: boolean (défaut `false`)
- `created_at`: datetime
- `updated_at`: datetime

> Note : `cover_image_url` est l'image principale de l'événement (affichée dans l'agenda et en tête de la galerie). Elle est uploadée par l'admin lors de la création ou modification de l'événement (F-10).

### Entité: EventMedia
- `id`: UUID
- `event_id`: UUID (référence `Event.id`, obligatoire)
- `url`: string (URL du fichier, obligatoire)
- `type`: enum (`photo`, `video`) — défaut `photo`
- `caption_fr`: string (optionnel)
- `caption_en`: string (optionnel)
- `sort_order`: integer (ordre d'affichage, défaut 0)
- `created_at`: datetime

> La galerie visiteur (`/galerie/[slug]`) affiche les `EventMedia` d'un événement. La page `/galerie` liste tous les événements publiés ayant au moins un média.

### Entité: ReservationRequest
- `id`: UUID
- `full_name`: string (obligatoire)
- `email`: string (obligatoire)
- `phone`: string (obligatoire)
- `event_id`: UUID (optionnel)
- `date_requested`: date (optionnel)
- `guest_count`: integer (obligatoire)
- `message`: text (optionnel)
- `status`: enum (`new`, `reviewed`, `contacted`, `closed`) - défaut `new`
- `source_locale`: enum (`fr`, `en`) - obligatoire
- `consent_rgpd`: boolean (obligatoire)
- `created_at`: datetime

### Entité: PrivatizationRequest
- `id`: UUID
- `full_name`: string (obligatoire)
- `email`: string (obligatoire)
- `phone`: string (obligatoire)
- `event_date`: date (optionnel)
- `guest_count`: integer (obligatoire)
- `budget_range`: string (optionnel)
- `message`: text (optionnel)
- `status`: enum (`new`, `reviewed`, `contacted`, `closed`) - défaut `new`
- `source_locale`: enum (`fr`, `en`) - obligatoire
- `consent_rgpd`: boolean (obligatoire)
- `created_at`: datetime

### Entité: SiteAsset
- `id`: UUID
- `key`: enum (`logo`, `home_hero_video`, `home_hero_poster`, `home_highlight_label`)
- `value`: string (URL ou texte)
- `locale`: enum (`fr`, `en`, `global`) - défaut `global`
- `updated_by`: UUID (admin user)
- `updated_at`: datetime

### Entité: AdminUser
- `id`: UUID
- `email`: string unique
- `password_hash` ou `provider_id`: string
- `role`: enum (`super_admin`, `editor`) - défaut `editor`
- `created_at`: datetime
- `updated_at`: datetime

## Back-office / Administration
- Un espace admin est requis pour gérer:
  - textes du site
  - logo
  - médias
  - événements
- L'expérience d'édition doit rester simple et cohérente avec le style global

## Médias et migration
- Phase 1: médias stockés localement dans `public/media` avec des noms explicites
- Phase 2: migration vers Cloudinary
- Le code doit être préparé pour rendre cette migration simple (abstraction de la source média)

## Références de cadrage
- Détail des fonctionnalités: `features.md`
- Personas: `personna.md`
- Contraintes techniques: `tech.md`
- Règles de travail: `rules.md`
- Direction design: `design.md`

## Points à préciser (recommandé)
- Priorité des pages pour le MVP (ordre de livraison)
- ~~Données minimales d'un événement~~ → validé : titre (FR/EN), date, description (FR/EN), image de couverture uploadable
- ~~Galerie par événement~~ → validé : `/galerie` liste les événements, `/galerie/[slug]` affiche les photos de l'événement
- Champs exacts des formulaires réservation / privatisation
- Règles anti-spam et RGPD (consentement, durée de conservation des demandes)

## Arbitrages proposés (par défaut si non précisé)
- Si aucun événement futur n'existe: masquer le bloc highlight et afficher un fallback éditorial
- Consentement RGPD requis pour tout envoi de formulaire
- Limiter les rôles admin à `super_admin` et `editor` pour la v1
- Conserver les demandes (réservation/privatisation) 12 mois avant archivage ou purge
