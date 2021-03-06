var preloadState = function(game) {
	
};

var preload = function() {
	game.load.image('coin', 'assets/images/coin.png');
	game.load.image('soldout', 'assets/images/soldout.png');
	game.load.image('empty_heart', 'assets/images/empty_heart.png');
	game.load.image('heart', 'assets/images/heart.png');
	game.load.image('wood', 'assets/images/wood.png');
	game.load.image('idle_cat', 'assets/images/idle_cat.png');
	game.load.image('cat_attack_0', 'assets/images/cat_attack_0.png');
	game.load.image('cat_attack_1', 'assets/images/cat_attack_1.png');
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