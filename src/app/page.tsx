import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <h1 className="text-2xl font-semibold text-foreground">مرحباً بك في DentalFlow</h1>
        <p className="text-muted-foreground max-w-sm text-center">
          الحل المتكامل لإدارة عيادة الأسنان الخاصة بك بكفاءة وفعالية.
        </p>
      </div>
      <div className="mt-8 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
