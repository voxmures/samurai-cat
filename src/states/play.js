var playState = function(game) {

};

var lvl = 1, // Current level
	threshold = 20, // Required experience to level up
	exp = 0, // Current experience
	expPerSec = 1, // Experience per second
	expPerTap = 1, // Experience per tap
	criticChance = 0.05,
	criticModifier = 1.3,
	coins = 100;

var shopItems = [{
	name: 'Item 1',
	price: 20,
	requiredLvl: 1,
	modifier: 2,
	isBought: false
}, {
	name: 'Item 2',
	price: 90,
	requiredLvl: 2,
	modifier: 3,
	isBought: false
}];

var gui = null;

/* Game mechanics */
function calcThreshold() {
	return (Math.sqrt(Math.pow(lvl, 3)) | 0) * 60;
}

function lvlUp() {
	lvl++;
	gui.setLvlText(lvl);

	var inItemsIndexes = shopItems
	.map(function(item, index) {
		if (!item.isBought && item.requiredLvl == lvl && coins >= item.price) { return index; } 
		return null; 
	})
	.filter(function(index) { return (index != null ? true : false) });

	gui.setShopItemsIn(inItemsIndexes);
}

function checkExp() {
	if (DEBUG) { console.log('exp:', exp); }
	if (exp >= threshold) {
		exp %= threshold;
		lvlUp();
		threshold = calcThreshold();
		if (DEBUG) {
			console.log('Lvl:', lvl);
			console.log('Threshold:', threshold);
		}
	}
}

function incrExp() {
	var game = this;

	exp += expPerSec;
	gui.paintExp(expPerSec);

	checkExp();
}

function tap() {
	var game = this;

	var temp = expPerTap;
	var critic = false;
	// Check for critics
	var rand = game.rnd.realInRange(0.0, 1.0);
	if (rand <= criticChance) {
		temp = Math.round(temp * criticModifier);
		critic = true;
	}

	exp += temp;
	gui.paintExp(temp, critic);

	checkExp();
}

function buyItem(index) {
	var shopItem = shopItems[index];
	if (!shopItem.isBought && lvl >= shopItem.requiredLvl && coins >= shopItem.price) {
		coins -= shopItem.price;
		gui.setCoinsText(coins);
		expPerSec *= shopItem.modifier;
		shopItem.isBought = true;
		gui.setShopItemBought(index);

		var outItemsIndexes = shopItems
		.map(function(item, index) { 
			if (!item.isBought && lvl >= item.requiredLvl && coins < item.price) { return index; } 
			return null; 
		})
		.filter(function(index) { return (index != null ? true : false) });

		gui.setShopItemsOut(outItemsIndexes);
	}
}

/* State control methods */
var create = function() {
	var game = this;
	game.stage.backgroundColor = '#73BFB8';

	if (DEBUG) { console.log('exp:', exp); }
	gui = new GUI(game);
	gui.init(shopItems, { lvl: lvl, coins: coins });
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