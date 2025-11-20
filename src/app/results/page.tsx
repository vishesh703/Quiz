import { ResultsClient } from '@/components/quiz/ResultsClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function LoadingResults() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="h-48 w-48 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingResults />}>
      <ResultsClient />
    </Suspense>
  );
}
