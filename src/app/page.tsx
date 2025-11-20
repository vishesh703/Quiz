import { CategoryCard } from '@/components/quiz/CategoryCard';
import { QUIZ_CATEGORIES } from '@/lib/quiz-data';
import type { Category } from '@/lib/types';
import { Atom, MessageSquare, BrainCircuit } from 'lucide-react';
import type { ReactNode } from 'react';

const categoryIcons: Record<Category, ReactNode> = {
  "Technical Knowledge": <Atom className="h-8 w-8" />,
  "Communication Skills": <MessageSquare className="h-8 w-8" />,
  "Aptitude & Logical Reasoning": <BrainCircuit className="h-8 w-8" />,
};


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary text-glow">
          QuizWhiz
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Challenge yourself with dynamic quizzes across various domains. Pick a category to begin your journey of knowledge.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {QUIZ_CATEGORIES.map((category) => (
          <CategoryCard 
            key={category} 
            category={category} 
            icon={categoryIcons[category]}
          />
        ))}
      </div>
    </div>
  );
}
