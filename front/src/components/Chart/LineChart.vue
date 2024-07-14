<template>
  <Line
      :id="chartId"
      :options="chartOptions"
      :data="chartData"
  />
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

  const props = defineProps({
    dimensionsDatas: {
      type: Array,
      required: true
    },
    measuresDatas: {
      type: Array,
      required: true
    },
    chartId: {
      type: String,
      default: 'line-chart-id'
    },
    title: {
      type: String,
      default: 'Line Chart'
    }
});

  const chartData = computed(() => ({
      labels: props.dimensionsDatas,
      datasets: [
          {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: props.measuresDatas
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
    }
  });
</script>

<style></style>
