"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Tab = {
  href: string;
  label: string;
  // Match if pathname starts with `match` (or equals when `exact`)
  match: string;
  exact?: boolean;
  badge?: number;
};

function buildBreadcrumbs(pathname: string): { href: string; label: string }[] {
  // Pathname examples:
  // /admin
  // /admin/events
  // /admin/events/new
  // /admin/events/<id>/edit
  // /admin/reservations
  // /admin/reservations/new
  // /admin/reservations/historique
  // /admin/reservations/groupe/<key>
  // /admin/reservations/<id>

  const crumbs: { href: string; label: string }[] = [{ href: "/admin", label: "Tableau de bord" }];

  if (pathname === "/admin") return crumbs;

  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);

  if (segments[0] === "events") {
    crumbs.push({ href: "/admin/events", label: "Événements" });
    if (segments[1] === "new") {
      crumbs.push({ href: "/admin/events/new", label: "Nouveau" });
    } else if (segments[1] && segments[2] === "edit") {
      crumbs.push({ href: pathname, label: "Édition" });
    }
  } else if (segments[0] === "reservations") {
    crumbs.push({ href: "/admin/reservations", label: "Réservations" });
    if (segments[1] === "new") {
      crumbs.push({ href: "/admin/reservations/new", label: "Nouvelle réservation" });
    } else if (segments[1] === "historique") {
      crumbs.push({ href: "/admin/reservations/historique", label: "Historique" });
    } else if (segments[1] === "notifications") {
      crumbs.push({ href: "/admin/reservations/notifications", label: "Notifications" });
    } else if (segments[1] === "groupe" && segments[2]) {
      crumbs.push({ href: pathname, label: "Soirée" });
    } else if (segments[1]) {
      crumbs.push({ href: pathname, label: "Détail" });
    }
  } else if (segments[0] === "users") {
    crumbs.push({ href: "/admin/users", label: "Comptes admin" });
  }

  return crumbs;
}

export function AdminShellNav({
  pendingReservations,
  adminEmail,
  canManageUsers,
  signOutAction
}: {
  pendingReservations: number;
  adminEmail: string | null;
  canManageUsers: boolean;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname() ?? "/admin";

  const tabs: Tab[] = [
    { href: "/admin", label: "Tableau de bord", match: "/admin", exact: true },
    { href: "/admin/events", label: "Événements", match: "/admin/events" },
    {
      href: "/admin/reservations",
      label: "Réservations",
      match: "/admin/reservations",
      badge: pendingReservations
    },
    { href: "/admin/reservations/historique", label: "Historique", match: "/admin/reservations/historique" },
    ...(canManageUsers
      ? [{ href: "/admin/users", label: "Comptes", match: "/admin/users" } satisfies Tab]
      : []),
  ];

  // Resolve active tab: prefer the most specific match (longest match wins,
  // but historique must beat reservations when on historique page).
  const activeTab = tabs.reduce<Tab | null>((best, tab) => {
    const matches = tab.exact ? pathname === tab.match : pathname.startsWith(tab.match);
    if (!matches) return best;
    if (!best) return tab;
    return tab.match.length > best.match.length ? tab : best;
  }, null);

  const crumbs = buildBreadcrumbs(pathname);
  // The immediate parent crumb (the one before the current page), if any.
  // Used on mobile to render a compact "← Parent" instead of the full chain.
  const parentCrumb = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;

  // Auto-scroll the active tab into view on mobile when tabs overflow.
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <>
      <div className="admin-chrome">
        <div className="admin-topbar">
          <Link href="/admin" className="admin-brand" aria-label="Rclub Admin">
            <span className="admin-brand-mark">R</span>
            <span className="admin-brand-text">
              <span className="admin-brand-line">Rclub</span>
              <span className="admin-brand-sub">Admin</span>
            </span>
          </Link>

          <div className="admin-topbar-actions">
            {adminEmail && <span className="admin-topbar-user">{adminEmail}</span>}
            <Link
              href="/"
              className="admin-topbar-link admin-topbar-link-site"
              target="_blank"
              rel="noreferrer"
              aria-label="Voir le site"
              title="Voir le site"
            >
              <span className="admin-topbar-link-label">Voir le site</span>
              <span aria-hidden>↗</span>
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="admin-topbar-link admin-topbar-logout"
                aria-label="Déconnexion"
                title="Déconnexion"
              >
                <span className="admin-topbar-link-label">Déconnexion</span>
                <span aria-hidden className="admin-topbar-link-icon">⎋</span>
              </button>
            </form>
          </div>
        </div>

        <nav className="admin-tabs" aria-label="Navigation admin">
          <div className="admin-tabs-inner">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  ref={isActive ? activeTabRef : undefined}
                  className={`admin-tab${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="admin-tab-badge">{tab.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {crumbs.length > 1 && (
        <nav className="admin-breadcrumbs" aria-label="Fil d'Ariane">
          {/* Mobile: compact "← Parent" */}
          {parentCrumb && (
            <Link href={parentCrumb.href} className="admin-breadcrumb-compact">
              <span aria-hidden>←</span>
              {parentCrumb.label}
            </Link>
          )}

          {/* Desktop: full chain */}
          <div className="admin-breadcrumb-chain">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={`${crumb.href}-${i}`} className="admin-breadcrumb-item">
                  {isLast ? (
                    <span className="admin-breadcrumb-current" aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="admin-breadcrumb-link">
                      {crumb.label}
                    </Link>
                  )}
                  {!isLast && <span className="admin-breadcrumb-sep" aria-hidden>›</span>}
                </span>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
