import { PublicLayout } from '@/components/layout/public-layout';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { SectionSubheading } from '@/components/shared/section-subheading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">EcoLocator</h1>
        <p className="text-muted-foreground mt-4">Test form components</p>
        <Section>
          <SectionHeading
            align="center"
            eyebrow="Why EcoLocator"
            title="Making recycling easier for everyone"
            description="Discover verified collection points, accepted materials, and useful information in one place."
          />

          <form className="my-4 space-y-4 rounded-3xl border-2 p-8">
            <SectionHeading title="Sample Form" />
            <Input label="Name" name="name" />
            <Input type="email" label="Email" name="email" />
            <FormField
              helperText="Use your active email address."
              error="sample error"
            >
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
        </Section>

        <Section>
          <SectionHeading title="Sample Section Heading" className="pb-4" />
          <SectionHeading
            title="Find Recycling Centers"
            description="Locate nearby facilities easily."
          />
          <SectionSubheading
            title="Contact Information"
            description="We'll use this to get back to you."
          />
          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Plastic Recycling</CardTitle>
                <CardDescription>
                  Find centers that accept bottles, containers, and other
                  plastic materials.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Search by city or material type to find the nearest location.
                </p>
                <img src={`https://placehold.co/400`} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Plastic Recycling</CardTitle>
                <CardDescription>
                  Find centers that accept bottles, containers, and other
                  plastic materials.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Search by city or material type to find the nearest location.
                </p>
                <img src={`https://placehold.co/400`} />
              </CardContent>
            </Card>
          </div>
        </Section>
      </section>
    </PublicLayout>
  );
}
