module.exports = {
	init: function(catCafe){
		this.catCafe = catCafe;
		this.sprite = catCafe.game.add.sprite(0, 74, 'tileset', 203, catCafe.backgroundGroup);
		this.sprite.animations.add('blink', [201,202], 2, true);
		this.sprite.animations.add('danger', [201,203], 2, true);
		this.sprite.animations.play('blink');
		this.framesToReact = 0;
	},
	update: function(){
		if (!this.doReact()){
			return;
		}
		if (this.catCafe.hasGrumpyCats()){
			this.sprite.animations.play('danger');
		} else {
			this.sprite.animations.play('blink');
		}
	},
	doReact: function(){
		this.framesToReact --;
		if (--this.framesToReact < 0){
			this.framesToReact = 24;
			return true;
		}
		return false;
	}
	
};