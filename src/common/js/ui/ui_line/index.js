/**
 * Created by lordchen on 16/5/24.
 */
import * as index from './index.scss'
import $ from 'jquery'
import template from './stoo.ma'

export default function init(dom) {
    var html = template({
        "stooges": [
            { "name": "cc" },
            { "name": "Larry" },
            { "name": "Curly" }
        ]
    });

     dom.html(html)

     $('.line').click(function(e){
         var _this = $(this)
         alert(_this.html())
     })
}
