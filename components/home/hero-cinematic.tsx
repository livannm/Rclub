"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import BorderGlow from "@/components/react-bits/BorderGlow";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const DarkVeil = dynamic(() => import("@/components/react-bits/DarkVeil"), {
  ssr: false,
});

const HERO_BRAND_URL = "/media/caligraphie_logo.png";
const GOLD_METALLIC_PALETTE = [
  "#5c4610",
  "#8a6b18",
  "#c9a227",
  "#f5e6b8",
  "#d4af37",
  "#e8c85a",
  "#7a5c10",
];

export type HeroCinematicProps = {
  heroAriaLabel: string;
  title: string;
  reservationLabel: string;
  agendaLabel: string;
  heroVideoUrl: string;
  heroPosterUrl: string;
};

export function HeroCinematic({
  heroAriaLabel,
  title,
  reservationLabel,
  agendaLabel,
  heroVideoUrl,
  heroPosterUrl,
}: HeroCinematicProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section aria-label={heroAriaLabel} className="hero hero--centered">
      <video
        data-testid="hero-video"
        src={heroVideoUrl}
        poster={heroPosterUrl}
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      />
      {!reducedMotion ? (
        <div className="hero-dark-veil" aria-hidden="true">
          <DarkVeil
            hueShift={42}
            noiseIntensity={0.02}
            scanlineIntensity={0.04}
            speed={0.35}
            warpAmount={0.15}
            resolutionScale={0.75}
          />
        </div>
      ) : null}
      <div className="hero-content hero-content--centered">
        <h1 className="hero-wordmark">
          <Link href="/" aria-label={title} className="hero-wordmark-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_BRAND_URL}
              alt=""
              className="hero-wordmark-img"
              width={319}
              height={344}
              fetchPriority="high"
              data-testid="hero-wordmark"
            />
          </Link>
        </h1>

        <div className="hero-actions hero-actions--centered">
          {reducedMotion ? (
            <>
              <Link className="button" href="/reservations">
                {reservationLabel}
              </Link>
              <Link className="button button-secondary" href="/agenda">
                {agendaLabel}
              </Link>
            </>
          ) : (
            <>
              <Link
                className="button hero-action-item hero-action-item--reservation"
                href="/reservations"
              >
                {reservationLabel}
              </Link>
              <BorderGlow
                animated
                borderRadius={0}
                glowColor="43 62 52"
                backgroundColor="#171717"
                colors={GOLD_METALLIC_PALETTE}
                glowIntensity={1.15}
                edgeSensitivity={18}
                className="hero-btn-glow hero-action-item hero-action-item--agenda"
              >
                <Link
                  className="button button-secondary hero-btn-inner"
                  href="/agenda"
                >
                  {agendaLabel}
                </Link>
              </BorderGlow>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
