import { MessageCircle } from "lucide-react";
import AuthCard from "../components/AuthCard";
import LoginFrom from "../components/LoginFrom";

export default function Login() {
  return (
    <AuthCard>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-inner shadow-white">
          <MessageCircle aria-hidden="true" className="h-7 w-7" />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
          Relay
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in to pick up your conversations right where you left off.
        </p>
      </div>
      <LoginFrom />
      <p className="mt-7 text-center text-xs leading-5 text-slate-400">
        By continuing, you agree to use Relay respectfully and securely.
      </p>
    </AuthCard>
  );
}
