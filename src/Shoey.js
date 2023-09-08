// var Util = require('./Util');
import Util from './Util'

var Shoey = {
	init: function(catCafe, x, y){
		this.catCafe = catCafe;
		this.sprite = catCafe.game.add.sprite(x, y, 'tileset', 208, catCafe.backgroundGroup);
		this.sprite.anchor.setTo(0.5, 0.75);
		this.sprite.animations.add('idle', [208, 209, 210, 211, 212, 213], 6, true);
		this.sprite.animations.add('meow', [214, 215, 216, 217, 216, 215], 6, true);
		this.sprite.animations.play('idle');
		this.framesToReact = 0;
	},
	update: function(){
		if (!this.doReact()){
			return;
		}
		if (Util.chance(20)){
			this.sprite.animations.play('meow');
		} else {
			this.sprite.animations.play('idle');
		}
	},
	doReact: function(){
		this.framesToReact --;
		if (--this.framesToReact < 0){
			this.framesToReact = 100;
			return true;
		}
		return false;
	}
	
};

//module.exports = Shoey;
export default Shoey