import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthCardProp{
    children:ReactNode
}

function AuthCard({children}:AuthCardProp) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/60
        bg-white/45
        p-8
        shadow-[0_20px_80px_rgba(56,189,248,0.15)]
        backdrop-blur-2xl
        sm:p-10
      "
    >
      <div className="pointer-events-none absolute -right-20 -left-20 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl">
      <div className="relative z-10">
        {children}
      </div>
      </div>
    </motion.div>
  );
}

export default AuthCard;
