import { useState, useEffect } from 'react';

/**
 * React Hook which allows throwing an error (catchable via ErrorBoundary) from another hook or promise
 * @see https://github.com/facebook/react/issues/14981
 */
export function useThrowError() {
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      setError(error);
      setError(() => {
        throw error;
      });
    }
  }, [error]);

  return setError;
}
