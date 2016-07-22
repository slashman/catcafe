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
	
}

function peraCollide(peraSprite, catSprite){
	if (catSprite._cat.deadly){
		if (Pera.currentFood)
			Pera.dropFood();
	}
	peraSprite.body.drag.x = 2000;
	peraSprite.body.drag.y = 2000;
	catSprite.body.drag.x = 2000;
	catSprite.body.drag.y = 2000;
}

function hitBar(){
	if (!Pera.currentFood && CatCafe.currentFood){
		switch (CatCafe.currentFood){
			case 'milkShake':
			Pera.pickMilkShake();
			break;
			case 'coffee':
			Pera.pickCoffee();
			break;
			case 'cake':
			Pera.pickCake();
			break;
		}
		CatCafe.currentFood = false;
		CatCafe.currentFoodSprite.visible = false;
	}
}

var FOOD_TILES = {
	milkShake: 32,
	coffee: 40,
	cake: 56
};

var CatCafe = {
	currentFood: false,
	init: function(){
		this.game = new Phaser.Game(256, 240, Phaser.AUTO, '', { preload: PhaserStates.preload, create: PhaserStates.create, update: PhaserStates.update }, false, false);
	},
	setFoodForCurrentOrder: function(){
		var food = Util.randomElementOf(['cake', 'milkShake', 'coffee']);
		this.currentFood = food;
		this.currentFoodSprite.loadTexture('tileset', FOOD_TILES[food]);
		this.currentFoodSprite.visible = true;
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
		return boundary;
	},
	start: function(){
		this.mainGroup = this.game.add.group();
		this.backgroundGroup = this.game.add.group(this.mainGroup);
		this.entitiesGroup = this.game.add.group(this.mainGroup);
		this.boundariesGroup = this.game.add.group(this.mainGroup);
		this.hudGroup = this.game.add.group();
		this.game.add.sprite(0, 0, 'bground', 0, this.backgroundGroup);
		this.currentFoodSprite = this.game.add.sprite(230, 147, 'tileset', 0, this.backgroundGroup);
		this.currentFoodSprite.visible = false;
		this.addBoundary(0,0,256,118);
		this.addBoundary(0,195,256,45);
		this.bar = this.addBoundary(231,43,24,152);
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
		this.setFoodForCurrentOrder();
	},
	update: function(){
		this.game.physics.arcade.collide(Pera.sprite, this.bar, hitBar, null, this);
		this.game.physics.arcade.collide(this.entitiesGroup, this.boundariesGroup, null, null, this);
		for (var i = 0; i < this.entities.length; i++){
			if (!this.entities[i].sprite.body){
				this.entities.splice(i,1);
				i--;
				continue;
			}
			this.entities[i].update();
		}
		this.game.physics.arcade.collide(Pera.sprite, this.entitiesGroup, peraCollide, null, this);
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
