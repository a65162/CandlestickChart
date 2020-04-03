import lodash from 'lodash'

export default (ctx, inject) => {
  ctx.$lodash = lodash
  inject('lodash', lodash)
}
