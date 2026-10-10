import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthCardProp {
  children: ReactNode;
}

function AuthCard({ children }: AuthCardProp) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border-2 border-slate-950 bg-white p-7 shadow-[8px_8px_0_#172554] sm:p-9"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rotate-12 rounded-[1.7rem] bg-amber-300" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-1 top-1 h-24 w-24 rotate-12 rounded-[1.7rem] border-2 border-slate-950" />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export default AuthCard;
