import { useState, useEffect } from 'react';

export function useThrowError() {
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      setError(() => {
        throw error;
      });
    }
  }, [error]);

  return setError;
}
