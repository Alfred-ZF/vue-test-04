// import bar from "./bar";
import Vue from 'vue';
import AV from 'leancloud-storage';

var APP_ID = 'hlytujv5TUPkOy5y9GIgGpF1-gzGzoHsz';
var APP_KEY = 'UxdlFiQGRQfmvq0AJwhSWDXN';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app = new Vue({
  el: '#app',

  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',
    currentUser: null,
    formData: {
      username: '',
      password: ''
    },
    showName: ''
  },

  created: function () {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos', dataString)
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []

    this.currentUser = this.getCurrentUser();
  },
  methods: {
    addTodo: function () { //添加事件
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false //添加一个 done 属性
      })
      this.newTodo = ''
      console.log(this.todoList)
    },
    removeTodo: function (todo) { //删除事件
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('注册失败') //
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('登录失败')
      });
    },
    getCurrentUser: function () {
      let current = AV.User.current()
      if (current) {
        let {
          id,
          createdAt,
          attributes: {
            username
          }
        } = current;
        this.showName = username;
        return {
          id,
          username,
          createdAt
        }
      } else {
        return null
      }
    },
    logout: function () {
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    }
  }
})