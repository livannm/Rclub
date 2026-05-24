'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'

interface ExperienceBlock {
  num: string
  title: string
  desc: string
  image: string
  imageAlt: string
}

interface HomeExperienceClientProps {
  eyebrow: string
  introTitle: string
  blocks: ExperienceBlock[]
}

export function HomeExperienceClient({ eyebrow, introTitle, blocks }: HomeExperienceClientProps) {
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
        <h2 className="home-exp-intro-title">{introTitle}</h2>
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
                <h3 className="home-exp-block-title">{block.title}</h3>
                <p className="home-exp-block-desc">{block.desc}</p>
              </motion.div>
            </div>
          )
        })}
      </div>
    </>
  )
}
