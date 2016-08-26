var DEBUG = true;

function paintScreenLimits(game) {
	var g = game.add.graphics(game.world.centerX, game.world.centerY);
	g.lineStyle(1, 0x00FF00, 1);
	g.drawCircle(0, 0, window.innerWidth);	
}