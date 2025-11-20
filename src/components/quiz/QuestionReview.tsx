"use client";

import type { QuestionResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";

interface QuestionReviewProps {
  analysis: QuestionResult[];
}

export function QuestionReview({ analysis }: QuestionReviewProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Question-wise Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {analysis.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center gap-4 w-full">
                  {item.isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                  <span className="text-left flex-1">Question {index + 1}</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.timeSpent.toFixed(1)}s
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="font-semibold">{item.question}</p>
                <div>
                  <p className="text-sm font-medium">Your Answer:</p>
                  <p className={`text-sm p-2 rounded-md ${item.isCorrect ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                    {item.selectedAnswer}
                  </p>
                </div>
                {!item.isCorrect && (
                  <div>
                    <p className="text-sm font-medium">Correct Answer:</p>
                    <p className="text-sm p-2 rounded-md bg-green-500/10 text-green-300">
                      {item.correctAnswer}
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
