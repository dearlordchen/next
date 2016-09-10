
var Class = require('commonjs/hilo/core/Class');
var Sprite = require('commonjs/hilo/view/Sprite');
var Stage = require('commonjs/hilo/view/Stage');
var BitmapText = require('commonjs/hilo/view/BitmapText');
var Bitmap = require('commonjs/hilo/view/Bitmap');
var Container = require('commonjs/hilo/view/Container');
var View = require('commonjs/hilo/view/View');
var Hilo = require('commonjs/hilo/core/Hilo');
var Tween = require('commonjs/hilo/tween/Tween');
var Ticker = require('commonjs/hilo/util/Ticker');

var OverScene = Class.create({
    Extends: Container,
    constructor: function(properties){
        OverScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        var board = new Bitmap({
            id: 'board',
            image: properties.image,
            rect: [0, 0, 590, 298]
        });

        var gameover = new Bitmap({
            id: 'gameover',
            image: properties.image,
            rect: [0, 298, 508, 158]
        });

        var startBtn = new Bitmap({
            id: 'start',
            image: properties.image,
            rect: [590, 0, 290, 176]
        });

        var gradeBtn = new Bitmap({
            id: 'grade',
            image: properties.image,
            rect: [590, 176, 290, 176]
        });

        var scoreLabel = new BitmapText({
            id: 'score',
            glyphs: properties.numberGlyphs,
            scaleX: 0.5,
            scaleY: 0.5,
            letterSpacing: 4,
            text: 0
        });

        var bestLabel = new BitmapText({
            id: 'best',
            glyphs: properties.numberGlyphs,
            scaleX: 0.5,
            scaleY: 0.5,
            letterSpacing: 4,
            text: 0
        });

        var whiteMask = new View({
            id: 'mask',
            width: this.width,
            height: this.height,
            alpha: 0.0,
            background:'#fff'
        });

        board.x = this.width - board.width >> 1;
        board.y = this.height - board.height >> 1;
        gameover.x = this.width - gameover.width >> 1;
        gameover.y = board.y - gameover.height - 20;
        startBtn.x = board.x - 5;
        startBtn.y = board.y + board.height + 20 >> 0;
        gradeBtn.x = startBtn.x + startBtn.width + 20 >> 0;
        gradeBtn.y = startBtn.y;
        scoreLabel.x = board.x + board.width - 140 >> 0;
        scoreLabel.y = board.y + 90;
        bestLabel.x = scoreLabel.x;
        bestLabel.y = scoreLabel.y + 105;

        this.addChild(gameover, board, startBtn, gradeBtn, scoreLabel, bestLabel, whiteMask);
    },

    show: function(score, bestScore){
        this.visible = true;
        this.getChildById('score').setText(score);
        this.getChildById('best').setText(bestScore);
        this.getChildById('mask').alpha = 1.0;

        Tween.from(this.getChildById('gameover'), {alpha:0}, {duration:100});
        Tween.from(this.getChildById('board'), {alpha:0, y:this.getChildById('board').y+150}, {duration:200, delay:200});
        Tween.from(this.getChildById('score'), {alpha:0, y:this.getChildById('score').y+150}, {duration:200, delay:200});
        Tween.from(this.getChildById('best'), {alpha:0, y:this.getChildById('best').y+150}, {duration:200, delay:200});
        Tween.from(this.getChildById('start'), {alpha:0}, {duration:100, delay:600});
        Tween.from(this.getChildById('grade'), {alpha:0}, {duration:100, delay:600});
        Tween.to(this.getChildById('mask'), {alpha:0}, {duration:400});
    }
});

module.exports = OverScene;
