<template>
    <div class="cp-test2">
        <p>我是组件cp-test2，将从父级组件中接收列表数据进行展示</p>
        <p>
            :user-list="names"表示把父级组件的数据names传递到子组件的user-list属性中，在html里面需要把驼峰变成短横线分割
        </p>
        <p>传递字符串则使用 title="{{title}}"</p>
        <p>传递数字类型的而数据使用 :number="3"</p>

        <div v-for="(index, item) in userList">
            <span>索引：{{index}}</span><span>id: {{item.id}}</span><span>name: {{item.name}}</span>
        </div>
    </div>
</template>
<style>
    .cp-test2 {
        background-color: #afdfe4;
    }
</style>
<script>
    export default{
        name: 'cp-test2',
        data(){
            return {
                // msg:'hello vue'
            }
        },
        props: {
            userList: {
                type: Array,
                default: () => []
            },
            title: {
                type: String,
                default: '组件标题'
            },
            number: {
                type: Number,
                default: 0
            }
        }
    }
</script>
