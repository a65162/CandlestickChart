export const actions = {
  getStocksInfo({ commit }, option) {
    return this.$axios
      .get('/api/zdata/mda.xdjxml?x=combo_00308', {
        responseType: 'document'
      })
      .then((response) => {
        const data = this.$lodash
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
              stock: {
                category: row.getAttribute('V2'),
                type,
                code: row
                  .getAttribute('V3')
                  .slice(2, row.getAttribute('V3').length),
                name: row.getAttribute('V4'),
                status: row.getAttribute('V7') === 'A' ? '上市' : '上櫃'
              }
            }
          })
        return {
          counts: data.length,
          data
        }
      })
      .catch((err) => {
        return {
          error: true,
          ...err
        }
      })
  }
}
