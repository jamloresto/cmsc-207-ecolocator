import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">EcoLocator</h1>
        <p className="text-muted-foreground mt-4">Test form components</p>
        <form className="my-4 space-y-4 rounded-lg border-2 p-8">
          <h3 className="text-center font-bold">SAMPLE FORM</h3>
          <Input label="Name" name="name" />
          <Input type="email" label="Email" name="email" />
          <FormField helperText="Use your active email address." error='sample error'>
            <Input id="email" label="Email Address" type="email" />
          </FormField>
          <FormField
            label="Email Address"
            htmlFor="email"
            required
            helperText="Use your active email address."
          >
            <Input id="email" type="email" placeholder="name@example.com" />
          </FormField>
          <Textarea label="Your message" />
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </PublicLayout>
  );
}
