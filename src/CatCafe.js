var Pera = require('./Pera');
var Cat = require('./Cat.class');
var Util = require('./Util');

var PhaserStates = {
	preload: function() {
		this.game.load.image('bground', 'img/bground.png');
		this.game.load.image('blank', 'img/blank.png');
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

function dragCollide(obj1, obj2){
	obj1.body.drag.x = 2000;
	obj1.body.drag.y = 2000;
	obj2.body.drag.x = 2000;
	obj2.body.drag.y = 2000;

}
var CatCafe = {
	init: function(){
		this.game = new Phaser.Game(256, 240, Phaser.AUTO, '', { preload: PhaserStates.preload, create: PhaserStates.create, update: PhaserStates.update }, false, false);
	},
	SFX_MAP: {},
	playSFX: function(key){
		this.SFX_MAP[key].play();
	},
	addBoundary: function(x, y, w, h){
		var boundary = this.game.add.sprite(x,y, 'blank', 0, this.boundariesGroup);
		boundary.width = w;
		boundary.height = h;
		this.game.physics.arcade.enable(boundary);
		boundary.body.immovable = true;
	},
	start: function(){
		this.mainGroup = this.game.add.group();
		this.backgroundGroup = this.game.add.group(this.mainGroup);
		this.entitiesGroup = this.game.add.group(this.mainGroup);
		this.boundariesGroup = this.game.add.group(this.mainGroup);
		this.hudGroup = this.game.add.group();
		this.game.add.sprite(0, 0, 'bground', 0, this.backgroundGroup);
		this.addBoundary(0,0,256,118);
		this.addBoundary(0,195,256,45);
		this.addBoundary(231,43,24,152);
		this.addBoundary(0,118,24,16);
		Pera.init(this);
		this.entities = [];
		this.entities.push(Pera);
		for (var i = 0; i < 10; i++){
			var cat = new Cat(this, Pera, Util.rand(32,227), Util.rand(120, 198), Util.rand(0,1) * 32 + 64);
			this.entities.push(cat);
		}
		Pera.sprite.bringToTop();
		this.sortSpritesByDepth();
	},
	update: function(){
		this.game.physics.arcade.collide(this.entitiesGroup, this.boundariesGroup, null, null, this);
		for (var i = 0; i < this.entities.length; i++){
			if (!this.entities[i].sprite.body){
				this.entities.splice(i,1);
				i--;
				continue;
			}
			this.entities[i].update();
		}
		this.game.physics.arcade.collide(this.entitiesGroup, this.entitiesGroup, dragCollide, null, this);
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
	},
	sortSpritesByDepth: function(){
		this.entities.sort(function(a, b) {
		    return a.sprite.y - b.sprite.y;
		});
		for (var i = 0; i < this.entities.length; i++){
			this.entities[i].sprite.bringToTop();
		}
		this.game.time.events.add(500, this.sortSpritesByDepth, this);
	}
}

window.CatCafe = CatCafe;

module.exports = CatCafe;
