
import AnimatedBackground from "../features/auth/components/AnimatedBackground"
import { Outlet } from "react-router-dom"

function Authlayout() {
  return (
<main className="relative min-h-screen overflow-hidden">
    <AnimatedBackground/>
    <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
<Outlet/>
        </div>

    </div>
</main>
  )
}

export default Authlayout