var preloadState = function(game) {
	
};

var preload = function() {
	game.load.image('coin', 'assets/images/coin.png');
	game.load.image('soldout', 'assets/images/soldout.png');
	game.load.atlasJSONHash('numbers', 'assets/images/numbers.png', 'assets/images/numbers.json');
	game.load.atlasJSONHash('buttons', 'assets/images/buttons.png', 'assets/images/buttons.json');

	game.load.audio('shop_sfx', 'assets/music/UI_Quirky11.mp3');
	game.load.audio('close_sfx', 'assets/music/UI_Quirky12.mp3');
};

var create = function() {
	this.game.global = new Global(this.game);
	game.state.start('home');
}

preloadState.prototype = {
	preload: preload,
	create: create
};