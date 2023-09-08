/*
var Pera = require('./Pera');
var Lali = require('./Lali');
var Shoey = require('./Shoey');
var Cat = require('./Cat.class');
var HolyCat = require('./HolyCat.class');
var Util = require('./Util');
var fakeCrt = require('./FakeCRT');*/
import Pera from './Pera'
import Lali from './Lali'
import Shoey from './Shoey'
import Cat from './Cat.class'
import HolyCat from './HolyCat.class'
import Util from './Util'
import fakeCrt from './FakeCRT'

var TVEmulation = {
	enabled: true,
	strech43: true,
	scanlinesOverlay: true,
	tvBackground: false,
	bulge: false,
	vignette: false
};

var PhaserStates = {
	preload: function() {
		if (!this.game.device.desktop){
			this.game.load.script('joystick', 'phaser-virtual-joystick.min.js');
			//this.game.load.atlas('dpad', 'img/dpad.png', 'dpad.json');
			this.load.atlas('generic', 'img/generic-joystick.png', 'generic-joystick.json');
			this.game.load.image('padbground', 'img/controller_fc.png');
		}
		this.game.load.image('bground', 'img/bground.png');
		this.game.load.image('city', 'img/city.png');
		this.game.load.image('title', 'img/title.png');
		this.game.load.image('ending', 'img/ending.png');
		this.game.load.image('blank', 'img/blank.png');
		this.game.load.image('help', 'img/help.png');
		this.game.load.spritesheet('messages', 'img/messages.png', 128, 8);
		this.game.load.spritesheet('tileset', 'img/tileset.png', 32, 32);
		this.game.load.spritesheet('ui', 'img/ui.png', 8, 8);
		this.game.load.spritesheet('title-tiles', 'img/title-tiles-256-64.png', 256, 64);

		this.game.load.audio('menu', ['ogg/menu.ogg', 'mp3/menu.mp3']);
		this.game.load.audio('game', ['ogg/game.ogg', 'mp3/game.mp3']);
		this.game.load.audio('cats', ['ogg/cats.ogg', 'mp3/cats.mp3']);

		this.game.load.audio('Get_Food_From_Kitchen', ['wav/Get_Food_From_Kitchen.wav']);
		this.game.load.audio('Give_Food_To_Kitten', ['wav/Give_Food_To_Kitten.wav']);
		this.game.load.audio('Kitten_Drops_Food', ['wav/Kitten_Drops_Food.wav']);
		this.game.load.audio('Kitten_Jumps', ['wav/Kitten_Jumps.wav']);
		this.game.load.audio('Kitten_Left', ['wav/Kitten_Left.wav']);
		this.game.load.audio('Kitten_Tired_of_Waiting', ['wav/Kitten_Tired_of_Waiting.wav']);
		this.game.load.audio('Wrong_Food', ['wav/Wrong_Food.wav']);
		this.game.load.audio('Meow', ['wav/Meow.wav']);
		this.game.load.audio('Meow(2)', ['wav/Meow(2).wav']);
		this.game.load.audio('Purr', ['wav/Purr.wav']);
		this.game.load.audio('Stage_Clear', ['wav/Stage_Clear.wav']);
		this.game.load.audio('Start_Game', ['wav/Start_Game.wav']);
	},
	create: function() {
		if (TVEmulation.strech43 && this.game.device.desktop){
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.setResizeCallback(CatCafe.recalcUserScale, CatCafe);
			CatCafe.recalcUserScale();
		} else {
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	
		}
		this.scale.pageAlignHorizontally = true;
		CatCafe.start();
	}, 
	update: function() {
		CatCafe.update();
	}
};

function getRatio (w, h) {
	var width = window.innerWidth;
    var height = window.innerHeight;
	var dips = window.devicePixelRatio;
    width = width * dips;
    height = height * dips;
    var scaleX = width / w;
    var scaleY = height / h;
    return {
        x: scaleX > scaleY ? scaleY : scaleX,
        y: scaleX > scaleY ? scaleY : scaleX
    };
}

function getDeviceH2WRatio(){
	var width = window.innerWidth;
    var height = window.innerHeight;
	var dips = window.devicePixelRatio;
    width = width * dips;
    height = height * dips;
    return height/width;
}


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
			this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['puddin']);
			break;
		case 'cake':
			Pera.pickPuddin();
			this.currentFoodSprite.loadTexture('blank');
			break;
		case 'puddin':
			Pera.pickNone();
			this.currentFoodSprite.loadTexture('tileset', FOOD_TILES['milkShake']);
			break;
	}
}

