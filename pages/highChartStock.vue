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
    const vm = this

    return {
      currentTab: 1,
      chartOptions: {
        credits: {
          enabled: false
        },
        annotations: [],
        chart: {
          backgroundColor: 'rgba(1, 31, 75, 0.2)',
          borderColor: '#011f4b',
          height: 800
        },
        rangeSelector: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        plotOptions: {
          sma: {
            marker: {
              enabled: false
            },
            lineWidth: 1
          },
          series: {
            states: {
              hover: {
                enabled: false
              },
              inactive: {
                enabled: false
              }
            }
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
          },
          type: 'datetime',
          labels: {
            formatter() {
              return vm.$moment(this.value).format('MM/DD')
            }
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
            name: 'macd',
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
          // width: 100,
          // height: 40,
          // margin: 0,
          panning: false
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
      chart.showLoading()
      this.getStockPriceHistory({
        StockID: 'AS2330',
        Count: (new Date().getFullYear() - 1962) * 365,
        Period: 'D'
      }).then(async (data) => {
        const vm = this
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
        chart.date = chart.renderer
          .text('日期：', 10, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('開：', 190, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.openPrice = chart.renderer
          .text('', 225, 80)
          .css({
            color: '#f45651',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('高：', 290, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.highPrice = chart.renderer
          .text('', 325, 80)
          .css({
            color: '#f45651',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('低：', 390, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.lowPrice = chart.renderer
          .text('', 425, 80)
          .css({
            color: '#45c46e',
            fontSize: '18px'
          })
          .add()
        chart.renderer
          .text('收：', 490, 80)
          .css({
            color: 'white',
            fontSize: '18px'
          })
          .add()
        chart.closePrice = chart.renderer
          .text('', 525, 80)
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
          .text('成交量：', 10, 440)
          .css({
            color: 'white',
            fontSize: '16px'
          })
          .add()

        chart.K = chart.renderer
          .text('K9：', 10, 530)
          .css({
            color: 'rgb(255, 125, 139)',
            fontSize: '16px'
          })
          .add()
        chart.D = chart.renderer
          .text('D9：', 110, 530)
          .css({
            color: 'rgb(75, 150, 235)',
            fontSize: '16px'
          })
          .add()

        chart.DIF = chart.renderer
          .text('DIF:', 10, 630)
          .css({
            color: '#f2e16e',
            fontSize: '16px'
          })
          .add()
        chart.MACD = chart.renderer
          .text('MACD:', 200, 630)
          .css({
            color: '#4b96eb',
            fontSize: '16px'
          })
          .add()
        chart.DM = chart.renderer
          .text('D-M:', 400, 630)
          .css({
            color: '#75f381',
            fontSize: '16px'
          })
          .add()

        chart.options.tooltip.formatter = function() {
          if (!this.points) return ''
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

          const MACD = this.points.find((point) => point.series.name === 'macd')

          const { x: date, open, high, low, close } = vm.$lodash.get(
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

          const { MACD: DIF, signal, y: DM } = vm.$lodash.get(MACD, 'point', {
            MACD: 0,
            signal: 0
          })

          chart.date.attr({
            text: `日期：${vm.$moment(date).format('YYYY/MM/DD')}`
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

          chart.DIF.attr({
            text: `DIF：${DIF.toFixed(2)}`
          })
          chart.MACD.attr({
            text: `MACD：${signal.toFixed(2)}`
          })
          chart.DM.attr({
            text: `D-M：${DM.toFixed(2)}`
          })
          return ''
        }
        this.chartOptions.annotations.push(
          ...[
            {
              labels: [
                {
                  useHTML: true,
                  backgroundColor: 'white',
                  borderColor: 'white',
                  formatter() {
                    return `
                    <div class="d-flex flex-column align-items-center">
                      <img class="rounded-circle" width="30" height="30" src="https://storage.googleapis.com/quants-images-prod/scantrader/upload/0164aa901d8d00003912000000000000.png" />
                      <span class="mt-2">阿斯匹靈</span>
                    </div>`
                  },
                  point: {
                    x: 1587513600000,
                    y: 300,
                    xAxis: 0,
                    yAxis: 0
                  }
                }
              ]
            },
            {
              labels: [
                {
                  useHTML: true,
                  backgroundColor: 'white',
                  borderColor: 'white',
                  formatter() {
                    return `
                    <div class="d-flex flex-column align-items-center">
                      <img class="rounded-circle" width="30" height="30" src="https://storage.googleapis.com/quants-images-prod/scantrader/upload/0164aa8d62c800003912000000000000.png" />
                      <span class="mt-2">華倫老師</span>
                    </div>`
                  },
                  point: {
                    x: 1585612800000,
                    y: 280,
                    xAxis: 0,
                    yAxis: 0
                  }
                }
              ]
            }
          ]
        )
        this.$lodash.last(chart.series[0].points).onMouseOver()
        chart.hideLoading()
      })
    },
    chartLoaded2(chart) {
      chart.showLoading()
      this.chartOptions2.series[0].data = [
        { x: 1589965740000, y: 7.14 },
        { x: 1589966340000, y: 7.15 },
        { x: 1589966940000, y: 7.15 },
        { x: 1589967540000, y: 7.16 },
        { x: 1589968140000, y: 7.16 },
        { x: 1589968740000, y: 7.15 },
        { x: 1589969340000, y: 7.17 },
        { x: 1589969940000, y: 7.14 },
        { x: 1589970540000, y: 7.15 },
        { x: 1589971140000, y: 7.13 },
        { x: 1589971740000, y: 7.13 },
        { x: 1589972340000, y: 7.14 },
        { x: 1589972940000, y: 7.13 },
        { x: 1589973540000, y: 7.14 },
        { x: 1589974140000, y: 7.13 },
        { x: 1589974740000, y: 7.13 },
        { x: 1589975340000, y: 7.13 },
        { x: 1589975940000, y: 7.15 },
        { x: 1589976540000, y: 7.14 },
        { x: 1589977140000, y: 7.14 },
        { x: 1589977740000, y: 7.15 },
        { x: 1589978340000, y: 7.14 },
        { x: 1589978940000, y: 7.13 },
        { x: 1589979540000, y: 7.13 },
        { x: 1589980140000, y: 7.13 },
        { x: 1589980740000, y: 7.14 },
        { x: 1589981340000, y: 7.15 }
      ]
      const startPrice = this.chartOptions2.series[0].data[0].y
      this.chartOptions2.series[0].threshold = startPrice

      // 讓 startPrice 線在圖表的水平置中
      const lowPrice = this.$lodash.minBy(
        this.chartOptions2.series[0].data,
        'y'
      ).y
      const highPrice = this.$lodash.maxBy(
        this.chartOptions2.series[0].data,
        'y'
      ).y

      const lowPriceMargin = startPrice - lowPrice
      const highPriceMargin = highPrice - startPrice

      if (lowPriceMargin > highPriceMargin) {
        this.chartOptions2.yAxis.max =
          highPrice + (lowPriceMargin - highPriceMargin)
      } else if (highPriceMargin > lowPriceMargin) {
        this.chartOptions2.yAxis.min =
          lowPrice - (highPriceMargin - lowPriceMargin)
      }
      chart.hideLoading()
    }
  }
}
</script>

<style lang="scss"></style>
