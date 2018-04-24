<template>
  <div>
    <div class="category-list">
      <a v-for="category in categories" class="category text-bold"
         @click='goAnchor("category-"+category.name)'>
        {{category.name}}({{category.count}})
      </a>
    </div>
    <div class="category-content">
      <div class="divider"></div>
      <div class="category-item" v-for="category in categories">
        <div class="category-title" :id="'category-'+category.name">{{category.name}}</div>
        <ul class="category-ul">
          <li v-for="article in category.articles" class="article-title">
            <nuxt-link :to="{ path: '/article/'+article.id }" class="text-primary">{{article.title}}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '~/plugins/api'
  import FameUtil from '~/plugins/utils/fame'

  export default {
    async asyncData () {
      let {data} = await api.getCategories()
      return {categories: data}
    },
    methods: {
      goAnchor (id) {
        FameUtil.goAnchor(id)
      }
    }
  }
</script>

<style scoped>
  .category-list {
    margin-top: 40px;
    margin-bottom: 30px;
    text-align: center;
  }

  .category-list a:hover {
    text-decoration: underline;
  }

  .category {
    color: #34495e;
    margin: .3rem .1rem;
    padding: .1rem .3rem;
  }

  .category-content {
    margin: 20px auto;
    width: 75%;
  }

  .category-item {
    margin-bottom: 10px;
  }

  .category-title {
    margin-right: 6px;
    font-size: 24px;
    font-weight: 600;
    color: #34495e;
  }

  .category-title:before {
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
