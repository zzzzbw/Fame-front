<template>
  <div class="markdown-body" v-html="content" v-highlight>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'

  export default {
    asyncData () {
      return api.getPage('About').then((res) => {
        return {content: res.data.content}
      })
    },
    data: function () {
      return {
        content: ''
      }
    }
  }
</script>
