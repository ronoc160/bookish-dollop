<script setup lang="ts">
import { computed, ref } from 'vue'
import DashboardHeader from './DashboardHeader.vue'
import WidgetWrapper from './widgets/WidgetWrapper.vue'
import KpiCard from './widgets/KpiCard.vue'
import MonitorTable from './widgets/MonitorTable.vue'
import UptimeLineChart from './charts/UptimeLineChart.vue'
import MonitorTypeBarChart from './charts/MonitorTypeBarChart.vue'
import { useAsyncData } from '../composables/useAsyncData'
import {
  monitors,
  uptimeStats,
  dailyUptimeSummaries,
  monitorTypeBreakdown,
  dashboardKPIs,
} from '../data/mockData'
import { formatPercentage, formatResponseTime } from '../utils/formatters'

// Demo mode state
const demoMode = ref(false)
const demoErrors = ref({
  kpis: false,
  uptime: false,
  types: false,
  monitors: false,
})
const demoEmpty = ref({
  uptime: false,
  types: false,
  monitors: false,
})

const toggleDemoMode = () => {
  demoMode.value = !demoMode.value
}

// Async data fetching with simulated delays for demo
const { data: kpis, state: kpisState, error: kpisError, refetch: refetchKpis } = useAsyncData(
  () => {
    if (demoErrors.value.kpis) throw new Error('Network error: Unable to connect to metrics server')
    return dashboardKPIs
  },
  { delay: 600 }
)

const { data: uptimeData, state: uptimeState, error: uptimeError, refetch: refetchUptime } = useAsyncData(
  () => {
    if (demoErrors.value.uptime) throw new Error('Timeout: Uptime service not responding')
    if (demoEmpty.value.uptime) return []
    return dailyUptimeSummaries
  },
  { delay: 1000 }
)

const { data: typeBreakdown, state: typeState, error: typeError, refetch: refetchType } = useAsyncData(
  () => {
    if (demoErrors.value.types) throw new Error('Error 503: Service temporarily unavailable')
    if (demoEmpty.value.types) return []
    return monitorTypeBreakdown
  },
  { delay: 800 }
)

const { data: monitorList, state: monitorState, error: monitorError, refetch: refetchMonitors } = useAsyncData(
  () => {
    if (demoErrors.value.monitors) throw new Error('Database connection failed')
    if (demoEmpty.value.monitors) return { monitors: [], uptimeStats: [] }
    return { monitors, uptimeStats }
  },
  { delay: 1200 }
)

// Trigger refetch when demo settings change
const applyDemoSettings = () => {
  refetchKpis()
  refetchUptime()
  refetchType()
  refetchMonitors()
}

// Computed values
const formattedUptime = computed(() =>
  kpis.value ? formatPercentage(kpis.value.overallUptime) : '—'
)

const formattedResponseTime = computed(() =>
  kpis.value ? formatResponseTime(kpis.value.averageResponseTime) : '—'
)

const uptimeTrend = computed(() => {
  if (!uptimeData.value || uptimeData.value.length < 14) return { direction: 'neutral' as const, value: '' }

  const recent = uptimeData.value.slice(-7)
  const previous = uptimeData.value.slice(-14, -7)

  const recentAvg = recent.reduce((sum, d) => sum + d.uptimePercentage, 0) / recent.length
  const previousAvg = previous.reduce((sum, d) => sum + d.uptimePercentage, 0) / previous.length

  const diff = recentAvg - previousAvg

  return {
    direction: diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'neutral' as const,
    value: `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`,
  }
})

