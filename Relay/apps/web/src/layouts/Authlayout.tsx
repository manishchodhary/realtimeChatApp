import { Outlet } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import AnimatedBackground from "../features/auth/components/AnimatedBackground";

function Authlayout() {
  return (
    <main className="relay-paper relative isolate min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <AnimatedBackground />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center gap-16 lg:justify-between">
        <section className="relative hidden max-w-xl lg:block">
          <div className="mb-7 inline-flex -rotate-2 items-center gap-2 rounded-lg border-2 border-slate-950 bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#172554]">
            <Sparkles className="h-4 w-4" /> Make room for good conversations
          </div>
          <h1 className="font-serif text-7xl font-black leading-[0.95] tracking-[-0.07em] xl:text-8xl">
            Say it<br />like you <span className="text-sky-600">mean it.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
            The best conversations don’t need a perfect opening line. Just your people, a little time, and a hello.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <span className="flex h-12 w-12 -rotate-6 items-center justify-center rounded-2xl border-2 border-slate-950 bg-sky-500 text-white shadow-[3px_3px_0_#172554]"><MessageCircle className="h-5 w-5" /></span>
            <div><p className="text-sm font-black">A little corner called Relay.</p><p className="text-xs text-slate-500">Come as you are. Say what you mean.</p></div>
          </div>
        </section>
        <div className="relative z-10 mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-5 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-slate-950 bg-sky-500 text-white shadow-[3px_3px_0_#172554]"><MessageCircle className="h-5 w-5" /></span>
            <span className="text-2xl font-black tracking-[-0.08em]">relay<span className="text-sky-500">.</span></span>
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default Authlayout;
