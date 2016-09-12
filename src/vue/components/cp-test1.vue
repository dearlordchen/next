// App.vue作为vue组件的主入口
<template>
    <div class="cp-test1">
        <div>{{ msg }}</div>
        // v-model="msg"表示在下面的input输入框对msg进行数据双向绑定，修改input的值试试看
        <p><input v-model="msg" placeholder="来啊"/></p>
        <p>
            <button v-on:click="showMsg">点击弹alert</button>
        </p>

        <div>计算属性</div>
        <div>计算前：{{level}}，计算后：{{superLevel}}</div>
    </div>
</template>
<style>
    .cp-test1 {
        background-color: #999;
    }
</style>
<script>
    export default{
        name: 'cp-test1',
        data(){
            return {
                // 组件自身数据初始化
                msg: '我是组件cp-test1',
                level: 1
            }
        },
        components: {
            // 这里可以加载其他vue组件
        },
        methods: {
            showMsg: function () {
                alert(this.msg);
            }
        },
        computed: {
            superLevel: function () {
                return this.level + 5
            }
        }
    }
</script>
