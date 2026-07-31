import { useRef } from "react";
import { useInView, type Variants } from "motion/react";

export function CallyMark({ size = 32 }: { size?: number }) {
  const c = "#f8f7f4";
  return (
    <div
      className="bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 40 40" fill="none">
        <path d="M34 9A18 18 0 1 0 34 31" stroke={c} strokeWidth="4" strokeLinecap="round" />
        <path d="M26 15A8 8 0 1 0 26 25" stroke={c} strokeWidth="3.2" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
}

export function useFadeInView(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.07 },
  }),
};
