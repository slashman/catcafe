var Util = require('./Util')

function addToArray(array, val){
	var ret = [];
	for (var i = 0; i < array.length; i++){
		ret[i] = array[i]+val;
	}
	return ret;
}

var SPRITES = {
	PREPARE_ATTACK: [0, 1, 2, 3],
	JUMP: [4, 5, 6, 7, 8],
	IDLE: [9, 10, 11, 12, 13, 14],
	IDLE_2_WALK: [16, 17], 
	WALK: [18, 19, 20, 21, 22, 23, 24, 25]
}

function Cat(catCafe, pera, x, y, baseSprite){
	this.catCafe = catCafe;
	this.target = pera;

	this.sprite = catCafe.game.add.sprite(x, y, 'tileset', 0, catCafe.entitiesGroup);
	this.sprite._cat = this;
	this.sprite.anchor.setTo(0.5, 0.75);
	catCafe.game.physics.arcade.enable(this.sprite);
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.setSize(8, 3, 11, 23);
	this.sprite.animations.add('idle', addToArray(SPRITES.IDLE, baseSprite), 6, true);
	this.sprite.animations.add('idle2walk', addToArray(SPRITES.IDLE_2_WALK, baseSprite), 6, false);
	this.sprite.animations.add('walk', addToArray(SPRITES.WALK, baseSprite), 6, true);
	this.sprite.animations.add('prepareAttack', addToArray(SPRITES.PREPARE_ATTACK, baseSprite), 8, true);
	this.sprite.animations.add('jump', addToArray(SPRITES.JUMP, baseSprite), 8, true);
	this.sprite.animations.play('idle');
	this.framesToReact = 0;
};

Cat.prototype = {
	update: function(){
		if (!this.doReact()){
			return;
		}
		this.sprite.body.drag.x = 0;
		this.sprite.body.drag.y = 0;
		if (this.attacking){

		} else if (this.shouldAttack()){
			if ( (this.target.sprite.x > this.sprite.x && this._flipped) || 
				 (this.target.sprite.x < this.sprite.x && !this._flipped) ){
				this._flipSprite();
			}
			this.attacking = true;
			this.sprite.animations.play('prepareAttack' );
			this.sprite.body.velocity.x = 0;
        	this.sprite.body.velocity.y = 0;
        	this.attackVector = this.getDirection();

			// Attack animation is 8 FPS, meaning each frame takes 125ms. 
			// Cat is setting up deadly attack first 4 frames
			this.catCafe.game.time.events.add(4*125, this.jump, this);
			this.catCafe.game.time.events.add(7*125 , this._resetDeadly, this);
			this.catCafe.game.time.events.add(9*125, this._resetMovement, this);
		} else {
			if ( (this.target.sprite.x > this.sprite.x && this._flipped) || 
				 (this.target.sprite.x < this.sprite.x && !this._flipped) ){
				this._flipSprite();
			}

			var idle = true;
			if (this.getCloser()) {
				idle = false;
				var vectors = this.getDirection();
		        this.sprite.body.velocity.x = vectors.x * (30+ Util.rand(0,20));
		        this.sprite.body.velocity.y = vectors.y * 20;
		    } else if (this.getFarther()){
		    	idle = false;
				var vectors = this.getDirection();
		        this.sprite.body.velocity.x = vectors.x * 40 * -1;
		        this.sprite.body.velocity.y = vectors.y * 20 * -1;
		    } else {
		    	this.sprite.body.velocity.x = 0;
		    	this.sprite.body.velocity.y = 0;
		    }
		    if (idle){
		    	this.sprite.animations.play('idle');
		    	this.isWalking = false;
		    } else {
		    	if (!this.isWalking){
		    		this.sprite.animations.play('idle2walk');
		    		this.isWalking = true;
		    	} else {
		    		if (!this.sprite.animations.getAnimation('idle2walk').isPlaying){
		    			this.sprite.animations.play('walk');
		    		}	
		    	}
		    }
		}
	},
	_flipSprite: function(){
		this._flipped = !this._flipped;
		this.sprite.scale.x *= -1;
	},
	doReact: function(){
		this.framesToReact --;
		if (--this.framesToReact < 0){
			this.framesToReact = Math.floor(Math.random()*30)+30;
			return true;
		}
		return false;
	},
	_distanceToTarget: function(){
		return Util.distance(this.sprite.x, this.sprite.y, this.target.sprite.x, this.target.sprite.y);
	},
	shouldAttack: function(){
		return this.target.currentFood && this._distanceToTarget() < 10;
	},
	getCloser: function(){
		return this._distanceToTarget() > 20 && this._distanceToTarget() < 50;
	},
	getFarther: function(){
		return this._distanceToTarget() < 5;
	},
	getDirection: function(){
		return {
			x: Math.sign(this.target.sprite.x - this.sprite.x),
			y: Math.sign(this.target.sprite.y - this.sprite.y)
		}
	}, 
	jump: function(){
		this.deadly = true;
		if (this.attackVector.x === 0)
			this.attackVector.x = 1;
        this.sprite.body.velocity.x = this.attackVector.x * (50+Util.rand(0,20));
        this.sprite.body.velocity.y = this.attackVector.y * 20;
		this.sprite.animations.play('jump');
	},
	_resetDeadly: function(){
		this.deadly = false;
	},
	_resetMovement: function(){
		this.sprite.animations.play('idle');
		this.sprite.body.velocity.x = 0;
		this.attacking = false;
	}
};

module.exports = Cat;