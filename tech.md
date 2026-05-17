# Stack technique

## Technologies imposées
- Framework web: Next.js 16 (App Router)
- Gestionnaire de paquets: pnpm
- Emails transactionnels: Resend
- Base de données: PostgreSQL (hébergée sur Railway)
- Gestion des médias: Cloudinary (prévoir une phase transitoire avec `public/media`)
- Hébergement: Vercel

## Technologies à choisir par l'agent (avec validation)
- Authentification admin: proposer la meilleure option pour Next.js, puis demander validation avant implémentation
- ORM / couche d'accès aux données: proposer une option adaptée à PostgreSQL et au besoin admin
- UI / Design system: proposer une librairie ou approche cohérente (composants réutilisables, thème noir/or)
- i18n: proposer une solution simple et robuste FR/EN
- Tests: proposer la stack de test (unitaires, intégration, e2e) avant implémentation massive

## Contraintes techniques
- Le code doit rester modulaire et maintenable (composants encapsulés, séparation UI / logique)
- Les médias doivent pouvoir être migrés facilement de `public/media` vers Cloudinary
- Les pages doivent être performantes (images optimisées, lazy loading, SEO de base)
- Les variables d'environnement doivent être documentées dans `.env.example` (sans secrets)

## Règle de décision
Quand un choix technique n'est pas explicitement figé ici, l'agent doit:
1. Proposer 1 option recommandée (avec courte justification)
2. Demander validation
3. Implémenter après validation
