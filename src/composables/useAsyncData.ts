import { ref, type Ref } from 'vue';
import type { LoadingState } from '../types';

interface UseAsyncDataReturn<T> {
  data: Ref<T | null>;
  state: Ref<LoadingState>;
  error: Ref<string | null>;
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
}

interface UseAsyncDataOptions {
  immediate?: boolean;
  delay?: number;
  errorRate?: number; // For simulating errors (0-1)
}

/**
 * Composable for handling async data fetching with loading and error states
 */
export function useAsyncData<T>(
  fetchFn: () => T | Promise<T>,
  options: UseAsyncDataOptions = {}
): UseAsyncDataReturn<T> {
  const { immediate = true, delay = 800, errorRate = 0 } = options;

  const data = ref<T | null>(null) as Ref<T | null>;
  const state = ref<LoadingState>('idle');
  const error = ref<string | null>(null);

  const execute = async (): Promise<void> => {
    state.value = 'loading';
    error.value = null;

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate random errors for testing error states
      if (errorRate > 0 && Math.random() < errorRate) {
        throw new Error('Failed to fetch data. Please try again.');
      }

      const result = await fetchFn();
      data.value = result;
      state.value = 'success';
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
      state.value = 'error';
    }
  };

  const refetch = async (): Promise<void> => {
    await execute();
  };

  if (immediate) {
    execute();
  }

  return {
    data,
    state,
    error,
    execute,
    refetch,
  };
}
