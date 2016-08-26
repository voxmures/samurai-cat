var playState = function(game) {
	
};

var lvl = 1, // Current level
	threshold = 60, // Required experience to level up
	exp = 0, // Current experience
	expPerSec = 1, // Experience per second
	coins = 100;

var shopItems = []

/* Game mechanics */
function calcThreshold() {
	return (Math.sqrt(Math.pow(lvl, 3)) | 0) * 60;
}

function checkExp() {
	if (DEBUG) { console.log('exp:', exp); }
	if (exp >= threshold) {
		exp %= threshold;
		lvl++;
		threshold = calcThreshold();
		if (DEBUG) {
			console.log('Lvl:', lvl);
			console.log('Threshold:', threshold);
		}
	}
}

function incrExp() {
	exp += expPerSec;
	checkExp();
}

function tap() {
	exp++;
	checkExp();
}

/* GUI methods */
function GUI(game) {
	var tap_area = game.add.graphics(game.world.centerX, game.world.centerY);
	tap_area.beginFill(0x00FF00, 0);
	tap_area.drawCircle(0, 0, game.world.width);
	tap_area.endFill();
	tap_area.inputEnabled = true;
	tap_area.events.onInputDown.add(tap, this);

	var shop_btn = game.add.sprite(game.world.centerX, 310, 'shop_btn');
	shop_btn.anchor.set(0.5);
	shop_btn.inputEnabled = true;

	/* SHOP AREA */
	var shop_area = game.add.graphics(game.world.centerX, game.world.height + game.world.centerY);
	shop_area.beginFill(0x3DA5D9, 1);
	shop_area.drawCircle(0, 0, game.world.width);
	shop_area.endFill();
	shop_area.inputEnabled = true;

	var close_btn = game.add.sprite(0, 130, 'close_btn');
	close_btn.anchor.set(0.5);
	close_btn.inputEnabled = true;

	shop_area.addChild(close_btn);

	// Shop header
	var coin_spr = game.add.sprite(-60, -140, 'coin');
	coin_spr.anchor.set(0.5);
	var coin_txt = game.add.text(20, -10, coins, { font: '18px Arial', fill: '#FFFFFF', align: 'center' });
	coin_spr.addChild(coin_txt);
	var lvl_txt = game.add.text(20, -151, 'Lvl ' + lvl, { font: '18px Arial', fill: '#FFFFFF', align: 'center' });

	shop_area.addChild(coin_spr);
	shop_area.addChild(lvl_txt);

	openShop_sfx = game.add.audio('shop_sfx');
	closeShop_sfx = game.add.audio('close_sfx');
	openShop_tw = game.add.tween(shop_area).to({ y: game.world.centerY }, Phaser.Timer.SECOND, Phaser.Easing.Bounce.Out);
	closeShop_tw = game.add.tween(shop_area).to({ y: game.world.height + game.world.centerY }, Phaser.Timer.SECOND * 0.2);

	shop_btn.events.onInputDown.add(function() { openShop_sfx.play(); openShop_tw.start() }, this);
	close_btn.events.onInputDown.add(function() { closeShop_sfx.play(); closeShop_tw.start() }, this);
}

/* State control methods */
var create = function() {
	var game = this;
	game.stage.backgroundColor = '#73BFB8';

	/*   Only for DEVELOPMENT    */
	/* Remove before publishing! */
	paintScreenLimits(game);
	/* ------------------------- */

	if (DEBUG) { console.log('exp:', exp); }

	game.time.events.loop(Phaser.Timer.SECOND, incrExp, game);

	GUI(game);	// Set the GUI
};

playState.prototype = {
	create: create
};