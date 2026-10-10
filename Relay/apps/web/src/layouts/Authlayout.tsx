import { Outlet } from "react-router-dom";
import AnimatedBackground from "../features/auth/components/AnimatedBackground";

function Authlayout() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-sky-50 px-4 py-10 sm:px-6">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default Authlayout;
