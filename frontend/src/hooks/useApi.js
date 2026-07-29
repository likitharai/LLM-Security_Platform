import { useState, useCallback } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...params);
      setData(result);
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || 'An unexpected error occurred while fetching data.';
      
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset
  };
};