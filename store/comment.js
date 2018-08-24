export const state = () => ({
  pagination: {
    list: [],
    total: 0
  }
})

export const mutations = {
  SET_LIST (state, data) {
    state.pagination = data
    // 设置评论的父评论
    for (let comment of state.pagination.list) {
      if (comment.pId && comment.pId !== -1) {
        let pComment = state.pagination.list.find(o => Object.is(o.id, comment.pId))
        if (pComment) {
          comment.pComment = pComment
        }
      }
    }
  },
  AGREE_COMMENT (state, commentId) {
    const comment = state.pagination.list.find(comment => Object.is(comment.id, commentId))
    if (comment) comment.agree++
  },
  DISAGREE_COMMENT (state, commentId) {
    const comment = state.pagination.list.find(comment => Object.is(comment.id, commentId))
    if (comment) comment.disagree++
  }
}
