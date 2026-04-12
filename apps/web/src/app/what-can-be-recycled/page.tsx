'use client';

import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { PublicLayout } from '@/components/layout/public-layout';
import { SectionHeading } from '@/components/shared/section-heading';

import { useMaterialTypes } from '@/modules/material-types';
import { CardSkeleton } from '@/components/common/loading/card-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getMaterialIcon(iconName?: string): LucideIcon {
  if (!iconName) return Icons.Recycle;

  const icon = Icons[iconName as keyof typeof Icons];
  return (icon ?? Icons.Recycle) as LucideIcon;
}

export default function WhatCanBeRecycledPage() {
  const { materialTypes, isLoading } = useMaterialTypes();

  return (
    <PublicLayout>
      <main className="bg-background min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
            <SectionHeading
              title="What Can Be Recycled"
              description="Learn which materials can be recycled and how to properly dispose of them."
            />

            {isLoading ? (
              <CardSkeleton count={5} />
            ) : materialTypes?.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {materialTypes.map((material) => {
                  const IconComponent = getMaterialIcon(material.icon);

                  return (
                    <Card
                      key={material.slug}
                      className="relative overflow-hidden"
                    >
                      <CardHeader>
                        <CardTitle className="text-center text-[1.1rem]!">
                          {material.name}
                        </CardTitle>
                        <div className="bg-primary/15 absolute -top-24 left-0 hidden aspect-square w-full rounded-b-full md:block" />

                        <div className="flex md:absolute bg-primary top-24 left-1/2 mx-auto aspect-square md:-translate-x-1/2 items-center rounded-full p-2">
                          <IconComponent className="text-accent w-6!" />
                        </div>
                      </CardHeader>
                      <CardContent className="-mt-4 md:my-auto md:pt-14">
                        {material.description ? (
                          <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
                            {material.description}
                          </p>
                        ) : (
                          <p className="text-muted-foreground mt-2 text-center text-sm italic">
                            No description available.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
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
