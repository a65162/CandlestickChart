import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import indicatorsInit from 'highcharts/indicators/indicators-all'

stockInit(Highcharts)
indicatorsInit(Highcharts)

Vue.use(HighchartsVue)
