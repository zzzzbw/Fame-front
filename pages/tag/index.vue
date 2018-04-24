<template>
  <div>
    <div class="tag-list">
      <a v-for="tag in tags" class="tag-link" @click="changeArticles(tag.name)">
        <span class="tag chip">
            {{tag.name}}
        </span>
      </a>
    </div>
    <transition name="flow" mode="out-in">
      <div class="tag-content" v-if="show">
        <div class="divider"></div>
        <div class="tag-title">{{tagTitle}}</div>
        <ul class="tag-ul">
          <li v-for="article in articles" class="article-title">
            <nuxt-link :to="{ path: '/article/'+article.id }" class="text-primary">{{article.title}}</nuxt-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'

  export default {
    async asyncData () {
      let {data} = await api.getTags()
      return {tags: data}
    },
    data: function () {
      return {
        data: [],
        tags: [],
        articles: [],
        tagTitle: '',
        show: false
      }
    },
    methods: {
      changeArticles (name) {
        let tag = null
        for (let key in this.tags) {
          if (this.tags[key].name === name) {
            tag = this.tags[key]
            break
          }
        }
        if (tag !== null) {
          this.show = false
          this.tagTitle = tag.name
          this.articles = tag.articles
          this.show = true
        }
      }
    }
  }
</script>

<style scoped>
  .tag-list {
    margin-top: 40px;
    margin-bottom: 30px;
    text-align: center;
  }

  .tag-link {
    text-decoration: none;
    text-underline: none;
  }

  .tag {
    background: #f0f1f4;
    border-radius: 5rem;
    color: #727e96;
    margin: .3rem .1rem;
    padding: .1rem .5rem;
  }

  .tag-link .tag:hover {
    background: #acb3c2;
    color: #f0f1f4;
    box-shadow: 0 0 3px rgba(14, 14, 14, 0.3);
    margin-top: -5px;
    transition: all 0.2s;
  }

  .tag-content {
    margin: 20px auto;
    width: 75%;
  }

  .tag-title {
    margin-right: 6px;
    font-size: 24px;
    font-weight: 600;
    color: #34495e;
  }

  .tag-title:before {
    content: "#";
    margin-right: 5px;
    color: #5764c6;
    font-size: 1.2em;
    font-weight: 700;
  }

  .article-title a {
    text-decoration: none;
    font-size: 1.1em;
  }

</style>
