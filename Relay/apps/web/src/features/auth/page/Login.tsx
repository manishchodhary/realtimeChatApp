import { MessageCircle, Sparkles } from "lucide-react";
import AuthCard from "../components/AuthCard";
import LoginFrom from "../components/LoginFrom";

export default function Login() {
  return (
    <AuthCard>
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 -rotate-3 items-center justify-center rounded-2xl border-2 border-slate-950 bg-sky-500 text-white shadow-[3px_3px_0_#172554]">
            <MessageCircle aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Welcome back</p>
            <p className="text-sm font-bold text-slate-500">Your people are here.</p>
          </div>
        </div>
        <h1 className="font-serif text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
          Pick up<br />where you left off<span className="text-sky-500">.</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in and get back to the conversations that matter.
        </p>
      </div>
      <LoginFrom />
      <div className="mt-7 flex items-center justify-center gap-2 border-t border-dashed border-slate-200 pt-5 text-center text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Keep it kind. Keep it real.
      </div>
    </AuthCard>
  );
}
