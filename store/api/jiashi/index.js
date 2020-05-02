export const actions = {
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
              x: new Date(row.getAttribute('V1').replace(/\//g, '-')).getTime(),
              open: Number(row.getAttribute('V4')),
              high: Number(row.getAttribute('V5')),
              low: Number(row.getAttribute('V6')),
              close: Number(row.getAttribute('V7')),
              volume: Number(row.getAttribute('V8'))
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
