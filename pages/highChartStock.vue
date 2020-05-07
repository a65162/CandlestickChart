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
    </b-tabs>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      currentTab: 1,
      chartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor: 'rgba(1, 31, 75, 0.2)',
          borderColor: '#011f4b',
          height: 800
          // zoomType: 'Y'
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
            height: '55%',
            offset: 0,
            gridLineDashStyle: 'LongDash',
            gridLineColor: 'rgba(230, 230, 230, 0.4)'
          },
          {
            labels: {
              align: 'left'
            },
            top: '55%',
            height: '15%',
            offset: 0,
            gridLineDashStyle: 'LongDash',
            gridLineColor: 'rgba(230, 230, 230, 0.4)'
          },
          {
            labels: {
              align: 'left'
            },
            top: '70%',
            height: '15%',
            offset: 0,
            gridLineDashStyle: 'LongDash',
            gridLineColor: 'rgba(230, 230, 230, 0.4)'
          },
          {
            labels: {
              align: 'left'
            },
            top: '85%',
            height: '15%',
            offset: 0,
            gridLineDashStyle: 'LongDash',
            gridLineColor: 'rgba(230, 230, 230, 0.4)'
          }
        ],
        tooltip: {
          shape: 'square',
          headerShape: 'callout',
          borderWidth: 0,
          shadow: false,
          positioner(width, height, point) {
            const chart = this.chart
            let position

            if (point.isHeader) {
              position = {
                x: Math.max(
                  // Left side limit
                  chart.plotLeft,
                  Math.min(
                    point.plotX + chart.plotLeft - width / 2,
                    // Right side limit
                    chart.chartWidth - width - chart.marginRight
                  )
                ),
                y: point.plotY
              }
            } else {
              position = {
                x: point.series.chart.plotLeft,
                y: point.series.yAxis.top - chart.plotTop
              }
            }

            return position
          }
          // formatter() {
          //   console.log(this)
          // }
        },
        series: [
          {
            type: 'candlestick',
            id: 'candlestick-2330',
            name: '台積電歷史走勢圖',
            data: [],
            turboThreshold: 0,
            upLineColor: '#fa3032',
            upColor: '#fa3032',
            lineColor: '#29b061',
            color: '#29b061'
            // dataLabels: {
            //   enabled: true
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
            color: '#64b5f6',
            smoothedLine: {
              styles: {
                lineColor: '#1976d3'
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
      }).then((data) => {
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
                color: item.open > item.close ? '#fa3032' : '#29b061'
              }
            })
          : []
        chart.hideLoading()
        // chart.renderer
        //   .rect(200, 300, 50, 50)
        //   .attr({
        //     fill: '#f44242',
        //     stroke: 'green',
        //     'stroke-width': 5,
        //     zIndex: 99
        //   })
        //   .add()
        // console.log(chart.get('sma-5'))
        // console.log(chart.renderer)
      })
    }
  }
}
</script>

<style lang="scss"></style>
