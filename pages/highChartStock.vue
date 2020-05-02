<template>
  <b-container>
    <client-only>
      <highcharts
        :callback="chartLoaded"
        :constructor-type="'stockChart'"
        :options="chartOptions"
      ></highcharts>
    </client-only>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          backgroundColor: '#011f4b',
          borderColor: '#011f4b',
          height: 800
        },
        rangeSelector: {
          enabled: false
        },
        yAxis: [
          {
            labels: {
              align: 'left'
            },
            height: '50%'
          },
          {
            labels: {
              align: 'left'
            },
            top: '50%',
            height: '15%',
            offset: 0
          },
          {
            labels: {
              align: 'left'
            },
            top: '65%',
            height: '10%',
            offset: 0
          },
          {
            labels: {
              align: 'left'
            },
            top: '75%',
            height: '25%',
            offset: 0
          }
        ],
        tooltip: {
          // shape: 'square',
          // headerShape: 'callout',
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
        },
        series: [
          {
            type: 'candlestick',
            id: 'candlestick-2330',
            name: '台積電歷史走勢圖',
            data: [],
            turboThreshold: 0,
            upColor: '#fa3032',
            color: '#29b061',
            dashStyle: 'Dash'
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
            name: 'KD指數',
            linkedTo: 'candlestick-2330',
            yAxis: 2,
            params: {
              period: [9, 9]
            }
          },
          {
            type: 'macd',
            id: 'macd',
            name: 'MACD',
            linkedTo: 'candlestick-2330',
            yAxis: 3,
            color: '#fa3032',
            negativeColor: '#29b061'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory']),
    chartLoaded() {
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
      })
    }
  }
}
</script>

<style lang="scss"></style>
