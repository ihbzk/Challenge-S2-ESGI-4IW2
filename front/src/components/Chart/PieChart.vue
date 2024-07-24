<template>
    <Pie
        :id="chartId"
        :options="chartOptions"
        :data="chartData"
    />
  </template>
  
  <script setup>
    import { ref, computed } from 'vue';
    import { Pie } from 'vue-chartjs';
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
    ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
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
        default: 'pie-chart-id'
      },
      title: {
        type: String,
        default: 'Pie Chart'
      }
    });
  
    const chartData = computed(() => ({
        labels: props.dimensionsDatas,
        datasets: [
            {
                label: 'Dataset',
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40'
                ],
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
  