<template>
  <div id="container"></div>
</template>

<script>
import { mapActions } from 'vuex'
import anychart from 'anychart'
import '~/node_modules/anychart/dist/css/anychart-ui.min.css'
import '~/node_modules/anychart/dist/fonts/css/anychart-font.min.css'

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
    // 設定輸出語言
    anychart.format.outputLocale('zh-tw')

    // 顯示 loading
    const preloader = anychart.ui.preloader()
    preloader.render(document.getElementById('container'))
    preloader.visible(true)

    // 獲取資料源
    const result = await this.getStockPriceHistory({
      StockID: this.stockCode,
      Period: 'D',
      Count: (new Date().getFullYear() - 1962) * 365
    })
    if (result.error) return
    // 塞入資料源
    const table = anychart.data.table('date')
    table.addData(result)

    // 設定 anyChart 樣式
    anychart.theme(anychart.themes.darkBlue)

    // defining the chart type
    const stockChart = anychart.stock()
    // define the grouping
    const grouping = stockChart.grouping()
    // set the max number of points
    grouping.maxVisiblePoints(60)

    // set the levels of grouping
    grouping.levels([
      { unit: 'week', count: 1 },
      { unit: 'month', count: 1 },
      { unit: 'month', count: 3 },
      { unit: 'month', count: 6 },
      { unit: 'year', count: 1 }
    ])

    // 設定全域的 tooltip
    stockChart.tooltip().titleFormat('{%x}{type:date}')

    // 走勢圖
    const candlestickPanel = stockChart.plot(0)
    candlestickPanel.legend().title(false)
    candlestickPanel.crosshair().yLabel(false)
    candlestickPanel
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
      .tooltip()
      .format(
        '開盤價：{%open}\n最高價：{%high}\n最低價：{%low}\n收盤價：{%close}\n{%value}'
      )

    // 在走勢圖加上 SMA
    candlestickPanel
      .sma(table.mapAs({ value: 'close' }), 20)
      .series()
      .stroke('#0e61cb')
    candlestickPanel
      .sma(table.mapAs({ value: 'close' }), 60)
      .series()
      .stroke('#71d3ff')
    candlestickPanel
      .sma(table.mapAs({ value: 'close' }), 200)
      .series()
      .stroke('#fddb48')

    // 交易量
    const volumePanel = stockChart.plot(1)
    volumePanel.xAxis(false)
    volumePanel.crosshair().yLabel(false)
    volumePanel.legend().title(false)
    volumePanel
      .column(table.mapAs({ value: 'volume' }))
      .name('交易量')
      .tooltip(false)

    // MACD
    const MACDPanel = stockChart.plot(2)
    const MACD = MACDPanel.macd(table.mapAs({ value: 'close' }), 12, 26, 9)
    MACDPanel.xAxis(false)
    MACDPanel.crosshair().yLabel(false)
    MACDPanel.legend().title(false)
    MACD.macdSeries()
      .stroke('#ad6eff')
      .tooltip(false)
    MACD.signalSeries()
      .stroke('#fba340')
      .tooltip(false)
    MACD.histogramSeries()
      .fill('#7dc0a2')
      .tooltip(false)

    // 設定第一區塊大小及位置
    candlestickPanel.bounds(0, '100%', '100%', 500)

    // setting the stockChart title
    stockChart.title(`${this.stockName}(${this.stockCode})歷史走勢圖`)

    // Render the range picker into an instance of a stock stockChart
    const rangeSelector = anychart.ui.rangeSelector()
    const customRanges = [
      {
        text: '日',
        type: 'unit',
        unit: 'day',
        count: 60,
        anchor: 'last-visible-date'
      },
      {
        text: '週',
        type: 'unit',
        unit: 'week',
        count: 60,
        anchor: 'last-visible-date'
      },
      {
        text: '月',
        type: 'unit',
        unit: 'month',
        count: 60,
        anchor: 'last-visible-date'
      },
      {
        text: '季',
        type: 'unit',
        unit: 'month',
        count: 180,
        anchor: 'last-visible-date'
      },
      {
        text: '半年',
        type: 'unit',
        unit: 'month',
        count: 240,
        anchor: 'last-visible-date'
      },
      {
        text: '年',
        type: 'unit',
        unit: 'year',
        count: 60,
        anchor: 'last-visible-date'
      }
    ]

    // Set custom ranges for the range selector.
    rangeSelector.ranges(customRanges)

    rangeSelector.zoomLabelText('週期:').render(stockChart)

    // display the stockChart
    stockChart.container('container').draw()

    // 選擇時間長度
    stockChart.selectRange('Month', 3, 'last-date')

    // 隱藏 loading
    preloader.visible(false)
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory'])
  }
}
</script>

<style>
.anychart-range-selector.anychart-range-selector-inside {
  bottom: 10px;
}
.anychart-credits {
  display: none;
}

#container {
  width: 100%;
  height: 800px;
}

.anychart-menu {
  z-index: 1042;
}
</style>
