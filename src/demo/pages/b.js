/**
 * 这个demo主要演示ui组件的使用以及es6的export和import
 * 这里引用的ui组件都在/src/common/js/ui 目录下，可以参考
 * Created by lordchen on 16/5/17.
 */
import $ from 'jquery'
import d from 'date'
import ui_line from 'ui_line'
import ui_title from 'ui_title'


console.log(d.format(new Date(),'MM/DD YY'))
var cartImg = require('../img/cart.png');
$("#cart").attr('src',cartImg)
$("#title").html(ui_title())
ui_line($("#cont"))
