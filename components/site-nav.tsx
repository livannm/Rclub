"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { CloseMenuIcon } from "@/components/icons/close-menu-icon";
import { CollapseMenuIcon } from "@/components/icons/collapse-menu-icon";

type NavLink = { href: string; label: string };

const MOBILE_NAV_MQ = "(max-width: 767px)";

function subscribeMobileNav(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_NAV_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileNavSnapshot() {
  return window.matchMedia(MOBILE_NAV_MQ).matches;
}

export function SiteNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobileNav = useSyncExternalStore(
    subscribeMobileNav,
    getMobileNavSnapshot,
    () => false
  );
  const pathname = usePathname();
  const t = useTranslations("Layout");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    if (!isMobileNav || open) {
      header.classList.remove("is-nav-hidden");
      return;
    }

    let lastY = window.scrollY;
    const deltaThreshold = 8;
    const showAtTop = 48;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < deltaThreshold) return;

      if (y <= showAtTop || delta < 0) {
        header!.classList.remove("is-nav-hidden");
      } else {
        header!.classList.add("is-nav-hidden");
      }
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      header.classList.remove("is-nav-hidden");
    };
  }, [isMobileNav, open]);

  return (
    <div className="site-nav-root">
      <nav className="site-nav-desktop">
        {links.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`site-nav-link${isActive ? " is-active" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {!isMobileNav ? <LocaleSwitcher className="locale-switcher-header" /> : null}

      <button
        className="site-nav-burger"
        aria-label={t("navOpenMenu")}
        aria-expanded={open}
        aria-controls="site-nav-drawer"
        onClick={() => setOpen(true)}
        type="button"
      >
        <CollapseMenuIcon />
      </button>

      {mounted && createPortal(
        <>
          {open && (
            <div
              className="site-nav-overlay"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />
          )}

          <div
            id="site-nav-drawer"
            className={`site-nav-drawer${open ? " is-open" : ""}`}
            aria-hidden={!open}
          >
            <button
              className="site-nav-close"
              aria-label={t("navCloseMenu")}
              onClick={() => setOpen(false)}
              type="button"
            >
              <CloseMenuIcon />
            </button>
            <nav className="site-nav-drawer-nav">
              {links.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`site-nav-drawer-link${isActive ? " is-active" : ""}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            {isMobileNav ? (
              <div className="site-nav-drawer-footer">
                <LocaleSwitcher className="locale-switcher-drawer" />
              </div>
            ) : null}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
