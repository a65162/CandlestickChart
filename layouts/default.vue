<template>
  <div>
    <header class="header">
      <b-navbar toggleable="md" type="dark">
        <b-navbar-brand>
          <b-img src="/images/logo.png" width="40" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              :to="{
                name: 'anyChartStock'
              }"
              >anyChart</b-nav-item
            >
            <b-nav-item
              :to="{
                name: 'highChartStock'
              }"
              >highCharts</b-nav-item
            >
            <b-nav-item
              :to="{
                name: 'activity'
              }"
              >動態牆</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <nuxt />
  </div>
</template>

<style lang="scss" scoped>
.header {
  background-color: #040303;
}
</style>

<style>
body {
  background-color: #0d101d;
}
</style>
