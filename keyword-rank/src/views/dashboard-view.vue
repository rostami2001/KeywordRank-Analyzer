<template>
  <the-header />
  <div class="dashboard">
    <h2 class="dashboard__header">داشبورد تحلیلی</h2>
    <div class="dashboard__charts">
      <div class="dashboard__barChart">
        <h6>تعداد بررسی‌های انجام شده</h6>
        <canvas ref="barChartRef"></canvas>
      </div>
      <div class="dashboard__lineChart">
        <h6 class="">تغییرات رتبه کلمات کلیدی</h6>
        <canvas ref="lineChartRef"></canvas>
      </div>
    </div>
    <div class="dashboard__table">
      <h6 class="">جدول داده‌های کلمات کلیدی</h6>
      <base-table
        :headers="[
          { value: 'کلمه کلیدی', key: 'keyword' },
          { value: 'سایت مرتبط', key: 'site' },
          { value: 'کمترین رتبه', key: 'min' },
          { value: 'بیشترین رتبه', key: 'max' },
          { value: 'میانگین رتبه', key: 'avg' },
          { value: 'تعداد بررسی', key: 'count' },
        ]"
        :items="tableData"
      ></base-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const barChartRef = ref(null)
const lineChartRef = ref(null)

const lineChartData = ref([])
const barChartData = ref([])
const tableData = ref([])

async function fetchDashboardData() {
  try {
    const response = await fetch('http://localhost:3004/dashboard')
    const data = await response.json()

    lineChartData.value = data.lineChartData
    barChartData.value = data.barChartData
    tableData.value = data.tableData
  } catch (error) {
    console.error('خطا در بارگذاری داده‌های داشبورد', error)
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

onMounted(async () => {
  await fetchDashboardData()

  new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels: lineChartData.value[0]?.timestamps.map(formatTimestamp),
      datasets: lineChartData.value.map((item) => ({
        label: `${item.site} (${item.keyword}) - ${item.rankings.length} بررسی`,
        data: item.rankings,
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        tension: 0.3,
      })),
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex
              const dataset = context.dataset
              const timestamp = lineChartData.value[0]?.timestamps[index]
              const formattedTimestamp = formatTimestamp(timestamp)
              return `${dataset.label}: ${context.raw} (زمان: ${formattedTimestamp})`
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'زمان',
          },
        },
        y: {
          title: {
            display: true,
            text: 'رتبه',
          },
          reverse: true,
        },
      },
    },
  })

  // Bar Chart
  new Chart(barChartRef.value, {
    type: 'bar',
    data: {
      labels: barChartData.value.map((d) => d._id),
      datasets: [
        {
          label: 'تعداد بررسی‌ها',
          data: barChartData.value.map((d) => d.count),
          backgroundColor: '#4caf50',
        },
      ],
    },
  })

  // Line Chart
  new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels: lineChartData.value.map((d) => formatTimestamp(d.timestamp)),
      datasets: [
        {
          label: `${lineChartData.value[0]?.site} (${lineChartData.value[0]?.keyword})`,
          data: lineChartData.value.map((d) => d.ranking[0]),
          borderColor: '#2196f3',
          fill: true,
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'زمان',
          },
        },
        y: {
          title: {
            display: true,
            text: 'رتبه',
          },
          reverse: true,
        },
      },
    },
  })
})
</script>

<style lang="scss" scoped>
canvas {
  max-width: 100%;
  margin: auto;
  width: 600px !important;
  height: 500px !important;
}

.dashboard {
  padding-top: 100px;
  overflow: auto;

  &__header {
    text-align: center;
    margin-bottom: 50px;
  }

  &__charts {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    margin-bottom: 30px;

    &__barChart,
    &__lineChart {
      flex: 1;
      padding: 20px;
      border-radius: 8px;
    }
  }

  &__table {
    padding: 20px;
    border-radius: 8px;
  }
}
</style>
