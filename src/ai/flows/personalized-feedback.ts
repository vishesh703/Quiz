'use server';
/**
 * @fileOverview Generates personalized feedback based on quiz performance.
 *
 * - generatePersonalizedFeedback - A function that generates personalized feedback based on user quiz performance.
 * - PersonalizedFeedbackInput - The input type for the generatePersonalizedFeedback function.
 * - PersonalizedFeedbackOutput - The return type for the generatePersonalizedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFeedbackInputSchema = z.object({
  category: z.string().describe('The category of the quiz (e.g., Communication Skills, Aptitude, Technical Knowledge).'),
  difficulty: z.string().describe('The difficulty level of the quiz (Easy, Medium, Hard).'),
  score: z.number().describe('The user score on the quiz.'),
  correctAnswers: z.number().describe('The number of correct answers.'),
  incorrectAnswers: z.number().describe('The number of incorrect answers.'),
  totalTimeSpent: z.number().describe('The total time spent on the quiz in seconds.'),
  questionWiseAnalysis: z.array(
    z.object({
      question: z.string().describe('The question text.'),
      selectedAnswer: z.string().describe('The answer selected by the user.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      timeSpent: z.number().describe('The time spent on the question in seconds.'),
      isCorrect: z.boolean().describe('Whether the answer was correct or not.'),
    })
  ).describe('Detailed analysis of each question answered by the user.'),
});
export type PersonalizedFeedbackInput = z.infer<typeof PersonalizedFeedbackInputSchema>;

const PersonalizedFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback message for the user.'),
});
export type PersonalizedFeedbackOutput = z.infer<typeof PersonalizedFeedbackOutputSchema>;

export async function generatePersonalizedFeedback(input: PersonalizedFeedbackInput): Promise<PersonalizedFeedbackOutput> {
  return personalizedFeedbackFlow(input);
}

const personalizedFeedbackPrompt = ai.definePrompt({
  name: 'personalizedFeedbackPrompt',
  input: {schema: PersonalizedFeedbackInputSchema},
  output: {schema: PersonalizedFeedbackOutputSchema},
  prompt: `You are an AI-powered feedback generator designed to provide personalized feedback to users based on their quiz performance.

  Based on the quiz category: {{{category}}},
  difficulty level: {{{difficulty}}},
  score: {{{score}}},
  number of correct answers: {{{correctAnswers}}},
  number of incorrect answers: {{{incorrectAnswers}}},
  total time spent: {{{totalTimeSpent}}} seconds,
  and the following question-wise analysis:
  {{#each questionWiseAnalysis}}
  Question: {{{question}}}
  Your Answer: {{{selectedAnswer}}}
  Correct Answer: {{{correctAnswer}}}
  Time Spent: {{{timeSpent}}} seconds
  Correct: {{#if isCorrect}}Yes{{else}}No{{/if}}
  {{/each}}

  Generate a feedback message that highlights the user's strengths and weaknesses, and provides specific tips and suggestions for improvement. The feedback should be encouraging and actionable.  Focus on specific areas where the user can improve based on their performance, but do not be overly critical.

  Here's the feedback:
  `,
});

const personalizedFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedFeedbackFlow',
    inputSchema: PersonalizedFeedbackInputSchema,
    outputSchema: PersonalizedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await personalizedFeedbackPrompt(input);
    return output!;
  }
);
