import { AdminLoginForm } from "@/modules/auth/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full">
          <div className="mb-8 text-center">
            <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase">
              EcoLocator Admin
            </p>
            <h1 className="text-foreground mt-3 text-3xl font-bold tracking-tight">
              Sign in to dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Access the admin panel to manage locations, suggestions, and
              messages.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
