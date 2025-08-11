import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons/logo";
import { AnimatedBackground } from "@/components/animated-background";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <AnimatedBackground />
      <div className="z-10 flex flex-col items-center gap-6">
        <Logo />
        <h1 className="text-2xl font-semibold text-foreground">مرحباً بك في DentalFlow</h1>
        <p className="text-muted-foreground max-w-sm text-center">
          الحل المتكامل لإدارة عيادة الأسنان الخاصة بك بكفاءة وفعالية.
        </p>
      </div>
      <div className="z-10 mt-8 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
