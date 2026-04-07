'use client';

import { PublicLayout } from '@/components/layout/public-layout';
import { SectionHeading } from '@/components/shared/section-heading';

import { useMaterialTypes } from '@/modules/material-types';
import { Recycle } from 'lucide-react';

export default function WhatCanBeRecycledPage() {
  const { materialTypes, isLoading } = useMaterialTypes();

  return (
    <PublicLayout>
      <main className="bg-background min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
            <SectionHeading
              title="What Can Be Recycled"
              description="Learn which materials can be recycled and how to properly dispose of
          them."
            />

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-border bg-background h-32 animate-pulse rounded-2xl border"
                  />
                ))}
              </div>
            ) : materialTypes?.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {materialTypes.map((material) => (
                  <div
                    key={material.slug}
                    className="border-border bg-background rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
                  >
                    <h2 className="text-foreground text-base font-semibold md:text-lg">
                      <Recycle className="text-primary mr-1 inline-flex h-6" />{' '}
                      {material.name}
                    </h2>

                    {material.description ? (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {material.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-2 text-sm italic">
                        No description available.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-border bg-background rounded-2xl border p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  No recyclable materials available.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
