"use client";

import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
};

export function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#c9a227",
  colorTo = "#f5e6b8",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      className="border-beam-root"
      style={
        {
          "--beam-size": `${size}px`,
          "--beam-duration": `${duration}s`,
          "--beam-delay": `${delay}s`,
          "--beam-color-from": colorFrom,
          "--beam-color-to": colorTo,
          "--beam-border-width": `${borderWidth}px`,
          ...style,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn("border-beam-glow", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          offsetDistance: `${initialOffset}%`,
        }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={
          transition ?? {
            repeat: Infinity,
            duration,
            delay,
            ease: "linear",
          }
        }
      />
    </div>
  );
}
