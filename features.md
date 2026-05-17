# Features du site

> Format recommandé: chaque scénario devient un test d'acceptation.

## Priorisation MVP

### P0 (indispensable au lancement)
- `F-01` Voir le prochain événement en avant
- `F-02` Basculer le site en anglais (FR/EN)
- `F-04` Envoyer une demande de réservation
- `F-05` Consulter l'agenda des événements
- `F-07` Se connecter à l'espace admin
- `F-09` Modifier le texte de la page d'accueil
- `F-10` Gérer les événements (CRUD)

### P1 (important après socle MVP)
- `F-03` Voir la galerie d'un événement (liste événements + page photos par événement)
- `F-06` Envoyer une demande de privatisation
- `F-08` Changer le logo
- `F-11` Gérer les photos d'un événement depuis l'admin (upload / suppression)
- `F-12` Changer la vidéo du hero

### P2 (optimisation / confort)
- Durcissement anti-spam des formulaires (rate limit, honeypot/captcha)
- Optimisations SEO avancées
- Dashboard admin avec statistiques simples

## Ordre de livraison recommandé
1. `F-07` Auth admin
2. `F-10` CRUD événements
3. `F-01` Highlight prochain événement
4. `F-05` Agenda événements
5. `F-04` Réservation
6. `F-02` i18n FR/EN
7. Puis bloc P1

## Persona: Visiteur

### Feature `F-01`: Voir le prochain événement en avant
```gherkin
Scenario: Affichage du prochain événement sur la page d'accueil
  Given plusieurs événements existent avec des dates futures
  When je visite la page d'accueil
  Then je vois l'événement avec la date la plus proche en section highlight
```

### Feature `F-02`: Basculer le site en anglais
```gherkin
Scenario: Changer la langue de FR vers EN
  Given je suis sur le site en français
  When je sélectionne la langue anglaise
  Then le contenu principal s'affiche en anglais
```

### Feature `F-03`: Voir la galerie d'un événement

> La galerie est structurée par événement. "Cash Out" est un événement parmi d'autres.
> Chaque événement a : titre, date, description, image de couverture (uploadée par l'admin).

```gherkin
Scenario: Consulter la liste des événements avec photos
  Given plusieurs événements publiés ont au moins une photo
  When je vais sur la page /galerie
  Then je vois la liste des événements avec leur couverture et leur titre

Scenario: Consulter la galerie d'un événement spécifique
  Given un événement publié a des photos associées
  When je clique sur cet événement depuis /galerie
  Then je suis redirigé vers /galerie/[slug]
  And je vois toutes les photos de cet événement

Scenario: Galerie vide
  Given un événement publié n'a aucune photo
  Then il n'apparaît pas dans la liste /galerie
```

### Feature `F-04`: Envoyer une demande de réservation
```gherkin
Scenario: Soumettre une demande de réservation valide
  Given je suis sur la page Réservations
  When je remplis le formulaire avec des données valides
  And je soumets le formulaire
  Then ma demande est enregistrée et/ou envoyée
  And je vois un message de confirmation
```

### Feature `F-05`: Consulter l'agenda des événements
```gherkin
Scenario: Voir les événements à venir
  Given des événements à venir existent
  When je vais sur la page Agenda
  Then je vois la liste des événements triés par date croissante
```

### Feature `F-06`: Envoyer une demande de privatisation
```gherkin
Scenario: Soumettre une demande de privatisation
  Given je suis sur la page de contact ou privatisation
  When je remplis le formulaire de privatisation
  And je soumets le formulaire
  Then ma demande est transmise avec succès
```

## Persona: Admin

### Feature `F-07`: Se connecter à l'espace admin
```gherkin
Scenario: Connexion admin réussie
  Given je possède des identifiants admin valides
  When je me connecte à l'espace admin
  Then j'accède au tableau de bord admin
```

### Feature `F-08`: Changer le logo
```gherkin
Scenario: Mettre à jour le logo du site
  Given je suis connecté en admin
  When je téléverse un nouveau logo valide
  Then le nouveau logo est utilisé sur le site
```

### Feature `F-09`: Modifier le texte de la page d'accueil
```gherkin
Scenario: Mettre à jour un texte éditorial
  Given je suis connecté en admin
  When je modifie le texte de la page d'accueil
  And j'enregistre les changements
  Then le nouveau texte est visible côté visiteur
```

### Feature `F-10`: Gérer les événements (CRUD)

> Chaque événement contient : titre (FR/EN), date, description (FR/EN), image de couverture uploadable.

```gherkin
Scenario: Ajouter un événement avec image de couverture
  Given je suis connecté en admin
  When je crée un événement avec titre, date, description et une image uploadée
  Then l'événement apparaît dans l'agenda avec son image

Scenario: Modifier un événement
  Given je suis connecté en admin
  And un événement existe déjà
  When je modifie ses informations ou remplace son image
  Then les nouvelles informations sont affichées sur le site

Scenario: Supprimer un événement
  Given je suis connecté en admin
  And un événement existe déjà
  When je supprime cet événement
  Then il n'apparaît plus dans l'agenda
```

### Feature `F-11`: Gérer les photos d'un événement (admin)

> S'applique à tous les événements, pas uniquement "Cash Out".

```gherkin
Scenario: Ajouter des photos à un événement
  Given je suis connecté en admin
  And un événement existe
  When j'uploade des photos depuis la fiche de cet événement
  Then elles sont visibles dans la galerie /galerie/[slug]

Scenario: Supprimer une photo d'un événement
  Given je suis connecté en admin
  And des photos existent pour un événement
  When je supprime une photo
  Then elle n'est plus visible dans la galerie

Scenario: Réordonner les photos
  Given je suis connecté en admin
  And plusieurs photos existent pour un événement
  When je modifie leur ordre
  Then la galerie visiteur respecte ce nouvel ordre
```

### Feature `F-12`: Changer la vidéo du hero
```gherkin
Scenario: Mettre à jour la vidéo hero
  Given je suis connecté en admin
  When je remplace la vidéo du hero par une source valide
  Then la nouvelle vidéo est affichée sur la page d'accueil
```

## Points à préciser (recommandé)
- Quels champs sont obligatoires pour chaque formulaire (réservation / privatisation)?
- Quel comportement si aucun événement futur n'existe?
- Modération requise avant publication d'un événement ou d'un média?
- Niveau de droits admin: un seul rôle ou plusieurs rôles (super-admin, éditeur)?

## Dépendances fonctionnelles
- `F-01` dépend de `F-10` (nécessite des événements en base)
- `F-05` dépend de `F-10`
- `F-11` dépend de `F-10`
- `F-08`, `F-09`, `F-11`, `F-12` dépendent de `F-07` (admin connecté)
