<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  icon?: 'monitor' | 'check' | 'alert' | 'clock' | 'activity'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  trend: 'neutral',
})

const iconWrapperClasses = computed(() => {
  const base = 'flex items-center justify-center w-10 h-10 rounded-lg shrink-0 md:w-12 md:h-12'
  const variants: Record<string, string> = {
    default: 'bg-blue-100 text-blue-500',
    success: 'bg-green-100 text-green-500',
    warning: 'bg-amber-100 text-amber-500',
    danger: 'bg-red-100 text-red-500',
  }
  return `${base} ${variants[props.variant]}`
})

const trendClasses = computed(() => {
  const base = 'inline-flex items-center text-xs font-medium'
  if (props.trend === 'up') return `${base} text-green-600`
  if (props.trend === 'down') return `${base} text-red-600`
  return `${base} text-gray-400`
})

const iconPath = computed(() => {
  const icons: Record<string, string> = {
    monitor: 'M4 6h16v10H4V6zm2 12h12v2H6v-2z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
    alert: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    clock: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  }
  return icons[props.icon || 'activity'] || icons.activity
})
</script>

<template>
  <div class="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow md:gap-4 md:p-5">
    <div :class="iconWrapperClasses" aria-hidden="true">
      <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
        <path fill="currentColor" :d="iconPath" />
      </svg>
    </div>

    <div class="flex flex-col gap-0.5 min-w-0">
      <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ props.label }}</span>
      <span class="text-2xl font-bold text-gray-900 leading-tight md:text-3xl">{{ props.value }}</span>

      <div v-if="props.subtitle || props.trendValue" class="flex items-center gap-2 mt-1">
        <span v-if="props.subtitle" class="text-xs text-gray-400">{{ props.subtitle }}</span>
        <span v-if="props.trendValue" :class="trendClasses">
          <svg v-if="props.trend !== 'neutral'" class="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              :d="props.trend === 'up' ? 'M7 14l5-5 5 5H7z' : 'M7 10l5 5 5-5H7z'"
            />
          </svg>
          {{ props.trendValue }}
        </span>
      </div>
    </div>
  </div>
</template>
