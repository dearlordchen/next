/**
 * Created by lordchen on 16/5/17.
 */

import * as mus from '../css/c.scss'
import bar from '../module/bar'
import template from '../mustache/stoo.ma'
import $ from 'jquery'


let html = template({
    "stooges": [
        { "name": "Moe" },
        { "name": "Larry" },
        { "name": "Curly" }
    ]
});

$('.c').html(bar.get());
$('#stoos').html(html);
