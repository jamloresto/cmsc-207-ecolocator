import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLoginForm } from "@/modules/auth";

export default function AdminLoginPage() {
  return (
    <PublicLayout>
      <main className="bg-background min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md px-4 md:px-6">
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
    </PublicLayout>
  );
}
