var GUI = function(game) {
	this.game = game;

	var tap_area = null;
	var shop_area = null;
	var lvl_txt = null;
	var coin_txt = null;

	var currentItem = null;
	var items = [];

	var screens = [{
		node: 0,
		name: 'main',
		depth: 0,
		children: [1]
	}, {
		node: 1,
		name: 'shop',
		depth: 1,
		parent: 0,
		children: null
	}];
	var currentScreen = screens[0];

	var rotate = function(direction) {
		switch(currentScreen.name) {
			case 'shop':
				if ((direction === 'CW' && currentItem == 0) || (direction === 'CCW' && currentItem == items.length - 1) ) { break; }

				var posX0 = (Math.cos(game.math.degToRad(30)) * game.world.width / 2) 
					 + (Math.tan(game.math.degToRad(30)) * (Math.sin(game.math.degToRad(30)) * game.world.width / 2));
				var posX1 = Math.cos(game.math.degToRad(30)) * game.world.width;

				if (direction === 'CCW') { posX0 *= -1; posX1 *= -1; }

				var currentItem_tw = this.game.add.tween(items[currentItem]).to({
					x: [posX0, posX1],
					y: [0, Math.sin(game.math.degToRad(30)) * game.world.width]
				}, 300);
				currentItem_tw.interpolation(function(v, k){
		            return Phaser.Math.bezierInterpolation(v, k);
		        });
		        currentItem_tw.start();

		        if (direction === 'CCW') { currentItem++; }
		        else { currentItem--; }

	        	var nextItem_tw = this.game.add.tween(items[currentItem]).to({
		            x: [-posX0, 0],
		            y: [0, 0]
		        }, 300);
		        nextItem_tw.interpolation(function(v, k){
		            return Phaser.Math.bezierInterpolation(v, k);
		        });
			    nextItem_tw.start();		
				break;
		}
	};

	var setListeners = function() {
		// Add eventListener for rotatorydetent
        window.addEventListener('rotarydetent', function(ev) {
			var direction = ev.detail.direction;
			rotate(direction);
		});

    	/* ROTATORY BEZEL SIMULATION
    	 * Simulates the rotary bezel, only for debugging purposes.
    	 * If key 'j' (74) is pressed, then rotate CCW;
    	 * else if key 'k' (75) is pressed, then rotate CW
    	 */
    	if (DEBUG) {
	    	if (!window.navigator.userAgent.includes('Tizen')) {
	    		console.warn('DEBUG:', 'Rotary bezel simulation active');
	    		document.addEventListener('keydown', function(ev) {
	    			switch(ev.keyCode) {
	    				case 74:
    						rotate('CCW');
    						break;
	    				case 75:
	    					rotate('CW');
	    					break;
	    			}
	    		});
	    	}
    	}
	};

	var changeScreen = function(name) {
		for (var i = 0; i < screens.length; i++) {
			if (screens[i].name === name) { currentScreen = screens[i]; break; }
		}
	};

	var paintScreenLimits = function() {
		var game = this.game;

		var g = game.add.graphics(game.world.centerX, game.world.centerY);
		g.lineStyle(1, 0x00FF00, 1);
		g.drawCircle(0, 0, window.innerWidth);
	};

	var paintShopItems = function(shopItems, player) {
		var game = this.game;

		for (var i = 0; i < shopItems.length; i++) {
			var g = game.add.graphics(0, -20);
			g.lineStyle(1, 0x000000, 1);
			g.beginFill(0x00FF00, 0);
			g.drawCircle(0, 0, window.innerWidth / 2);
			g.endFill();

			var item_txt = game.add.text(0, -80, shopItems[i].name, { font: '24px Arial', fill: '#FFFFFF', align: 'center' });
			item_txt.anchor.set(0.5);
			var price_txt = game.add.text(-40, 40, shopItems[i].price, { font: '24px Arial', fill: '#FFFFFF', align: 'center' });
			price_txt.anchor.set(0.5);
			var requiredLvl_txt = game.add.text(30, 40, 'Lvl ' + shopItems[i].requiredLvl, { font: '24px Arial', fill: '#FFFFFF', align: 'center' });
			requiredLvl_txt.anchor.set(0.5);

			var item_spr;
			if (i == 0) { item_spr = game.add.sprite(0, 0); }
			else {
				var x = game.world.width * Math.cos(game.math.degToRad(30));
				var y = game.world.width * Math.sin(game.math.degToRad(30));
				item_spr = game.add.sprite(x, y);
			}
			item_spr.addChild(g);
			item_spr.addChild(item_txt);
			item_spr.addChild(price_txt);
			item_spr.addChild(requiredLvl_txt);
			
			if (player.lvl >= shopItems[i].requiredLvl && player.coins >= shopItems[i].price) {
				item_spr.inputEnabled = true;
			} else {
				var mask = game.add.graphics(0, -20);
				mask.beginFill(0x000000, 0.5);
				mask.drawCircle(0, 0, window.innerWidth / 2);
				mask.endFill();
				item_spr.addChild(mask);
			}

			shop_area.addChild(item_spr);

			currentItem = 0;
			items.push(item_spr);
		}
	};

	this.getTapArea = function() {
		return tap_area;
	};

	this.getShopItems = function() {
		return items;
	};

	this.setShopItemBought = function(index) {
		items[index].inputEnabled = false;
		var g = game.add.graphics(0, -20);
		g.beginFill(0x000000, 0.5);
		g.drawCircle(0, 0, game.world.width / 2);
		g.endFill();
		var soldOut_spr = game.add.sprite(0, -20, 'soldout');
		soldOut_spr.anchor.set(0.5);

		items[index].addChild(g);
		items[index].addChild(soldOut_spr);
	};

	this.setShopItemsIn = function(itemsIdxs) {
		for (var i = 0; i < itemsIdxs.length; i++) {
			var item = items[itemsIdxs];
			item.inputEnabled = true;
			item.removeChildAt(item.children.length - 1);
		}
	};

	this.setShopItemsOut = function(itemsIdxs) {
		for (var i = 0; i < itemsIdxs.length; i++) {
			var item = items[itemsIdxs];
			item.inputEnabled = false;

			var g = game.add.graphics(0, -20);
			g.beginFill(0x000000, 0.5);
			g.drawCircle(0, 0, game.world.width / 2);
			g.endFill();
			item.addChild(g);
		}
	};

	this.setLvlText = function(lvl) {
		lvl_txt.setText('Lvl ' + lvl);
	};

	this.setCoinsText = function(coins) {
		coin_txt.setText(coins);
	};

	this.init = function(shopItems, player) {
		var game = this.game;

		/*   Only for DEVELOPMENT    */
		/* Remove before publishing! */
		paintScreenLimits(game);
		/* ------------------------- */

		tap_area = game.add.graphics(game.world.centerX, game.world.centerY);
		tap_area.beginFill(0x00FF00, 0);
		tap_area.drawCircle(0, 0, game.world.width);
		tap_area.endFill();
		tap_area.inputEnabled = true;

		var shop_btn = game.add.sprite(game.world.centerX, 310, 'shop_btn');
		shop_btn.anchor.set(0.5);
		shop_btn.inputEnabled = true;

		/* SHOP AREA */
		shop_area = game.add.graphics(game.world.centerX, game.world.height + game.world.centerY);
		shop_area.beginFill(0x3DA5D9, 1);
		shop_area.drawCircle(0, 0, game.world.width);
		shop_area.endFill();
		shop_area.inputEnabled = true;

		var close_btn = game.add.sprite(0, 130, 'close_btn');
		close_btn.anchor.set(0.5);
		close_btn.inputEnabled = true;

		shop_area.addChild(close_btn);

		// Shop header
		var coin_spr = game.add.sprite(-60, -140, 'coin');
		coin_spr.anchor.set(0.5);
		coin_txt = game.add.text(20, -10, player.coins, { font: '18px Arial', fill: '#FFFFFF', align: 'center' });
		coin_spr.addChild(coin_txt);
		lvl_txt = game.add.text(20, -151, 'Lvl ' + player.lvl, { font: '18px Arial', fill: '#FFFFFF', align: 'center' });

		shop_area.addChild(coin_spr);
		shop_area.addChild(lvl_txt);

		// Shop content
		paintShopItems(shopItems, player);

		var openShop_sfx = game.add.audio('shop_sfx');
		var closeShop_sfx = game.add.audio('close_sfx');
		var openShop_tw = game.add.tween(shop_area).to({ y: game.world.centerY }, Phaser.Timer.SECOND, Phaser.Easing.Bounce.Out);
		var closeShop_tw = game.add.tween(shop_area).to({ y: game.world.height + game.world.centerY }, Phaser.Timer.SECOND * 0.2);

		shop_btn.events.onInputDown.add(function() { openShop_sfx.play(); openShop_tw.start(); changeScreen('shop'); }, this);
		close_btn.events.onInputDown.add(function() { closeShop_sfx.play(); closeShop_tw.start(); changeScreen('main'); }, this);

		setListeners();
	};
};