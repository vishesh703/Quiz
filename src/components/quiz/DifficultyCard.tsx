"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Trophy, Brain, BarChart } from 'lucide-react';

const difficultyInfo = {
    Easy: { icon: <Trophy className="h-8 w-8 text-green-400" />, time: 30 },
    Medium: { icon: <Brain className="h-8 w-8 text-yellow-400" />, time: 25 },
    Hard: { icon: <BarChart className="h-8 w-8 text-red-400" />, time: 20 },
}

interface DifficultyCardProps {
  category: string;
  difficulty: string;
}

export function DifficultyCard({ category, difficulty }: DifficultyCardProps) {
    const info = difficultyInfo[difficulty as keyof typeof difficultyInfo];
  return (
    <Link href={`/quiz/${encodeURIComponent(category)}/${encodeURIComponent(difficulty)}`} className="group block">
      <Card className="glass-morphism h-full hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <div className="mb-4">{info.icon}</div>
          <h3 className="text-xl font-headline font-semibold text-foreground mb-2">{difficulty}</h3>
          <p className="text-sm text-muted-foreground mb-4">{info.time} seconds per question</p>
          <p className="text-sm text-primary flex items-center">
            Select
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
