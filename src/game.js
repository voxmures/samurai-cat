var DEBUG = true;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'main');

var Global = function (game) {
    this.game = game;

    this.accumTime = 0;
    this.tickCount = 0;
};

Global.prototype.getTick = function() {
    this.accumTime += this.game.time.elapsed;
    this.tickCount += Math.floor(this.accumTime / (Phaser.Timer.SECOND / 2));
    this.accumTime %= Phaser.Timer.SECOND / 2;
    
    return this.tickCount;
}

game.state.add('preload', preloadState);
game.state.add('play', playState);
game.state.add('home', homeState);

game.state.start('preload');
