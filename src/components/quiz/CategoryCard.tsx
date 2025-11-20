"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  icon: ReactNode;
}

export function CategoryCard({ category, icon }: CategoryCardProps) {
  return (
    <Link href={`/quiz/${encodeURIComponent(category)}`} className="group block">
      <Card className="glass-morphism h-full hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <div className="mb-4 text-primary">{icon}</div>
          <h3 className="text-xl font-headline font-semibold text-foreground mb-2">{category}</h3>
          <p className="text-sm text-muted-foreground flex items-center">
            Start Quiz
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
