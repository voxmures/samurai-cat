var playState = function(game) {
	
};

var lvl = 1, // Current level
	threshold = 60, // Required experience to level up
	exp = 0, // Current experience
	expPerSec = 1; // Experience per second

function calcThreshold() {
	return (Math.sqrt(Math.pow(lvl, 3)) | 0) * 60;
}

function checkExp() {
	console.log(exp);
	if (exp >= threshold) {
		exp %= threshold;
		lvl++;
		threshold = calcThreshold();
		console.log('Lvl: ', lvl);
		console.log('Threshold', threshold);
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

var create = function() {
	var game = this;

	console.log(exp);

	game.time.events.loop(Phaser.Timer.SECOND, incrExp, game);

	game.input.onDown.add(tap, this);
};

playState.prototype = {
	create: create
};