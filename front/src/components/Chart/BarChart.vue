<template>
  <Bar
    :id="chartId"
    :options="chartOptions"
    :data="chartData"
  />
</template>
    
<script setup>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  dimensionsDatas: {
    type: Array,
    required: true
  },
  measuresDatas: {
    type: Array,
    required: true
  },
  backgroundColor: {
    type: String,
    default: '#f87979'
  },
  chartId: {
    type: String,
    default: 'bar-chart-id'
  },
  title: {
    type: String,
    default: 'Bar Chart'
  }
});

const chartData = computed(() => ({
  labels: props.dimensionsDatas,
  datasets: [
    {
      label: 'My Dataset',
      data: props.measuresDatas,
      backgroundColor: props.backgroundColor
    }
  ]
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, 
  plugins: {
    title: {
        display: true,
        text: props.title,
        padding: {
            top: 10,
        }
    },
    legend: {
      display: true,
      position: 'top'
    }
  },
});
</script>
