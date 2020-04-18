import Anychart from '~/node_modules/anychart/dist/js/anychart-base.min'
import '~/node_modules/anychart/dist/js/anychart-ui.min'
import '~/node_modules/anychart/dist/js/anychart-exports.min'
import '~/node_modules/anychart/dist/js/anychart-stock.min'
import '~/node_modules/anychart/dist/css/anychart-ui.min.css'
import '~/node_modules/anychart/dist/fonts/css/anychart-font.min.css'

export default (ctx, inject) => {
  ctx.$Anychart = Anychart
  inject('Anychart', Anychart)

  if (process.client) {
    window.onNuxtReady((root) => {
      ctx.app.head.script.push({
        src: 'https://cdn.anychart.com/releases/8.7.1/locales/zh-tw.js',
        body: true,
        charset: 'UTF-8'
      })
      root.$meta().refresh()

      // 設定輸出語言
      Anychart.format.outputLocale('zh-tw')
    })
  }
}
