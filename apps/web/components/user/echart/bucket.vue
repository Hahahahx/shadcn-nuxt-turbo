<script setup lang="ts">
// 引入 vue-echarts 组件
import VChart from 'vue-echarts'

import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

const props = defineProps<{
  data: {
    value: number
    name: string
  }[]
}>()

use([
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  PieChart,
  CanvasRenderer,
])

const colorMode = useColorMode()
// 图表数据
const option = computed(() => ({
  backgroundColor: '#00000000',
  tooltip: {
    show: true,
    trigger: 'item',
    position: 'left',
    axisPointer: {
      type: 'shadow',
    },
    borderColor: 'transparent',
    formatter: (params: any) => {
      return (
        `${params.marker
            + params.name
             }<br/>${
             byteTrans.merticKB(params.value)
             }<br/>${
             params.percent ?? 0
             }%`
      )
    },
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: '文件详情图',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: props.data,
    },
  ],
}))
</script>

<template>
  <ClientOnly fallback-tag="div" fallback="Loading comments...">
    <VChart autoresize class="chart" :option="option" :theme="colorMode.value" />
  </ClientOnly>
</template>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
