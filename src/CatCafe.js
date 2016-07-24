var Pera = require('./Pera');
var Cat = require('./Cat.class');
var HolyCat = require('./HolyCat.class');
var Util = require('./Util');

var PhaserStates = {
	preload: function() {
		this.game.load.image('bground', 'img/bground.png');
		this.game.load.image('blank', 'img/blank.png');
		this.game.load.image('gameOver', 'img/gameOver.png');
		this.game.load.spritesheet('tileset', 'img/tileset.png', 32, 32);
		this.game.load.spritesheet('ui', 'img/ui.png', 8, 8);
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

function peraCollide(peraSprite, sprite){
	if (sprite._cat){
		if (sprite._cat.deadly){
			if (Pera.currentFood)
				Pera.dropFood();
		}
		peraSprite.body.drag.x = 2000;
		peraSprite.body.drag.y = 2000;
		sprite.body.drag.x = 2000;
		sprite.body.drag.y = 2000;
	}
}

function holyCatCollide(peraSprite, catSprite){
	if (Pera.dead)
		return;
	if (Pera.currentFood){
		catSprite._cat.giveFood();
	}
}

function hitKitchen(){
	if (Pera.dead)
		return;
	if (Pera.kitchenCounter++ < 24){
		return;
	}
	Pera.kitchenCounter = 0;
	switch(Pera.currentFood){
		case false: case undefined:
			Pera.pickMilkShake();
			this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['coffee']);
			break;
		case 'milkShake':
			Pera.pickCoffee();
			this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['cake']);
			break;
		case 'coffee':
			Pera.pickCake();
			this.currentFoodSprite.loadTexture('blank');
			break;
		case 'cake':
			Pera.pickNone();
			this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['milkShake']);
			break;
	}
}

var FOOD_TILES = {
	milkShake: 32,
	coffee: 40,
	cake: 58
};

var SPECS = {
	table: {
		tile: 193,
		w: 15,
		h: 8,
		xoff: 9,
		yoff: 24
	},
	chair: {
		tile: 194,
		w: 13,
		h: 7,
		xoff: 9,
		yoff: 25	
	}
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
		return boundary;
	},
	resetFoodSprite: function(){
		this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['milkShake']);
	},
	addObstacle: function(type, x, y){
		var specs = SPECS[type];
		var boundary = this.game.add.sprite(x,y, 'tileset', specs.tile, this.entitiesGroup);
		this.game.physics.arcade.enable(boundary);
		boundary.body.setSize(specs.w, specs.h, specs.xoff, specs.yoff);
		boundary.body.immovable = true;
		boundary.ycomp = y + 32;
		this.stageSprites.push(boundary);
		return boundary;
	},
	reduceHearts: function(){
		if (this.currentHeart <= 0)
			return;
		this.currentHeart--;
		this.hearts[this.currentHeart].loadTexture('ui', 16);
		if (this.currentHeart === 0){
			Pera.kill();
			this.gameOverSprite.visible = true;
		}
	},
	start: function(){
		this.mainGroup = this.game.add.group();
		this.backgroundGroup = this.game.add.group(this.mainGroup);
		this.entitiesGroup = this.game.add.group(this.mainGroup);
		this.holyCatsGroup = this.game.add.group(this.mainGroup);
		this.boundariesGroup = this.game.add.group(this.mainGroup);
		this.hudGroup = this.game.add.group();
		this.hearts = [];
		this.currentHeart = 10;
		for (var i = 0; i < 10; i++){
			this.hearts[i] = this.game.add.sprite(62 + 10*i, 10, 'ui', 17, this.hudGroup);
		}
		this.scoreDigits = [];
		this.score = 0;
		for (var i = 0; i < 6; i++){
			this.scoreDigits[i] = this.game.add.sprite(62 + 8*i, 20, 'ui', 0, this.hudGroup);
		}
		this.updateScore();
		this.gameOverSprite = this.game.add.sprite(80, 29, 'gameOver', 0, this.hudGroup);
		this.gameOverSprite.visible = false;
		this.game.add.sprite(0, 0, 'bground', 0, this.backgroundGroup);
		this.currentFoodSprite = this.game.add.sprite(8, 82, 'tileset', FOOD_TILES['milkShake'], this.backgroundGroup);
		this.addBoundary(0,0,256,118);
		this.addBoundary(0,195,256,45);
		this.bar = this.addBoundary(240,109,16,87);
		this.kitchen = this.addBoundary(10,97,25,21);

		this.stageSprites = [];

		this.addObstacle('table', 32,108);
		this.addObstacle('table', 80,108);
		this.addObstacle('table', 128,108);
		this.addObstacle('table', 176,108);

		this.addObstacle('table', 64,140);
		this.addObstacle('table', 112,140);
		this.addObstacle('table', 160,140);
		
		this.addObstacle('chair', 217,108);
		this.addObstacle('chair', 217,132);
		this.addObstacle('chair', 217,156);

		Pera.init(this);
		this.entities = [];
		this.entities.push(Pera);
		this.stageSprites.push(Pera.sprite);
		//Add the 3 holy cats
		for (var i = 0; i < 3; i++){
			var cat = new HolyCat(this, Pera, 232, 124+i*24, Util.rand(0,3) * 32 + 64);
			this.entities.push(cat);
		}


		for (var i = 0; i < 3; i++){
			var cat = new Cat(this, Pera, Util.rand(32,227), Util.rand(120, 198), Util.rand(0,3) * 32 + 64);
			this.entities.push(cat);
			this.stageSprites.push(cat.sprite);
		}
		this.sortSpritesByDepth();
	},
	update: function(){
		this.game.physics.arcade.collide(Pera.sprite, this.kitchen, hitKitchen, null, this);
		this.game.physics.arcade.collide(Pera.sprite, this.holyCatsGroup, holyCatCollide, null, this);
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
		this.stageSprites.sort(function(a, b) {
		    //return a.y - b.y;
		    return (a.ycomp ? a.ycomp : a.y) - (b.ycomp ? b.ycomp : b.y);
		});
		for (var i = 0; i < this.stageSprites.length; i++){
			this.stageSprites[i].bringToTop();
		}
		this.game.time.events.add(500, this.sortSpritesByDepth, this);
	},
	increaseScore: function(){
		this.score += 100;
		this.updateScore();
		var cat = new Cat(this, Pera, Util.rand(32,227), Util.rand(120, 198), Util.rand(0,3) * 32 + 64);
		this.entities.push(cat);
		this.stageSprites.push(cat.sprite);
	},
	updateScore: function(){
		for (var i = 0; i < this.scoreDigits.length; i++){
			this.scoreDigits[i].visible = false;
		}
		var strScore = this.score+"";
		for (var i = 0; i < strScore.length; i++){
			this.scoreDigits[i].loadTexture('ui', parseInt(strScore.charAt(i)));
			this.scoreDigits[i].visible = true;
		}
	}
}

window.CatCafe = CatCafe;

module.exports = CatCafe;