var FOOD_TILES = {
	milkShake: 32,
	coffee: 40,
	cake: 58,
	puddin: 48
};

var SPECS = {
	table: {
		tile: 192,
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

function setTVFrame(){
	if (!TVEmulation.enabled){
		return;
	}
	if (TVEmulation.bulge || TVEmulation.vignette){
		fakeCrt(TVEmulation);
	} else if (TVEmulation.scanlinesOverlay){
		CatCafe.relocateTVOverlay();
	}
	if (TVEmulation.tvBackground){
		var body = document.getElementsByTagName('body')[0];
		body.style.backgroundImage = "url('img/tv.png')";
	    body.style.backgroundSize = 'auto 100%';
	    body.style.backgroundPosition = 'center top';
	    body.style.backgroundRepeat = 'no-repeat';	
	}
}

var DAY_DURATION = 112;

var CatCafe = {
	gameASelected: true,
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
		if (type === 'table'){
			this.spawnPoints.push({x: x+8, y: y+24});
			this.spawnPoints.push({x: x + 26, y: y+24});
			this.game.add.sprite(x-9,y, 'tileset', 204, this.garbageGroup);
			this.game.add.sprite(x+8,y, 'tileset', 205, this.garbageGroup);
		}
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
			this.game.time.events.remove(this.currentDayEndTimer);
			this.gameOverSprite.visible = true;
			this.gameOver = true;
			this.holdUpSprite.visible = false;
			this.arrowSprite.visible = false;
		}
	},
	newGame: function(){
		this.blockScreenAction = false;
		this.titleScreenGroup.visible = false;
		this.menuMusic.stop();
		Pera.dead = false;
		this.gameOver = false;
		this.currentHeart = 10;
		for (var i = 0; i < 10; i++){
			this.hearts[i].loadTexture('ui', 17);
		}
		this.score = 0;
		this.updateScore();
		this.gameOverSprite.visible = false;
		this.destroyStage();
		Pera.reset();
		this.currentStage = 0;
		this.setStage(0);
		this.startStage();
	},
	changeTitleOption: function(){
		if (!this.titleScreenGroup.visible){
			return;
		}
		this.playSFX('Start_Game');
		this.gameASelected = !this.gameASelected;
		if (this.gameASelected){
			this.gameTypeSelectSprite.x = 50;
		} else {
			this.gameTypeSelectSprite.x = 138;
		}
	},
	start: function(){
		if (!this.game.device.desktop){
			var ratio = getDeviceH2WRatio();
			if (ratio <= 0.9){
				// Almost square, or horizontal layout, don't change scale!
			} else {
				this.gameHeight = Math.round(256*ratio);
				this.game.scale.setGameSize(256, this.gameHeight);
				this.game.add.sprite(-15, this.gameHeight - 205, 'padbground');
			}
			this.initBackButton();
		} else {
			this.game.time.events.add(500, setTVFrame);
		}
		this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.changeTitleOption, this);
		this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.changeTitleOption, this);

		this.mainGroup = this.game.add.group();
		this.cityGroup = this.game.add.group(this.mainGroup);
		this.backgroundGroup = this.game.add.group(this.mainGroup);
		this.entitiesGroup = this.game.add.group(this.mainGroup);
		this.boundariesGroup = this.game.add.group(this.mainGroup);
		this.hudGroup = this.game.add.group();
		this.holyCatsGroup = this.game.add.group(this.mainGroup);
		this.hearts = [];
		
		for (var i = 0; i < 10; i++){
			this.hearts[i] = this.game.add.sprite(62 + 10*i, 6, 'ui', 17, this.hudGroup);
		}
		this.scoreDigits = [];
		
		for (var i = 0; i < 6; i++){
			this.scoreDigits[i] = this.game.add.sprite(62 + 8*i, 14, 'ui', 0, this.hudGroup);
		}
		this.stageDigits = [];
		for (var i = 0; i < 2; i++){
			this.stageDigits[i] = this.game.add.sprite(62 + 8*i, 22, 'ui', 0, this.hudGroup);
		}
		this.hourDigits = [];
		for (var i = 0; i < 2; i++){
			this.hourDigits[i] = this.game.add.sprite(62 + 8*i, 30, 'ui', 0, this.hudGroup);
		}
		var colon = this.game.add.sprite(62 + 8*2, 30, 'ui', 10, this.hudGroup);
		colon.animations.add('blink', [10,11], 2, true);
		colon.animations.play('blink');
		this.game.add.sprite(62 + 8*3, 30, 'ui', 0, this.hudGroup);
		this.game.add.sprite(62 + 8*4, 30, 'ui', 0, this.hudGroup);
		
		this.gameOverSprite = this.game.add.sprite(100, 224, 'messages', 0, this.hudGroup);
		this.pauseSprite = this.game.add.sprite(116, 224, 'messages', 1, this.hudGroup);
		this.pauseSprite.visible = false;
		this.dayEndsSprite = this.game.add.sprite(80, 224, 'messages', 2, this.hudGroup);
		this.dayEndsSprite.visible = false;

		this.holdUpSprite = this.game.add.sprite(5, 41, 'tileset', 224, this.hudGroup);
		this.arrowSprite = this.game.add.sprite(13, 96, 'tileset', 225, this.hudGroup);
		this.helpSprite = this.game.add.sprite(0, 45, 'help', 0, this.hudGroup);

		var tween = this.game.add.tween(this.arrowSprite).to({y: 90}, 1500, Phaser.Easing.None,true, 0, Number.MAX_VALUE, true);
		tween.start();
		this.holdUpSprite.visible = false;
		this.arrowSprite.visible = false;

		this.game.add.sprite(0, 0, 'city', 0, this.cityGroup);
		this.game.add.sprite(0, 0, 'bground', 0, this.backgroundGroup);
		this.garbageGroup = this.game.add.group(this.backgroundGroup);
		Lali.init(this)
		this.currentFoodSprite = this.game.add.sprite(12, 82, 'tileset', FOOD_TILES['milkShake'], this.backgroundGroup);

		this.addBoundary(0,0,256,118);
		this.addBoundary(0,195,256,45);
		this.bar = this.addBoundary(240,109,16,87);
		this.kitchen = this.addBoundary(10,97,25,21);

		this.stageSprites = [];

		Pera.init(this);
		Shoey.init(this, 10, 208);
		this.entities = [];
		this.sortSpritesByDepth();

		this.wanderingCat = this.game.add.sprite(150, 70, 'tileset', 0, this.cityGroup);
		this.game.physics.arcade.enable(this.wanderingCat);
		this.setWanderingCat();

		this.titleScreenGroup = this.game.add.group();
		this.game.add.sprite(0, 0, 'title', 0, this.titleScreenGroup);
		var logoSprite = this.game.add.sprite(24, 8, 'title-tiles', 0, this.titleScreenGroup);
		logoSprite.animations.add('blink', [0,1], 2, true);
		logoSprite.animations.play('blink');
		this.game.add.sprite(96, 48, 'title-tiles', 2, this.titleScreenGroup);
		this.gameTypeSelectSprite = this.game.add.sprite(50, 158, 'tileset', 208, this.titleScreenGroup);
		this.gameTypeSelectSprite.animations.add('idle', [208, 209, 210, 211, 212, 213], 6, true);
		this.gameTypeSelectSprite.animations.play('idle');
		

		this.menuMusic = this.game.add.audio('menu',0.5, true);
		this.gameMusic = this.game.add.audio('game',0.5, true);
		this.endingMusic = this.game.add.audio('cats',0.5, true);
		this.menuMusic.play();

		this.endingScreenGroup = this.game.add.group();
		this.endingScreenGroup.visible = false;
		this.game.add.sprite(0, 0, 'ending', 0, this.endingScreenGroup);
		var endingCharacter = this.game.add.sprite(107, 151, 'tileset', 13, this.endingScreenGroup);
		endingCharacter.animations.add('celebrate', [14, 15], 4, true);
		endingCharacter.animations.play('celebrate');

		if (!this.game.device.desktop){
			
		}

		this.SFX_MAP['Get_Food_From_Kitchen'] = this.game.add.audio('Get_Food_From_Kitchen',0.5, false);
		this.SFX_MAP['Give_Food_To_Kitten'] = this.game.add.audio('Give_Food_To_Kitten',0.5, false);
		this.SFX_MAP['Kitten_Drops_Food'] = this.game.add.audio('Kitten_Drops_Food',0.5, false);
		this.SFX_MAP['Kitten_Jumps'] = this.game.add.audio('Kitten_Jumps',0.5, false);
		this.SFX_MAP['Kitten_Left'] = this.game.add.audio('Kitten_Left',0.5, false);
		this.SFX_MAP['Kitten_Tired_of_Waiting'] = this.game.add.audio('Kitten_Tired_of_Waiting',0.5, false);
		this.SFX_MAP['Wrong_Food'] = this.game.add.audio('Wrong_Food',0.5, false);
		this.SFX_MAP['Meow'] = this.game.add.audio('Meow',0.5, false);
		this.SFX_MAP['Meow(2)'] = this.game.add.audio('Meow(2)',0.5, false);
		this.SFX_MAP['Purr'] = this.game.add.audio('Purr',0.5, false);
		this.SFX_MAP['Stage_Clear'] = this.game.add.audio('Stage_Clear',0.5, false);
		this.SFX_MAP['Start_Game'] = this.game.add.audio('Start_Game',0.5, false);
	},
	showEnding: function(){
		this.holdUpSprite.visible = false;
		this.arrowSprite.visible = false;
		this.endingScreenGroup.visible = true;
		this.gameMusic.stop();
		this.endingMusic.play();
	},
	showTitleScreen: function(){
		this.endingMusic.stop();
		this.endingScreenGroup.visible = false;
		this.titleScreenGroup.visible = true;
		this.menuMusic.play();
	},
	titleScreenAction: function(){
		if (this.blockScreenAction)
			return;
		this.blockScreenAction = true;
		this.playSFX('Start_Game');
		this.game.time.events.add(1*1000, this.newGame, this);
	},
	setWanderingCat: function(){
		var leftToRight = Math.random() > 0.5;
		var baseSprite = Util.rand(0,3) * 32 + 64;
		this.wanderingCat.y = Util.rand(60, 80);
		if (leftToRight){
			this.wanderingCat.x = Util.rand(130, 150);
			this.wanderingCat.body.velocity.x = Util.rand(30, 60);
			this.wanderingCat.scale.x = 1;
		} else {
			this.wanderingCat.x = Util.rand(270, 280)	
			this.wanderingCat.body.velocity.x = -1 * Util.rand(30, 60);
			this.wanderingCat.scale.x = -1;
		}
		this.wanderingCat.animations.add('walk', Util.addToArray([18, 19, 20, 21, 22, 23, 24, 25], baseSprite), 6, true);
		this.wanderingCat.animations.play('walk');
		this.game.time.events.add(Util.rand(8,12)*1000, this.setWanderingCat, this);
	},
	updateTime: function(){
		if (Pera.dead)
			return;
		this.hour++;
		for (var i = 0; i < this.hourDigits.length; i++){
			this.hourDigits[i].loadTexture('ui', 0);
		}

		var strHour = this.hour+"";
		for (var i = 0; i < strHour.length; i++){
			this.hourDigits[this.hourDigits.length-i-1].loadTexture('ui', parseInt(strHour.charAt(strHour.length-i-1)));
			this.hourDigits[this.hourDigits.length-i-1].visible = true;
		}
		if (this.hour < 18){
			this.currentHourIncreaseTimer = this.game.time.events.add(12*1000, this.updateTime, this);
		}
	},
	destroyStage: function(){
		for (var i = 0; i < this.entities.length; i++){
			if (this.entities[i] != Pera)
				this.entities[i].sprite.destroy();
			if (this.entities[i].destroy)
				this.entities[i].destroy();
		}
		this.holyCatsGroup.removeAll(true);
		this.garbageGroup.removeAll(true);
		this.entities = [];
		for (var i = 0; i < this.stageSprites.length; i++){
			var sprite = this.stageSprites[i];
			if (sprite.alive && sprite != Pera.sprite){
				sprite.destroy();
			}
		}
		this.stageSprites = [];
		this.busy = {};
		this.game.time.events.remove(this.currentHourIncreaseTimer);
	},
	endDay: function(){
		if (Pera.dead)
			return;
		this.holdUpSprite.visible = false;
		this.arrowSprite.visible = false;
		this.gameActive = false;
		this.dayEndsSprite.loadTexture('messages', 2);
		this.dayEndsSprite.visible = true;
		this.gameMusic.stop();
		Pera.endStage();
		if (this.currentStage == 6){
			Pera.dead = true;
			this.game.time.events.add(5*1000, this.showEnding, this);
		} else {
			this.game.time.events.add(3*1000, this.increaseStage, this);
		}
	},
	increaseStage: function(){
		if (Pera.dead)
			return;
		this.destroyStage();
		this.currentStage++;
		this.setStage(this.currentStage);
		this.game.time.events.add(3*1000, this.startStage, this);
		this.dayEndsSprite.loadTexture('messages', 3);
	},
	update: function(){
		if (this.titleScreenGroup.visible){
			if (!this.joystickInputCounter)
				this.joystickInputCounter = 0;
			if (this.joystickInputCounter-- <= 0 && (Pera.isJoyLeftDown() || Pera.isJoyRightDown())){
				this.changeTitleOption();
				this.joystickInputCounter = 40;
			}
			return;
		}
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
		Lali.update();
		Shoey.update();
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
		this.addCat();
	},
	addCat: function(){
		var spawnPoint = Util.randomElementOf(this.spawnPoints);
		var cat = new Cat(this, Pera, spawnPoint.x, spawnPoint.y, Util.rand(0,3) * 32 + 64);
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
	},
	updateStageNumber: function(){
		for (var i = 0; i < this.stageDigits.length; i++){
			this.stageDigits[i].visible = false;
		}
		var strStage = (this.currentStage+1)+"";
		for (var i = 0; i < strStage.length; i++){
			this.stageDigits[i].loadTexture('ui', parseInt(strStage.charAt(i)));
			this.stageDigits[i].visible = true;
		}
	},
	busy: {},
	placeHolyCat: function(){
		if (!this.gameActive)
			return;
		var place = Util.rand(0,6);
		while (this.busy[place]){
			place = Util.rand(0,6);
		}
		this.busy[place] = true;
		if (place <= 2){
			var cat = new HolyCat(this, Pera, 232, 124+place*24, Util.rand(0,3) * 32 + 64);
			this.entities.push(cat);
			cat.place = place;
		} else {
			place -= 2;
			var cat = new HolyCat(this, Pera, 15+place*48, 192, Util.rand(0,3) * 32 + 64, true);
			this.entities.push(cat);
			cat.place = place + 2;
		}
	},
	hasGrumpyCats: function(){
		for (var i = 0; i < this.entities.length; i++){
			if (this.entities[i].isHolyCat &&  this.entities[i].isGrumpy)
				return true;
		}
		return false;
	},
	setStage: function(num){
		this.spawnPoints = [];
		this.addObstacle('chair', 217,108);
		this.addObstacle('chair', 217,132);
		this.addObstacle('chair', 217,156);
		this.entities.push(Pera);
		this.stageSprites.push(Pera.sprite);
		Pera.sprite.x = 20;
		Pera.sprite.y = 140;
		
		this.updateStageNumber();
		this.hour = 7;
		
		var baseStageMap = stageMap[this.gameASelected?'a':'b'];
		if (num > baseStageMap.length - 1)
			num = baseStageMap.length - 1;
		var specs = baseStageMap[num];

		var tableLayout = TABLE_LAYOUTS[specs.tables];
		for (var i = 0; i < tableLayout.length; i++){
			this.addObstacle('table', TABLE_POSITIONS[tableLayout[i]].x, TABLE_POSITIONS[tableLayout[i]].y);
		}
		for (var i = 0; i < specs.cats; i++){
			this.addCat();
		}
	},
	startStage: function(){
		Pera.startStage();
		this.gameMusic.play();
		this.dayEndsSprite.visible = false;
		if (this.currentStage == 0){
			this.arrowSprite.visible = true;
			this.helpSprite.visible = true;
			this.onHelpScreen = true;
		} else {
			this.doStartStage();
		}
	},
	doStartStage: function(){
		if (this.currentStage == 0){
			this.holdUpSprite.visible = true;
		} else {
			this.holdUpSprite.visible = false;
		}


		Pera.dead = false;
		var baseStageMap = stageMap[this.gameASelected?'a':'b'];
		var num = this.currentStage;
		if (num > baseStageMap.length - 1)
			num = baseStageMap.length - 1;
		var specs = baseStageMap[num];
		for (var i = 0; i < specs.holyCats; i++){
			this.game.time.events.add(i*5000, this.placeHolyCat, this);
		}
		this.updateTime();
		this.currentDayEndTimer = this.game.time.events.add(DAY_DURATION*1000, this.endDay, this);
		this.gameActive = true; 
	},
	recalcUserScale: function(){
		var width = window.innerWidth;
	    var height = window.innerHeight;
		var dips = window.devicePixelRatio;
	    width = width * dips;
	    height = height * dips;

		if (height > width/1.33){
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	
			var tvOverlay = document.getElementById('scanlines');
			tvOverlay.style.display = 'none';
		} else {
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	    	var ratio = getRatio(256, 240);
			this.game.scale.setUserScale((1.33/dips)*ratio.x, ratio.y/dips, 0, 0);
			this.relocateTVOverlay();
		}		
		
	},
	relocateTVOverlay: function(){
		var tvOverlay = document.getElementById('scanlines');
		tvOverlay.style.display = 'block';
		var canvas = document.getElementsByTagName('canvas')[0];
        var canvasMargin = parseInt(canvas.style.marginLeft.substr(0, canvas.style.marginLeft.indexOf("px")));
        var originalDistance = 418;
        var scale = tvOverlay.clientWidth / 1755;
        var realDistance = Math.round(originalDistance * scale);
        tvOverlay.style.left = (canvasMargin-realDistance)+"px" ;
	},
	initBackButton: function(){
		document.addEventListener("backbutton", function(){
			navigator.notification.confirm (
					"Close CatCafe?",
					function(buttonIndex){
						if(buttonIndex == "1"){
				            navigator.app.exitApp();
				        }
					}, 
			        "Confirmation", 
			        "Yes,No"
			      ); 
		}, false);
	}
}

