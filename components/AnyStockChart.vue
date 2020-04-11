<template>
  <div id="container" style="width: 100%; height: 800px;"></div>
</template>

<script>
import { mapActions } from 'vuex'
import anychart from 'anychart'
import '~/node_modules/anychart/dist/css/anychart-ui.min.css'

export default {
  props: {
    stockCode: {
      type: String,
      required: true
    },
    stockName: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  async mounted() {
    const preloader = anychart.ui.preloader()
    preloader.render(document.getElementById('container'))
    preloader.visible(true)

    const result = await this.getStockPriceHistory({
      StockID: this.stockCode,
      Period: 'D',
      Count: (new Date().getFullYear() - 1962) * 365
    })
    if (result.error) return
    const table = anychart.data.table('date')
    table.addData(result)
    // defining the chart type
    const stockChart = anychart.stock()

    // 走勢圖
    stockChart
      .plot(0)
      .xAxis(false)
      .candlestick(
        table.mapAs({
          open: 'open',
          high: 'high',
          low: 'low',
          close: 'close'
        })
      )
      .fallingFill('#29b061')
      .fallingStroke('#29b061')
      .risingStroke('#fa3032')
      .risingFill('#fa3032')
      .name(this.stockName)

    // 在走勢圖加上 EMA
    stockChart
      .plot(0)
      .sma(table.mapAs({ value: 'close' }), 20)
      .series()
      .stroke('#0e61cb')
    stockChart
      .plot(0)
      .sma(table.mapAs({ value: 'close' }), 60)
      .series()
      .stroke('#71d3ff')
    stockChart
      .plot(0)
      .sma(table.mapAs({ value: 'close' }), 200)
      .series()
      .stroke('#fddb48')

    // 交易量
    stockChart
      .plot(1)
      .legend(false)
      .xAxis(false)
      .column(table.mapAs({ value: 'volume' }))
      .name('volume')

    // MACD
    const MACD = stockChart
      .plot(2)
      .legend(false)
      .macd(table.mapAs({ value: 'close' }), 12, 26, 9)
    MACD.macdSeries().stroke('#ad6eff')
    MACD.signalSeries().stroke('#fba340')
    MACD.histogramSeries().fill('#7dc0a2')

    // 設定第一張圖表大小
    stockChart.plot(0).bounds(0, '100%', '100%', 500)

    // setting the stockChart title
    stockChart.title(`${this.stockName}(${this.stockCode})歷史走勢圖`)

    // Render the range picker into an instance of a stock stockChart
    anychart.ui
      .rangeSelector()
      .zoomLabelText('Data Range:')
      .render(stockChart)

    // 隱藏時間 bar
    stockChart.scroller().enabled(false)

    // display the stockChart
    stockChart.container('container')
    stockChart.draw()

    // 選擇時間長度
    stockChart.selectRange('Month', 3, 'last-date')

    preloader.visible(false)
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory'])
  }
}
</script>

<style></style>
