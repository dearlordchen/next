var Class = require('commonjs/hilo/core/Class');
var Bitmap = require('commonjs/hilo/view/Bitmap');
var Container = require('commonjs/hilo/view/Container');


var ReadyScene = Class.create({
    Extends: Container,
    constructor: function(properties){
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        //准备Get Ready!
        var getready = new Bitmap({
            image: properties.image,
            rect: [0, 0, 508, 158]
        });

        //开始提示tap
        var tap = new Bitmap({
            image: properties.image,
            rect: [0, 158, 286, 246]
        });

        //确定getready和tap的位置
        tap.x = this.width - tap.width >> 1;
        tap.y = this.height - tap.height + 40 >> 1;
        getready.x = this.width - getready.width >> 1;
        getready.y = tap.y - getready.height >> 0;

        this.addChild(tap, getready);
    }
});

module.exports = ReadyScene;
