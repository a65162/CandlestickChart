<template>
  <div class="container py-5">
    <h1 class="text-center mb-5">
      台灣個股
    </h1>
    <b-form inline class="mb-4 justify-content-end" @reset.prevent="resetForm">
      <b-form-input
        v-model="filter.name"
        class="mr-3"
        placeholder="請輸入完整股票名稱"
      ></b-form-input>
      <b-form-input
        v-model="filter.code"
        class="mr-3"
        placeholder="請輸入股票代碼"
      ></b-form-input>
      <b-form-select
        v-model="filter.category"
        class="mr-3"
        :options="categoryOptions"
      ></b-form-select>
      <b-form-select
        v-model="filter.type"
        class="mr-3"
        :options="marketTypeOptions"
      ></b-form-select>
      <b-form-select
        v-model="filter.status"
        class="mr-3"
        :options="statusOptions"
      ></b-form-select>
      <b-button type="reset">
        清除
      </b-button>
    </b-form>
    <b-table
      fixed
      hover
      show-empty
      :items="showStocks"
      :busy="!stocks"
      :fields="fields"
      dark
    >
      <template #table-busy>
        <div class="text-muted text-center h4">
          loading...
        </div>
      </template>
      <template #empty>
        <div class="text-info text-center h4">
          找不到資料
        </div>
      </template>
    </b-table>
    <b-pagination
      v-if="stockList && $lodash.get(stockList, 'length', 0) > 1"
      v-model="page"
      align="center"
      :total-rows="stocks.length"
      :per-page="perPage"
      class="mt-5"
    ></b-pagination>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      stocks: null,
      page: 1,
      perPage: 100,
      fields: [
        {
          key: '嘉實類股代碼',
          label: '嘉實類股代碼'
        },
        {
          key: 'stock.name',
          label: '股票名稱'
        },
        {
          key: 'stock.code',
          label: '股票代碼'
        },
        {
          key: 'stock.category',
          label: '產業類別'
        },
        {
          key: 'stock.type',
          label: '金融類別'
        },
        {
          key: 'stock.status',
          label: '股票狀態'
        },
        {
          key: 'operation',
          label: '操作'
        }
      ],
      filter: {
        code: '',
        name: '',
        category: null,
        type: null,
        status: null
      }
    }
  },
  computed: {
    showStocks() {
      if (this.stockList && this.$lodash.get(this.stockList, 'length', 0)) {
        return this.stockList[this.page - 1]
      }
      return null
    },
    stockList() {
      if (this.stocks && this.$lodash.get(this.stocks, 'length', 0)) {
        return this.$lodash.chunk(
          this.stocks.filter((stock) => {
            return (
              (this.filter.code
                ? stock.stock.code.match(this.filter.code)
                : true) &&
              (this.filter.name
                ? stock.stock.name.match(this.filter.name)
                : true) &&
              (this.filter.category
                ? stock.stock.category === this.filter.category
                : true) &&
              (this.filter.type
                ? stock.stock.type === this.filter.type
                : true) &&
              (this.filter.status
                ? stock.stock.status === this.filter.status
                : true)
            )
          }),
          100
        )
      }
      return null
    },
    categoryOptions() {
      if (this.stocks && this.$lodash.get(this.stocks, 'length', 0)) {
        return [
          {
            value: null,
            text: '請選擇產業類別'
          },
          ...this.$lodash.uniqBy(
            this.stocks.map((stock) => {
              return {
                value: stock.stock.category,
                text: stock.stock.category
              }
            }),
            'value'
          )
        ]
      }
      return []
    },
    marketTypeOptions() {
      if (this.stocks && this.$lodash.get(this.stocks, 'length', 0)) {
        return [
          {
            value: null,
            text: '請選擇金融類別'
          },
          ...this.$lodash.uniqBy(
            this.stocks.map((stock) => {
              return {
                value: stock.stock.type,
                text: stock.stock.type
              }
            }),
            'value'
          )
        ]
      }
      return []
    },
    statusOptions() {
      if (this.stocks && this.$lodash.get(this.stocks, 'length', 0)) {
        return [
          {
            value: null,
            text: '請選擇股票狀態'
          },
          ...this.$lodash.uniqBy(
            this.stocks.map((stock) => {
              return {
                value: stock.stock.status,
                text: stock.stock.status
              }
            }),
            'value'
          )
        ]
      }
      return []
    }
  },
  watch: {
    page: 'scrollToTop',
    filter: {
      deep: true,
      handler: 'resetPage'
    }
  },
  mounted() {
    this.getStocksInfo().then((result) => {
      this.stocks = !result.error ? result.data : []
    })
  },
  methods: {
    ...mapActions('api/jiashi', ['getStocksInfo']),
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    resetPage() {
      this.page = 1
    },
    resetForm() {
      this.filter = {
        code: '',
        name: '',
        category: null,
        type: null,
        status: null
      }
    }
  }
}
</script>

<style></style>
