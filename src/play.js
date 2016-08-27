var playState = function(game) {

};

var lvl = 1, // Current level
	threshold = 60, // Required experience to level up
	exp = 0, // Current experience
	expPerSec = 1, // Experience per second
	coins = 100;

var shopItems = [{
	name: 'Item 1',
	price: 20,
	requiredLvl: 1,
	modifier: 2
}, {
	name: 'Item 2',
	price: 80,
	requiredLvl: 2,
	modifier: 3
}];

var gui = null;

/* Game mechanics */
function calcThreshold() {
	return (Math.sqrt(Math.pow(lvl, 3)) | 0) * 60;
}

function checkExp() {
	if (DEBUG) { console.log('exp:', exp); }
	if (exp >= threshold) {
		exp %= threshold;
		lvl++; gui.setLvlText(lvl);
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

function buyItem(index) {
	var shopItem = shopItems[index];
	if (lvl >= shopItem.requiredLvl && coins >= shopItem.price) {
		coins -= shopItem.price;
		gui.setCoinsText(coins);
		expPerSec *= shopItem.modifier;
		gui.setShopItemBought(index);
	}
}

/* State control methods */
var create = function() {
	var game = this;
	game.stage.backgroundColor = '#73BFB8';

	if (DEBUG) { console.log('exp:', exp); }
	gui = new GUI(game);
	gui.init(shopItems);
	gui.getTapArea().events.onInputDown.add(tap, this);

	var shopItemsGUI = gui.getShopItems();
	for (var i = 0; i < shopItemsGUI.length; i++) {
		(function(index) {
			shopItemsGUI[index].events.onInputDown.add(function() { buyItem(index); }, this);
		})(i);
	}

	game.time.events.loop(Phaser.Timer.SECOND, incrExp, game);

	GUI(game);	// Set the GUI
};

playState.prototype = {
	create: create
};