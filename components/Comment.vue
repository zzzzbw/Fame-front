<template>
  <div class="comment" id="comment">
    <transition-group name="list" tag="span">
      <div class="comment-header" :key="1">
        <span class="total">{{pagination.total}}条评论</span>
        <span class="line"></span>
      </div>
      <div class="comment-box" :key="2">
        <form @submit="submitComment">
          <div class="comment-edit">
            <div class="gravatar">
              <img src="~/assets/img/avator.jpg"/>
            </div>
            <div class="editor">
              <transition-group tag="div" name="list" id="reply">
                <div class="reply" v-if="isReply" :key="1">
                  <div class="reply-name">
                    <span>回复:{{replyComment.name}}</span>
                    <a @click="closeReply"><span class="icon-close"></span></a>
                  </div>
                  <div class="reply-preview markdown-body" v-html="replyComment.content"></div>
                </div>
                <div class="markdown" :key="2">
                  <div class="markdown-editor" :class="{'editing':isEdit}" ref="content" contenteditable="true"
                       :placeholder="placeHolder"
                       @keyup="commentEditListen($event)" @blur="commentBlurListen" @click="commentClickListen"></div>
                </div>
              </transition-group>
            </div>
          </div>
          <div class="comment-user">
            <div class="user-input">
              <div class="name">
                <input v-model="name" required="required" type="text" name="name" placeholder="称呼（必填）" maxlength="10">
              </div>
              <div class="email">
                <input v-model="email" type="email" name="email" placeholder="邮箱（非必填，不会公开）" maxlength="30">
              </div>
              <div class="website">
                <input v-model="website" type="url" name="url" placeholder="网站（http, https:// 开头，非必填）" maxlength="20">
              </div>
            </div>
            <button type="submit" class="submit" :disabled="isComment"><span>{{isComment?'发布中...':'发布'}}</span><i
              class="icon-rocket"></i>
            </button>
          </div>
        </form>
      </div>
      <div class="comment-body" :key="3">
        <transition-group name="list" tag="ul" class="comment-list">
          <li class="comment-item" v-for="comment in comments" :key="comment.id">
            <div class="gravatar">
              <img src="~/assets/img/avator.jpg"/>
            </div>
            <div class="comment-item-body">
              <div class="comment-item-header">
                <a class="user-name">{{comment.name}}</a>
                <span class="comment-date">{{comment.created | time('yyyy.MM.dd hh:mm')}}</span>
              </div>
              <div class="comment-item-content markdown-body">
                <div class="comment-item-reply-box" v-if="comment.pId !== -1 && comment.pComment">
                  <a class="user-name">{{comment.pComment.name}}</a>
                  <div class="comment-item-replay-content" v-html="comment.pComment.content">
                  </div>
                </div>
                <div v-html="comment.content"></div>
              </div>
              <div class="comment-item-footer">
                <a class="comment-item-agree" @click="assessComment(comment.id,'agree')"
                   :class="{active: isAgree(comment.id)}"><span
                  class="icon-thumbs-o-up"></span><span>顶({{comment.agree}})</span></a>
                <a class="comment-item-disagree"
                   @click="assessComment(comment.id,'disagree')" :class="{active: isDisagree(comment.id)}"><span
                  class="icon-thumbs-o-down"></span><span>踩({{comment.disagree}})</span></a>
                <a class="comment-item-reply" @click="replyFor(comment.id,comment.name,comment.content)"><span
                  class="icon-reply"></span><span>回复</span></a>
              </div>
            </div>
          </li>
        </transition-group>
      </div>
    </transition-group>
  </div>
