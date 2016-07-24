var Util = require('./Util')

function addToArray(array, val){
	var ret = [];
	for (var i = 0; i < array.length; i++){
		ret[i] = array[i]+val;
	}
	return ret;
}

var SPRITES = {
	IDLE: [9, 10, 11, 12, 13, 14]
}

var FOOD_TILES = {
	milkShake: 32,
	coffee: 40,
	cake: 58,
	puddin: 48
};


function HolyCat(catCafe, pera, x, y, baseSprite){
	this.catCafe = catCafe;
	this.target = pera;
	this.sprite = catCafe.game.add.sprite(x, y, 'tileset', 0, catCafe.holyCatsGroup);
	this.sprite._cat = this;
	this.sprite.anchor.setTo(0.5, 0.75);
	catCafe.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.setSize(8, 3, 11, 23);
	this.sprite.animations.add('idle', addToArray(SPRITES.IDLE, baseSprite), 6, true);
	this.sprite.animations.play('idle');
	this.framesToReact = 0;

	this.globe = catCafe.game.add.sprite(0, 0, 'tileset', 195, catCafe.holyCatsGroup);
	this.sprite.addChild(this.globe);
	this.globe.animations.add('blink', [195,196], 2, true);
	this.globe.visible = false;
	this.globe.anchor.setTo(0.8, 1);

	this.wantedFoodSprite = catCafe.game.add.sprite(0, 0, 'tileset', 32, catCafe.holyCatsGroup);
	this.sprite.addChild(this.wantedFoodSprite);
	this.wantedFoodSprite.visible = false;
	this.wantedFoodSprite.anchor.setTo(0.85, 0.6);
		
	this.foodSprite = catCafe.game.add.sprite(x+16, y+16, 'tileset', 32, catCafe.holyCatsGroup);
	this.foodSprite.anchor.setTo(0.5, 0.75);
	this.foodSprite.visible = false;

	this.sprite.scale.x *= -1;
};

HolyCat.prototype = {
	update: function(){
		if (!this.doReact()){
			return;
		}
		if (this.catCafe.gameOver){
			return;
		}
		if (this.eating){
			// Do nothing
		} else if (this.wantedFood){
			// Do nothing
		} else if (this.thinkingOnFood){
			// Do nothing
		} else {
			if (this.askForFood()){
				this.thinkingOnFood = true;
				this.catCafe.game.time.events.add(1000, this.selectFood, this);
			}
		}
	},
	doReact: function(){
		this.framesToReact --;
		if (--this.framesToReact < 0){
			this.framesToReact = Math.floor(Math.random()*30)+30;
			return true;
		}
		return false;
	},
	askForFood: function(){
		return Math.random() > 0.7;
	},
	selectFood: function(){
		if (this.dead)
			return;
		this.wantedFood = Util.randomElementOf(['cake', 'milkShake', 'coffee', 'puddin']);
		this.thinkingOnFood = false;
		this.grumpyTimer = this.catCafe.game.time.events.add(15000, this.warnGrumpy, this);
		this.grumpyTimer = this.catCafe.game.time.events.add(20000, this.getGrumpy, this);
		this.globe.animations.stop();
		this.globe.frame = 195;
		this.globe.visible = true;
		this.wantedFoodSprite.loadTexture('tileset', FOOD_TILES[this.wantedFood]);
		this.wantedFoodSprite.visible = true;
	},
	warnGrumpy: function(){
		if (this.dead)
			return;
		this.globe.animations.play('blink');
	},
	getGrumpy: function(){
		if (this.dead)
			return;
		//this.sprite.animations.play('grumpy');
		this.catCafe.reduceHearts();
		this.wantedFood = false;
		this.globe.visible = false;
		this.wantedFoodSprite.visible = false;
	},
	giveFood: function(){
		if (this.dead)
			return;
		var foodType = this.target.currentFood;
		if (foodType && foodType === this.wantedFood){
			this.catCafe.game.time.events.remove(this.grumpyTimer);
			this.target.deliverFood();
			this.wantedFood = false;
			this.globe.visible = false;
			this.wantedFoodSprite.visible = false;
			this.eating = true;
			this.catCafe.game.time.events.add(20000, this.finishEating, this);
			this.foodSprite.loadTexture('tileset', FOOD_TILES[foodType]);
			this.foodSprite.visible = true;

		}
	},
	finishEating: function(){
		this.eating = false;
		this.foodSprite.visible = false;
	},
	destroy: function(){
		this.dead = true;
		if (this.grumpyTimer)
			this.catCafe.game.time.events.remove(this.grumpyTimer);
	}
	
};

module.exports = HolyCat;