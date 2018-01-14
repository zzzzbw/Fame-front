<template>
  <div>
    <fame-header></fame-header>
    <div class="container">
      <nuxt/>
    </div>
    <fame-scroll-top></fame-scroll-top>
    <fame-footer></fame-footer>
  </div>
</template>

<script>
  import FameHeader from '~/components/Header.vue'
  import FameFooter from '~/components/Footer.vue'
  import FameScrollTop from '~/components/ScrollTop.vue'

  export default {
    components: {
      FameHeader,
      FameFooter,
      FameScrollTop
    }
  }
</script>

<style>
  .container {
    padding: 1em;
    margin: 65px auto;
    height: 100%;
    max-width: 750px;
    font-size: 16px;
    position: relative;
  }
</style>