// Empty state checks
const isUptimeEmpty = computed(() => !uptimeData.value || uptimeData.value.length === 0)
const isTypeEmpty = computed(() => !typeBreakdown.value || typeBreakdown.value.length === 0)
const isMonitorsEmpty = computed(() => !monitorList.value || monitorList.value.monitors.length === 0)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Skip Link for Accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:outline-none"
    >
      Skip to main content
    </a>

    <DashboardHeader />

    <!-- Demo Mode Toggle Button -->
    <button
      @click="toggleDemoMode"
      class="fixed bottom-4 right-4 z-50 px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="demoMode
        ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
        : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-200'"
    >
      {{ demoMode ? '✕ Close Demo Panel' : '🎛 Demo Mode' }}
    </button>

    <!-- Demo Control Panel -->
    <div
      v-if="demoMode"
      class="fixed bottom-16 right-4 z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div class="bg-purple-600 text-white px-4 py-3">
        <h3 class="font-semibold">Demo Controls</h3>
        <p class="text-xs text-purple-200">Simulate different states</p>
      </div>

      <div class="p-4 space-y-4">
        <!-- Error States -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Simulate Errors</p>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoErrors.kpis" class="rounded text-red-500 focus:ring-red-500" />
              <span>KPI Cards</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoErrors.uptime" class="rounded text-red-500 focus:ring-red-500" />
              <span>Uptime Chart</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoErrors.types" class="rounded text-red-500 focus:ring-red-500" />
              <span>Type Chart</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoErrors.monitors" class="rounded text-red-500 focus:ring-red-500" />
              <span>Monitor Table</span>
            </label>
          </div>
        </div>

        <!-- Empty States -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Simulate Empty</p>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoEmpty.uptime" class="rounded text-amber-500 focus:ring-amber-500" />
              <span>Uptime Chart</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoEmpty.types" class="rounded text-amber-500 focus:ring-amber-500" />
              <span>Type Chart</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="demoEmpty.monitors" class="rounded text-amber-500 focus:ring-amber-500" />
              <span>Monitor Table</span>
            </label>
          </div>
        </div>

        <!-- Apply Button -->
        <button
          @click="applyDemoSettings"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Apply & Reload Data
        </button>

        <!-- Reset Button -->
        <button
          @click="() => {
            demoErrors = { kpis: false, uptime: false, types: false, monitors: false }
            demoEmpty = { uptime: false, types: false, monitors: false }
            applyDemoSettings()
          }"
          class="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset to Normal
        </button>
      </div>
    </div>

    <main
      id="main-content"
      class="flex-1 w-full max-w-7xl mx-auto px-3 py-4 flex flex-col gap-4 md:px-6 md:py-6 md:gap-6"
      role="main"
      aria-label="Dashboard content"
    >
      <!-- KPI Cards Section -->
      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4" aria-label="Key Performance Indicators">
        <template v-if="kpisState === 'loading'">
          <div
            v-for="i in 4"
            :key="i"
            class="h-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-xl"
            role="status"
            aria-label="Loading KPI"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </template>
        <template v-else-if="kpisState === 'success' && kpis">
          <KpiCard
            label="Total Monitors"
            :value="kpis.totalMonitors"
            subtitle="Active monitors"
            icon="monitor"
            variant="default"
          />
          <KpiCard
            label="Monitors Up"
            :value="kpis.monitorsUp"
            :subtitle="`${kpis.monitorsDown} down`"
            icon="check"
            variant="success"
          />
          <KpiCard
            label="Overall Uptime"
            :value="formattedUptime"
            subtitle="Last 30 days"
            icon="activity"
            variant="success"
            :trend="uptimeTrend.direction"
            :trend-value="uptimeTrend.value"
          />
          <KpiCard
            label="Avg Response"
            :value="formattedResponseTime"
            subtitle="Across all monitors"
            icon="clock"
            variant="default"
          />
        </template>
        <template v-else>
          <div class="col-span-full flex flex-col items-center gap-3 p-6 bg-red-50 rounded-xl" role="alert">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900">Unable to load metrics</p>
              <p class="text-xs text-gray-500 mt-1">{{ kpisError || 'Please try again.' }}</p>
            </div>
            <button
              class="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="refetchKpis"
            >
              Try Again
            </button>
          </div>
        </template>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6" aria-label="Data Visualizations">
        <WidgetWrapper
          title="Uptime & Response Time Trends"
          :state="uptimeState"
          :error="uptimeError"
          :is-empty="isUptimeEmpty"
          class="lg:col-span-2"
          @retry="refetchUptime"
        >
          <UptimeLineChart v-if="uptimeData && uptimeData.length > 0" :data="uptimeData" />
        </WidgetWrapper>

        <WidgetWrapper
          title="Monitors by Type"
          :state="typeState"
          :error="typeError"
          :is-empty="isTypeEmpty"
          @retry="refetchType"
        >
          <MonitorTypeBarChart v-if="typeBreakdown && typeBreakdown.length > 0" :data="typeBreakdown" />
        </WidgetWrapper>
      </section>

      <!-- Table Section -->
      <section aria-label="Monitor Details">
        <WidgetWrapper
          title="All Monitors"
          :state="monitorState"
          :error="monitorError"
          :is-empty="isMonitorsEmpty"
          :full-width="true"
          @retry="refetchMonitors"
        >
          <MonitorTable
            v-if="monitorList"
            :monitors="monitorList.monitors"
            :uptime-stats="monitorList.uptimeStats"
          />
        </WidgetWrapper>
      </section>
    </main>

    <footer class="text-center py-4 text-sm text-gray-400 border-t border-gray-200" role="contentinfo">
      <p>
        Dashboard built with Vue 3 + TypeScript + Tailwind CSS
        <span class="mx-2" aria-hidden="true">•</span>
        Data refreshes automatically
      </p>
    </footer>
  </div>
</template>
