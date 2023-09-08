//var Util = require('./Util')
import Util from './Util'

function addToArray(array, val){
	var ret = [];
	for (var i = 0; i < array.length; i++){
		ret[i] = array[i]+val;
	}
	return ret;
}

var SPRITES = {
	IDLE: [9, 10, 11, 12, 13, 14],
	MEOW: [26, 27, 28, 29, 28, 27]
}

var FOOD_TILES = {
	milkShake: 32,
	coffee: 40,
	cake: 58,
	puddin: 48
};


function HolyCat(catCafe, pera, x, y, baseSprite, vertical){
	this.isHolyCat = true;
	this.meows = baseSprite === 160; //TODO All cats meow
	this.catCafe = catCafe;
	this.target = pera;
	this.sprite = catCafe.game.add.sprite(x, y, 'tileset', 0, catCafe.holyCatsGroup);
	this.sprite._cat = this;
	this.sprite.anchor.setTo(0.5, 0.75);
	catCafe.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.setSize(8, 3, 11, 23);
	this.sprite.animations.add('idle', addToArray(SPRITES.IDLE, baseSprite), 6, true);
	this.framesToReact = 0;

	if (this.meows){
		this.sprite.animations.add('meow', addToArray(SPRITES.MEOW, baseSprite), 6, true);
	}

	this.sprite.animations.play('idle');

	this.globe = catCafe.game.add.sprite(0, 0, 'tileset', 195, catCafe.holyCatsGroup);
	this.sprite.addChild(this.globe);
	this.globe.animations.add('blink', [195,196], 2, true);
	this.globe.visible = false;
	this.globe.anchor.setTo(0.8, 1);

	this.wantedFoodSprite = catCafe.game.add.sprite(0, 0, 'tileset', 32, catCafe.holyCatsGroup);
	this.sprite.addChild(this.wantedFoodSprite);
	this.wantedFoodSprite.visible = false;
	this.wantedFoodSprite.anchor.setTo(0.85, 0.6);
	
	if (vertical){
		this.foodSprite = catCafe.game.add.sprite(x, y+24, 'tileset', 32, catCafe.holyCatsGroup);
	} else {
		this.foodSprite = catCafe.game.add.sprite(x+16, y+16, 'tileset', 32, catCafe.holyCatsGroup);
	}
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
		if (this.dead || this.target.dead)
			return;
		this.wantedFood = Util.randomElementOf(['cake', 'milkShake', 'coffee', 'puddin']);
		this.thinkingOnFood = false;
		this.catCafe.game.time.events.add(15000, this.warnGrumpy, this);
		this.catCafe.game.time.events.add(20000, this.getGrumpy, this);
		this.globe.animations.stop();
		this.globe.frame = 195;
		this.globe.visible = true;
		this.wantedFoodSprite.loadTexture('tileset', FOOD_TILES[this.wantedFood]);
		this.catCafe.playSFX('Meow');
		this.wantedFoodSprite.visible = true;
	},
	warnGrumpy: function(){
		if (this.dead || this.target.dead)
			return;
		if (!this.wantedFood)
			return;
		this.globe.animations.play('blink');
		this.catCafe.playSFX('Kitten_Tired_of_Waiting');
		if (this.meows)
			this.sprite.animations.play('meow');
		this.isGrumpy = true;
	},
	getGrumpy: function(){
		if (this.dead || this.target.dead || !this.catCafe.gameActive)
			return;
		if (!this.wantedFood)
			return;
		this.isGrumpy = false;
		this.catCafe.reduceHearts();
		this.catCafe.playSFX('Kitten_Left');
		this.wantedFood = false;
		this.globe.visible = false;
		this.wantedFoodSprite.visible = false;
		
		this.destroy();
		this.sprite.destroy();
		this.catCafe.busy[this.place] = false;
		this.catCafe.placeHolyCat();
	},
	giveFood: function(){
		if (this.dead || this.target.dead)
			return;
		var foodType = this.target.currentFood;
		if (foodType){
			if (foodType === this.wantedFood){
				this.sprite.animations.play('idle');
				this.target.deliverFood();
				this.wantedFood = false;
				this.isGrumpy = false;
				this.globe.visible = false;
				this.wantedFoodSprite.visible = false;
				this.eating = true;
				this.catCafe.game.time.events.add(20000, this.finishEating, this);
				this.foodSprite.loadTexture('tileset', FOOD_TILES[foodType]);
				this.foodSprite.visible = true;
			} else {
				this.catCafe.playSFX('Wrong_Food');
			}
		}
	},
	finishEating: function(){
		if (this.dead || this.target.dead)
			return;
		this.eating = false;
		this.foodSprite.visible = false;
		this.destroy();
		this.sprite.destroy();
		this.catCafe.busy[this.place] = false;
		this.catCafe.placeHolyCat();
	},
	destroy: function(){
		this.dead = true;
	}
	
};

//module.exports = HolyCat;
export default HolyCat
