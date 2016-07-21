var Pera = require('./Pera');
var Cat = require('./Cat.class');
var Util = require('./Util');

var PhaserStates = {
	preload: function() {
		this.game.load.image('bground', 'img/bground.png');
		this.game.load.spritesheet('tileset', 'img/tileset.png', 32, 32);
	},
	create: function() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		CatCafe.start();
	}, 
	update: function() {
		CatCafe.update();
	}
};

var CatCafe = {
	init: function(){
		this.game = new Phaser.Game(256, 240, Phaser.AUTO, '', { preload: PhaserStates.preload, create: PhaserStates.create, update: PhaserStates.update }, false, false);
	},
	SFX_MAP: {},
	playSFX: function(key){
		this.SFX_MAP[key].play();
	},
	start: function(){
		this.mainGroup = this.game.add.group();
		this.hudGroup = this.game.add.group();
		this.game.add.sprite(0, 0, 'bground', 0, this.mainGroup);
		Pera.init(this);
		this.entities = [];
		this.entities.push(Pera);
		for (var i = 0; i < 10; i++){
			var cat = new Cat(this, Pera, Util.rand(32,227), Util.rand(120, 198), Util.rand(0,3) * 16 + 32);
			this.entities.push(cat);
		}
		Pera.sprite.bringToTop();
	},
	update: function(){
		for (var i = 0; i < this.entities.length; i++){
			if (!this.entities[i].sprite.body){
				this.entities.splice(i,1);
				i--;
				continue;
			}
			this.entities[i].update();
		}
	},
	getClosestEntity: function(){
		var minDistance = 99999;
		var closest = false;
		for (var i = 0; i < this.entities.length; i++){
			var entity = this.entities[i];
			if (entity === Pera)
				continue;
			var distance = Util.distance(entity.sprite.x, entity.sprite.y, Pera.sprite.x, Pera.sprite.y);
			if (distance < minDistance){
				minDistance = distance;
				closest = entity;
			}
		}
		return closest;
	}
}

window.CatCafe = CatCafe;

module.exports = CatCafe;
