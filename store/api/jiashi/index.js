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
              date: new Date(
                row.getAttribute('V1').replace(/\//g, '-')
              ).getTime(),
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
