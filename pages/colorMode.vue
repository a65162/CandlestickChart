<template>
  <b-container class="colorMode border pt-4 pb-5 px-4 mt-5 text-color">
    <span class="colorMode__label">
      請選擇顏色主題：
    </span>
    <b-form-select
      v-model="$colorMode.value"
      class="mt-3"
      :options="options"
    ></b-form-select>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { value: 'light', text: 'Light Mode' },
        { value: 'dark', text: 'Dark Mode' },
        { value: 'pink', text: 'Pink Mode' }
      ]
    }
  },
  beforeDestroy() {
    this.$colorMode.value = 'dark'
  }
}
</script>

<style lang="scss" scoped>
.colorMode {
  background-color: white;

  &__label {
    color: #0d101d;
  }
}
</style>

<style lang="scss">
.light-mode {
  body {
    background-color: white;
  }

  .colorMode {
    background-color: #0d101d;

    &__label {
      color: white;
    }
  }
}

.pink-mode {
  body {
    background-color: pink;
  }
}
</style>
