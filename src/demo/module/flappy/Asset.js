
var Class = require('commonjs/hilo/core/Class');
var EventMixin = require('commonjs/hilo/event/EventMixin');
var LoadQueue = require('commonjs/hilo/loader/LoadQueue');
var TextureAtlas = require('commonjs/hilo/util/TextureAtlas');

// var bg = require('../../img/bg.png');
// var ground = require('../../img/ground.png');
// var ready = require('../../img/ready.png');
// var over = require('../../img/over.png');
// var number = require('../../img/number.png');
// var bird = require('../../img/bird.png');
// var holdback = require('../../img/holdback.png');

var Asset = Class.create({
    Mixes: EventMixin,

    queue: null,
    bg: null,
    ground: null,
    ready: null,
    over: null,
    numberGlyphs: null,
    birdAtlas: null,
    holdback: null,

    load: function(){
        var resources = [
          {id:'bg', src:'images/bg.png'},
          {id:'ground', src:'images/ground.png'},
          {id:'ready', src:'images/ready.png'},
          {id:'over', src:'images/over.png'},
          {id:'number', src:'images/number.png'},
          {id:'bird', src:'images/bird.png'},
          {id:'holdback', src:'images/holdback.png'}
        ];

        this.queue = new LoadQueue();
        this.queue.add(resources);
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },

    onComplete: function(e){
        this.bg = this.queue.get('bg').content;
        this.ground = this.queue.get('ground').content;
        this.ready = this.queue.get('ready').content;
        this.over = this.queue.get('over').content;
        this.holdback = this.queue.get('holdback').content;

        this.birdAtlas = new TextureAtlas({
            image: this.queue.get('bird').content,
            frames: [
                [0, 120, 86, 60],
                [0, 60, 86, 60],
                [0, 0, 86, 60]
            ],
            sprites: {
                bird: [0, 1, 2]
            }
        });

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            0: {image:number, rect:[0,0,60,91]},
            1: {image:number, rect:[61,0,60,91]},
            2: {image:number, rect:[121,0,60,91]},
            3: {image:number, rect:[191,0,60,91]},
            4: {image:number, rect:[261,0,60,91]},
            5: {image:number, rect:[331,0,60,91]},
            6: {image:number, rect:[401,0,60,91]},
            7: {image:number, rect:[471,0,60,91]},
            8: {image:number, rect:[541,0,60,91]},
            9: {image:number, rect:[611,0,60,91]}
        };

        this.queue.off('complete');
        this.fire('complete');
    }
});

module.exports = Asset;
