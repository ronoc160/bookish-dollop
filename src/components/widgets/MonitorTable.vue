<script setup lang="ts">
import { computed } from 'vue'
import type { Monitor, UptimeStats } from '../../types'
import { formatPercentage, formatResponseTime, formatRelativeTime, getStatusText } from '../../utils/formatters'

interface Props {
  monitors: Monitor[]
  uptimeStats: UptimeStats[]
}

const props = defineProps<Props>()

const isEmpty = computed(() => props.monitors.length === 0)

const monitorData = computed(() =>
  props.monitors.map(monitor => {
    const stats = props.uptimeStats.find(s => s.monitorId === monitor.id)
    return {
      ...monitor,
      uptime: stats?.uptimePercentage ?? 0,
      responseTime: stats?.averageResponseTime ?? 0,
    }
  })
)

const getStatusClasses = (status: string) => {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full'
  const variants: Record<string, string> = {
    up: 'bg-green-100 text-green-700',
    down: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
    paused: 'bg-gray-100 text-gray-600',
  }
  return `${base} ${variants[status] || 'bg-gray-100 text-gray-600'}`
}

const getIndicatorClasses = (status: string) => {
  const base = 'w-2 h-2 rounded-full'
  const variants: Record<string, string> = {
    up: 'bg-green-500',
    down: 'bg-red-500 animate-pulse',
    pending: 'bg-amber-500',
    paused: 'bg-gray-400',
  }
  return `${base} ${variants[status] || 'bg-gray-400'}`
}

const getUptimeClasses = (uptime: number) => {
  const base = 'font-semibold tabular-nums'
  if (uptime >= 99.9) return `${base} text-green-600`
  if (uptime >= 99) return `${base} text-green-600`
  if (uptime >= 95) return `${base} text-amber-600`
  return `${base} text-red-600`
}
</script>

<template>
  <div class="w-full">
    <!-- Empty State -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
        <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 6h16v10H4V6zm2 12h12v2H6v-2zm13-9h-2v2h2V9zm0 3h-2v2h2v-2zm-4-3h-2v2h2V9zm0 3h-2v2h2v-2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-700">No monitors configured</p>
      <p class="text-xs text-gray-400 mt-1">Monitors will appear here once added.</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm" role="table" aria-label="Monitor Status Table">
        <thead>
          <tr class="border-b border-gray-200">
            <th scope="col" class="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide md:px-4">Name</th>
            <th scope="col" class="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide md:px-4">Type</th>
            <th scope="col" class="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide md:px-4">Status</th>
            <th scope="col" class="hidden text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide md:table-cell md:px-4">Uptime (30d)</th>
            <th scope="col" class="hidden text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide md:table-cell md:px-4">Avg Response</th>
            <th scope="col" class="hidden text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide lg:table-cell md:px-4">Last Check</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="monitor in monitorData"
            :key="monitor.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors focus-within:bg-blue-50"
          >
            <td class="px-3 py-3 md:px-4">
              <div class="flex flex-col gap-1">
                <span class="font-medium text-gray-900">{{ monitor.name }}</span>
                <div class="hidden gap-1.5 flex-wrap md:flex">
                  <span
                    v-for="tag in monitor.tags.slice(0, 2)"
                    :key="tag"
                    class="inline-block px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded-full uppercase tracking-wide"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-3 py-3 md:px-4">
              <span class="inline-block px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-100 rounded">
                {{ monitor.type.toUpperCase() }}
              </span>
            </td>
            <td class="px-3 py-3 md:px-4">
              <span :class="getStatusClasses(monitor.status)">
                <span :class="getIndicatorClasses(monitor.status)" aria-hidden="true"></span>
                {{ getStatusText(monitor.status) }}
              </span>
            </td>
            <td class="hidden px-3 py-3 md:table-cell md:px-4">
              <span :class="getUptimeClasses(monitor.uptime)">
                {{ formatPercentage(monitor.uptime) }}
              </span>
            </td>
            <td class="hidden px-3 py-3 text-gray-600 md:table-cell md:px-4">
              {{ formatResponseTime(monitor.responseTime) }}
            </td>
            <td class="hidden px-3 py-3 text-gray-500 whitespace-nowrap lg:table-cell md:px-4">
              {{ formatRelativeTime(monitor.lastCheckedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
