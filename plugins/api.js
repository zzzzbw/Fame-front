import {get} from './utils/http'

const api = {
  getArticles (page) {
    let params = {
      page: page,
      limit: 5
    }
    return get('/article', params)
  },
  getArticle (id) {
    return get('/article/' + id)
  },
  getCategories () {
    return get('/category')
  },
  getTags () {
    return get('/tag')
  },
  getPage (title) {
    return get('/page/' + title)
  },
  getArchives () {
    return get('/archive')
  }
}

export default api
