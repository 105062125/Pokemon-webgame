function Bigmap(game) {
    var touchLeft = false;
	var touchRight = false;
	var touchUp = false;
    var touchDown = false;
    var frameposition;
    /*this.preload = function () {
        
    }*/
    this.create = function () {
        game.add.sprite(0, 0, 'bigmaplook');
        var backfont = { fontSize: '15px', fill: '#ff0000' };
        backname = game.add.text(40, 430, "按B回到遊戲", backfont);
        var ifont = { fontSize: '30px', fill: '#000' };
        if(worldlocate == 'gamemain') {
            chooseframe = game.add.sprite(328, 242.6, 'chooseframe');
            maplocate = game.add.sprite(333, 250, 'pika');
            locationname = game.add.text(70, 20, "真新鎮", ifont);
        }
        else if(worldlocate == 'world2'){
            chooseframe = game.add.sprite(368, 261.2, 'chooseframe');
            maplocate = game.add.sprite(375, 269, 'pika');
            locationname = game.add.text(70, 20, "岩石洞穴", ifont)
        }
        else if(worldlocate == 'world3'){
            chooseframe = game.add.sprite(365.3, 146.6, 'chooseframe');
            maplocate = game.add.sprite(370, 151, 'pika');
            locationname = game.add.text(70, 20, "野賴市", ifont)
        }
        else if(worldlocate == 'world4') {
            chooseframe = game.add.sprite(413.3, 127.9, 'chooseframe');
            maplocate = game.add.sprite(418, 135, 'pika');
            locationname = game.add.text(70, 20, "102號郊區", ifont)
        }
        else if(worldlocate == 'world5') {
            chooseframe = game.add.sprite(346.6, 333.2, 'chooseframe');
            maplocate = game.add.sprite(360.6, 344.6, 'pika');
            locationname = game.add.text(70, 20, "寶貝球草原", ifont)
        }
        
        

        game.physics.arcade.enable(chooseframe, Phaser.Physics.ARCADE);
        chooseframe.scale.setTo(0.4, 0.4);
        game.physics.arcade.enable(maplocate, Phaser.Physics.ARCADE);
        maplocate.scale.setTo(0.6, 0.6);
        maplocate.animations.add('down', [0, 1, 2, 3], 10, true);

		
        keyboard = game.input.keyboard.addKeys({
			'b': Phaser.Keyboard.B,
            'l': Phaser.Keyboard.L,
            'enter':Phaser.Keyboard.ENTER,
        });
        cursors = game.input.keyboard.createCursorKeys();
		
    }
	this.update = function () {
        maplocate.animations.play('down');
        chooseframe.body.velocity.x = 0;
		chooseframe.body.velocity.y = 0;
        if (cursors.left.isDown || touchLeft) {
            chooseframe.body.velocity.x = -160;
            
        } else if (cursors.right.isDown || touchRight) {
            chooseframe.body.velocity.x = 160;
           
        } else if (cursors.up.isDown || touchUp) {
            chooseframe.body.velocity.y = -160;
           
        } else if (cursors.down.isDown || touchDown) {
            chooseframe.body.velocity.y = 160;
        }


        if(chooseframe.x >= 362 && chooseframe.x <= 380 && chooseframe.y >= 140 && chooseframe.y <= 159)
        {
           
            locationname.text = "野賴市";
            frameposition = 'world3';
        } 
        if(chooseframe.x >= 319 && chooseframe.x <= 330 && chooseframe.y >= 237 && chooseframe.y <= 250)
        {
            
            locationname.text = "真新鎮";
            frameposition = 'gamemain';
        }
        if(chooseframe.x >= 405 && chooseframe.x <= 418 && chooseframe.y >= 122 && chooseframe.y <= 135)
        {
            
            locationname.text = "102號郊區";
            frameposition = 'world4';
        }
        if(chooseframe.x >= 360 && chooseframe.x <= 376 && chooseframe.y >= 253 && chooseframe.y <= 269)
        {
            
            locationname.text = "岩石洞穴";
            frameposition = 'world2';
        }
        if(chooseframe.x >= 341 && chooseframe.x <= 354 && chooseframe.y >= 325 && chooseframe.y <= 338)
        {
            
            locationname.text = "寶貝球草原";
            frameposition = 'world5';
        }





        //按按鍵回原本地圖
        if (keyboard.b.isDown) {
			if (worldlocate == 'gamemain') {
                 game.state.start('gamemain');
            }
            else if (worldlocate == 'world2') {
                game.state.start('world2');
            } else if (worldlocate == 'world3') {
                game.state.start('world3'); 
            } else if (worldlocate == 'world4') {
                game.state.start('world4'); 
            } else if (worldlocate == 'world5') {
                game.state.start('world5'); 
            }else if (worldlocate == 'hospital') {
                game.state.start('hospital'); 
            }
        }

        if (keyboard.enter.isDown) {
			if (frameposition == 'gamemain' && worldlocate!='gamemain') {
                 game.state.start('gamemain');
                 playerData[1] = 15;
                 playerData[2] = 20;
                 worldlocate = 'gamemain';
            }
            else if (frameposition == 'world2'&& worldlocate!='world2') {
                game.state.start('world2');
                playerData[1] = 15;
                playerData[2] = 2;
                worldlocate = 'world2';
            } else if (frameposition == 'world3'&& worldlocate!='world3') {
                game.state.start('world3'); 
                playerData[1] = 5;
                playerData[2] = 17;
                worldlocate = 'world3';
            } else if (frameposition == 'world4'&& worldlocate!='world4') {
                game.state.start('world4'); 
                playerData[1] = 1;
                playerData[2] = 6;
                worldlocate = 'world4';
            } else if (frameposition == 'world5'&& worldlocate!='world5') {
                game.state.start('world5'); 
                playerData[1] = 8;
                playerData[2] = 31;
                worldlocate = 'world5';
            }
        }
        
        if (keyboard.l.isDown) {
            console.log(chooseframe.x +','+chooseframe.y);
        }
        
		

    }
    this.addTouchKey = function () {
		var buttonfire = game.add.button(540, 380, 'button-a', null, this, 0, 1, 0, 1);
		buttonfire.fixedToCamera = true;
		buttonfire.events.onInputDown.add(this.actKeyDown, this);
		var buttonleft = game.add.button(0, 384, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonleft.fixedToCamera = true;
		buttonleft.events.onInputOver.add(function () { touchLeft = true; });
		buttonleft.events.onInputDown.add(function () { touchLeft = true; });
		buttonleft.events.onInputOut.add(function () { touchLeft = false; });
		buttonleft.events.onInputUp.add(function () { touchLeft = false; });
		var buttonright = game.add.button(196, 384, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonright.fixedToCamera = true;
		buttonright.scale.setTo(-1, 1);
		buttonright.events.onInputOver.add(function () { touchRight = true; });
		buttonright.events.onInputDown.add(function () { touchRight = true; });
		buttonright.events.onInputOut.add(function () { touchRight = false; });
		buttonright.events.onInputUp.add(function () { touchRight = false; });
		var buttonup = game.add.button(130, 350, 'button-arrow', null, this, 0, 1, 0, 1);
		buttonup.rotation = Math.PI * 0.5;
		buttonup.fixedToCamera = true;
		buttonup.events.onInputOver.add(function () { touchUp = true; });
		buttonup.events.onInputDown.add(function () { touchUp = true; });
		buttonup.events.onInputOut.add(function () { touchUp = false; });
		buttonup.events.onInputUp.add(function () { touchUp = false; });
		var buttondown = game.add.button(66, 480, 'button-arrow', null, this, 0, 1, 0, 1);
		buttondown.rotation = Math.PI * 1.5;
		buttondown.fixedToCamera = true;
		buttondown.events.onInputOver.add(function () { touchDown = true; });
		buttondown.events.onInputDown.add(function () { touchDown = true; });
		buttondown.events.onInputOut.add(function () { touchDown = false; });
		buttondown.events.onInputUp.add(function () { touchDown = false; });
	};
}