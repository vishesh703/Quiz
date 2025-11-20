import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DifficultyCard } from '@/components/quiz/DifficultyCard';
import { QUIZ_CATEGORIES } from '@/lib/quiz-data';
import { redirect } from 'next/navigation';
import type { Category } from '@/lib/types';

export function generateStaticParams() {
  return QUIZ_CATEGORIES.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default function DifficultySelectionPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category) as Category;

  if (!QUIZ_CATEGORIES.includes(category)) {
    redirect('/');
  }

  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-5xl mx-auto">
        <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
            <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
            </Button>
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary text-glow">
            {category}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Choose your challenge level.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {difficulties.map((difficulty) => (
            <DifficultyCard key={difficulty} category={category} difficulty={difficulty} />
          ))}
        </div>
      </div>
    </div>
  );
}
