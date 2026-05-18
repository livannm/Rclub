"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string };

export function SiteNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Layout");

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

  return (
    <>
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

      <button
        className="site-nav-burger"
        aria-label={t("navOpenMenu")}
        aria-expanded={open}
        aria-controls="site-nav-drawer"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

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
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <nav className="site-nav-drawer-nav">
          {links.map(({ href, label }, i) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`site-nav-drawer-link${isActive ? " is-active" : ""}`}
                style={{ transitionDelay: open ? `${i * 55 + 80}ms` : "0ms" }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
