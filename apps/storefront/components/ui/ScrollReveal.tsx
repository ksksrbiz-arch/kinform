"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  className = "",
  as = "div",
}: ScrollRevealProps) {
  const offset = directionMap[direction];
  const scaledOffset: Record<string, number> = {};
  if (offset.x) scaledOffset.x = (offset.x / 40) * distance;
  if (offset.y) scaledOffset.y = (offset.y / 40) * distance;

  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, ...scaledOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Staggered container for children that reveal one-by-one on scroll.
 */
interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
};

export function StaggerReveal({ children, staggerDelay = 0.06, className = "" }: StaggerRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
