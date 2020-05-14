<template>
  <b-container class="bg-white pt-4 pb-5 px-4 mt-5">
    <client-only>
      <b-table-simple hover striped>
        <b-thead>
          <b-tr>
            <b-th v-for="field in fields" :key="field" v-text="field" />
            <b-th v-text="''" />
          </b-tr>
        </b-thead>
        <draggable
          v-model="dragItems"
          tag="b-tbody"
          handle=".draggableItem"
          @change="onChange"
        >
          <b-tr
            v-for="dragItem in dragItems"
            :key="dragItem.name"
            class="draggableTr"
          >
            <b-td v-for="field in fields" :key="field" class="align-middle">
              <template v-if="field !== 'value'">
                {{ dragItem[field] }}
              </template>
              <template v-else>
                <b-input v-model="dragItem[field]"></b-input>
              </template>
            </b-td>
            <b-td class="align-middle">
              <b-icon class="draggableItem" icon="tools"> </b-icon>
            </b-td>
          </b-tr>
        </draggable>
      </b-table-simple>
    </client-only>
    <b-row>
      <b-col cols="4">
        <h4>更新有更動的資料（{{ onlyUpdateModfiedItems.length }}）：</h4>
        <json-view
          :data="onlyUpdateModfiedItems"
          :deep="2"
          theme="vs-code"
        ></json-view>
      </b-col>
      <b-col cols="4">
        <h4>更新全部資料</h4>
        <json-view :data="updateAllItems" :deep="2" theme="vs-code"></json-view>
      </b-col>
      <b-col v-if="items" cols="4">
        <h4>原始資料：</h4>
        <json-view :data="items" :deep="2" theme="vs-code"></json-view>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: ['name', 'value', 'order'],
      items: null,
      dragItems: null
    }
  },
  computed: {
    onlyUpdateModfiedItems() {
      return this.$lodash.differenceWith(
        this.dragItems,
        this.items,
        this.$lodash.isEqual
      )
    },
    updateAllItems() {
      return !this.$lodash.isEqual(this.dragItems, this.items)
        ? this.dragItems
        : []
    }
  },
  mounted() {
    this.getData([
      {
        name: 'vue.draggable',
        value: '123123',
        order: 0
      },
      {
        name: 'draggable',
        value: '123123',
        order: 1
      },
      {
        name: 'component',
        value: '123123',
        order: 2
      },
      {
        name: 'for',
        value: '123123',
        order: 3
      },
      {
        name: 'vue.js 2.0',
        value: '123123',
        order: 4
      },
      {
        name: 'based',
        value: '123123',
        order: 5
      },
      {
        name: 'on',
        value: '123123',
        order: 6
      },
      {
        name: 'Sortablejs',
        value: '123123',
        order: 7
      }
    ])
  },
  methods: {
    onChange(e) {
      this.dragItems.forEach((dragItem, i) => {
        if (dragItem.order !== i) {
          dragItem.order = i
        }
      })
    },
    getData(data) {
      this.items = this.$lodash.cloneDeep(data)
      this.dragItems = this.$lodash.cloneDeep(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.draggableItem {
  cursor: move;

  &.disabled {
    cursor: default;
  }
}
</style>
