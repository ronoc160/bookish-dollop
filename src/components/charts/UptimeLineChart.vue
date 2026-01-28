<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { DailyUptimeSummary } from '../../types'
import { formatDate } from '../../utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  data: DailyUptimeSummary[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map(d => formatDate(d.date)),
  datasets: [
    {
      label: 'Uptime %',
      data: props.data.map(d => d.uptimePercentage),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#22c55e',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
    },
    {
      label: 'Response Time (ms)',
      data: props.data.map(d => d.averageResponseTime),
      borderColor: '#3b82f6',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#3b82f6',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
      yAxisID: 'y1',
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: { dataset: { label?: string }; parsed: { y: number | null } }) => {
          const { label } = context.dataset
          const value = context.parsed.y
          if (label === 'Uptime %') return ` ${label}: ${value?.toFixed(2)}%`
          return ` ${label}: ${value}ms`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { maxTicksLimit: 7, font: { size: 11 }, color: '#9ca3af' },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      min: 95,
      max: 100,
      grid: { color: '#f3f4f6' },
      ticks: { callback: (value: number | string) => `${value}%`, font: { size: 11 }, color: '#9ca3af' },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: { drawOnChartArea: false },
      ticks: { callback: (value: number | string) => `${value}ms`, font: { size: 11 }, color: '#9ca3af' },
    },
  },
}))
</script>

<template>
  <div class="w-full h-[220px] md:h-[280px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
