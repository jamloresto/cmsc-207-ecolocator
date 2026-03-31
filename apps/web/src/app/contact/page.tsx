import { ContactForm } from "@/components/features/contact/contact-form";


export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 text-center md:mb-10">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Have questions or suggestions? Send us a message.
          </p>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
