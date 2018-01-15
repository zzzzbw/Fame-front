<template>
  <div>
    <div v-for="article in articles" class="article-item">
      <h3 class="article-head text-bold">
        <nuxt-link :to="{ path: '/article/'+article.id }">{{article.title}}</nuxt-link>
      </h3>
      <p class="article-date"><span class="icon-folder"></span> {{article.category | formatCategory}}</p>
      <p class="article-date text-italic"><span class="icon-calendar"></span> {{article.created | time('yyyy-MM-dd')}}
      </p>
      <p class="article-date"><span class="icon-eye"></span> {{article.hits}}</p>
      <div class="article-tags">
        <label v-for="tag in article.tags" class="chip">
          {{tag}}
        </label>
      </div>
      <div class="article-summary markdown-body" v-html="article.content" v-highlight>
      </div>
      <nuxt-link class="article-more text-primary" :to="{ path: '/article/'+article.id }">Read more</nuxt-link>
    </div>
    <div class="front-page">
      <div class="pre text-primary" v-if="hasPre">
        <nuxt-link :to="{path:'/article', query: { page: pre }}">← Pre</nuxt-link>
      </div>
      <div class="next text-primary" v-if="hasNext">
        <nuxt-link :to="{path:'/article', query: { page: next }}">Next →</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'

  export default {
    asyncData ({params}) {
      return api.getArticles(params.page).then((res) => {
        return {pagination: res.data}
      })
    },
    data: function () {
      return {
        pagination: Object,
        articles: [],
        pre: '',
        hasPre: false,
        next: '',
        hasNext: false
      }
    },
    methods: {
      tagSplit (articles) {
        for (let index in articles) {
          articles[index].tags = this.$util.stringToTags(articles[index].tags)
        }
      },
      init () {
        this.articles = this.pagination.list
        this.tagSplit(this.articles)
        let nowPage = this.pagination.pageNum || 1
        if (nowPage > 1) {
          this.hasPre = true
          this.pre = Number(nowPage) - 1
        } else {
          this.hasPre = false
        }
        if (nowPage < this.pagination.pages) {
          this.hasNext = true
          this.next = Number(nowPage) + 1
        } else {
          this.hasNext = false
        }
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

  .article-item {
    margin-top: 60px;
  }

  .article-head {
    line-height: 1.2;
    font-size: 1.8rem;
    margin: 0;
  }

  .article-head > a {
    color: #34495e;
    outline: none;
    text-decoration: none;
  }

  .article-head > a:hover {
    outline-width: 0;
    text-decoration: underline;
  }

  .article-item .article-date {
    display: inline-block;
    color: #7f8c8d;
    margin: 10px 5px;
    font-size: 0.9em;
  }

  .article-item .article-tags {
    margin-bottom: 10px;
  }

  .article-item .article-more {
    font-weight: 600;
    margin-top: 15px;
    font-size: 16px;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
  }

  .article-item .article-more:hover {
    transform: translateX(10px);
  }

  .front-page {
    margin: 4em 3em;
    font-size: 15px;
    font-weight: 600;

  }

  .front-page a {
    color: #5764c6;
    text-decoration: none;
  }

  .front-page .pre {
    float: left;
  }

  .front-page .next {
    float: right;
  }
</style>
