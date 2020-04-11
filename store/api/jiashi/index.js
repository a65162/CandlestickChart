export const actions = {
  getStocksBaseInfo({ commit }, option) {
    return this.$axios
      .get('/jiashi/zdata/mda.xdjxml', {
        responseType: 'document',
        params: {
          x: 'combo_00308'
        }
      })
      .then((response) => {
        return this.$lodash
          .toArray(response.data.querySelectorAll('Row'))
          .map((row) => {
            let type = ''
            switch (row.getAttribute('V3').slice(0, 2)) {
              case 'AS':
                type = '個股'
                break
              case 'AP':
                type = 'ETF'
                break
              case 'AQ':
                type = '權證'
                break
              case 'AR':
                type = '特別股公司債'
                break
              default:
                break
            }
            return {
              嘉實類股代碼: row.getAttribute('V1'),
              category: row.getAttribute('V2'),
              type,
              code: row
                .getAttribute('V3')
                .slice(2, row.getAttribute('V3').length),
              name: row.getAttribute('V4'),
              status: row.getAttribute('V7') === 'A' ? '上市' : '上櫃'
            }
          })
      })
      .catch((err) => {
        return {
          error: true,
          ...err
        }
      })
  },
  getStockPriceHistory({ commit }, options) {
    const { StockID, Period, Count } = options
    return this.$axios
      .get('/jiashi/zdata/mda.xdjxml', {
        responseType: 'document',
        params: {
          x: 'combo_01501',
          StockID,
          Period,
          Count
        }
      })
      .then((res) => {
        return this.$lodash
          .toArray(res.data.querySelectorAll('Row'))
          .map((row) => {
            return {
              date: row.getAttribute('V1'),
              open: row.getAttribute('V4'),
              high: row.getAttribute('V5'),
              low: row.getAttribute('V6'),
              close: row.getAttribute('V7'),
              volume: row.getAttribute('V8')
            }
          })
      })
      .catch((err) => {
        return {
          error: true,
          ...err
        }
      })
  }
}
