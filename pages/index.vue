<template>
  <b-container class="my-5 py-3">
    <b-tabs
      v-model="currentTab"
      content-class="mt-3"
      lazy
      @activate-tab="showChart"
    >
      <b-tab title="即時走勢" :disabled="$lodash.isNull(priceHistory.data)">
        <div id="container" class="position-relative"></div>
      </b-tab>
      <b-tab title="技術指標">
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
        <div id="container" class="position-relative"></div>
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
      priceHistory: {
        count: 0,
        data: null
      },
      preloader: null,
      stockChart: null,
      dataTable: null,
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
      ],
      prevClosePrice: null
    }
  },
  watch: {
    cycle: 'getStockPriceDataByK'
  },
  mounted() {
    this.showChart(1)
  },
  destroyed() {
    if (this.stockChart) this.stockChart.dispose()
  },
  methods: {
    ...mapActions('api/jiashi', ['getStockPriceHistory']),
    initialChart() {
      // 設定圖表類型
      this.stockChart = this.$Anychart.stock()

      // 定義資料格式
      this.dataTable = this.$Anychart.data.table('date')

      // 設定等待元件
      this.preloader = this.$Anychart.ui.preloader()
      this.preloader.render(document.getElementById('container'))
    },
    async getStockPriceDataByK() {
      // 顯示 loading
      this.preloader.visible(true)
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
      this.priceHistory.data = await this.getStockPriceHistory(options)
      if (this.priceHistory.error) return

      // 移除舊資料
      this.dataTable.removeFirst(this.priceHistory.count)
      this.priceHistory.count = this.priceHistory.data.length

      // 塞入資料源
      this.dataTable.addData(this.priceHistory.data)

      await this.$nextTick()

      // 選擇時間長度
      switch (this.cycle) {
        case 'Day':
          this.stockChart.selectRange('Day', 90, 'last-date')
          break
        case 'Week':
          this.stockChart.selectRange('Week', 60, 'last-date')
          break
        case 'Month':
          this.stockChart.selectRange('Month', 50, 'last-date')
          break
      }

      // 隱藏 loading
      this.preloader.visible(false)
    },
    getStockPriceDataByP() {
      const priceList = this.priceHistory.data.filter(
        (item) => item.open === (this.prevClosePrice || item.open)
      )
      const newData = (priceList.length ? priceList : this.priceHistory.data)[
        Math.floor(
          Math.random() *
            Math.floor(
              (priceList.length ? priceList : this.priceHistory.data).length
            )
        )
      ]

      setTimeout(() => {
        if (this.currentTab === 0) {
          // 塞入資料源
          this.dataTable.addData([
            {
              ...newData,
              date: new Date().getTime()
            }
          ])
          this.prevClosePrice =
            this.$lodash.get(newData, 'close', 0) || this.prevClosePrice
          this.getStockPriceDataByP()
        }
      }, 1000)
    },
    configureKChart() {
      // 設定 anyChart 樣式
      this.stockChart.background().fill('#011f4b 0.2')

      // 設定全域的 tooltip
      this.stockChart.tooltip().titleFormat('{%x}{type:date}')
      this.stockChart.crosshair().xLabel(false)

      // 走勢圖
      const candlestickPanel = this.stockChart.plot(0)
      candlestickPanel.legend().title(false)
      candlestickPanel.crosshair().yLabel(false)
      candlestickPanel
        .xAxis(false)
        .candlestick(
          this.dataTable.mapAs({
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
        .sma(this.dataTable.mapAs({ value: 'close' }), 5)
        .series()
        .stroke('#63f1da')
      candlestickPanel
        .sma(this.dataTable.mapAs({ value: 'close' }), 10)
        .series()
        .stroke('#ad6efe')
      candlestickPanel
        .sma(this.dataTable.mapAs({ value: 'close' }), 20)
        .series()
        .stroke('#0e61cb')
      candlestickPanel
        .sma(this.dataTable.mapAs({ value: 'close' }), 60)
        .series()
        .stroke('#71d3ff')
      candlestickPanel
        .sma(this.dataTable.mapAs({ value: 'close' }), 200)
        .series()
        .stroke('#fddb48')

      // 交易量
      const volumePanel = this.stockChart.plot(1)
      volumePanel.xAxis(false)
      volumePanel.crosshair().yLabel(false)
      volumePanel.legend().title(false)
      volumePanel
        .yAxis()
        .labels()
        .format(function() {
          return this.value.toString().length > 3
            ? `${this.value
                .toString()
                .slice(0, this.value.toString().length - 3)}k`
            : this.value
        })
      const volume5Ma = volumePanel.volumeMa(
        this.dataTable.mapAs({
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
        this.dataTable.mapAs({
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
      const KDPanel = this.stockChart.plot(2)
      KDPanel.xAxis(false)
      KDPanel.crosshair().yLabel(false)
      KDPanel.legend().title(false)
      const KD = KDPanel.stochastic(
        this.dataTable.mapAs({
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
      const MACDPanel = this.stockChart.plot(3)
      const MACD = MACDPanel.macd(
        this.dataTable.mapAs({ value: 'close' }),
        12,
        26,
        9
      )
      // MACDPanel.xAxis(false)
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

      // setting the this.stockChart title
      this.stockChart.title('台積電(2330)歷史走勢圖')

      // display the this.stockChart
      this.stockChart.container('container').draw()

      // 選擇時間長度
      switch (this.cycle) {
        case 'Day':
          this.stockChart.selectRange('Day', 90, 'last-date')
          break
        case 'Week':
          this.stockChart.selectRange('Week', 60, 'last-date')
          break
        case 'Month':
          this.stockChart.selectRange('Month', 50, 'last-date')
          break
      }
    },
    configurePChart() {
      const vm = this
      // 設定 anyChart 樣式
      this.stockChart.background().fill('#011f4b 0.2')

      // 設定全域的 tooltip
      this.stockChart.tooltip().titleFormat(function() {
        return vm.$Anychart.format.dateTime(this.hoveredDate, 'HH:mm:ss')
      })

      // 走勢圖
      const candlestickPanel = this.stockChart.plot(0)
      candlestickPanel.legend().title(false)
      candlestickPanel.crosshair().yLabel(false)
      candlestickPanel.crosshair().xLabel(false)
      candlestickPanel
        .xAxis(false)
        .candlestick(
          this.dataTable.mapAs({
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
        .titleFormat('{%value}{dateTimeFormat:MM-dd}')

      // 設定第一區塊大小及位置
      candlestickPanel.bounds(0, '100%', '100%', 300)

      // setting the this.stockChart title
      this.stockChart.title('模擬台積電(2330)即時走勢圖')

      // display the this.stockChart
      this.stockChart.container('container').draw()
    },
    async showChart(newTabIndex) {
      await this.$nextTick()
      if (this.stockChart) this.stockChart.dispose()
      this.initialChart()
      if (newTabIndex === 1) {
        this.getStockPriceDataByK().then(() => {
          this.configureKChart()
        })
      } else {
        this.getStockPriceDataByP()
        this.configurePChart()
      }
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
