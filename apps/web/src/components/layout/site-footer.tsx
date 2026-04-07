import { Recycle } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/container';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/find-centers', label: 'Find Centers' },
  { href: '/suggest-location', label: 'Suggest a Location' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/admin/login', label: 'Admin Portal' },
];

const resources = [
  { href: '#', label: 'Recycling Guide' },
  { href: '#', label: 'What Can Be Recycled' },
  { href: '#', label: 'FAQs' },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-950 text-center text-white md:text-left">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-16">
          <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
            <div className="mx-auto flex items-center gap-3 md:mx-0">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                <Recycle />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-lg font-bold">EcoLocator</span>
                <span className="text-xs">Waste & Recycling Solutions</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-white/80">
              <p className="text-balance">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga,
                quam vero impedit cum nulla, pariatur enim eius recusandae
                facilis quas veniam voluptates beatae libero, natus soluta fugit
                maxime! Earum, numquam.
              </p>
              <p className="text-balance">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Veritatis voluptate dicta quo deserunt, distinctio quasi
                accusantium? Voluptatibus nemo, dolores labore reprehenderit
                quas architecto ratione ullam consequuntur ipsum tempore
                accusantium consequatur!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-white/80 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Resources</h3>
              <div className="space-y-3">
                {resources.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-white/80 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm text-white/80">
              <p>(0987) 654-3210</p>
              <p>hello@ecolocator.com</p>
              <p>123 Green Street, Metro Manila</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          © 2026 EcoLocator. All rights reserved. Making recycling easier for
          everyone.
        </div>
      </Container>
    </footer>
  );
}
