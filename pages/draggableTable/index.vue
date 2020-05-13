<template>
  <b-container class="bg-white py-5 px-4 mt-5">
    <client-only>
      <b-table-simple hover striped>
        <b-thead>
          <b-tr>
            <b-th v-for="field in fields" :key="field" v-text="field" />
          </b-tr>
        </b-thead>
        <draggable v-model="dragItems" tag="b-tbody" @end="onEnd">
          <b-tr
            v-for="dragItem in dragItems"
            :key="dragItem.name"
            class="draggableTr"
          >
            <b-td
              v-for="field in fields"
              :key="field"
              v-text="dragItem[field]"
            />
          </b-tr>
        </draggable>
      </b-table-simple>
    </client-only>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: ['name', 'order', 'fixed'],
      items: [
        {
          name: 'vue.draggable',
          order: 0,
          fixed: false
        },
        {
          name: 'draggable',
          order: 1,
          fixed: false
        },
        {
          name: 'component',
          order: 2,
          fixed: false
        },
        {
          name: 'for',
          order: 3,
          fixed: false
        },
        {
          name: 'vue.js 2.0',
          order: 4,
          fixed: false
        },
        {
          name: 'based',
          order: 5,
          fixed: false
        },
        {
          name: 'on',
          order: 6,
          fixed: false
        },
        {
          name: 'Sortablejs',
          order: 7,
          fixed: false
        }
      ],
      dragItems: [
        {
          name: 'vue.draggable',
          order: 0,
          fixed: false
        },
        {
          name: 'draggable',
          order: 1,
          fixed: false
        },
        {
          name: 'component',
          order: 2,
          fixed: false
        },
        {
          name: 'for',
          order: 3,
          fixed: false
        },
        {
          name: 'vue.js 2.0',
          order: 4,
          fixed: false
        },
        {
          name: 'based',
          order: 5,
          fixed: false
        },
        {
          name: 'on',
          order: 6,
          fixed: false
        },
        {
          name: 'Sortablejs',
          order: 7,
          fixed: false
        }
      ]
    }
  },
  computed: {
    updateItems() {
      return this.$lodash.xorWith(
        this.dragItems,
        this.items,
        this.$lodash.isEqual
      )
    }
  },
  methods: {
    onEnd() {
      this.dragItems.forEach((dragitem, i) => {
        dragitem.order = i
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.draggableTr {
  cursor: move;
}
</style>
