var DESERT_FALLING = {
	milkShake: [35, 36, 37, 38, 39],
	coffee: [43, 44, 45, 46, 47],
	cake: [59, 60, 61, 62, 63],
	puddin: [52, 53, 54, 55, 56, 57]
};

module.exports = {
	kitchenCounter: 0,
	init: function(catCafe){
		this.catCafe = catCafe;
		this.sprite = catCafe.game.add.sprite(20, 140, 'tileset', 0, catCafe.entitiesGroup);
		this.sprite.anchor.setTo(0.5, 1);
		catCafe.game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.setSize(14, 7, 9, 25);
		this.sprite.animations.add('walk-tray', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		this.sprite.animations.add('walk', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);
		this.sprite.animations.add('scared', [8, 9, 10], 8, false);
		this.sprite.animations.add('cry', [11, 12], 4, true);
		this.sprite.animations.add('celebrate', [14, 15], 4, true);
		
		this.binSprite = catCafe.game.add.sprite(0, 0, 'tileset', 197, catCafe.entitiesGroup);
		this.binSprite.animations.add('walk', [197, 198, 199, 200, 199, 198], 8, true);
		this.binSprite.anchor.setTo(0.4, 1.0);
		this.binSprite.visible = true;

		this.milkShakeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 32, catCafe.entitiesGroup);
		this.milkShakeSprite.animations.add('walk', [32, 33], 4, true);
		this.milkShakeSprite.anchor.setTo(0.15, 0.85);
		this.milkShakeSprite.visible = false;
		
		this.coffeeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 40, catCafe.entitiesGroup);
		this.coffeeSprite.animations.add('walk', [40, 41, 42], 4, true);
		this.coffeeSprite.anchor.setTo(0.1, 0.85);
		this.coffeeSprite.visible = false;

		this.cakeSprite = catCafe.game.add.sprite(0, 0, 'tileset', 58, catCafe.entitiesGroup);
		this.cakeSprite.animations.add('walk', [58], 4, true);
		this.cakeSprite.anchor.setTo(0.1, 0.85);
		this.cakeSprite.visible = false;

		this.puddinSprite = catCafe.game.add.sprite(0, 0, 'tileset', 48, catCafe.entitiesGroup);
		this.puddinSprite.animations.add('walk', [48, 49, 50, 51], 4, true);
		this.puddinSprite.anchor.setTo(0.1, 0.85);
		this.puddinSprite.visible = false;

		this.sprite.addChild(this.binSprite);
		this.sprite.addChild(this.milkShakeSprite);
		this.sprite.addChild(this.coffeeSprite);
		this.sprite.addChild(this.puddinSprite);
		this.sprite.addChild(this.cakeSprite);

		this.cursors = catCafe.game.input.keyboard.createCursorKeys();
		catCafe.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.onActionDown, this);
		catCafe.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.onActionDown, this);

		if (!catCafe.game.device.desktop){
			this.initDPad();
		}
	},
	initDPad: function(){
		this.pad = this.catCafe.game.plugins.add(Phaser.VirtualJoystick);
		//this.stick = this.pad.addDPad(0, 0, 20, 'dpad');
		this.stick = this.pad.addStick(0, 0, 200, 'generic');
		this.stick.scale = 0.65;
        this.stick.alignBottomLeft(0);
        //this.actionButton = this.pad.addButton(200, 270, 'dpad', 'button1-up', 'button1-down');
        this.actionButton = this.pad.addButton(238, 310, 'generic', 'button1-up', 'button1-down');
        this.actionButton.scale = 0.5;
        this.actionButton.onDown.add(this.onActionDown, this);
	},
	pickMilkShake: function(){
		this.milkShakeSprite.visible = true;
		this.coffeeSprite.visible = false;
		this.binSprite.visible = true;
		this.cakeSprite.visible = false;
		this.puddinSprite.visible = false;
		this.currentFood = 'milkShake';
		this.catCafe.playSFX('Get_Food_From_Kitchen');
	},
	pickCoffee: function(){
		this.coffeeSprite.visible = true;
		this.milkShakeSprite.visible = false;
		this.cakeSprite.visible = false;
		this.puddinSprite.visible = false;
		this.binSprite.visible = true;
		this.currentFood = 'coffee';
		this.catCafe.playSFX('Get_Food_From_Kitchen');
	},
	pickCake: function(){
		this.cakeSprite.visible = true;
		this.coffeeSprite.visible = false;
		this.milkShakeSprite.visible = false;
		this.puddinSprite.visible = false;
		this.binSprite.visible = true;
		this.currentFood = 'cake';
		this.catCafe.playSFX('Get_Food_From_Kitchen');
	},
	pickPuddin: function(){
		this.cakeSprite.visible = false;
		this.coffeeSprite.visible = false;
		this.puddinSprite.visible = true;
		this.milkShakeSprite.visible = false;
		this.binSprite.visible = true;
		this.currentFood = 'puddin';
		this.catCafe.playSFX('Get_Food_From_Kitchen');
	},
	pickNone: function(){
		this.cakeSprite.visible = false;
		this.coffeeSprite.visible = false;
		this.milkShakeSprite.visible = false;
		this.binSprite.visible = false;
		this.puddinSprite.visible = false;
		this.currentFood = false;
	},
	dropTheFood: function(){
		var fallSprite = this.catCafe.game.add.sprite(this.sprite.x, this.sprite.y, 'tileset', DESERT_FALLING[this.currentFood][0], this.catCafe.garbageGroup);
		fallSprite.anchor.setTo(0.1, 0.9);
		if (this._flipped)
			fallSprite.scale.x *= -1;
		fallSprite.animations.add('fall', DESERT_FALLING[this.currentFood], 4, false);
		fallSprite.animations.play('fall');
		this.pickNone();
	},
	dropFood: function(){
		this.dropTheFood();
		this.sprite.animations.play('scared');
		this.scared = true;
		this.catCafe.game.time.events.add(1000, this.recoverMovement, this);
		this.catCafe.resetFoodSprite();
		this.catCafe.reduceHearts();
		this.catCafe.playSFX('Kitten_Drops_Food');
	},
	recoverMovement: function(){
		this.scared = false;
	},
	deliverFood: function(){
		this.pickNone();
		this.catCafe.resetFoodSprite();
		this.catCafe.increaseScore();
		this.catCafe.playSFX('Give_Food_To_Kitten');
	},
	_flipSprite: function(){
		this._flipped = !this._flipped;
		this.sprite.scale.x *= -1;
	},
	isLeftDown: function(){
		return this.cursors.left.isDown || 
			(this.dpad && this.dpad.isDown && this.dpad.direction === Phaser.LEFT) ||
			(this.stick && this.stick.isDown && this.stick.octant >= 135 && this.stick.octant <= 225);
	},
	isRightDown: function(){
		return this.cursors.right.isDown || 
			(this.dpad && this.dpad.isDown && this.dpad.direction === Phaser.RIGHT) ||
			(this.stick && this.stick.isDown && (this.stick.octant <= 45 || this.stick.octant >= 315)) ;
	},
	isJoyLeftDown: function(){
		return (this.stick && this.stick.isDown && this.stick.octant >= 135 && this.stick.octant <= 225);
	},
	isJoyRightDown: function(){
		return (this.stick && this.stick.isDown && (this.stick.octant <= 45 || this.stick.octant >= 315)) ;
	},
	isUpDown: function(){
		return this.cursors.up.isDown || 
			(this.dpad && this.dpad.isDown && this.dpad.direction === Phaser.UP) ||
			(this.stick && this.stick.isDown && this.stick.octant >= 225 && this.stick.octant <= 315);
	},
	isDownDown: function(){
		return this.cursors.down.isDown || 
			(this.dpad && this.dpad.isDown && this.dpad.direction === Phaser.DOWN) ||
			(this.stick && this.stick.isDown && this.stick.octant >= 45 && this.stick.octant <= 135);
	},
	onActionDown: function(){
		if (this.catCafe.titleScreenGroup.visible){
			this.catCafe.titleScreenAction();
		} else if (this.catCafe.onHelpScreen){
			this.catCafe.onHelpScreen = false;
			this.catCafe.arrowSprite.visible = false;
			this.catCafe.helpSprite.visible = false;
			this.catCafe.doStartStage();
		} else if (this.dead || this.catCafe.endingScreenGroup.visible){
			this.catCafe.showTitleScreen();
		} else if (this.catCafe.game.paused){
			this.catCafe.game.paused = false;
			this.catCafe.pauseSprite.visible = false;
		} else {
			this.catCafe.playSFX('Meow');
			this.catCafe.game.paused = true;
			this.catCafe.pauseSprite.visible = true;
		} 
	},
	update: function(){
		if (this.scared || this.dead || !this.catCafe.gameActive){
			return;
		}
		this.sprite.body.drag.x = 0;
		this.sprite.body.drag.y = 0;
		var idle = true;
		if (this.isLeftDown()) {
			idle = false;
	        this.sprite.body.velocity.x = -60;
	        if (!this._flipped){
	        	this._flipSprite();
	        }
	    } else if (this.isRightDown()) {
	    	idle = false;
	        this.sprite.body.velocity.x = 60;
	        if (this._flipped){
	        	this._flipSprite();
	        }
	    } else {
	    	this.sprite.body.velocity.x = 0;
	    }
		
	    if (this.isUpDown()) {
	    	idle = false;
	        this.sprite.body.velocity.y = -40;
	    } else if (this.isDownDown()) {
	    	idle = false;
	    	this.sprite.body.velocity.y = 40;
	    } else {
	    	this.sprite.body.velocity.y = 0;
	    }
	    if (idle){
	    	this.stop();
	    } else {
	    	if (this.binSprite.visible){
	    		this.sprite.animations.play('walk-tray');
	    	} else {
	    	   	this.sprite.animations.play('walk');
	    	}
	    	this.milkShakeSprite.animations.play('walk');
	    	this.coffeeSprite.animations.play('walk');
	    	this.binSprite.animations.play('walk');
	    	this.puddinSprite.animations.play('walk');
	    	this.cakeSprite.animations.play('walk');
	    }
		
	},
	kill: function(){
		this.catCafe.gameMusic.stop();
		this.dead = true;
		if (this.currentFood)
			this.dropTheFood();
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.animations.play('cry');
	},
	stop: function(){
		if (this.binSprite.visible)
			this.sprite.frame = 0;
		else
			this.sprite.frame = 16;
    	this.sprite.animations.stop();
    	this.milkShakeSprite.animations.stop();
    	this.coffeeSprite.animations.stop();
    	this.binSprite.animations.stop();
    	this.binSprite.frame = 197;
    	this.puddinSprite.animations.stop();
    	this.cakeSprite.animations.stop();
	},
	reset: function(){
		this.dead = false;
		this.stop();
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.pickNone();
		this.catCafe.resetFoodSprite();
		this.sprite.frame = 13;
	},
	endStage: function(){
		this.reset();
		this.catCafe.game.time.events.add(500, this.cheer, this);
	},
	cheer: function(){
		this.catCafe.playSFX('Stage_Clear');
		this.sprite.animations.play('celebrate');
	},
	startStage: function(){
		//this.dead = false;
		this.sprite.x = 20;
		this.sprite.y = 140;
		if (this._flipped)
			this._flipSprite();
	}
}