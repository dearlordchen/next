/**
 * 主要演示webpack基本用法以及 require.ensure的用法
 * Created by lordchen on 16/5/17.
 */

require('../css/a.scss');

//var moment = require('moment');
var url = require('commonjs/url');
var report = require('report');
var $ = require('jquery');

var component = url.getQuery('component');


var moment = require('moment');
$('#list').html(moment().format('MMMM Do YYYY, h:mm:ss a'));


//下面用到的$是window.$
if('dialog' === component) {
    require.ensure([], function(require) {
        var dialog = require('dialog');
        // todo ...

        $('#dialog').removeClass('none');
    });
}

if('toast' === component) {
    require.ensure([], function(require) {
        var toast = require('toast');
        // todo ...1213456

        $('#toast').removeClass('none');
    });
}


var logoImg = require('../img/webpack.png');
var $logo = $('<img />').attr('src', logoImg);

$('#logo').html($logo);
