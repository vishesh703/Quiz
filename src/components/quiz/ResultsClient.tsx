"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { QuizResult } from '@/lib/types';
import { generatePersonalizedFeedback } from '@/ai/flows/personalized-feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from './ScoreCircle';
import { AnalyticsCharts } from './AnalyticsCharts';
import { QuestionReview } from './QuestionReview';
import { Skeleton } from '../ui/skeleton';
import { Bot } from 'lucide-react';

export function ResultsClient() {
  const router = useRouter();
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

  useEffect(() => {
    const resultData = localStorage.getItem('quizResult');
    if (resultData) {
      setQuizResult(JSON.parse(resultData));
    } else {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    if (quizResult) {
      const runAI = async () => {
        setIsLoadingFeedback(true);
        try {
          const { category, difficulty, score, correctAnswers, incorrectAnswers, totalTimeSpent, questionWiseAnalysis } = quizResult;
          const aiInput = {
            category,
            difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
            score,
            correctAnswers,
            incorrectAnswers,
            totalTimeSpent,
            questionWiseAnalysis: questionWiseAnalysis.map(q => ({...q, timeSpent: Math.round(q.timeSpent)}))
          };
          const response = await generatePersonalizedFeedback(aiInput);
          setFeedback(response.feedback);
        } catch (error) {
          console.error("Error generating feedback:", error);
          setFeedback("Could not generate personalized feedback at this time. Please try again later.");
        } finally {
          setIsLoadingFeedback(false);
        }
      };
      runAI();
    }
  }, [quizResult]);

  const scoreColor = useMemo(() => {
    if (!quizResult) return 'text-gray-500';
    if (quizResult.score >= 75) return 'text-green-500';
    if (quizResult.score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }, [quizResult]);

  if (!quizResult) {
    return null; // The suspense fallback in page.tsx will be shown
  }

  const { category, difficulty, score, correctAnswers, incorrectAnswers, totalTimeSpent, totalQuestions } = quizResult;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary text-glow">
                Quiz Results
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">{category} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
        </div>

        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <ScoreCircle score={score} />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <p className={`text-5xl font-bold ${scoreColor}`}>{score.toFixed(1)}%</p>
              <p className="text-lg"><span className="font-semibold text-green-500">{correctAnswers}</span> Correct</p>
              <p className="text-lg"><span className="font-semibold text-red-500">{incorrectAnswers}</span> Incorrect</p>
              <p className="text-lg"><span className="font-semibold">{totalQuestions}</span> Total Questions</p>
              <p className="text-lg"><span className="font-semibold">{totalTimeSpent.toFixed(2)}s</span> Total Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI Personalized Feedback</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoadingFeedback ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{feedback}</p>
                )}
            </CardContent>
        </Card>
        
        <AnalyticsCharts result={quizResult} />

        <QuestionReview analysis={quizResult.questionWiseAnalysis} />
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button onClick={() => router.push(`/quiz/${encodeURIComponent(category)}/${encodeURIComponent(difficulty)}`)} size="lg" variant="outline">
                Restart Quiz
            </Button>
            <Button onClick={() => router.push('/')} size="lg" className="yellow-accent-bg">
                Choose New Quiz
            </Button>
        </div>
      </div>
    </div>
  );
}
