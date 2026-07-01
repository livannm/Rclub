import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { adminDashboardStatsService } from "@/lib/admin-stats/admin-dashboard-stats-instance";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";
import type {
  RecentReservation,
  UpcomingEventSummary,
  WeeklyTrendPoint
} from "@/lib/admin-stats/admin-dashboard-stats";

export default async function AdminDashboardPage() {
  const session = await auth();
  const currentHeroVideo = await siteAssetService.getHeroVideo();
  const currentLogo = await siteAssetService.getLogo();
  const stats = await adminDashboardStatsService.getStats();

  async function updateHeroVideoAction(formData: FormData) {
    "use server";
    const url = formData.get("hero_video_url");
    if (typeof url !== "string" || !url.trim()) {
      return;
    }
    await siteAssetService.updateHeroVideo(url.trim());
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function updateLogoAction(formData: FormData) {
    "use server";
    const url = formData.get("logo_url");
    if (typeof url !== "string" || !url.trim()) {
      return;
    }
    await siteAssetService.updateLogo(url.trim());
    revalidatePath("/");
    revalidatePath("/admin");
  }

  const { events, requests } = stats;
  const trendMax = Math.max(1, ...requests.weeklyTrend.map((p) => p.count));
  const trendTotal = requests.weeklyTrend.reduce((sum, p) => sum + p.count, 0);
  const tableTotal =
    requests.tableTypeBreakdown.classique +
    requests.tableTypeBreakdown.prestige +
    requests.tableTypeBreakdown.vip;
  const occasionTotal =
    requests.occasionBreakdown.evg +
    requests.occasionBreakdown.evjf +
    requests.occasionBreakdown.anniversaire +
    requests.occasionBreakdown.autre;

  return (
    <main className="admin-shell">
      <div className="admin-page-bar">
        <p className="admin-page-subtitle">
          Bonjour {session?.user?.email?.split("@")[0] ?? "admin"}, voici l&apos;état du club.
        </p>
      </div>

      {/* ── KPIs principaux ───────────────────────────────── */}
      <section aria-labelledby="kpis-heading" className="admin-section">
        <h2 id="kpis-heading" className="admin-section-title">Aperçu</h2>
        <div className="kpi-grid">
          <KpiCard
            label="Demandes à traiter"
            value={requests.reservationsNew}
            href="/admin/reservations"
            urgent={requests.reservationsNew > 0}
            hint={
              requests.privatizationsNew > 0
                ? `+ ${requests.privatizationsNew} privatisation${requests.privatizationsNew > 1 ? "s" : ""}`
                : "Aucune urgence"
            }
            testId="admin-stat-reservations-new"
          />
          <KpiCard
            label="Guests confirmés · 7 j"
            value={requests.guestsConfirmedNext7Days}
            hint={`${requests.guestsConfirmedNext30Days} sur 30 jours`}
          />
          <KpiCard
            label="Taux de confirmation · 30 j"
            value={`${Math.round(requests.confirmationRate30d * 100)}%`}
            hint={
              requests.cancellationRate90d > 0
                ? `Annulations · 90 j : ${Math.round(requests.cancellationRate90d * 100)}%`
                : "0 annulation sur 90 j"
            }
            progress={requests.confirmationRate30d}
          />
          <KpiCard
            label="Soirées à venir"
            value={events.upcomingPublished}
            href="/admin/events"
            hint={`${events.published} publiée${events.published > 1 ? "s" : ""} au total`}
            testId="admin-stat-events-upcoming"
          />
        </div>
      </section>

      {/* ── Prochaine soirée ───────────────────────────────── */}
      {events.nextEvent && (
        <section aria-labelledby="next-evening-heading" className="admin-section">
          <h2 id="next-evening-heading" className="admin-section-title">Prochaine soirée</h2>
          <NextEveningCard event={events.nextEvent} />
        </section>
      )}

      {/* ── Planning ─────────────────────────────────────── */}
      {events.upcomingPlanning.length > 1 && (
        <section aria-labelledby="planning-heading" className="admin-section">
          <h2 id="planning-heading" className="admin-section-title">Planning</h2>
          <div className="planning-grid">
            {events.upcomingPlanning.slice(1).map((event) => (
              <PlanningCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ── Activité récente + Insights ─────────────────── */}
      <div className="dashboard-2col">
        <section aria-labelledby="activity-heading" className="admin-section">
          <h2 id="activity-heading" className="admin-section-title">Activité récente</h2>
          <div className="admin-card activity-card">
            {requests.recentActivity.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                Aucune demande pour l&apos;instant.
              </p>
            ) : (
              <ul className="activity-feed">
                {requests.recentActivity.map((r) => (
                  <ActivityRow key={r.id} reservation={r} />
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="insights-heading" className="admin-section">
          <h2 id="insights-heading" className="admin-section-title">Insights</h2>
          <div className="insights-stack">
            <div className="admin-card insight-card">
              <h3 className="insight-title">Tendance des demandes · 4 semaines</h3>
              {trendTotal === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  Pas encore de données.
                </p>
              ) : (
                <Sparkline data={requests.weeklyTrend} max={trendMax} />
              )}
            </div>

            <div className="admin-card insight-card">
              <h3 className="insight-title">Type de table · confirmées</h3>
              {tableTotal === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  Aucune réservation confirmée.
                </p>
              ) : (
                <BreakdownBars
                  rows={[
                    { label: "Classique", count: requests.tableTypeBreakdown.classique, total: tableTotal },
                    { label: "Prestige", count: requests.tableTypeBreakdown.prestige, total: tableTotal },
                    { label: "VIP", count: requests.tableTypeBreakdown.vip, total: tableTotal }
                  ]}
                />
              )}
            </div>

            <div className="admin-card insight-card">
              <h3 className="insight-title">Occasions · confirmées</h3>
              {occasionTotal === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  Aucune occasion renseignée.
                </p>
              ) : (
                <BreakdownBars
                  rows={[
                    { label: "EVG", count: requests.occasionBreakdown.evg, total: occasionTotal },
                    { label: "EVJF", count: requests.occasionBreakdown.evjf, total: occasionTotal },
                    { label: "Anniversaire", count: requests.occasionBreakdown.anniversaire, total: occasionTotal },
                    { label: "Autre", count: requests.occasionBreakdown.autre, total: occasionTotal }
                  ]}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Configuration site (gardées plus bas) ───────── */}
      <section className="admin-section">
        <h2 className="admin-section-title">Configuration du site</h2>
        <div className="dashboard-2col">
          <div className="admin-card">
            <h3 className="insight-title">Logo</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 0 }}>
              <code data-testid="current-logo-url">{currentLogo}</code>
            </p>
            {currentLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentLogo}
                alt="Logo actuel"
                data-testid="current-logo-preview"
                className="site-logo"
              />
            )}
            <form action={updateLogoAction} className="admin-form">
              <MediaUploadField
                id="logo_url"
                name="logo_url"
                label="Nouvelle URL"
                kind="image"
                placeholder="https://... ou /media/logo.png"
                defaultValue={currentLogo}
                destination={{ kind: "images" }}
                required
              />
              <button type="submit">Mettre à jour</button>
            </form>
          </div>

          <div className="admin-card">
            <h3 className="insight-title">Vidéo hero</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 0 }}>
              <code data-testid="current-hero-video-url">{currentHeroVideo}</code>
            </p>
            <form action={updateHeroVideoAction} className="admin-form">
              <MediaUploadField
                id="hero_video_url"
                name="hero_video_url"
                label="Nouvelle URL"
                kind="video"
                placeholder="https://... ou /media/hero.mp4"
                defaultValue={currentHeroVideo}
                destination={{ kind: "videos" }}
                required
              />
              <button type="submit">Mettre à jour</button>
            </form>
          </div>
        </div>
      </section>

      {/* Test-id legacy stats (non visibles) */}
      <div hidden>
        <span data-testid="admin-stat-events-total">{events.total}</span>
        <span data-testid="admin-stat-events-published">{events.published}</span>
        <span data-testid="admin-stat-reservations">{requests.reservationsTotal}</span>
        <span data-testid="admin-stat-privatizations">{requests.privatizationsTotal}</span>
        <span data-testid="admin-stat-privatizations-new">{requests.privatizationsNew}</span>
        <span data-testid="admin-stat-gallery-photos">{stats.gallery.photosTotal}</span>
        <span data-testid="admin-stat-gallery-events">{stats.gallery.eventsWithPhotos}</span>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  hint,
  href,
  urgent,
  progress,
  testId
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  urgent?: boolean;
  progress?: number;
  testId?: string;
}) {
  const inner = (
    <>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value" data-testid={testId}>
        {value}
        {urgent && typeof value === "number" && value > 0 && <span className="kpi-pulse" aria-hidden />}
      </p>
      {progress !== undefined && (
        <div className="kpi-progress" aria-hidden>
          <div
            className="kpi-progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
      {hint && <p className="kpi-hint">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`kpi-card kpi-card-link${urgent ? " is-urgent" : ""}`}>
        {inner}
      </a>
    );
  }

  return <div className={`kpi-card${urgent ? " is-urgent" : ""}`}>{inner}</div>;
}

function NextEveningCard({ event }: { event: UpcomingEventSummary }) {
  const dateStr = new Date(event.startsAtIso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const timeStr = new Date(event.startsAtIso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <article className="next-evening-card">
      <div
        className="next-evening-cover"
        style={{ backgroundImage: `url(${event.coverImageUrl})` }}
        aria-hidden
      />
      <div className="next-evening-body">
        <p className="next-evening-when">
          {event.daysUntil === 0 ? "Aujourd'hui" : `Dans ${event.daysUntil} jour${event.daysUntil > 1 ? "s" : ""}`}
          {" · "}
          {timeStr}
        </p>
        <h3 className="next-evening-title">{event.titleFr}</h3>
        <p className="next-evening-date">{dateStr}</p>

        <div className="next-evening-stats">
          <div className="ne-stat">
            <span className="ne-stat-value">{event.confirmedCount}</span>
            <span className="ne-stat-label">Confirmées</span>
          </div>
          <div className="ne-stat">
            <span className={`ne-stat-value${event.pendingCount > 0 ? " is-pending" : ""}`}>
              {event.pendingCount}
            </span>
            <span className="ne-stat-label">En attente</span>
          </div>
          <div className="ne-stat ne-stat-emphasis">
            <span className="ne-stat-value">{event.totalGuestsConfirmed}</span>
            <span className="ne-stat-label">Guests confirmés</span>
          </div>
        </div>

        <div className="next-evening-actions">
          <a href={`/admin/reservations/groupe/event_${event.id}`} className="button">
            Voir les réservations
          </a>
          <a href={`/admin/events/${event.id}/edit`} className="button button-ghost">
            Modifier l&apos;événement
          </a>
        </div>
      </div>
    </article>
  );
}

function PlanningCard({ event }: { event: UpcomingEventSummary }) {
  const dateStr = new Date(event.startsAtIso).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });

  return (
    <a href={`/admin/reservations/groupe/event_${event.id}`} className="planning-card">
      <div className="planning-card-header">
        <span className="planning-when">Dans {event.daysUntil} j</span>
        <span className="planning-date">{dateStr}</span>
      </div>
      <p className="planning-title">{event.titleFr}</p>
      <div className="planning-stats">
        <span className="planning-stat">
          <strong>{event.confirmedCount}</strong> conf.
        </span>
        {event.pendingCount > 0 && (
          <span className="planning-stat is-pending">
            <strong>{event.pendingCount}</strong> attente
          </span>
        )}
        <span className="planning-stat planning-stat-guests">
          <strong>{event.totalGuestsConfirmed}</strong> guests
        </span>
      </div>
    </a>
  );
}

function ActivityRow({ reservation }: { reservation: RecentReservation }) {
  const created = new Date(reservation.createdAtIso);
  const ago = relativeTimeFr(created);
  const where = reservation.eventTitleFr ?? reservation.dateRequested ?? "Sans date";

  return (
    <li className="activity-row">
      <a href={`/admin/reservations/${reservation.id}`} className="activity-link">
        <div className="activity-main">
          <span className="activity-name">{reservation.fullName}</span>
          <span className="activity-meta">
            {reservation.guestCount} pers. · {where}
          </span>
        </div>
        <div className="activity-side">
          <span className={`activity-status res-status-${reservation.status}`}>
            {statusShort(reservation.status)}
          </span>
          <span className="activity-ago">{ago}</span>
        </div>
      </a>
    </li>
  );
}

function Sparkline({ data, max }: { data: WeeklyTrendPoint[]; max: number }) {
  return (
    <div className="sparkline">
      {data.map((point) => {
        const height = Math.max(4, (point.count / max) * 60);
        const weekLabel = new Date(point.weekStartIso).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit"
        });
        return (
          <div key={point.weekStartIso} className="sparkline-bar-wrap" title={`Semaine du ${weekLabel} : ${point.count} demande${point.count > 1 ? "s" : ""}`}>
            <div className="sparkline-count">{point.count}</div>
            <div className="sparkline-bar" style={{ height: `${height}px` }} />
            <div className="sparkline-label">{weekLabel}</div>
          </div>
        );
      })}
    </div>
  );
}

function BreakdownBars({ rows }: { rows: { label: string; count: number; total: number }[] }) {
  return (
    <div className="breakdown">
      {rows.map((row) => {
        const pct = row.total > 0 ? (row.count / row.total) * 100 : 0;
        return (
          <div key={row.label} className="breakdown-row">
            <span className="breakdown-label">{row.label}</span>
            <div className="breakdown-bar">
              <div className="breakdown-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="breakdown-count">{row.count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function statusShort(status: string): string {
  switch (status) {
    case "new": return "Nouvelle";
    case "confirmed": return "Confirmée";
    case "refused": return "Refusée";
    case "cancelled": return "Annulée";
    default: return status;
  }
}

function relativeTimeFr(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `il y a ${diffD} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
