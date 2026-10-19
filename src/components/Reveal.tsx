"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "up": sobe e aparece. "wipe": abre da esquerda para a direita (clip-path), bom para imagens. */
  variant?: "up" | "wipe";
  as?: "div" | "li" | "section" | "article" | "p" | "h2" | "h3";
};

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * O gatilho de visibilidade fica num wrapper sem clip-path: o IntersectionObserver ignora
 * elementos totalmente recortados, então a animação "wipe" nunca dispararia se observássemos o próprio recorte.
 * Com movimento reduzido o conteúdo vai direto ao estado final (animate vence o initial vindo do servidor).
 */
export function Reveal({ children, className, delay = 0, variant = "up", as = "div" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const MotionTag = motion[as] as typeof motion.div;
  const hidden = variant === "wipe" ? { clipPath: "inset(0 100% 0 0)" } : { opacity: 0, y: 28 };
  const shown = variant === "wipe" ? { clipPath: "inset(0 0% 0 0)" } : { opacity: 1, y: 0 };
  const motionProps = {
    initial: hidden,
    animate: reduce || inView ? shown : hidden,
    transition: reduce ? { duration: 0 } : { duration: variant === "wipe" ? 0.9 : 0.7, ease, delay },
  };

  if (variant === "wipe")
    return (
      <div ref={ref} className={className}>
        <motion.div {...motionProps}>{children}</motion.div>
      </div>
    );

  return (
    <MotionTag ref={ref as never} className={className} {...motionProps}>
      {children}
    </MotionTag>
  );
}
