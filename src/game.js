var DEBUG = true;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'main');

game.state.add('preload', preloadState);
game.state.add('play', playState);

game.state.start('preload');