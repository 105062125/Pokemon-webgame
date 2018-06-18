function World4(game) {

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
			if (idx <= 1 && !monsterData[idx][8] && monsterData[idx][9] == 4) {
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
			} else if (!monsterData[idx][8] && monsterData[idx][9] == 4) {
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
		var map = game.add.tilemap('world-4');
		map.addTilesetImage('tiles-2');

		//map.setTileIndexCallback(271, this.change, this);
		//map.setCollisionByExclusion([5,6,7,8]);//除指定tileid外的所有tile执行碰撞检测
		map.setCollision([3391]);//仅指定的tileid执行碰撞检测
		//切換到world3
		map.setTileLocationCallback(0, 6, 1, 1, this.changeworld3, this);



		//map.setCollision([680,681,682,683,684]);//仅指定的tileid执行碰撞检测
		//仅指定的tileid执行碰撞检测

		layer_1 = map.createLayer('touchlayer');
		layer_1.visible = false;
		layer_1.resizeWorld();

		//map.createLayer('ground-1').resizeWorld(); //背景图层，并重设WorldSize
		//map.createLayer('ground-2');
		game.add.sprite(0, 0, 'world4-ground'); //用一张大图代替tilemaplayer可提高性能

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
			if (idx <= 1 && monsterData[idx][8] && monsterData[idx][9] == 4) {
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
			} else if (monsterData[idx][8] && monsterData[idx][9] == 4) {
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
		//game.add.sprite(0, 0, 'world2-fore');



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
		if (keyboard.m.isDown) {
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
	this.changeworld3 = function () {
		console.log("換到地圖3");
		worldlocate = 'world3';
		game.state.start('world3');
		playerData[1] = 57;
		playerData[2] = 6;
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