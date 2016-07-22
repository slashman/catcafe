module.exports = {
	init: function(catCafe){
		this.sprite = catCafe.game.add.sprite(40, 140, 'tileset', 0, catCafe.entitiesGroup);
		this.sprite.anchor.setTo(0.5, 1);
		catCafe.game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.setSize(14, 7, 9, 25);
		this.sprite.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
		this.cursors = catCafe.game.input.keyboard.createCursorKeys();
	},
	_flipSprite: function(){
		this._flipped = !this._flipped;
		this.sprite.scale.x *= -1;
	},
	update: function(){
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
	    } else {
	    	this.sprite.animations.play('walk');
	    }
		
	}
}