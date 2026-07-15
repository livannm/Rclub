'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'

interface PracticalItem {
  label: string
  value?: string
  lines?: string[]
}

interface HomePracticalInfoClientProps {
  title: string
  items: PracticalItem[]
  ctaReserve: string
  ctaDirections: string
  mapsUrl: string
}

export function HomePracticalInfoClient({
  title,
  items,
  ctaReserve,
  ctaDirections,
  mapsUrl,
}: HomePracticalInfoClientProps) {
  const reduced = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <>
      <div className="home-practical-header">
        <p className="page-kicker">{title}</p>
      </div>

      <dl className="home-practical-reveal-list">
        {items.map(({ label, value, lines }, i) => (
          <motion.div
            key={label}
            className="home-practical-reveal-item"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.09, ease }}
          >
            <span className="home-practical-reveal-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <dt className="home-practical-reveal-label">{label}</dt>
            {lines ? (
              <dd className="home-practical-reveal-value">
                <ul className="home-practical-reveal-lines">
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </dd>
            ) : (
              <dd className="home-practical-reveal-value">{value}</dd>
            )}
          </motion.div>
        ))}
      </dl>

      <motion.div
        className="home-practical-ctas"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, delay: items.length * 0.09, ease }}
      >
        <Link href="/reservations" className="button">
          {ctaReserve}
        </Link>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-secondary home-practical-directions"
        >
          {ctaDirections}
        </a>
      </motion.div>
    </>
  )
}
