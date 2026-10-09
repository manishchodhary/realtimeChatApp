import AuthCard from "../components/AuthCard";
import LoginFrom from "../components/LoginFrom";

export default function Login() {
  return (
    <AuthCard>
    <div className="text-center">
      <h1 className="text-4xl font-bold text-slate-800">
        Welcome back
      </h1>

      <p className="mt-3 text-slate-500">
        Login to continue
      </p>
      <LoginFrom/>
    </div></AuthCard>
  );
}