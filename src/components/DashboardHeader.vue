<script setup lang="ts">
import { ref, computed } from 'vue'

const currentTime = ref(new Date())

setInterval(() => {
  currentTime.value = new Date()
}, 60000)

const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
)
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 md:px-6" role="banner">
    <div class="max-w-7xl mx-auto flex justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8 text-blue-500 shrink-0 md:w-10 md:h-10" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-gray-900 leading-tight md:text-xl">System Monitor</h1>
          <p class="hidden text-xs text-gray-500 md:block">Infrastructure Health Dashboard</p>
        </div>
      </div>

      <div class="flex items-center gap-4 md:gap-6">
        <div class="hidden flex-col items-end md:flex">
          <time class="text-sm font-medium text-gray-900" :datetime="currentTime.toISOString()">
            {{ formattedDate }}
          </time>
          <span class="text-xs text-gray-500">{{ formattedTime }}</span>
        </div>

        <div class="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full" aria-live="polite">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse-live" aria-hidden="true"></span>
          <span class="text-xs font-semibold text-green-800 uppercase tracking-wide">Live</span>
        </div>
      </div>
    </div>
  </header>
</template>
