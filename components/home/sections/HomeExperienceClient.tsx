'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'

interface ExperienceBlock {
  num: string
  title: string
  paragraphs: string[]
  image: string
  imageAlt: string
}

interface ExperienceSignature {
  brand: string
  address: string
  parking: string
  tagline: string
}

interface HomeExperienceClientProps {
  eyebrow: string
  introTitleLead: string
  introTitleRest: string
  blocks: ExperienceBlock[]
  closer: string[]
  signature: ExperienceSignature
}

export function HomeExperienceClient({
  eyebrow,
  introTitleLead,
  introTitleRest,
  blocks,
  closer,
  signature,
}: HomeExperienceClientProps) {
  const reduced = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <>
      <motion.div
        className="home-exp-intro"
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
      >
        <p className="page-kicker">{eyebrow}</p>
        <h2 className="home-exp-intro-title">
          <strong>{introTitleLead}</strong>
          <span className="home-exp-intro-since">— {introTitleRest}</span>
        </h2>
      </motion.div>

      <div className="home-exp-sequence">
        {blocks.map((block, i) => {
          const isReverse = i % 2 === 1
          return (
            <div
              key={block.num}
              className={`home-exp-block${isReverse ? ' home-exp-block--reverse' : ''}`}
            >
              <motion.div
                className="home-exp-block-media"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.05, ease }}
              >
                <Image
                  src={block.image}
                  alt={block.imageAlt}
                  fill
                  className="home-exp-block-img"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
                <div className="home-exp-block-media-overlay" aria-hidden="true" />
              </motion.div>

              <motion.div
                className="home-exp-block-content"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
              >
                <span className="home-exp-block-num" aria-hidden="true">
                  {block.num}
                </span>
                <span className="home-exp-block-separator" aria-hidden="true" />
                <h3 className="home-exp-block-title">{block.title}</h3>
                <div className="home-exp-block-copy">
                  {block.paragraphs.map((paragraph, pi) => (
                    <p key={pi} className="home-exp-block-desc">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      <motion.div
        className="home-exp-closer"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
      >
        {closer.map((paragraph, i) => (
          <p key={i} className={i === 0 ? 'home-exp-closer-lead' : 'home-exp-closer-body'}>
            {paragraph}
          </p>
        ))}
      </motion.div>

      <motion.footer
        className="home-exp-signature"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        <p className="home-exp-signature-brand">{signature.brand}</p>
        <p className="home-exp-signature-meta">{signature.address}</p>
        <p className="home-exp-signature-meta">{signature.parking}</p>
        <p className="home-exp-signature-tagline">{signature.tagline}</p>
      </motion.footer>
    </>
  )
}
