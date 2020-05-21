import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import annotations from 'highcharts/modules/annotations'
import annotationsadvanced from 'highcharts/modules/annotations-advanced'
import indicatorsInit from 'highcharts/indicators/indicators-all'

stockInit(Highcharts)
indicatorsInit(Highcharts)
annotations(Highcharts)
annotationsadvanced(Highcharts)

Vue.use(HighchartsVue)
