<template>
  <b-container class="my-5 py-3">
    <b-tabs v-model="currentTab" content-class="mt-3" lazy>
      <b-tab title="即時走勢"> </b-tab>
      <b-tab title="技術指標">
        <!-- <div class="mb-3 text-right">
          <b-button
            v-for="option in cycleOptions"
            :key="option.value"
            :disabled="cycle === option.value"
            class="ml-3 cycleSwitch"
            :class="{
              'cycleSwitch--active': cycle === option.value
            }"
            @click.prevent="cycle = option.value"
          >
            {{ option.text }}
          </b-button>
        </div> -->
        <client-only>
          <highcharts
            :callback="chartLoaded"
            :constructor-type="'stockChart'"
            :options="chartOptions"
          ></highcharts>
        </client-only>
      </b-tab>
      <b-tab title="關注清單">
        <client-only>
          <highcharts
            :callback="chartLoaded2"
            :constructor-type="'stockChart'"
            :options="chartOptions2"
          ></highcharts>
        </client-only>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      currentTab: 2,
      chartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor: 'rgba(1, 31, 75, 0.2)',
          borderColor: '#011f4b',
          height: 800
        },
        rangeSelector: {
          enabled: false
        },
        plotOptions: {
          sma: {
            marker: {
              enabled: false
            },
            lineWidth: 1
          }
        },
        title: {
          text: '台積電 (2330) 日K線',
          align: 'left',
          style: {
            color: '#ffffff',
            fontSize: '30px',
            fontWeight: '500'
          }
        },
        xAxis: {
          range: 3 * 30 * 24 * 3600 * 1000, // three months data
          crosshair: {
            dashStyle: 'LongDash',
            color: 'rgba(230, 230, 230, 0.5)'
          }
        },
        yAxis: [
          {
            labels: {
              align: 'left'
            },
            top: '15%',
            height: '40%',
            offset: 0,
            gridLineColor: 'rgba(230, 230, 230, 0.4)'
          },
          {
            labels: {
              align: 'left'
            },
            top: '55%',
            height: '15%',
            offset: 0,
            gridLineColor: 'rgba(230, 230, 230, 0.4)',
            gridLineWidth: 0
          },
          {
            labels: {
              align: 'left'
            },
            top: '70%',
            height: '15%',
            offset: 0,
            gridLineColor: 'rgba(230, 230, 230, 0.4)',
            gridLineWidth: 0
          },
          {
            labels: {
              align: 'left'
            },
            top: '85%',
            height: '15%',
            offset: 0,
            gridLineColor: 'rgba(230, 230, 230, 0.4)',
            gridLineWidth: 0
          }
        ],
        series: [
          {
            type: 'candlestick',
            id: 'candlestick-2330',
            name: 'candlestick(2330)',
            data: [],
            turboThreshold: 0,
            upLineColor: '#fa3032',
            upColor: '#fa3032',
            lineColor: '#29b061',
            color: '#29b061'
            // dataLabels: {
            //   enabled: true,
            //   filter: {
            //     operator: '===',
            //     property: 'x',
            //     value: 1586995200000
            //   },
            //   useHTML: true,
            //   formatter() {
            //     console.log(this)
            //     return '<img src="https://storage.googleapis.com/quants-images-prod/scantrader/upload/0164aa901d8d00003912000000000000.png/>'
            //   }
            //   // format:
            //   //   '<img src="https://storage.googleapis.com/quants-images-prod/scantrader/upload/0164aa901d8d00003912000000000000.png/>'
            // }
          },
          {
            type: 'sma',
            id: 'sma-5',
            name: 'ma(5)',
            linkedTo: 'candlestick-2330',
            color: '#ffec71',
            params: {
              period: 5
            }
          },
          {
            type: 'sma',
            id: 'sma-10',
            name: 'ma(10)',
            linkedTo: 'candlestick-2330',
            color: '#ff7d8b',
            params: {
              period: 10
            }
          },
          {
            type: 'sma',
            id: 'sma-20',
            name: 'ma(20)',
            linkedTo: 'candlestick-2330',
            color: '#4b96eb',
            params: {
              period: 20
            }
          },
          {
            type: 'sma',
            id: 'sma-60',
            name: 'ma(60)',
            linkedTo: 'candlestick-2330',
            color: '#7bff86',
            params: {
              period: 60
            }
          },
          {
            type: 'sma',
            id: 'sma-200',
            name: 'ma(200)',
            linkedTo: 'candlestick-2330',
            color: '#fddb48',
            params: {
              period: 200
            }
          },
          {
            type: 'column',
            id: 'volume',
            name: '成交量',
            yAxis: 1,
            data: [],
            turboThreshold: 0
          },
          {
            type: 'stochastic',
            id: 'KD',
            name: 'KD',
            linkedTo: 'candlestick-2330',
            yAxis: 2,
            color: 'rgb(255, 125, 139)',
            smoothedLine: {
              styles: {
                lineColor: 'rgb(75, 150, 235)'
              }
            },
            params: {
              periods: [9, 9]
            }
          },
          {
            type: 'macd',
            id: 'macd',
            linkedTo: 'candlestick-2330',
            yAxis: 3,
            color: '#fa3032',
            negativeColor: '#29b061',
            macdLine: {
              styles: {
                lineColor: '#b073fe'
              }
            },
            signalLine: {
              styles: {
                lineColor: '#ffa544'
              }
            }
          }
        ]
      },
      chartOptions2: {
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor: 'rgba(1, 31, 75, 0.2)',
          borderColor: '#011f4b',
          height: 800
        },
        rangeSelector: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          visible: false
        },
        series: [
          {
            type: 'area',
            data: [],
            color: 'rgb(255, 75, 75)',
            fillOpacity: 0.3,
            negativeColor: 'rgb(0, 188, 105)',
            lineWidth: 0,
            enableMouseTracking: false,
            states: {
              hover: {
                enabled: false
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory']),
    chartLoaded(chart) {
      const vm = this
      chart.showLoading()
      this.getStockPriceHistory({
        StockID: 'AS2330',
        Count: (new Date().getFullYear() - 1962) * 365,
        Period: 'D'
      }).then(async (data) => {
        const candlestick = this.chartOptions.series.find(
          (series) => series.type === 'candlestick'
        )
        const volume = this.chartOptions.series.find(
          (series) => series.id === 'volume'
        )
        candlestick.data = !data.error ? data : []
        volume.data = !data.error
          ? data.map((item) => {
              return {
                x: item.x,
                y: item.volume,
                color: item.open < item.close ? '#fa3032' : '#29b061'
              }
            })
          : []
        await this.$nextTick()

        // 客製化
        chart.renderer
          .text('開：', 10, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.openPrice = chart.renderer
          .text('', 45, 80)
          .css({
            color: '#f45651',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('高：', 110, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.highPrice = chart.renderer
          .text('', 145, 80)
          .css({
            color: '#f45651',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('低：', 210, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.lowPrice = chart.renderer
          .text('', 245, 80)
          .css({
            color: '#45c46e',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('收：', 310, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.closePrice = chart.renderer
          .text('', 345, 80)
          .css({
            color: '#45c46e',
            fontSize: '18px'
          })
          .add()
        chart['5ma'] = chart.renderer
          .text('5MA：', 10, 120)
          .css({
            color: '#ffec71',
            fontSize: '18px'
          })
          .add()
        chart['10ma'] = chart.renderer
          .text('10MA：', 145, 120)
          .css({
            color: '#ff7d8b',
            fontSize: '18px'
          })
          .add()
        chart['20ma'] = chart.renderer
          .text('20MA：', 295, 120)
          .css({
            color: '#4b96eb',
            fontSize: '18px'
          })
          .add()
        chart['60ma'] = chart.renderer
          .text('10MA：', 445, 120)
          .css({
            color: '#7bff86',
            fontSize: '18px'
          })
          .add()
        chart['200ma'] = chart.renderer
          .text('10MA：', 595, 120)
          .css({
            color: '#fddb48',
            fontSize: '18px'
          })
          .add()
        chart.volume = chart.renderer
          .text('成交量：', 10, 430)
          .css({
            color: 'white',
            fontSize: '16px'
          })
          .add()
        chart.K = chart.renderer
          .text('K9：', 10, 520)
          .css({
            color: 'rgb(255, 125, 139)',
            fontSize: '16px'
          })
          .add()
        chart.D = chart.renderer
          .text('D9：', 110, 520)
          .css({
            color: 'rgb(75, 150, 235)',
            fontSize: '16px'
          })
          .add()

        chart.options.tooltip.formatter = function() {
          const candlestickPoint = this.points.find(
            (point) => point.series.name === 'candlestick(2330)'
          )
          const fiveMA = this.points.find(
            (point) => point.series.name === 'ma(5)'
          )
          const tenMA = this.points.find(
            (point) => point.series.name === 'ma(10)'
          )
          const twentyMA = this.points.find(
            (point) => point.series.name === 'ma(20)'
          )
          const sixtyMA = this.points.find(
            (point) => point.series.name === 'ma(60)'
          )
          const twoHundredMA = this.points.find(
            (point) => point.series.name === 'ma(200)'
          )
          const volume = this.points.find(
            (point) => point.series.name === '成交量'
          )
          const KD = this.points.find((point) => point.series.name === 'KD')

          const { open, high, low, close } = vm.$lodash.get(
            candlestickPoint,
            'point',
            {
              open: 0,
              high: 0,
              low: 0,
              close: 0
            }
          )
          const { y: fiveMAPrice } = vm.$lodash.get(fiveMA, 'point', {
            y: 0
          })
          const { y: tenMAPrice } = vm.$lodash.get(tenMA, 'point', {
            y: 0
          })
          const { y: twentyMAPrice } = vm.$lodash.get(twentyMA, 'point', {
            y: 0
          })
          const { y: sixtyMAPrice } = vm.$lodash.get(sixtyMA, 'point', {
            y: 0
          })
          const { y: twoHundredMAPrice } = vm.$lodash.get(
            twoHundredMA,
            'point',
            {
              y: 0
            }
          )
          const { y: volumeData } = vm.$lodash.get(volume, 'point', {
            y: 0
          })
          const { y: K, smoothed: D } = vm.$lodash.get(KD, 'point', {
            y: 0,
            smoothed: 0
          })

          chart.openPrice.attr({
            text: open
          })
          chart.highPrice.attr({
            text: high
          })
          chart.lowPrice.attr({
            text: low
          })
          chart.closePrice.attr({
            text: close
          })
          chart['5ma'].attr({
            text: `5MA：${fiveMAPrice.toFixed(1)}`
          })
          chart['10ma'].attr({
            text: `10MA：${tenMAPrice.toFixed(1)}`
          })
          chart['20ma'].attr({
            text: `20MA：${twentyMAPrice.toFixed(1)}`
          })
          chart['60ma'].attr({
            text: `60MA：${sixtyMAPrice.toFixed(1)}`
          })
          chart['200ma'].attr({
            text: `200MA：${twoHundredMAPrice.toFixed(1)}`
          })
          chart.volume.attr({
            text: `成交量：${volumeData.toLocaleString()}`
          })
          chart.K.attr({
            text: `K9：${K.toFixed(2)}`
          })
          chart.D.attr({
            text: `D9：${D.toFixed(2)}`
          })
          return ''
        }
        this.$lodash.last(chart.series[0].points).onMouseOver()
        chart.hideLoading()
      })
    },
    async chartLoaded2(chart) {
      chart.showLoading()
      this.chartOptions2.series[0].data = [
        { x: 1589792940000, y: 293 },
        { x: 1589793540000, y: 293.5 },
        { x: 1589794140000, y: 293.2 },
        { x: 1589794740000, y: 291 },
        { x: 1589795340000, y: 292 },
        { x: 1589795940000, y: 291.5 },
        { x: 1589796540000, y: 291.5 },
        { x: 1589797140000, y: 292 },
        { x: 1589797740000, y: 292 },
        { x: 1589798340000, y: 292.5 },
        { x: 1589798940000, y: 292 },
        { x: 1589799540000, y: 292 },
        { x: 1589800140000, y: 291.5 },
        { x: 1589800740000, y: 292 },
        { x: 1589801340000, y: 292.5 },
        { x: 1589801940000, y: 292 },
        { x: 1589802540000, y: 292 },
        { x: 1589803140000, y: 292 },
        { x: 1589803740000, y: 291.5 },
        { x: 1589804340000, y: 291 },
        { x: 1589804940000, y: 291.5 },
        { x: 1589805540000, y: 291 },
        { x: 1589806140000, y: 290.5 },
        { x: 1589806740000, y: 290.5 },
        { x: 1589807340000, y: 290.5 },
        { x: 1589807940000, y: 290 },
        { x: 1589808540000, y: 290.5 }
      ]
      this.chartOptions2.series[0].threshold = this.chartOptions2.series[0].data[0].y
      await this.$nextTick()
      await new Promise((resolve) => setTimeout(resolve, 3000))
      chart.hideLoading()
    }
  }
}
</script>

<style lang="scss"></style>
