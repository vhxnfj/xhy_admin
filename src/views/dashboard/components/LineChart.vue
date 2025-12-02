<template>
  <div class="block-box">
    <div class="title">经营分析</div>
    <div class="mode-set">
      <el-radio-group v-model="mode" size="small">
      <el-radio-button label="day30">最近30天</el-radio-button>
      <el-radio-button label="day15">最近15天</el-radio-button>
      <el-radio-button label="day7">最近7天</el-radio-button>
    </el-radio-group>
    </div>
    <div :class="className" :style="{height:height,width:width}" ref="chartBox"/>
  </div>

</template>

<script>
import echarts from 'echarts'
console.log(echarts)
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getChart} from '@/api/report'

export default {
  name:"linechart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData:{},
      mode:'day30'
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    mode(val){
      this.loadChartData();
    }
  },
  mounted() {
    this.loadChartData();
    /*this.$nextTick(() => {
      this.initChart()
    })*/
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    loadChartData(){
      getChart('mode='+this.mode).then(res=>{
        this.chartData = res.data;
        if(!this.chart) this.initChart();
      });
      setTimeout(this.loadChartData,60000);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartBox, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      this.chart.setOption({
        xAxis: {
          data: data.days,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            interval:0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
            rotate:38   //调整数值改变倾斜的幅度（范围-90到90）
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: data.name
        },
        series: [{
          name: data.name[0],
          itemStyle: {
            normal: {
              color: '#1d8e11',
              lineStyle: {
                color: '#1d8e11',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: data.values.recharge,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
          {
            name: data.name[1],
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#d23b09',
                lineStyle: {
                  color: '#d23b09',
                  width: 2
                }
              }
            },
            data: data.values.out,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    }
  }
}
</script>
<style scoped>
  .block-box{
    background: white;
    padding: 20px 10px;
    position: relative;
  }
  .block-box .title{
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
    color: #2b2f3a;
  }
  .block-box .mode-set{
    position: absolute;
    margin-top: -60px;
    right: 20px;
  }
</style>
