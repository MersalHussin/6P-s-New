
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A client component that listens for Firestore permission errors and throws them
 * to be caught by the Next.js error overlay in development. This is crucial for
 * debugging security rules.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In a production environment, you might want to log this to a service
      // like Sentry, but in development, we want to see the Next.js overlay.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        console.error(error); // Fallback for production
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything
}

    
