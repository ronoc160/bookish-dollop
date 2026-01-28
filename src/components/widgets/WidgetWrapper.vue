<script setup lang="ts">
import type { LoadingState } from '../../types'

interface Props {
  title: string
  state: LoadingState
  error?: string | null
  isEmpty?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  isEmpty: false,
  fullWidth: false,
})

const emit = defineEmits<{
  retry: []
}>()

const handleRetry = () => emit('retry')
</script>

<template>
  <article
    class="bg-white rounded-xl shadow-sm flex flex-col min-h-[200px] overflow-hidden"
    :class="{ 'col-span-full': props.fullWidth }"
    role="region"
    :aria-label="props.title"
    :aria-busy="props.state === 'loading'"
  >
    <header class="px-4 py-3 border-b border-gray-200 md:px-5 md:py-4">
      <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider md:text-sm">
        {{ props.title }}
      </h2>
    </header>

    <div class="flex-1 flex items-center justify-center p-4 md:p-5">
      <!-- Loading State -->
      <div v-if="props.state === 'loading'" class="flex flex-col items-center gap-3" aria-live="polite">
        <div
          class="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"
          aria-hidden="true"
        ></div>
        <span class="sr-only">Loading {{ props.title }}...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="props.state === 'error'" class="flex flex-col items-center gap-3 text-center" role="alert">
        <div class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
          <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-gray-900">Unable to load data</p>
          <p class="text-xs text-gray-500">{{ props.error || 'Something went wrong. Please try again.' }}</p>
        </div>
        <button
          class="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="handleRetry"
          type="button"
        >
          Try Again
        </button>
      </div>

      <!-- Empty/No Data State -->
      <div v-else-if="props.state === 'idle' || props.isEmpty" class="flex flex-col items-center gap-3 text-center py-4">
        <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 12H5c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z"
            />
          </svg>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-gray-700">No data available</p>
          <p class="text-xs text-gray-400">Data will appear here once available.</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="props.state === 'success'" class="w-full h-full">
        <slot></slot>
      </div>
    </div>
  </article>
</template>
