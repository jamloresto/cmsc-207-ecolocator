import { DialogDemo } from '@/components/DialogDemo';
import { PublicLayout } from '@/components/layout/public-layout';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { SectionSubheading } from '@/components/shared/section-subheading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SelectCustom } from '@/components/ui/select-custom';
import { StatusPill } from '@/components/ui/status-pill';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, XCircle } from 'lucide-react';


export default function HomePage() {
  const status = "pending";
  
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">EcoLocator</h1>
        <p className="text-muted-foreground mt-4">Test form components</p>
        <Section>
          <SectionHeading title="Loading States Samplers" className="pb-8" />
          <LoadingState message="Loading recycling centers..." />
          <EmptyState
            title="No location suggestions yet"
            description="Submitted suggestions from users will appear here once available."
          />
        </Section>
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
              htmlFor="email1"
              error="sample error"
            >
              <Input id="email1" label="Email Address" type="email" />
            </FormField>
            <FormField
              label="Email Address"
              htmlFor="email2"
              required
              helperText="Use your active email address."
            >
              <Input id="email2" type="email" placeholder="name@example.com" />
            </FormField>
            <FormField label="Sample Select" htmlFor="sample-select">
              <Select
                placeholder="Select Status"
                id="sample-select"
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                ]}
              />
            </FormField>
            <FormField label="Sample Select" htmlFor="sample-select">
              <SelectCustom
                value={status}
                // onChange={(e) => {console.log(e.target.value)}}
                options={[
                  {
                    label: 'Pending',
                    value: 'pending',
                    icon: <Clock className="h-4 w-4 text-yellow-500" />,
                  },
                  {
                    label: 'Approved',
                    value: 'approved',
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                  },
                  {
                    label: 'Rejected',
                    value: 'rejected',
                    icon: <XCircle className="h-4 w-4 text-red-500" />,
                  },
                ]}
              />
            </FormField>
            <Textarea label="Your message" />
            <Switch label="Active status" />
            <Switch
              label="Publish location"
              description="This location will be visible on the public site."
            />
            <Switch
              label="Enable feature"
              error="This setting could not be updated."
            />
            <Checkbox label="Accept terms and conditions" />
            <Checkbox
              label="Mark as active"
              description="This location will be visible to users on the public site."
            />
            <Button type="submit">Send Message</Button>
          </form>
        </Section>

        <DialogDemo />

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
                <div className="flex flex-wrap gap-2 pt-3">
                  <StatusPill status="pending" />
                  <StatusPill status="approved" />
                  <StatusPill status="inactive" />
                  <StatusPill status="replied" />
                  <StatusPill status="archived">Custom Status</StatusPill>
                </div>
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
                <div className="flex flex-wrap gap-2 pt-3">
                  <Badge>Plastic</Badge>
                  <Badge variant="primary">E-waste</Badge>
                  <Badge variant="outline">Metro Manila</Badge>
                  <Badge variant="success">Verified</Badge>
                  <Badge variant="warning">Unverified</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </section>
    </PublicLayout>
  );
}
