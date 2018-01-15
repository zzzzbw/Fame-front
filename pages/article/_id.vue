<template>
  <div>
    <h2 class="article-title text-bold">{{article.title}}</h2>
    <div class="article-info">
      <p class="article-category"><span class="icon-folder"></span> {{article.category | formatCategory}}</p>
      <p class="article-date"><span class="icon-calendar"></span> {{article.created | time('yyyy-MM-dd')}}</p>
      <p class="article-date"><span class="icon-eye"></span> {{article.hits}}</p>
    </div>

    <div class="markdown-body" v-html="article.content" v-highlight>
    </div>
    <div class="article-tags">
      <label class="label-tags">Tags:</label>
      <span v-for="tag in article.tags" class="chip">
        {{tag}}
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'

  export default {
    asyncData ({params}) {
      return api.getArticle(params.id).then((res) => {
        return {article: res.data}
      })
    },
    data: function () {
      return {
        article: {
          id: '',
          title: '',
          date: '',
          category: '',
          tags: [],
          content: ''
        }
      }
    },
    methods: {
      init () {
        this.article.tags = this.$util.stringToTags(this.article.tags)
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

  .article-title {
    color: #24292e;;
    margin-top: 30px;
    font-size: 2.0rem;
    text-align: center;
  }

  .article-info {
    text-align: center;
  }

  .article-date {
    color: #50596c;
    display: inline-block;
    margin-left: 8px;
  }

  .article-category {
    color: #50596c;
    display: inline-block;
    margin-right: 8px;
  }

  .article-tags {
    margin: 15px 0;

  }

  .article-tags .label-tags {
    margin-right: 6px;
    font-size: 16px;
    font-weight: 600;
    color: #34495e;
  }

  .article-tags .chip {
    margin-right: 5px;
  }
</style>
