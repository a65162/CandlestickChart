<template>
  <b-container class="my-5 py-3">
    <b-tabs content-class="mt-3" lazy>
      <b-tab title="即時走勢">
        <div v-if="priceHistory" id="container"></div>
      </b-tab>
      <b-tab title="技術指標" active @click.prevent="selectCycle">
        <div class="mb-3 text-right">
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
        </div>
        <div v-if="priceHistory" id="container"></div>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      priceHistory: null,
      anyChart: {
        preloader: null
      },
      cycle: 'Day',
      cycleOptions: [
        {
          value: 'Day',
          text: '日線'
        },
        {
          value: 'Week',
          text: '週線'
        },
        {
          value: 'Month',
          text: '月線'
        }
      ]
    }
  },
  watch: {
    cycle: 'selectCycle'
  },
  mounted() {
    this.anyChart.preloader = this.$Anychart.ui.preloader()
    this.anyChart.preloader.render()
    this.selectCycle()
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory']),
    showKChart() {
      // 塞入資料源
      const datTable = this.$Anychart.data.table('date')
      datTable.addData(this.priceHistory)

      // 設定圖表類型
      const stockChart = this.$Anychart.stock()

      // 設定 anyChart 樣式
      stockChart.background().fill('#011f4b 0.2')

      // 設定全域的 tooltip
      stockChart.tooltip().titleFormat('{%x}{type:date}')

      // 走勢圖
      const candlestickPanel = stockChart.plot(0)
      candlestickPanel.legend().title(false)
      candlestickPanel.crosshair().yLabel(false)
      candlestickPanel
        .xAxis(false)
        .candlestick(
          datTable.mapAs({
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
        .name('台積電')
        .tooltip()
        .format(
          '開盤價：{%open}\n最高價：{%high}\n最低價：{%low}\n收盤價：{%close}\n{%value}'
        )

      // 在走勢圖加上 SMA
      candlestickPanel
        .sma(datTable.mapAs({ value: 'close' }), 20)
        .series()
        .stroke('#0e61cb')
      candlestickPanel
        .sma(datTable.mapAs({ value: 'close' }), 60)
        .series()
        .stroke('#71d3ff')
      candlestickPanel
        .sma(datTable.mapAs({ value: 'close' }), 200)
        .series()
        .stroke('#fddb48')

      // 交易量
      const volumePanel = stockChart.plot(1)
      volumePanel.xAxis(false)
      volumePanel.crosshair().yLabel(false)
      volumePanel.legend().title(false)
      const volume5Ma = volumePanel.volumeMa(
        datTable.mapAs({
          open: 'open',
          high: 'high',
          low: 'low',
          close: 'close',
          volume: 'volume'
        }),
        5,
        'sma',
        'column'
      )
      volume5Ma
        .volumeSeries()
        .fallingFill('#29b061')
        .fallingStroke('#29b061')
        .risingStroke('#fa3032')
        .risingFill('#fa3032')
        .name('成交量')
        .tooltip(false)
      volume5Ma.maSeries().tooltip(false)
      const volume20Ma = volumePanel.volumeMa(
        datTable.mapAs({
          open: 'open',
          high: 'high',
          low: 'low',
          close: 'close',
          volume: 'volume'
        }),
        20,
        'sma',
        'column'
      )
      volume20Ma
        .volumeSeries()
        .tooltip(false)
        .legendItem(false)
        .enabled(false)
      volume20Ma.maSeries().tooltip(false)

      // KD
      const KDPanel = stockChart.plot(2)
      KDPanel.xAxis(false)
      KDPanel.crosshair().yLabel(false)
      KDPanel.legend().title(false)
      const KD = KDPanel.stochastic(
        datTable.mapAs({
          high: 'high',
          low: 'low',
          close: 'close'
        }),
        9,
        1,
        9
      )
      KD.kSeries().tooltip(false)
      KD.dSeries().tooltip(false)

      // MACD
      const MACDPanel = stockChart.plot(3)
      const MACD = MACDPanel.macd(datTable.mapAs({ value: 'close' }), 12, 26, 9)
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
      candlestickPanel.bounds(0, '100%', '100%', 300)

      // setting the stockChart title
      stockChart.title('台積電(2330)歷史走勢圖')

      // display the stockChart
      stockChart.container('container').draw()

      // 選擇時間長度
      switch (this.cycle) {
        case 'Day':
          stockChart.selectRange('Day', 90, 'last-date')
          break
        case 'Week':
          stockChart.selectRange('Week', 60, 'last-date')
          break
        case 'Month':
          stockChart.selectRange('Month', 50, 'last-date')
          break
      }
    },
    async selectCycle() {
      // 顯示 loading
      this.anyChart.preloader.visible(true)
      this.priceHistory = null
      const options = {
        StockID: 'AS2330',
        Count: (new Date().getFullYear() - 1962) * 365
      }
      switch (this.cycle) {
        case 'Day':
          options.Period = 'D'
          break
        case 'Week':
          options.Period = 'W'
          break
        case 'Month':
          options.Period = 'M'
          break
      }
      // 獲取資料源
      this.priceHistory = await this.getStockPriceHistory(options)
      await this.$nextTick()
      if (this.priceHistory.error) return
      this.showKChart()
      // 隱藏 loading
      this.anyChart.preloader.visible(false)
    }
  }
}
</script>

<style lang="scss">
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

<style lang="scss" scoped>
.cycleSwitch {
  background-color: rgb(33, 39, 75);
  width: 51px;
  height: 32px;
  color: white;
  border: none;
  font-size: 12px;

  &--active {
    color: rgb(255, 204, 161);
  }
}
</style>
