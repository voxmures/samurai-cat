var preloadState = function(game) {
	
};

var preload = function() {
	game.load.image('close_btn', 'assets/images/close_btn.png');
	game.load.image('shop_btn', 'assets/images/shop_btn.png');
	game.load.image('coin', 'assets/images/coin.png');
	game.load.image('soldout', 'assets/images/soldout.png');

	game.load.audio('shop_sfx', 'assets/music/UI_Quirky11.mp3');
	game.load.audio('close_sfx', 'assets/music/UI_Quirky12.mp3');
};

var create = function() {
	game.state.start('play');
}

preloadState.prototype = {
	preload: preload,
	create: create
};