var DESERT_FALLING = {
	milkShake: [35, 36, 37, 38, 39],
	coffee: [43, 44, 45, 46, 47],
	cake: [59, 60, 61, 62, 63]
};

module.exports = {
	init: function(catCafe){
		this.catCafe = catCafe;
		this.sprite = catCafe.game.add.sprite(40, 140, 'tileset', 0, catCafe.entitiesGroup);
		this.sprite.anchor.setTo(0.5, 1);
		catCafe.game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.setSize(14, 7, 9, 25);
		this.sprite.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		
		this.milkShakeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 32, catCafe.entitiesGroup);
		this.milkShakeSprite.animations.add('walk', [32, 33], 4, true);
		this.milkShakeSprite.anchor.setTo(0.1, 0.9);
		this.milkShakeSprite.visible = false;
		
		this.coffeeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 40, catCafe.entitiesGroup);
		this.coffeeSprite.animations.add('walk', [40, 41, 42], 4, true);
		this.coffeeSprite.anchor.setTo(0.1, 0.9);
		this.coffeeSprite.visible = false;

		this.cakeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 56, catCafe.entitiesGroup);
		this.cakeSprite.animations.add('walk', [56], 4, true);
		this.cakeSprite.anchor.setTo(0.1, 0.9);
		this.cakeSprite.visible = false;

		this.sprite.addChild(this.milkShakeSprite);
		this.sprite.addChild(this.coffeeSprite);
		this.sprite.addChild(this.cakeSprite);

		this.cursors = catCafe.game.input.keyboard.createCursorKeys();
	},
	pickMilkShake: function(){
		this.milkShakeSprite.visible = true;
		this.coffeeSprite.visible = false;
		this.cakeSprite.visible = false;
		this.currentFood = 'milkShake';
	},
	pickCoffee: function(){
		this.coffeeSprite.visible = true;
		this.milkShakeSprite.visible = false;
		this.cakeSprite.visible = false;
		this.currentFood = 'coffee';
	},
	pickCake: function(){
		this.cakeSprite.visible = true;
		this.coffeeSprite.visible = false;
		this.milkShakeSprite.visible = false;
		this.currentFood = 'cake';
	},
	dropFood: function(){
		this.cakeSprite.visible = false;
		this.coffeeSprite.visible = false;
		this.milkShakeSprite.visible = false;
		var fallSprite = this.catCafe.game.add.sprite(this.sprite.x, this.sprite.y, 'tileset', DESERT_FALLING[this.currentFood][0], this.catCafe.backgroundGroup);
		fallSprite.anchor.setTo(0.1, 0.9);
		if (this._flipped)
			fallSprite.scale.x *= -1;
		fallSprite.animations.add('fall', DESERT_FALLING[this.currentFood], 4, false);
		fallSprite.animations.play('fall');
		this.currentFood = false;
		this.catCafe.setFoodForCurrentOrder();
		this.catCafe.reduceHearts();
	},
	_flipSprite: function(){
		this._flipped = !this._flipped;
		this.sprite.scale.x *= -1;
	},
	update: function(){
		if (this.dead){
			return;
		}
		this.sprite.body.drag.x = 0;
		this.sprite.body.drag.y = 0;
		var idle = true;
		if (this.cursors.left.isDown) {
			idle = false;
	        this.sprite.body.velocity.x = -60;
	        if (!this._flipped){
	        	this._flipSprite();
	        }
	    } else if (this.cursors.right.isDown) {
	    	idle = false;
	        this.sprite.body.velocity.x = 60;
	        if (this._flipped){
	        	this._flipSprite();
	        }
	    } else {
	    	this.sprite.body.velocity.x = 0;
	    }
		
	    if (this.cursors.up.isDown) {
	    	idle = false;
	        this.sprite.body.velocity.y = -40;
	    } else if (this.cursors.down.isDown) {
	    	idle = false;
	    	this.sprite.body.velocity.y = 40;
	    } else {
	    	this.sprite.body.velocity.y = 0;
	    }
	    if (idle){
	    	this.sprite.frame = 0;
	    	this.sprite.animations.stop();
	    	this.milkShakeSprite.animations.stop();
	    	this.coffeeSprite.animations.stop();
	    	this.cakeSprite.animations.stop();
	    } else {
	    	this.sprite.animations.play('walk');
	    	this.milkShakeSprite.animations.play('walk');
	    	this.coffeeSprite.animations.play('walk');
	    	this.cakeSprite.animations.play('walk');
	    }
		
	},
	kill: function(){
		this.dead = true;
		this.sprite.frame = 0;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
    	this.sprite.animations.stop();
	    	
	}
}