</template>
<script type="text/ecmascript-6">
  import api from '~/plugins/api'
  import FameUtil from '~/plugins/utils/fame'

  const defaultPlaceholder = '写下你的评论...'
  // 设置999不分页
  const defaultLimit = 999
  export default {
    props: ['articleId'],
    data: function () {
      return {
        pagination: Object,
        comments: [],
        commentAgrees: [],
        commentDisagrees: [],
        commentContent: '',
        name: '',
        email: '',
        website: '',
        isEdit: false,
        isComment: false,
        isReply: false,
        replyComment: {
          id: -1,
          name: '',
          content: ''
        },
        placeHolder: defaultPlaceholder
      }
    },
    methods: {
      // 跳转到某条指定的id位置
      toSomeAnchorById (id) {
        FameUtil.goAnchor(id, 120, 60)
      },
      commentClickListen () {
        this.isEdit = true
        this.placeHolder = ''
      },
      commentBlurListen () {
        this.isEdit = false
        if (!this.commentContent || this.commentContent === '') {
          this.placeHolder = defaultPlaceholder
        }
      },
      commentEditListen ($event) {
        this.isEdit = true
        const html = this.$refs.content.innerHTML
        this.commentContent = html
        if (html !== '') {
          this.placeHolder = ''
        }
      },
      closeReply () {
        this.isReply = false
        this.replyComment.id = -1
        this.replyComment.content = ''
        this.replyComment.name = ''
      },
      replyFor (id, name, content) {
        this.isReply = true
        this.replyComment.id = id
        this.replyComment.content = content
        this.replyComment.name = name
        this.toSomeAnchorById('reply')
      },
      clearComment () {
        this.pagination = {}
        this.comments = []
        this.commentContent = ''
        this.name = ''
        this.email = ''
        this.website = ''
        this.isEdit = false
        this.isComment = false
        this.isReply = false
        this.replyComment = {
          id: -1,
          name: '',
          content: ''
        }
        this.$refs.content.innerHTML = ''
        this.placeHolder = defaultPlaceholder
      },
      isAgree (commentId) {
        return this.commentAgrees.includes(commentId)
      },
      isDisagree (commentId) {
        return this.commentDisagrees.includes(commentId)
      },
      async assessComment (commentId, assess) {
        if (assess === 'agree') {
          if (this.isAgree(commentId)) return
        }
        if (assess === 'disagree') {
          if (this.isDisagree(commentId)) return
        }
        const res = await api.assessComment(commentId, assess)
        if (res.success) {
          if (localStorage) {
            let comment
            for (let entity of this.comments) {
              if (entity.id === commentId) {
                comment = entity
                break
              }
            }
            if (!comment) return
            if (assess === 'agree') {
              this.commentAgrees.push(commentId)
              localStorage.setItem('COMMENT_AGREE', JSON.stringify(this.commentAgrees))
              comment.agree = comment.agree + 1
            } else if (assess === 'disagree') {
              this.commentDisagrees.push(commentId)
              localStorage.setItem('COMMENT_DISAGREE', JSON.stringify(this.commentDisagrees))
              comment.disagree = comment.disagree + 1
            }
          }
        } else {
          if (assess === 'agree') {
            alert('赞评论失败')
          }
          if (assess === 'disagree') {
            alert('踩评论失败')
          }
        }
      },
      async submitComment ($event) {
        $event.preventDefault()
        if (this.isComment) {
          alert('请等待发布完成')
        }
        let html = this.commentContent
        if (!html || html === '') {
          return alert('请填写回复内容')
        }
        // contenteditable会把换行添加<div>
        html = html.replace(/<div>/g, '\n')
        html = html.replace(/<\/div>/g, '')
        const lineOverflow = this.commentContent.split('\n').length > 36
        const lengthOverflow = this.commentContent.length > 1000
        if (lineOverflow || lengthOverflow) {
          return alert('请回复内容不超过1000字/36行')
        }
        this.isComment = true
        const res = await api.postComment(this.articleId, this.replyComment.id, html,
          this.name, this.email, this.website)
        this.isComment = false
        if (res.success) {
          this.clearComment()
          this.init()
        } else {
          alert(res.msg)
        }
      },
      async init () {
        const res = await api.getComment(this.articleId, 1, defaultLimit)
        if (res.success) {
          this.pagination = res.data
          this.comments = this.pagination.list
        } else {
          alert('获取评论失败')
          return
        }
        let commentMap = new Map()
        for (let comment of this.comments) {
          commentMap.set(comment.id, comment)
        }
        for (let comment of this.comments) {
          if (comment.pId && comment.pId !== -1) {
            let pComment = commentMap.get(comment.pId)
            if (pComment) {
              comment.pComment = pComment
            }
          }
        }
        if (localStorage) {
          const commentAgrees = localStorage.getItem('COMMENT_AGREE')
          const commentDisagrees = localStorage.getItem('COMMENT_DISAGREE')
          if (commentAgrees) {
            this.commentAgrees = JSON.parse(commentAgrees)
          }
          if (commentDisagrees) {
            this.commentDisagrees = JSON.parse(commentDisagrees)
          }
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>

  .comment {
    font-size: 14px;
  }

  .comment-header {
    position: relative;
    display: flex;
    padding: 16px 0;
    align-items: center;
    justify-content: space-between;
  }

  .comment-header .total {
    position: relative;
    padding-right: 15px;
    color: #24292e;
    background: #fff;
    font-weight: 500;
    z-index: 99;
  }

  .comment-header .line {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    color: #eee;
    background: currentColor;
  }

  .comment-edit {
    width: 100%;
    display: flex;
  }

  .gravatar {
    display: block;
    margin-right: 10px;
    margin-bottom: 5px;
    width: 36px;
    height: 36px;
  }

  .gravatar img {
    width: 100%;
    height: 100%;
    transition: transform .5s ease-out;
    border-radius: 4px;
  }

  .comment-edit .editor {
    flex-grow: 1;
    position: relative;
    max-width: calc(100% - 56px);
  }

  .comment-edit .editor .reply {
    font-size: 14px;
    margin-bottom: 15px;
  }

  .comment-edit .editor .reply .reply-name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .comment-edit .editor .reply .reply-preview {
    max-height: 10em;
    overflow: auto;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .comment-edit .editor .markdown {
    position: relative;
    overflow: hidden;
  }

  .comment-edit .editor .markdown .markdown-editor {
    min-height: 70px;
    max-height: 300px;
    overflow: auto;
    outline: none;
    padding: .5em;
    cursor: auto;
    line-height: 16px;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: all .25s;
  }

  .comment-edit .editor .markdown .markdown-editor:hover {
    border: 1px solid #8391a5;
  }

  .comment-edit .editor .markdown .markdown-editor:before {
    content: attr(placeholder);
    color: rgba(0, 0, 0, .38);
  }

  [contenteditable] {
    caret-color: #24292e;
  }

  .comment-user {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: calc(100% - 56px);
    padding-left: 50px;
    margin-top: 10px;
    line-height: 32px;
  }

  .comment-user div {
    margin-right: 16px;
  }

  .comment-user .name, .comment-user .email, .comment-user .website {
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    flex-grow: 1;
  }

  .comment-user .user-input {
    display: inline-flex;
    flex-wrap: wrap;
  }

  .comment-user input {
    width: 100%;
    height: 16px;
    padding: 5px;
    background: transparent;
    caret-color: #24292e;
    color: #555;
    display: inline-block;
    outline: none;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .comment-user input:hover {
    border-color: #8391a5;
  }

  .comment-user input:focus {
    border-color: #24292e !important;
  }

  .comment-box button {
    height: 32px;
    border: 0;
    padding: 0 8px;
    border-radius: 4px;
    color: #8391a5;
    text-align: center;
    background: transparent;
    outline: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .comment-box button:hover {
    color: #24292e;
    background: rgba(0, 0, 0, .12);
  }

  .comment-box button span {
    margin-right: 8px;
  }

  .editing {
    border-color: #24292e !important;
  }

  .comment-body {
    margin-top: 16px;
  }

  .comment-item {
    margin: 20px 5px;
    width: 100%;
    display: flex;
  }

  .comment-item-body {
    flex-grow: 1;
    position: relative;
    padding: 0 10px;
    max-width: calc(100% - 56px);
  }

  .comment-item-body .comment-item-header {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .comment-item-body .user-name {
    color: rgba(0, 0, 0, .54);
    font-weight: 700;
    font-size: 12px;
    margin-right: 5px;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
  }

  .comment-item-header a:hover {
    text-decoration: underline;
  }

  .comment-item-body .comment-item-content {
    line-height: 30px;
    margin: 10px 0;
    word-wrap: break-word;
  }

  .comment-item-content .comment-item-reply-box {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .comment-item-content .comment-item-reply-box .comment-item-replay-content {
    margin-top: 10px;
  }

  .comment-item-body .comment-item-footer {
    display: flex;
    align-items: center;
    position: relative;
  }

  .comment-item-body .comment-item-footer a {
    color: #8391a5;;
    font-size: 10px;
    margin-right: 15px;
    opacity: .8;
  }

  .comment-item-body .comment-item-footer a:hover, .comment-item-body .comment-item-footer .active {
    color: #ea6f5a;
  }

  .comment-item-body .comment-item-footer a span {
    margin: 2px;
  }

  *, :hover {
    transition: all .25s;
  }

</style>
