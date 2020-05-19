<template>
  <b-container class="my-5 py-3">
    <b-input v-model="keyword" placeholder="輸入任何文字"> </b-input>
    <client-only>
      <b-list-group class="mt-4">
        <b-list-group-item>
          <text-highlight :queries="queries">
            Cras justo odio
          </text-highlight>
        </b-list-group-item>
        <b-list-group-item>
          <text-highlight :queries="queries">
            Dapibus ac facilisis in
          </text-highlight>
        </b-list-group-item>
        <b-list-group-item>
          <text-highlight :queries="queries">
            Morbi leo risus
          </text-highlight>
        </b-list-group-item>
        <b-list-group-item>
          <text-highlight :queries="queries">
            Porta ac consectetur ac
          </text-highlight>
        </b-list-group-item>
        <b-list-group-item>
          <text-highlight :queries="queries">
            Vestibulum at eros
          </text-highlight>
        </b-list-group-item>
      </b-list-group>
    </client-only>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    queries() {
      return [this.keyword]
    }
  }
}
</script>

<style lang="scss" scoped></style>
