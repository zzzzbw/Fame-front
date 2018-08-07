<template>
  <div>
    <fame-header/>
    <div class="container">
      <transition name="flow" mode="out-in">
        <nuxt/>
      </transition>
    </div>
    <fame-scroll-top/>
    <fame-footer/>
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
    width: 75%;
    max-width: 960px;
    font-size: 16px;
    position: relative;
  }
</style>
