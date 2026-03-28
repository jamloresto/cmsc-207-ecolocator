import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">EcoLocator</h1>
        <p className="text-muted-foreground mt-4">
          Test form components
        </p>
        <form className="space-y-4 my-4 p-8 border-2 rounded-lg">
          <h3 className="text-center font-bold">SAMPLE FORM</h3>
          <Input label="Name" name="name" />
          <Input type="email" label="Email" name="email" />
          <Textarea label="Your message" />
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </PublicLayout>
  );
}
