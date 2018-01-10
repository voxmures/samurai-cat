var homeState = function(game) {

};

var lastTick = 0;

var hungry = 1,
    happiness = 3,
    discipline = 3;

var year = 0,
    weight = 5;

var paintScreenLimits = function(game) {
    var g = game.add.graphics(game.world.centerX, game.world.centerY);
    g.lineStyle(1, 0x00FF00, 1);
    g.drawCircle(0, 0, window.innerWidth);
};

/* State control methods */
var create = function() {
    var game = this;
    game.stage.backgroundColor = '#73BFB8';
    
    /*   Only for DEVELOPMENT    */
    /* Remove before publishing! */
    paintScreenLimits(game);
    /* ------------------------- */
    
    var menu = new menuComponent(game);
    menu.init();
    // this.game.global.getTick().timer = new Phaser.Timer(this, false);
    // this.game.global.getTick().timer.start();
};

var update = function() {
    var game = this;

    var currentTick = this.game.global.getTick();
    var elapsedTick = currentTick - lastTick;
    if (elapsedTick > 0) {
        // TODO: Do the changes in player's properties
        lastTick = currentTick;
    }
};

homeState.prototype = {
    create: create,
    update: update
};

var menuComponent = function(game) {
    this.game = game;

    this.menu_btn = null;
    this.play_btn = null;
    this.stats_btn = null;
    this.isOpen = false;

    this.init = function() {
        this.menu_btn = game.add.sprite(game.world.centerX, 310, 'buttons', 'basic/0000.png');
        this.menu_btn.anchor.set(0.5);
        this.menu_btn.inputEnabled = true;

        this.menu_btn.events.onInputDown.add(function() {
            if (this.isOpen) {
                this.menu_btn.frameName = 'basic/0000.png';
                this.play_btn.visible = false;
                this.stats_btn.visible = false;
            }
            else {
                this.menu_btn.frameName = 'basic/0001.png';
                this.play_btn.visible = true;
                this.stats_btn.visible = true;
            }

            this.isOpen = !(this.isOpen);

        }, this);

        this.play_btn = game.add.sprite(game.world.centerX - 60, 310 - 40, 'buttons', 'states/home/0000.png');
        this.play_btn.anchor.set(0.5);
        this.play_btn.inputEnabled = true;
        this.play_btn.visible = false;   

        this.play_btn.events.onInputDown.add(function() {
            this.game.state.start('play');
        }, this);   

        this.stats_btn = game.add.sprite(game.world.centerX + 60, 310 - 40, 'buttons', 'states/home/0001.png');
        this.stats_btn.anchor.set(0.5);
        this.stats_btn.inputEnabled = true;
        this.stats_btn.visible = false;   
    };
};