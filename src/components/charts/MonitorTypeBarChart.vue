<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { MonitorTypeBreakdown } from '../../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  data: MonitorTypeBreakdown[]
}

const props = defineProps<Props>()

const typeLabels: Record<string, string> = {
  http: 'HTTP',
  tcp: 'TCP',
  ping: 'Ping',
  dns: 'DNS',
  ssl: 'SSL',
}

const chartData = computed(() => ({
  labels: props.data.map(d => typeLabels[d.type] || d.type.toUpperCase()),
  datasets: [
    {
      label: 'Up',
      data: props.data.map(d => d.upCount),
      backgroundColor: '#22c55e',
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
    {
      label: 'Down',
      data: props.data.map(d => d.downCount),
      backgroundColor: '#ef4444',
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
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
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#9ca3af' },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: { stepSize: 1, font: { size: 11 }, color: '#9ca3af' },
    },
  },
}))
</script>

<template>
  <div class="w-full h-[200px] md:h-[250px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
