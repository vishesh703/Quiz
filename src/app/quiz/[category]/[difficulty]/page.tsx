import { QuizClient } from '@/components/quiz/QuizClient';
import { quizData, QUIZ_CATEGORIES } from '@/lib/quiz-data';
import type { Category, Difficulty, Question } from '@/lib/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export function generateStaticParams() {
    const params: { category: string, difficulty: string }[] = [];
    QUIZ_CATEGORIES.forEach(category => {
        ['Easy', 'Medium', 'Hard'].forEach(difficulty => {
            params.push({ category: encodeURIComponent(category), difficulty: encodeURIComponent(difficulty) });
        });
    });
    return params;
}

const difficultyTimeMap: Record<Difficulty, number> = {
    easy: 30,
    medium: 25,
    hard: 20,
};

export default function QuizPage({ params }: { params: { category: string, difficulty: string } }) {
  const category = decodeURIComponent(params.category) as Category;
  const difficulty = decodeURIComponent(params.difficulty).toLowerCase() as Difficulty;

  if (!quizData[category] || !quizData[category][difficulty]) {
    redirect('/');
  }

  const questions: Question[] = quizData[category][difficulty];
  const timePerQuestion = difficultyTimeMap[difficulty];
  
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Quiz...</div>}>
      <QuizClient questions={questions} category={category} difficulty={difficulty} timePerQuestion={timePerQuestion} />
    </Suspense>
  );
}
