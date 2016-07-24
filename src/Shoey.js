var Shoey = {
	init: function(catCafe, x, y){
		this.catCafe = catCafe;
		this.sprite = catCafe.game.add.sprite(x, y, 'tileset', 208, catCafe.backgroundGroup);
		this.sprite.anchor.setTo(0.5, 0.75);
		this.sprite.animations.add('idle', [208, 209, 210, 211, 212, 213], 6, true);
		this.sprite.animations.play('idle');
		this.framesToReact = 0;
	},
	update: function(){
		if (!this.doReact()){
			return;
		}
	},
	doReact: function(){
		this.framesToReact --;
		if (--this.framesToReact < 0){
			this.framesToReact = Math.floor(Math.random()*30)+30;
			return true;
		}
		return false;
	}
	
};

module.exports = Shoey;