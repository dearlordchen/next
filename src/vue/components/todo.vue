<template>

    <div>
      <input v-model="newTodo" v-on:keyup.enter="addTodo">
  <ul>
    <li v-for="todo in todos">
      <span>{{ todo.text }}</span>
      <button v-on:click="removeTodo($index)">X</button>
    </li>
  </ul>
    </div>
</template>
<style>
    body {
        background-color: #FFF;
    }
    span{
      color: #c77eb5;
    }
    input{
      border: 1px solid;
    }
</style>
<script>
    export default{
        data(){
            return {
              newTodo: 'sing a song',
              todos: [
                 { text: 'Add some todos' }
              ]
            }
        },
        methods: {
          addTodo: function () {
            var text = this.newTodo.trim()
            if (text) {
              this.todos.push({ text: text })
              this.newTodo = ''
            }
          },
          removeTodo: function (index) {
            this.todos.splice(index, 1)
          }
        }
    }
</script>
