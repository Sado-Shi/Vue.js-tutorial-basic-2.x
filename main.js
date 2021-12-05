// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  el: "#app",

  data: {
    todos: [],
    options: [
      {
        value: -1,
        label: 'すべて'
      },
      {
        value: 0,
        label: '作業中'
      },
      {
        value: 1,
        label: '完了'
      }
    ],
    // 選択している options の value を記憶するためのデータ
    // 初期値を「-1」つまり「すべて」にする
    now: -1
  },

  computed: {
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, {
          [b.value]: b.label
        })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    },

    changeTodos: function () {
      // データ now が -1 ならすべて
      // それ以外なら now と state が一致するものだけに絞り込む
      return this.todos.filter(function(el) {
        return this.now < 0 ? true : this.now === el.state
      }, this)
    }
  },

  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // ネストしているデータ(オブジェクト)も監視できるように
      deep: true
    }
  },

  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
  },

  methods: {

    // ★STEP7 ToDo 追加の処理
    doAdd: function () {
      // ref で名前を付けておいた要素を参照
      var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      comment.value = ''
    },

    // ★STEP10 状態変更の処理
    changeState: function (item) {
      item.state = item.state ? 0 : 1
    },

    // ★STEP10 削除の処理
    doDelete: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }

  }
})
