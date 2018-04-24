<template>
  <div class="markdown-body" v-html="content" v-highlight>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'

  export default {
    async asyncData () {
      let {data} = await api.getPage('About')
      return {content: data.content}
    }
  }
</script>