var T_OFF_X = 48;
var T_OFF_Y = 108;

var T_SPACE_X = 56;
var T_SPACE_Y = 18;
var TABLE_POSITIONS = [
	{x: T_OFF_X, y:T_OFF_Y},
	{x: T_OFF_X+T_SPACE_X, y:T_OFF_Y},
	{x: T_OFF_X+T_SPACE_X*2, y:T_OFF_Y},
	{x: T_OFF_X+T_SPACE_X, y:T_OFF_Y+T_SPACE_Y},
	{x: T_OFF_X, y:T_OFF_Y+T_SPACE_Y*2},
	{x: T_OFF_X+T_SPACE_X, y:T_OFF_Y+T_SPACE_Y*2},
	{x: T_OFF_X+T_SPACE_X*2, y:T_OFF_Y+T_SPACE_Y*2},
];

var TABLE_LAYOUTS = [
	[],
	[3],
	[1,5],
	[1,4,6],
	[0,2,4,6],
	[0,2,3,4,6],
	[0,1,2,4,5,6],
];

/**
 Difficulty per stage
       GAME A               GAME B
 stage cats holyCats tables cats holyCats tables
 1     2    2        3      3    4        3  
 2     2    2        0      3    4        0  
 3     3    2        4      4    4        4  
 4     3    3        0      4    5        0  
 5     4    3        5      5    5        5  
 6     4    4        0      5    6        0  
 7     5    5        6      6    6        6  
*/
var stageMap = {
	a: [
		{
			cats: 2,
			holyCats: 2,
			tables: 3
		},
		{
			cats: 2,
			holyCats: 2,
			tables: 1
		},
		{
			cats: 3,
			holyCats: 2,
			tables: 4
		},
		{
			cats: 3,
			holyCats: 3,
			tables: 1
		},
		{
			cats: 4,
			holyCats: 3,
			tables: 5
		},
		{
			cats: 4,
			holyCats: 4,
			tables: 1
		},
		{
			cats: 5,
			holyCats: 5,
			tables: 6
		}
	],
	b: [
		{
			cats: 3,
			holyCats: 4,
			tables: 3
		},
		{
			cats: 3,
			holyCats: 4,
			tables: 1
		},
		{
			cats: 4,
			holyCats: 4,
			tables: 4
		},
		{
			cats: 4,
			holyCats: 5,
			tables: 1
		},
		{
			cats: 5,
			holyCats: 5,
			tables: 5
		},
		{
			cats: 5,
			holyCats: 6,
			tables: 1
		},
		{
			cats: 6,
			holyCats: 6,
			tables: 6
		}
	]
};

window.CatCafe = CatCafe;

// module.exports = CatCafe;
export default CatCafe