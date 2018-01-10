var homeState = function(game) {

};

var lastTick = 0;

var hungry = 20,
    happiness = 50;

var hungryHearts = [];
var happinessHearts = [];

var year = 0,
    weight = 5;

var paintScreenLimits = function(game) {
    var g = game.add.graphics(game.world.centerX, game.world.centerY);
    g.lineStyle(1, 0x00FF00, 1);
    g.drawCircle(0, 0, window.innerWidth);
};

var updateStats = function(elapsed) {
    hungry += elapsed * 0.5;
    if (hungry > 100) hungry = 100;
    happiness -= elapsed * 0.2;
    if (happiness < 0) happiness = 0;
    
    for (var i = 0; i < Math.floor(hungry / 20); i++) {
        hungryHearts[i].visible = true;
    }

    for (var i = 0; i < Math.floor(happiness / 20); i++) {
        happinessHearts[i].visible = true;
    }
}

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
};

var update = function() {
    var game = this;

    var currentTick = this.game.global.getTick();
    var elapsedTick = currentTick - lastTick;
    if (elapsedTick > 0) {
        updateStats(elapsedTick);
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

    this.statsScreen = null;

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

        this.statsScreen = new StatsScreen(game).init();

        var openStats_sfx = game.add.audio('shop_sfx');
        var openStats_tw = game.add.tween(this.statsScreen).to({ y: game.world.centerY }, Phaser.Timer.SECOND, Phaser.Easing.Bounce.Out);
        this.stats_btn.events.onInputDown.add(function() { openStats_sfx.play(); openStats_tw.start(); }, this);
        
    };
};

var StatsScreen = function(game) {
    this.game = game;

    this.stats_area = null;

    this.init = function() {
        this.stats_area = game.add.graphics(game.world.centerX, game.world.height + game.world.centerY);
		this.stats_area.beginFill(0x3DA5D9, 1);
		this.stats_area.drawCircle(0, 0, game.world.width);
        this.stats_area.endFill();
        this.stats_area.inputEnabled = true;

        var hungryText = game.add.text(0, -100, 'HUNGRY');
        hungryText.anchor.set(0.5);
        this.stats_area.addChild(hungryText);

        for (var i = 0; i < 5; i++) {
            var posX = -130 + (i * 65),
                posY = -50;
            var empty_heart = game.add.sprite(posX, posY, 'empty_heart');
            empty_heart.anchor.set(0.5);
            var heart = game.add.sprite(posX, posY, 'heart');
            heart.anchor.set(0.5);
            heart.visible = false;
            hungryHearts.push(heart);
            this.stats_area.addChild(empty_heart);
            this.stats_area.addChild(heart);
        }

        var happinessText = game.add.text(0, 0, 'HAPPINESS');
        happinessText.anchor.set(0.5);
        this.stats_area.addChild(happinessText);

        for (var i = 0; i < 5; i++) {
            var posX = -130 + (i * 65),
                posY = 50;
            var empty_heart = game.add.sprite(posX, posY, 'empty_heart');
            empty_heart.anchor.set(0.5);
            var heart = game.add.sprite(posX, posY, 'heart');
            heart.anchor.set(0.5);
            heart.visible = false;
            happinessHearts.push(heart);
            this.stats_area.addChild(empty_heart);
            this.stats_area.addChild(heart);
        }
        
        var close_btn = game.add.sprite(0, 130, 'buttons', 'basic/0001.png');
        close_btn.anchor.set(0.5);
        close_btn.inputEnabled = true;

        this.stats_area.addChild(close_btn);

        var closeStats_sfx = game.add.audio('close_sfx');
        var closeStats_tw = game.add.tween(this.stats_area).to({ y: game.world.height + game.world.centerY }, Phaser.Timer.SECOND * 0.2);        
		close_btn.events.onInputDown.add(function() { closeStats_sfx.play(); closeStats_tw.start(); }, this);
        
        return this.stats_area;
    }
}