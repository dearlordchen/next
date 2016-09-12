// App.vue作为vue组件的主入口
<template>
  <h1>to do demo by vuejs</h1>
  <todo></todo>
  <h1>basic use of vuejs</h1>
  <cp-test1></cp-test1>
  <cp-test2 :user-list="names" title="列表组件" :number="3"></cp-test2>
</template>
<style>
    body {
        background-color: #d1c7b7;
    }
</style>
<script>
import CpTest1 from  '../components/cp-test1'
import CpTest2 from  '../components/cp-test2'
import Todo from  '../components/todo'

    export default{
        data(){
            return {
                // 组件自身数据初始化
                msg: 'hello vuejs',
                names: [{
                    id: 1,
                    name: '小气包'
                }, {
                    id: 2,
                    name: '大气包'
                }, {
                    id: 3,
                    name: '大大气包'
                }]
            }
        },
        components: {
            // 这里可以加载其他vue组件
            'cp-test1': CpTest1,
            'cp-test2': CpTest2,
            'todo': Todo
        }
    }
</script>
