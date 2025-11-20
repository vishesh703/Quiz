"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Difficulty, Question, QuizResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CircularTimer } from './CircularTimer';

interface QuizClientProps {
  questions: Question[];
  category: Category;
  difficulty: Difficulty;
  timePerQuestion: number;
}

export function QuizClient({ questions, category, difficulty, timePerQuestion }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [questionWiseTime, setQuestionWiseTime] = useState<number[]>(Array(questions.length).fill(0));
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isFinished, setIsFinished] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const finishQuiz = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);

    let correctAnswers = 0;
    let totalTimeSpent = 0;

    const questionWiseAnalysis = questions.map((q, index) => {
      const isCorrect = selectedAnswers[index] === q.correctAnswer;
      if (isCorrect) correctAnswers++;
      totalTimeSpent += questionWiseTime[index];
      return {
        question: q.question,
        selectedAnswer: selectedAnswers[index] || "Not Answered",
        correctAnswer: q.correctAnswer,
        isCorrect,
        timeSpent: questionWiseTime[index],
      };
    });

    const result: QuizResult = {
      category,
      difficulty,
      score: (correctAnswers / questions.length) * 100,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      totalTimeSpent,
      questionWiseAnalysis,
      totalQuestions: questions.length,
    };

    localStorage.setItem('quizResult', JSON.stringify(result));
    router.push('/results');
  }, [isFinished, category, difficulty, questions, selectedAnswers, questionWiseTime, router]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpDialog(true);
          return 0;
        }
        return prev - 1;
      });
      setQuestionWiseTime(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex]++;
        return newTimes;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, finishQuiz, timePerQuestion]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(timePerQuestion);
    } else {
      finishQuiz();
    }
  };
  
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeLeft(timePerQuestion);
    }
  };

  const handleSelectAnswer = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = value;
    setSelectedAnswers(newAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl glass-morphism">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl md:text-3xl text-primary text-glow">{category}</CardTitle>
              <p className="text-muted-foreground">{difficulty}</p>
            </div>
            <CircularTimer duration={timePerQuestion} currentTime={timeLeft} />
          </div>
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-sm text-muted-foreground text-center mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-foreground">{currentQuestion.question}</h2>
          <RadioGroup value={selectedAnswers[currentQuestionIndex] || ''} onValueChange={handleSelectAnswer} className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} className="border-primary text-primary" />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} className="yellow-accent-bg">
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              You've run out of time for this question. The quiz will now be submitted with your current answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={finishQuiz} className="yellow-accent-bg">View Results</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
