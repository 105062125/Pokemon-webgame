
function GameMain(game) {

	var layer_1;
	var player;
	var npcs;
	var directions = ["down", "left", "right", "up"];
	var facing = 0;
	var touchLeft = false;
	var touchRight = false;
	var touchUp = false;
	var touchDown = false;
	var fires;
	var cursors;
	var actKey;
	var actTimer = 0;

	var talkbox;
	var talking = 0;
	var talkingto = null;

	var keyboard;


	this.create = function () {
		if (!load_once) {
			this.LoadMyMonsterFromFirebase();
			load_once = true;
		}
		keyboard = game.input.keyboard.addKeys({
			'w': Phaser.Keyboard.W,
			't': Phaser.Keyboard.T,
			'a': Phaser.Keyboard.A,
			'm': Phaser.Keyboard.M,

		});
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//pkmusic.play();
		mainbackmusic.play();
		monsters_2 = game.add.group();
		monsters_2.enableBody = true;
		game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(this.SaveDataToFirebase, this);
		game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.showmonster, this);
		//創自己隱藏的怪
		for (idx in monsterData) {
			if (idx <= 1 && !monsterData[idx][8] && monsterData[idx][9] == 1) {
				var img = (monsterData[idx][1] % 4) * 3 + parseInt(monsterData[idx][1] / 4) * 48;
				var monster2 = monsters_2.create(monsterData[idx][2] * 32, monsterData[idx][3] * 32, 'sheet-monster', img);
				monster2.body.collideWorldBounds = true;
				monster2.body.immovable = true;
				monster2.idx = idx;
				monster2.talking = false;
				monster2.visible = true;
				monster2.timetomove = 0;
				monster2.animations.add('down', [0 + img, 1 + img, 2 + img], 5, true);
				monster2.animations.add('left', [12 + img, 13 + img, 14 + img], 5, true);
				monster2.animations.add('right', [24 + img, 25 + img, 26 + img], 5, true);
				monster2.animations.add('up', [36 + img, 37 + img, 38 + img], 5, true);
				if (monsterData[idx][4] == 0) { monster2.kill(); }
				//console.log(idx + '號隱藏怪物創立');
			} else if (!monsterData[idx][8] && monsterData[idx][9] == 1) {
				var monster2 = monsters_2.create(monsterData[idx][2] * 32, monsterData[idx][3] * 32, monsterData[idx][7]);
				monster2.body.collideWorldBounds = true;
				monster2.body.immovable = true;
				monster2.idx = idx;
				monster2.talking = false;
				monster2.visible = true;
				monster2.timetomove = 0;
				monster2.animations.add('down', [0, 1, 2, 3], 5, true);
				monster2.animations.add('left', [4, 5, 6, 7], 5, true);
				monster2.animations.add('right', [8, 9, 10, 11], 5, true);
				monster2.animations.add('up', [12, 13, 14, 15], 5, true);
				if (monsterData[idx][4] == 0) { monster2.kill(); }
				//console.log(idx + '號隱藏怪物創立');
				//console.log('創建自己的怪結束1');
			}
		}
		//加载地图
		var map = game.add.tilemap('world-1');
		map.addTilesetImage('tiles-2');
		map.addTilesetImage('pokemonbig');
		//map.setTileIndexCallback(271, this.change, this);
		//map.setCollisionByExclusion([5,6,7,8]);//除指定tileid外的所有tile执行碰撞检测
		map.setCollision([21, 22, 221, 222, 251, 271]);//仅指定的tileid执行碰撞检测
		//切換到world2
		map.setTileLocationCallback(9, 15, 1, 1, this.changeworld2, this);
		//切換到world3
		map.setTileLocationCallback(20, 23, 1, 1, this.changeworld3, this);
		//切到醫院
		map.setTileLocationCallback(20, 7, 1, 1, this.changehospital, this);

		//map.setCollision([680,681,682,683,684]);//仅指定的tileid执行碰撞检测
		//仅指定的tileid执行碰撞检测

		layer_1 = map.createLayer('touchlayer');
		layer_1.visible = false;
		layer_1.resizeWorld();

		//map.createLayer('ground-1').resizeWorld(); //背景图层，并重设WorldSize
		//map.createLayer('ground-2');
		game.add.sprite(0, 0, 'world-ground'); //用一张大图代替tilemaplayer可提高性能

		//创建NPC......
		npcs = game.add.group();
		npcs.enableBody = true;
		for (idx in npcData) {
			var img = (npcData[idx][1] % 4) * 3 + parseInt(npcData[idx][1] / 4) * 48;
			var npc = npcs.create(npcData[idx][2] * 32, npcData[idx][3] * 32, 'sheet-hero', img);
			npc.body.collideWorldBounds = true;
			npc.body.immovable = true;
			npc.idx = idx;
			npc.talking = false;
			npc.timetomove = 0;
			npc.animations.add('down', [0 + img, 1 + img, 2 + img], 5, true);
			npc.animations.add('left', [12 + img, 13 + img, 14 + img], 5, true);
			npc.animations.add('right', [24 + img, 25 + img, 26 + img], 5, true);
			npc.animations.add('up', [36 + img, 37 + img, 38 + img], 5, true);
		}

		monsters = game.add.group();
		monsters.enableBody = true;
		//創自己的怪
		for (idx in monsterData) {
			if (idx <= 1 && monsterData[idx][8] && monsterData[idx][9] == 1) {
				var img = (monsterData[idx][1] % 4) * 3 + parseInt(monsterData[idx][1] / 4) * 48;
				var monster = monsters.create(monsterData[idx][2] * 32, monsterData[idx][3] * 32, 'sheet-monster', img);
				monster.body.collideWorldBounds = true;
				monster.body.immovable = true;
				monster.idx = idx;
				monster.talking = false;
				//monster.visible = false;
				monster.timetomove = 0;
				monster.animations.add('down', [0 + img, 1 + img, 2 + img], 5, true);
				monster.animations.add('left', [12 + img, 13 + img, 14 + img], 5, true);
				monster.animations.add('right', [24 + img, 25 + img, 26 + img], 5, true);
				monster.animations.add('up', [36 + img, 37 + img, 38 + img], 5, true);
				if (monsterData[idx][4] == 0) { monster.kill(); }
				//console.log(idx + '號可見怪物創立');
			} else if (monsterData[idx][8] && monsterData[idx][9] == 1) {
				var monster = monsters.create(monsterData[idx][2] * 32, monsterData[idx][3] * 32, monsterData[idx][7]);
				monster.body.collideWorldBounds = true;
				monster.body.immovable = true;
				monster.idx = idx;
				monster.talking = false;
				//monster.visible = false;
				monster.timetomove = 0;
				monster.animations.add('down', [0, 1, 2, 3], 5, true);
				monster.animations.add('left', [4, 5, 6, 7], 5, true);
				monster.animations.add('right', [8, 9, 10, 11], 5, true);
				monster.animations.add('up', [12, 13, 14, 15], 5, true);
				if (monsterData[idx][4] == 0) { monster.kill(); }
				//console.log(idx + '號可見怪物創立');
				//console.log('創建自己的怪結束2');
			}
		}
		//创建主角

		if (!playerdata_load_once) {
			console.log('logged');
			playerData[1] = parseInt(last_player_x / 32);
			playerData[2] = parseInt(last_player_y / 32);
			worldlocate = last_player_locaction;
			playerdata_load_once = true;
		}

		if (best_monster_id == 0) {
			if (fight_over) {
				player = game.add.sprite(playerData[1] * 32, playerData[2] * 32, 'pika');
			} else {
				player = game.add.sprite(playerData[1] * 32 + 8 * 32, playerData[2] * 32 + 2 * 32, 'pika');
			}

		} else {
			player = game.add.sprite(playerData[1] * 32, playerData[2] * 32, MyMonsterData[best_monster_id][5]);
		}
		game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
		player.body.setSize(32, 24, 0, 8);
		player.scale.setTo(0.7, 0.7);
		//player.animations.add('down', [0, 1, 2], 10, true);
		//player.animations.add('left', [12, 13, 14], 10, true); 
		//player.animations.add('right', [24, 25, 26], 10, true); 
		//player.animations.add('up', [36, 37, 38], 10, true); 
		player.animations.add('down', [0, 1, 2, 3], 10, true);
		player.animations.add('left', [4, 5, 6, 7], 10, true);
		player.animations.add('right', [8, 9, 10, 11], 10, true);
		player.animations.add('up', [12, 13, 14, 15], 10, true);
		game.camera.follow(player);

		//创建遮挡图层（在主角创建之后创建，实现遮挡）
		//map.createLayer('fore1');
		//map.createLayer('fore2');
		game.add.sprite(0, 0, 'world-fore');



		//对话框
		talkbox = game.add.sprite(120, 380, 'talkboximg');
		talkbox.alpha = 0; //
		talkbox.talkText = talkbox.addChild(game.add.text(5, 5, '', { fontSize: '16px', fill: '#000' }));
		talkbox.fixedToCamera = true;

		//虚拟按键
		var buttonMenu = game.add.button(2, 2, 'button-menu', null, this, 0, 1, 0, 1);
		buttonMenu.fixedToCamera = true;
		buttonMenu.events.onInputDown.add(function () {
			this.saveData();
			game.state.start('viewinfo');
		}, this);
		if (!game.device.desktop) {
			this.addTouchKey();
		}
		//键盘按键
		cursors = game.input.keyboard.createCursorKeys();
		actKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		actKey.onDown.add(this.actKeyDown, this);

	};

	this.update = function () {
		game.physics.arcade.collide(player, layer_1);
		game.physics.arcade.collide(npcs, layer_1);
		game.physics.arcade.collide(monsters, layer_1);
		game.physics.arcade.collide(monsters_2, layer_1);
		game.physics.arcade.collide(player, npcs);
		game.physics.arcade.overlap(player, monsters, function (player, monster) {
			this.saveData();
			fightingID = monster.idx;
			game.state.start('fighting');
		}, null, this);
		game.physics.arcade.overlap(player, monsters_2, function (player, monster) {
			this.saveData();
			fightingID = monster.idx;
			game.state.start('fighting');
		}, null, this);

		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		//切換地圖
		if (keyboard.w.isDown) {
			console.log("換地圖");
			worldlocate = 'world2';
			game.state.start('world2');
		}
		else if (keyboard.t.isDown) {
			console.log("換地圖");
			worldlocate = 'world5';
			game.state.start('world5');
		} else if (keyboard.a.isDown) {
			console.log('戰鬥吧！');
			//fightingID = 0;
			game.state.start('fighting');
		} else if (keyboard.m.isDown) {
			console.log('切到大地圖觀看');
			this.saveData();
			game.state.start('bigmap');
		}

		//方向键检测，当然说话时是不能动的
		if (talking == 0) {
			if (cursors.left.isDown || touchLeft) {
				player.body.velocity.x = -160;
				facing = 1;
			} else if (cursors.right.isDown || touchRight) {
				player.body.velocity.x = 160;
				facing = 2;
			} else if (cursors.up.isDown || touchUp) {
				player.body.velocity.y = -160;
				facing = 3;
			} else if (cursors.down.isDown || touchDown) {
				player.body.velocity.y = 160;
				facing = 0;
			}
		}
		if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
			player.animations.stop();
			player.frame = facing * 12 + 1;
		} else {
			player.animations.play(directions[facing]);

			//如果得到倚天剑，就结束吧（恭喜通关！！！）
			if (playerData[7] == 2) {
				game.state.start('gamewin');
			}
		}
		//其他......
		npcs.forEachAlive(this.npcmove, this); //活的都动起来~~~
		monsters.forEachAlive(this.npcmove, this); //活的都动起来~~~
		monsters_2.forEachAlive(this.npcmove, this); //活的都动起来~~~
	};
	this.npcmove = function (npc) {
		if (!npc.talking && game.time.now > npc.timetomove) {
			var go = parseInt(Math.random() * 12);
			npc.body.velocity.x = go == 1 ? -30 : (go == 2 ? 30 : 0);
			npc.body.velocity.y = go == 0 ? 30 : (go == 3 ? -30 : 0);
			npc.animations.play(directions[go % 4]);
			npc.timetomove = game.time.now + Math.random() * 1000 + 500;
		}
	};
	this.getHitNPC = function (x, y) {
		for (idx in npcs.children) {
			if (npcs.children[idx].body.hitTest(x, y)) {
				return npcs.children[idx];
			}
		}
		return null;
	};
	this.actKeyDown = function () {
		if (game.time.now < actTimer) { return; }
		actTimer = game.time.now + 500;
		if (talking == 1) {
			talkingto.talking = false;
			talkingto.timetomove = game.time.now + Math.random() * 1000 + 500;
			talkingto = null;

			talking = 2;
			talkbox.alpha = 1;
			game.add.tween(talkbox).to({ alpha: 0 }, 100, "Linear", true).onComplete.add(function () { talking = 0; }, this);
		} else if (talking == 0) {
			var frontX = facing == 1 ? -8 : facing == 2 ? 40 : 16;
			var frontY = facing == 0 ? 40 : facing == 3 ? -8 : 16;
			talkingto = this.getHitNPC(player.x + frontX, player.y + frontY);
			if (talkingto != null) {
				talkingto.body.velocity.x = 0;
				talkingto.body.velocity.y = 0;
				talkingto.talking = true;
				talkingto.animations.play(directions[facing == 0 ? 3 : facing == 1 ? 2 : facing == 2 ? 1 : 0]);

				talking = 2;
				talkbox.alpha = 0;
				var talktext = npcData[talkingto.idx][4].split("|");
				//任务激活
				if (taskData[npcData[talkingto.idx][6]][0] == 9) { //依赖事件已完成
					if (taskData[npcData[talkingto.idx][5]][0] != 9) { //主事件未完成
						if (taskData[npcData[talkingto.idx][5]][0] == 8) {
							taskData[npcData[talkingto.idx][5]][0] = 9;//完成标志
							playerData[7] = taskData[npcData[talkingto.idx][5]][7]; //任务奖励
							talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + taskData[npcData[talkingto.idx][5]][6];
						} else {
							taskData[npcData[talkingto.idx][5]][0] = 1;//激活标志
							talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + taskData[npcData[talkingto.idx][5]][5];
						}
					} else {
						talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + talktext[parseInt(Math.random() * talktext.length)];
					}
				} else {
					talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + talktext[parseInt(Math.random() * talktext.length)];
				}
				game.add.tween(talkbox).to({ alpha: 1 }, 100, "Linear", true).onComplete.add(function () { talking = 1; }, this);
			}
		}
	};
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
	this.saveData = function () {
		for (idx in npcs.children) {
			npcData[npcs.children[idx].idx][2] = parseInt(npcs.children[idx].x / 32);
			npcData[npcs.children[idx].idx][3] = parseInt(npcs.children[idx].y / 32);
		}
		for (idx in monsters.children) {
			monsterData[monsters.children[idx].idx][2] = parseInt(monsters.children[idx].x / 32);
			monsterData[monsters.children[idx].idx][3] = parseInt(monsters.children[idx].y / 32);
		}
		for (idx in monsters_2.children) {
			monsterData[monsters_2.children[idx].idx][2] = parseInt(monsters_2.children[idx].x / 32);
			monsterData[monsters_2.children[idx].idx][3] = parseInt(monsters_2.children[idx].y / 32);
		}
		playerData[1] = parseInt(player.x / 32);
		playerData[2] = parseInt(player.y / 32);
	};
	this.changeworld2 = function () {
		console.log("換到地圖2");
		worldlocate = 'world2';
		game.state.start('world2');
		playerData[1] = 15;
		playerData[2] = 2;


	}
	this.changeworld3 = function () {
		console.log("換到地圖3");
		worldlocate = 'world3';
		game.state.start('world3');
		playerData[1] = 5;
		playerData[2] = 17;
	}
	this.changehospital = function () {
		console.log("換到醫院");
		worldlocate = 'hospital';
		game.state.start('hospital');
		playerData[1] = 23;
		playerData[2] = 22;
	}
	this.showmonster = function () {
		for (idx in MyMonsterData) {
			console.log('擁有的怪物' + MyMonsterData[idx][0] + '  ' + '生命: ' + MyMonsterData[idx][1] + ' 攻擊力: ' + MyMonsterData[idx][2]);
		}
	}
	this.SaveDataToFirebase = function () {
		console.log('firebase is saving.......')
		for (idx in MyMonsterData) {
			var monster_string = 'monster' + idx;
			firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/monsters/' + monster_string).set({
				name: MyMonsterData[idx][0],
				life: MyMonsterData[idx][1],
				power: MyMonsterData[idx][2],
				level: MyMonsterData[idx][3],
				exp: MyMonsterData[idx][4],
				id: MyMonsterData[idx][5],
			});
		}
		firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/playerdata/').set({
			player_x: player.x,
			player_y: player.y,
			location: worldlocate,
		});
		console.log('firebase is saved !');
	}
	this.LoadMyMonsterFromFirebase = function () {
		console.log('initializing monsters ')
		firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/monsters/').once('value')
			.then(function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					var monster_name = childSnapshot.val().name;
					var monster_life = childSnapshot.val().life;
					var monster_power = childSnapshot.val().power;
					var monster_level = childSnapshot.val().level;
					var monster_exp = childSnapshot.val().exp;
					var monster_id = childSnapshot.val().id;
					if (monster_name != "皮卡丘") {
						MyMonsterData[MyMonsterData.length] = [monster_name, monster_life, monster_power, monster_level, monster_exp, monster_id];
					}

				});
			})
			.catch(e => console.log(e.message));
		console.log('intialized!');
	}
}

