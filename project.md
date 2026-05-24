# Projet - Site web du club

## Vision
Créer un site web premium pour une boîte de nuit réputée à Strasbourg, avec une direction artistique noir/or, une ambiance luxueuse et une navigation claire.

## Objectifs principaux
- Présenter le club et ses événements de manière attractive
- Permettre aux visiteurs de faire des demandes de réservation et de privatisation
- Fournir un espace admin simple pour mettre à jour les contenus (textes, logo, médias, événements)
- Fournir un socle technique propre, maintenable et extensible

## Pages attendues (MVP)
- Accueil ✅ (hero vidéo, carousel 3D événements, infos pratiques, expérience, inside, CTA final)
- Agenda des événements ✅
- Galerie (`/galerie`) ✅ → liste des événements ayant des photos
- Galerie d'un événement (`/galerie/[slug]`) ✅ → photos de cet événement
- Réservations ✅
- Privatisation ✅
- Contact (intégré footer)

## Exigences fonctionnelles clés
- Le site est en français par défaut ✅
- Le site doit être basculable en anglais (FR/EN) ✅
- La page d'accueil doit mettre en avant le prochain événement à venir (calculé selon la date) ✅
- Le hero de la page d'accueil est une vidéo avec le logo du club superposé ✅
- Les demandes de réservation doivent pouvoir être envoyées depuis le site ✅
- La page d'accueil suit un parcours émotion→information→confiance→projection→conversion ✅

## Lacunes connues (phase 1)
- Images secondaires `HomeInsideClub` : placeholders events (`r-family.png`, `legend-r.png`) — à remplacer par photos club définitives
- Textes des sections sous carousel (PracticalInfo, Experience, Inside, FinalCta) codés en dur dans `messages/*.json` — pas de CMS admin pour les modifier (F-09 ne couvre que les textes hero)
- Upload binaire médias non implémenté — seules les URLs sont gérées (phase 2 : Cloudinary)
- Rate-limit anti-spam in-process : se remet à zéro au redémarrage (pas Redis)

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
- `status`: enum (`new`, `reviewed`, `confirmed`, `refused`, `closed`) - défaut `new`
- `source_locale`: enum (`fr`, `en`) - obligatoire
- `consent_rgpd`: boolean (obligatoire)
- `admin_notes`: text (optionnel — notes internes, non visibles du client)
- `notified_at`: datetime (optionnel — date du dernier email envoyé au client)
- `confirmed_at`: datetime (optionnel — renseigné lors de la confirmation)
- `refused_at`: datetime (optionnel — renseigné lors du refus)
- `created_by_admin`: boolean (défaut `false` — `true` si créée manuellement par l'admin)
- `created_at`: datetime
- `updated_at`: datetime

> Les statuts `confirmed` et `refused` déclenchent automatiquement un email de notification au client via Resend. Le statut `created_by_admin` distingue les réservations saisies manuellement des demandes entrantes.

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
  - réservations (voir ci-dessous)
- L'expérience d'édition doit rester simple et cohérente avec le style global

### Gestion des réservations (admin)

#### Vue dashboard réservations
- L'admin voit un tableau de bord avec le **nombre de réservations par soir** : événements passés et à venir
- Chaque ligne affiche : date / nom de l'événement, nb confirmées, nb en attente, nb refusées, total guests confirmés
- Les soirs à venir sont mis en avant visuellement par rapport aux passés

#### Traitement des demandes entrantes
- L'admin peut **accepter** ou **refuser** une demande de réservation depuis l'interface
- À chaque décision, un email est automatiquement envoyé au client (via Resend) :
  - Confirmation : email chaleureux avec récap (nom, date, nb personnes)
  - Refus : email courtois indiquant que la demande n'a pas pu être retenue
- L'admin peut ajouter une **note interne** (non visible du client) avant de valider
- L'historique du statut est visible sur la fiche de la demande

#### Ajout manuel d'une réservation
- L'admin peut créer une réservation directement (sans passer par le formulaire visiteur)
- Champs : nom, email, téléphone, événement ou date, nb personnes, note interne
- La réservation est créée avec le statut `confirmed` par défaut
- Un email de confirmation est envoyé au client (paramétrable)

#### Modification d'une réservation confirmée
- L'admin peut modifier une réservation déjà confirmée (manuelle ou issue d'une demande)
- Champs modifiables : nom, téléphone, email, nb personnes, note interne, événement/date
- Si l'email ou le nb de personnes change, un email de mise à jour peut être envoyé au client (à la discrétion de l'admin, via une case "notifier le client")

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
- Les emails de confirmation/refus sont envoyés immédiatement lors du changement de statut (pas de file d'attente)
- L'admin peut choisir d'envoyer ou non un email lors d'une modification d'une réservation confirmée
- Une réservation créée manuellement par l'admin est `confirmed` par défaut ; l'envoi de l'email de confirmation est optionnel
- Un refus est définitif depuis l'UI (pas de retour en arrière automatique — l'admin devra re-confirmer manuellement si besoin)
