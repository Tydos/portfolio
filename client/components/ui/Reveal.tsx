"use client";

import { useReveal } from "../../lib/useReveal";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Scroll-reveal wrapper that fades/slides children in when visible.
 *
 * @param props.children - Content to reveal.
 * @param props.className - Extra classes on the wrapper element.
 * @param props.delay - Transition delay in milliseconds after reveal.
 * @param props.as - Wrapper element tag (`div`, `section`, or `li`).
 */
function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const { ref, isVisible } = useReveal();
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
