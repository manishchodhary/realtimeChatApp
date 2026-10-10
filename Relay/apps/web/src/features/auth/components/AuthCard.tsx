import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthCardProp {
  children: ReactNode;
}

function AuthCard({ children }: AuthCardProp) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate overflow-hidden rounded-[28px] border border-white/80 bg-white/75 p-7 shadow-[0_24px_90px_rgba(14,116,144,0.14)] backdrop-blur-2xl sm:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export default AuthCard;