function ViewInfo(game) {
	var touchLeft = false;
	var touchRight = false;
	var touchUp = false;
	var touchDown = false;
	var count = 0;
	var checkonce = 1;
	var temp_best_id;

	var judge=0;
	
	this.create = function () {
		viewinfomove = game.add.audio('viewinfomove');
		viewinfoclick = game.add.audio('viewinfoclick');
		keyboard = game.input.keyboard.addKeys({
            'enter':Phaser.Keyboard.ENTER,
        });
		cursors = game.input.keyboard.createCursorKeys();


		if(checkonce){
			for (idx in MyMonsterData) {
				judge++;
				if (MyMonsterData[idx][1] > MyMonsterData[best_monster_id][1]) {
					best_monster_id = idx;
				}
			}
			checkonce = 0;
			console.log(judge);
		}
		temp_best_id = best_monster_id;

		var boximg = game.make.bitmapData(game.width - 4, game.height - 4);
		boximg.context.strokeStyle = "rgb(192,192,192)";
		boximg.context.strokeRect(0, 0, game.width - 4, 140);
		boximg.rect(0, 0, game.width - 4, 140, "rgba(100,150,250,0.5)");

		var box = game.add.sprite(2, 2, boximg);
		if (best_monster_id == 0) {
			box.addChild(game.add.sprite(25, 30, 'pika', 1)).scale.setTo(2, 2);
		} else {
			box.addChild(game.add.sprite(25, 30, MyMonsterData[best_monster_id][5], 1)).scale.setTo(2, 2);
		}

		if(best_monster_id<6){
			chooseframe = game.add.sprite(22+best_monster_id*100, 160, 'chooseframe');
		}else if(best_monster_id>=6 && best_monster_id<12){
			chooseframe = game.add.sprite(22+(best_monster_id-6)*100, 260, 'chooseframe');
		}else if(best_monster_id>=12 && best_monster_id<18){
			chooseframe = game.add.sprite(22+(best_monster_id-12)*100, 360, 'chooseframe');
		}
		//chooseframe = game.add.sprite(22+best_monster_id*100, 160, 'chooseframe');
		//box.addChild(game.add.sprite(25, 30, 'pika', 1)).scale.setTo(2, 2);



		var ifont = { fontSize: '16px', fill: '#fff' };
		/*box.addChild(game.add.text(120, 20, "姓名 : " + playerData[0], ifont));
		box.addChild(game.add.text(120, 40, "生命 : " + playerData[3] + " / " + playerData[5], ifont));
		box.addChild(game.add.text(120, 60, "法力 : " + playerData[4] + " / " + playerData[6], ifont));
		box.addChild(game.add.text(120, 80, "武器 : " + weapons[playerData[7]][0], ifont));
		box.addChild(game.add.text(120, 100, "防具 : " + armors[playerData[8]][0], ifont));*/
		if (best_monster_id == 0) {
			box.addChild(game.add.text(120, 20, "姓名 : " + playerData[0], ifont));
			box.addChild(game.add.text(120, 40, "生命 : " + playerData[3] + " / " + playerData[5], ifont));
			box.addChild(game.add.text(120, 60, "法力 : " + playerData[4] + " / " + playerData[6], ifont));
			box.addChild(game.add.text(120, 80, "武器 : " + weapons[playerData[7]][0], ifont));
			box.addChild(game.add.text(120, 100, "防具 : " + armors[playerData[8]][0], ifont));
		} else {
			//my怪物數據:0.名字、1.生命 2.攻擊力  3.等級 4.經驗值 5.圖片編號
			var exp_max = MyMonsterData[best_monster_id][3] * MyMonsterData[best_monster_id][3] + 100;
			box.addChild(game.add.text(120, 20, "姓名 : " + MyMonsterData[best_monster_id][0], ifont));
			box.addChild(game.add.text(120, 40, "生命 : " + MyMonsterData[best_monster_id][1], ifont));
			box.addChild(game.add.text(120, 60, "攻擊力 : " + MyMonsterData[best_monster_id][2], ifont));
			box.addChild(game.add.text(120, 80, "等級 : " + MyMonsterData[best_monster_id][3], ifont));
			box.addChild(game.add.text(120, 100, "經驗值 : " + MyMonsterData[best_monster_id][4] + '/' + exp_max, ifont));
		}

		for (idx in MyMonsterData) {
			if (idx > 0 && idx < 6) {
				game.add.sprite(25 + idx * 100, 160, MyMonsterData[idx][5], 1).scale.setTo(2, 2);
			} else if (idx == 0) {
				game.add.sprite(25, 160, 'pika', 1).scale.setTo(2, 2);
			} else if (idx > 5 && idx < 12) {
				game.add.sprite(25 + (idx - 6) * 100, 260, MyMonsterData[idx][5], 1).scale.setTo(2, 2);
			} else if (idx > 11) {
				game.add.sprite(25 + (idx - 12) * 100, 360, MyMonsterData[idx][5], 1).scale.setTo(2, 2);
			}
		}


		var buttonClose = game.add.button(574, 2, 'button-x', null, this, 0, 1, 0, 1);
		if (worldlocate == 'gamemain') {
			buttonClose.events.onInputDown.add(function () { game.state.start('gamemain'); });
		}
		else if (worldlocate == 'world2') {
			buttonClose.events.onInputDown.add(function () { game.state.start('world2'); });
		} else if (worldlocate == 'world3') {
			buttonClose.events.onInputDown.add(function () { game.state.start('world3'); });
		} else if (worldlocate == 'world5') {
			buttonClose.events.onInputDown.add(function () { game.state.start('world5'); });
		} else if (worldlocate == 'world4') {
			buttonClose.events.onInputDown.add(function () { game.state.start('world4'); });
		} else if (worldlocate == 'hospital') {
			buttonClose.events.onInputDown.add(function () { game.state.start('hospital'); });
		}

	}
	this.update = function () {
		count++;
		if(!(count%7))
		{
			if (cursors.left.isDown && chooseframe.x>22) {

				chooseframe.x -= 100;
				temp_best_id -= 1;
				viewinfomove.play();
				console.log(temp_best_id);
	
			} else if (cursors.right.isDown && chooseframe.x <522) {
				chooseframe.x += 100;
				temp_best_id -= 1;
				temp_best_id += 2;
				viewinfomove.play();
				console.log(temp_best_id);
	
			} else if (cursors.up.isDown && chooseframe.y >160) {
				chooseframe.y -= 100;
				temp_best_id -= 6;
				viewinfomove.play();
				console.log(temp_best_id);
	
			} else if (cursors.down.isDown && chooseframe.y <360) {
				chooseframe.y += 100;
				temp_best_id -= 1;
				temp_best_id += 7;
				viewinfomove.play();
				console.log(temp_best_id);
			}
		}


		if (keyboard.enter.isDown) {
			if(temp_best_id<judge)
			{
				viewinfoclick.play();
				best_monster_id = temp_best_id;
			}
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

function Fighting(game) {
	var player;
	var monster;
	var actFire;
	var actFire2;
	var ball;
	var tmp_HP = 0;
	var waiting = false;
	var myTurn = true;
	var isOver = false;

	var box;
	var lifeText;
	var tips;
	var level_up = false;
	this.preload = function () {
		waiting = false;
		myTurn = true;
		isOver = false;
		game.load.image('ball', 'assets/ball.png');
	}
	this.create = function () {
		fight_over = false;
		game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.back_to_map, this);
		game.add.sprite(0, 0, 'fightingback');

		mainbackmusic.pause();
		pkmusic.play();

		//monster
		var img = (monsterData[fightingID][1] % 4) * 3 + parseInt(monsterData[fightingID][1] / 4) * 48;
		if (fightingID <= 1) {
			monster = game.add.sprite(480, 260, 'sheet-monster', img + 1)//*
		} else {
			monster = game.add.sprite(480, 260, monsterData[fightingID][7])//*
		}

		monster.anchor.setTo(0.5, 0.5);
		monster.scale.setTo(2.5, 2.5);//*
		monster.life = monsterData[fightingID][4];
		monster.damage = monsterData[fightingID][5];
		actFire = game.add.sprite(480, 260, 'fire', 6);
		actFire.anchor.setTo(0.5, 0.5);
		actFire.animations.add('one-1', [0, 2, 4, 6, 9], 10, false);
		actFire.animations.add('one-2', [1, 3, 5, 7, 9], 10, false);
		actFire.animations.add('two', [0, 2, 4, 6, 1, 3, 5, 7, 9], 10, false);
		//player

		if (best_monster_id == 0) {
			player = game.add.sprite(140, 420, 'pika', 12);
			player.life = playerData[3];
			player.damage = weapons[playerData[7]][1];
		} else {
			player = game.add.sprite(140, 420, MyMonsterData[best_monster_id][5], 12);
			player.life = MyMonsterData[best_monster_id][1];
			player.damage = MyMonsterData[best_monster_id][2];
		}
		player.anchor.setTo(0.5, 0.5);
		player.scale.setTo(2.5, 2.5);

		//20180615
		level_up_animation = game.add.sprite(70, 310, 'levelup');
		level_up_animation.animations.add('levelup_animation', [0, 1, 2, 3, 4, 5, 6], 10, true);
		level_up_animation.visible = false;

		actFire2 = game.add.sprite(140, 420, 'fire2', 3);
		actFire2.anchor.setTo(0.5, 0.5);
		actFire2.animations.add('one-1', [0, 1, 2, 3, 7], 10, false);
		actFire2.animations.add('one-2', [4, 5, 6, 3, 7], 10, false);
		actFire2.animations.add('two', [0, 1, 2, 4, 5, 6, 7], 10, false);
		// box player
		var boximg = game.make.bitmapData(game.width - 4, game.height - 4);
		boximg.context.strokeStyle = "rgb(192,192,192)";
		boximg.context.strokeRect(0, 0, game.width - 4, 80);
		boximg.rect(0, 0, game.width - 4, 80, "rgba(100,150,250,0.5)");

		box = game.add.sprite(2, game.height - 83, boximg);

		var ifont = { fontSize: '16px', fill: '#fff' };
		if (best_monster_id == 0) {
			box.addChild(game.add.sprite(25, 10, 'pika', 1));
			box.addChild(game.add.text(20, 50, playerData[0], ifont));
			lifeText = game.add.text(120, 20, "生命 : " + playerData[3], ifont);
			box.addChild(lifeText);
			box.addChild(game.add.text(120, 40, "法力 : " + playerData[4], ifont));
		} else {
			box.addChild(game.add.sprite(25, 10, MyMonsterData[best_monster_id][5], 1));
			box.addChild(game.add.text(20, 50, MyMonsterData[best_monster_id][0], ifont));
			lifeText = game.add.text(120, 20, "生命 : " + MyMonsterData[best_monster_id][1], ifont);
			box.addChild(lifeText);
			box.addChild(game.add.text(120, 40, "法力 : " + MyMonsterData[best_monster_id][2], ifont));
		}

		//box monster
		var boximgmonster = game.make.bitmapData(game.width - 4, game.height - 4);
		boximgmonster.context.strokeStyle = "rgb(192,192,192)";
		boximgmonster.context.strokeRect(0, 0, game.width - 4, 80);
		boximgmonster.rect(0, 0, game.width - 4, 80, "rgba(100,150,250,0.5)");

		boxmons = game.add.sprite(2, game.height - 470, boximgmonster);
		if (fightingID <= 1) {
			boxmons.addChild(game.add.sprite(25, 10, 'sheet-monster', img + 1));
		} else {
			boxmons.addChild(game.add.sprite(25, 10, monsterData[fightingID][7]));
		}

		var ifont = { fontSize: '16px', fill: '#fff' };
		boxmons.addChild(game.add.text(20, 50, monsterData[fightingID][0], ifont));
		lifeTextmons = game.add.text(120, 20, "生命 : " + monsterData[fightingID][4], ifont);
		boxmons.addChild(lifeTextmons);
		boxmons.addChild(game.add.text(120, 40, "法力 : " + monsterData[fightingID][5], ifont));

		ball = game.add.sprite(0, 300, 'ball');
		ball.visible = false;


		tips = game.add.text(0, 0, "", ifont);
		tips.anchor.setTo(0.5, 0.5);
		tips.alpha = 0;

		var buttonAtt = game.add.button(game.width - 134, game.height - 160, 'button-att', null, this, 0, 1, 0, 1);
		buttonAtt.events.onInputDown.add(function () {
			if (myTurn && !waiting) {
				waiting = true;
				game.add.tween(player).to({ x: 480, y: 260, width: 56, height: 56 }, 200, "Linear", true).onComplete.add(function () {
					actFire.animations.play('one-1');
				}, this);
			}
		});
		var buttonClose = game.add.button(game.width - 68, game.height - 160, 'button-leave', null, this, 0, 1, 0, 1);
		buttonClose.events.onInputDown.add(function () {
			fight_over = true;
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
			} else if (worldlocate == 'hospital') {
				game.state.start('hospital');
			}
			mainbackmusic.play();
			pkmusic.pause();
			pkmusic.currentTime = 0;
		});

	};
	this.update = function () {
		if (isOver) {
			fight_over = true;
			if (monster.life <= 0) { //win
				ball.visible = true;
				this.ThrowBallAnimation();
				this.WinAnimation();
				tmp_HP = (monsterData[fightingID][4] != 0) ? monsterData[fightingID][4] : tmp_HP;
				MyMonsterData[best_monster_id][4] += (monsterData[fightingID][4] != 0) ? monsterData[fightingID][10] : 0;
				if ((MyMonsterData[best_monster_id][4] >= (MyMonsterData[best_monster_id][3] * MyMonsterData[best_monster_id][3] + 100)) && !level_up) {
					level_up_animation.visible = true;
					level_up_animation.animations.play('levelup_animation');
					MyMonsterData[best_monster_id][3] += 1;
					level_up = true;
					MyMonsterData[best_monster_id][4] = 0;
					MyMonsterData[best_monster_id][1] += 100;
					MyMonsterData[best_monster_id][2] += 50;
					console.log('level up');
				}
				monsterData[fightingID][4] = 0;
				for (idx in taskData) {
					if (taskData[idx][1] == fightingID && taskData[idx][0] > 0 && taskData[idx][0] != 9) {
						taskData[idx][3]++;
						taskData[idx][0] = taskData[idx][3] >= taskData[idx][2] ? 8 : taskData[idx][0]; //如果达到数值，则标志为待确认 如果達到數值，則標誌為待確認
					}
				}
				//game.state.start('gamemain');
			} else {
				game.state.start('gameover');
			}
			//这里可以增加些经验、得到些宝物(简体中文)……這裡可以增加些經驗、得到些寶物(繁體中文)
		} else {
			if (myTurn) {
				if (waiting && actFire.frame == 9) {
					player.reset(140, 420);
					player.scale.setTo(2.5, 2.5);
					actFire.frame = 6;
					actFire.animations.stop();

					var killValue = player.damage + parseInt(Math.random() * player.damage);
					monster.life -= killValue;
					lifeTextmons.text = "生命 : " + monster.life;
					tips.reset(monster.x - 10, monster.y - 10);
					tips.text = "-" + killValue;
					tips.alpha = 1;
					game.add.tween(tips).to({ y: monster.y - 60, alpha: 0 }, 500, "Linear", true).onComplete.add(function () {
						waiting = false;
						myTurn = false;
						if (monster.life <= 0) { isOver = true; }
					}, this);
				}
			} else {
				if (!waiting) {
					waiting = true;
					game.add.tween(monster).to({ x: 150, y: 400, width: 56, height: 56 }, 200, "Linear", true).onComplete.add(function () {
						actFire2.animations.play('one-1');
					}, this);
				} else {
					if (actFire2.frame == 7) { //刀光结束
						monster.reset(480, 260);
						monster.scale.setTo(2.5, 2.5);
						actFire2.frame = 3;
						actFire2.animations.stop();

						var killValue = parseInt(monster.damage * (Math.random() + 1) / 2);
						tips.reset(player.x, player.y - 30);
						tips.text = "-" + killValue;
						tips.alpha = 1;
						game.add.tween(tips).to({ y: player.y - 60, alpha: 0 }, 500, "Linear", true).onComplete.add(function () {
							waiting = false;
							myTurn = true;
						}, this);
						player.life -= killValue;
						lifeText.text = "生命 : " + player.life;
						if (player.life <= 0) { isOver = true; }

					}
				}
			}
		}
	};
	this.WinAnimation = function () {
		game.add.tween(monster).to({ x: 480, y: 290, width: 0, height: 0 }, 300, "Linear", true).onComplete.add(function () { }, this);
	};
	this.ThrowBallAnimation = function () {
		game.add.tween(ball).to({ x: 480 - 20, y: 290 - 20, width: 40, height: 40 }, 100, "Linear", true).onComplete.add(function () { }, this);
	};
	this.back_to_map = function () {

		if (monster.life <= 0) {
			this.CollectMonsters();
			if (worldlocate == 'gamemain') {
				game.state.start('gamemain');
			}
			else if (worldlocate == 'world2') {
				game.state.start('world2');
			} else if (worldlocate == 'world3') {
				game.state.start('world3');
			} else if (worldlocate == 'world4') {
				game.state.start('world4');
			}
		}
		ball.visible = false;
		pkmusic.pause();
		pkmusic.currentTime = 0;
		mainbackmusic.play();
	};
	this.CollectMonsters = function () {
		console.log('tmp_HP : ' + tmp_HP);
		//my怪物數據:0.名字、1.生命 2.攻擊力  3.等級 4.經驗值 5.圖片編號
		//怪物數據:0.名字、1.圖片ID、2.x、3.y、4.生命、5.攻擊力、6.對話內容、7.圖片編號、8.Visible 、9.出現地圖的ID、 10.獲得之經驗值gain 11.Level
		var valid = true;
		for (idx in MyMonsterData) {
			if (MyMonsterData[idx][0] == monsterData[fightingID][0]) {
				valid = false;
			}
		}
		if (valid) {
			console.log('抓！');
			MyMonsterData[MyMonsterData.length] = [monsterData[fightingID][0], tmp_HP, monsterData[fightingID][5], monsterData[fightingID][11], 0, monsterData[fightingID][7]];
		}
		else {
			console.log('抓到重複的囉！');
		}
	};
}
