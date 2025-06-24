
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface UserCreationMessagesProps {
  successMessage: string | null;
  errorMessage: string | null;
}

export function UserCreationMessages({ successMessage, errorMessage }: UserCreationMessagesProps) {
  if (!successMessage && !errorMessage) {
    return null;
  }

  return (
    <>
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 whitespace-pre-line">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
