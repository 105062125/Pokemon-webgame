var worldlocate = 'gamemain';
var load_once = false;
var playerdata_load_once = false;
var best_monster_id = 0;
var fight_over = true;
//NPCDATA:名字、圖片id、x、y、對話内容、事件標誌(用於激活相應的任務)
var npcData = [
    ["蘿莉", 1, 5, 5, "好好的一个村子說没就没了，嗚嗚～～|我和弟弟走散了，你能幫我找他回来嗎？", 0, 0],
    ["阿拉花瓜", 2, 18, 5, "怪物！怪物！|哇！你這麼醜，不會是怪物變的吧？", 0, 0],
    ["花痴", 3, 25, 5, "聽說幾百年前也發生過類似的事情！|你就是傳說中的救世英雄嗎？看著不像啊。|傳說救世英雄是一個英俊瀟灑的小伙子～～～", 0, 0],
    ["覺青", 4, 5, 10, "老村長肯定有什么事瞞著我們……|我的夢想就是拯救世界，現在機會来了！|别打攪我，我要練功呢。", 2, 1],
    ["村長", 6, 15, 10, "我老了，拯救世界就靠你們年輕人了。|如果能找到傳說中的倚天劍就好了……", 1, 0]
];
//經驗值Max = 等級^2 + 100
//my怪物數據:0.名字、1.生命 2.攻擊力  3.等級 4.經驗值 5.圖片編號
var MyMonsterData = [
    ["皮卡丘", 100, 100, 1, 0, 0],
];
//怪物數據:0.名字、1.圖片ID、2.x、3.y、4.生命、5.攻擊力、6.對話內容、7.圖片編號、8.Visible 、9.出現地圖的ID、 10.獲得之經驗值gain 11.Level
var monsterData = [
    ["狼人", 0, 15, 28, 50, 10, "嗷呜……", "", 0, 0, 30, 5],
    ["牛怪", 2, 28, 25, 200, 50, "哞……", "", 0, 0, 30, 7],
    ["緯杰", 0, 22, 28, 100, 10, "幹", 'bang', 1, 1, 300, 3],
    ["小火龍", 0, 7, 10, 70, 20, "幹", '004', 1, 1, 30, 10],
    ["小屁孩", 0, 10, 10, 65, 30, "幹", '492', 1, 1, 30, 1],
    ["水箭龜", 0, 20, 10, 200, 70, "幹", '009', 1, 1, 30, 6],
    ["BOSS", 0, 26, 12, 500, 30, "幹", '486', 1, 1, 30, 15],
    ["哥達鴨", 0, 26, 5, 500, 30, "幹", '055', 1, 1, 30, 9],
    ["大舌舔", 0, 26, 5, 500, 30, "幹", '108', 1, 1, 30, 4],
    ["雙彈瓦斯", 0, 26, 5, 500, 1000, "幹", '110', 1, 1, 30, 5],
    ["九尾", 0, 39, 12, 125, 50, "幹", '038', 1, 3, 30, 3],
    ["胖丁", 0, 43, 18, 150, 20, "幹", '039', 1, 3, 30, 3],
    ["大嘴福", 0, 4, 27, 70, 15, "幹", '042', 1, 2, 30, 2],
    ["可達鴨", 0, 10, 29, 200, 5, "幹", '054', 1, 3, 30, 3],
    ["勇吉拉", 0, 47, 15, 120, 30, "幹", '064', 1, 3, 30, 3],
    ["喇叭芽", 0, 14, 5, 100, 7, "幹", '069', 1, 4, 30, 3],
    ["小火馬", 0, 13, 11, 70, 20, "幹", '077', 1, 4, 30, 4],
    ["耿鬼", 0, 23, 74, 100, 20, "幹", '094', 1, 4, 30, 4],
    ["頑皮雷彈", 0, 15, 79, 100, 40, "幹", '101', 1, 4, 30, 4],
    ["椰蛋樹", 0, 10, 86, 200, 10, "幹", '103', 1, 4, 30, 4],
    ["嘎啦嘎拉", 0, 10, 300, 5, 30, "幹", '105', 1, 4, 30, 5],
    ["寶石海星", 0, 5, 83, 1000, 1, "幹", '121', 1, 4, 30, 6],
    ["拉普拉斯", 0, 17, 88, 200, 20, "幹", '131', 1, 4, 30, 7],
    ["多邊獸", 0, 2, 10, 100, 10, "幹", '137', 1, 3, 30, 5],
    ["卡比獸", 0, 49, 3, 1000, 1, "幹", '143', 1, 3, 30, 6],
    ["夢幻", 0, 60, 2, 10000, 1, "幹", '151', 1, 3, 30, 7],
    ["火球鼠", 0, 4, 29, 100, 10, "幹", '155', 1, 1, 30, 2],
    ["電龍", 0, 4, 22, 200, 15, "幹", '181', 1, 1, 30, 6],
    ["沼王", 0, 11, 30, 500, 7, "幹", '195', 1, 1, 30, 1],
    ["太陽伊布", 0, 16, 103, 10000, 1, "幹", '196', 1, 4, 30, 1],
    ["月亮伊布", 0, 7, 103, 10000, 1, "幹", '197', 1, 4, 30, 9],
    ["果然翁", 0, 10, 100, 100, 40, "幹", '202', 1, 4, 30, 9],
    ["麒麟奇", 0, 6, 26, 300, 24, "幹", '203', 1, 2, 30, 4],
    ["迷唇娃", 0, 11, 21, 150, 20, "幹", '238', 1, 2, 30, 4],
    ["班基拉斯", 0, 3, 15, 100, 15, "幹", '248', 1, 2, 30, 7],
    ["雪拉比", 0, 15, 14, 999, 99, "幹", '251', 1, 2, 30, 4],
    ["木守宮", 0, 27, 29, 100, 10, "幹", '252', 1, 1, 30, 4],
    ["樂天河童", 0, 27, 20, 100, 15, "幹", '272', 1, 1, 30, 1],
    ["奇魯莉安", 0, 5, 2, 200, 20, "幹", '281', 1, 3, 30, 4],
    ["朝北鼻", 0, 21, 3, 500, 10, "幹", '299', 1, 3, 30, 4],
    ["毒薔薇", 0, 32, 21, 150, 50, "幹", '315', 1, 3, 30, 3],
    ["吼吼驚", 0, 27, 15, 1000, 100, "幹", '320', 1, 3, 30, 3],
    ["變隱龍", 0, 42, 3, 50, 1, "幹", '352', 1, 3, 30, 4],
    ["徬徨夜靈", 0, 24, 69, 800, 60, "幹", '356', 1, 4, 30, 9],
    ["冰鬼", 0, 17, 61, 400, 60, "幹", '362', 1, 4, 30, 9],
];
var playerData = ["皮卡丘", 8, 2, 100, 100, 100, 100, 0, 0]; //名字，x座標，y座標，HP，MP，HPMAX，MPMAX，武器id，防具id
//20180615
var last_player_x = playerData[1];
var last_player_y = playerData[2];
var last_player_locaction = worldlocate;
var weapons = [["木劍", 1000], ["鐵劍", 50], ["倚天劍", 100]];
var armors = [["布衣", 10], ["皮衣", 50], ["天蠶衣", 100]];
//打怪任務：元素意義分別為：激活狀態、怪物ID、任務數值、當前數值、任務標題、參數
var taskData = [
    [9, 0, 1, 1, "空事件", "……", 0, 0],
    [0, 0, 1, 0, "殺掉狼人", "如果你能殺掉那個狼人，我將送你一把鐵劍。", "小伙子勇氣可嘉，這把鐵劍拿去吧！", 1, 0],
    [0, 1, 1, 0, "殺掉牛怪", "那牛怪太厲害了，千萬別靠近它！", "慚愧，我留這倚天劍何用？给你了！", 2, 0]
];
var fightingID = 0; //战斗目标的ID，对应monsterData的元素索引
var mainbackmusic = new Audio("mainbackmusic.mp3");
var pkmusic = new Audio("pkmusic.mp3");
function Boot(game) {
    this.preload = function () {
        game.load.spritesheet('loading', 'assets/loading.png', 80, 24);
    };
    this.create = function () {
        game.state.start('loading');
    }
}
function Loading(game) {

    var loadingSprite;
    this.preload = function () {
        game.load.audio('viewinfomove','viewinfomove.wav');
				game.load.audio('viewinfoclick','viewinfoclick.wav');
        loadingSprite = game.add.sprite(280, 200, 'loading');
        loadingSprite.animations.add('loadingplay', [0, 1, 2], 5, true);
        loadingSprite.animations.play('loadingplay');
        game.load.spritesheet('pika', 'assets/pika.png', 48, 48);
        game.load.spritesheet('sheet-hero', 'assets/heros.png', 32, 32);
        game.load.spritesheet('sheet-monster', 'assets/monsters.png', 32, 32);
        game.load.spritesheet('levelup', 'assets/light_burned.png', 135, 186);
        game.load.image('talkboximg', 'assets/talkbox.png');

        game.load.image('bigmaplook', 'assets/bigmaplook.jpg');
        game.load.image('maplocate', 'assets/maplocate.png');
        game.load.image('chooseframe', 'assets/chooseframe.png');

        game.load.spritesheet('button-arrow', 'assets/button-arrow.png', 64, 64);
        game.load.spritesheet('button-x', 'assets/button-x.png', 64, 64);
        game.load.spritesheet('button-menu', 'assets/button-menu.png', 64, 64);
        game.load.spritesheet('button-a', 'assets/button-a.png', 96, 96);
        game.load.spritesheet('button-att', 'assets/button-att.png', 64, 64);
        game.load.spritesheet('button-leave', 'assets/button-leave.png', 64, 64);
        game.load.image('button-start', 'images/AAAA.png');

        game.load.spritesheet('bang', 'assets/bang.png', 48, 48);
        game.load.spritesheet('004', 'assets/004.png', 48, 48);
        game.load.spritesheet('009', 'assets/009.png', 48, 48);
        game.load.spritesheet('492', 'assets/492.png', 48, 48);
        game.load.spritesheet('055', 'assets/055.png', 48, 48);
        game.load.spritesheet('110', 'assets/110.png', 48, 48);
        game.load.spritesheet('108', 'assets/108.png', 48, 48);
        game.load.spritesheet('486', 'assets/486.png', 72, 72);
        game.load.spritesheet('038', 'assets/038.png', 48, 48);
        game.load.spritesheet('039', 'assets/039.png', 48, 48);
        game.load.spritesheet('042', 'assets/042.png', 48, 48);
        game.load.spritesheet('054', 'assets/054.png', 48, 48);
        game.load.spritesheet('064', 'assets/064.png', 48, 48);
        game.load.spritesheet('069', 'assets/069.png', 48, 48);
        game.load.spritesheet('077', 'assets/077.png', 48, 48);
        game.load.spritesheet('094', 'assets/094.png', 48, 48);
        game.load.spritesheet('101', 'assets/101.png', 48, 48);
        game.load.spritesheet('103', 'assets/103.png', 48, 48);
        game.load.spritesheet('105', 'assets/105.png', 48, 48);
        game.load.spritesheet('121', 'assets/121.png', 48, 48);
        game.load.spritesheet('131', 'assets/131.png', 96, 96);
        game.load.spritesheet('137', 'assets/137.png', 48, 48);
        game.load.spritesheet('143', 'assets/143.png', 48, 48);
        game.load.spritesheet('151', 'assets/151.png', 48, 48);
        game.load.spritesheet('155', 'assets/155.png', 48, 48);
        game.load.spritesheet('181', 'assets/181.png', 48, 48);
        game.load.spritesheet('195', 'assets/195.png', 48, 48);
        game.load.spritesheet('196', 'assets/196.png', 48, 48);
        game.load.spritesheet('197', 'assets/197.png', 48, 48);
        game.load.spritesheet('202', 'assets/202.png', 48, 48);
        game.load.spritesheet('203', 'assets/203.png', 48, 48);
        game.load.spritesheet('238', 'assets/238.png', 48, 48);
        game.load.spritesheet('248', 'assets/248.png', 48, 48);
        game.load.spritesheet('251', 'assets/251.png', 48, 48);
        game.load.spritesheet('252', 'assets/252.png', 48, 48);
        game.load.spritesheet('272', 'assets/272.png', 48, 48);
        game.load.spritesheet('281', 'assets/281.png', 48, 48);
        game.load.spritesheet('299', 'assets/299.png', 48, 48);
        game.load.spritesheet('315', 'assets/315.png', 48, 48);
        game.load.spritesheet('320', 'assets/320.png', 48, 48);
        game.load.spritesheet('352', 'assets/352.png', 48, 48);
        game.load.spritesheet('356', 'assets/356.png', 48, 48);
        game.load.spritesheet('362', 'assets/362.png', 48, 48);

        game.load.image('menuback', 'assets/menuback.jpg');

        game.load.image('pokemonbig', 'assets/pokemonbig.png');
        game.load.image('bigmap', 'assets/bigmap.png');
        game.load.image('tiles-2', 'assets/tiles-2.png');

        game.load.image('world-ground', 'assets/world-background.png');
        game.load.image('world-fore', 'assets/world-fore.png');
        game.load.tilemap('world-1', 'assets/world-1.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('world2-ground', 'assets/world2-background.png');
        game.load.image('world2-fore', 'assets/world2-fore.png');
        game.load.tilemap('world-2', 'assets/world-2.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('world3-ground', 'assets/world3-background.png');
        //game.load.image('world2-fore', 'assets/world2-fore.png');
        game.load.tilemap('world-3', 'assets/world-3.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('world4-ground', 'assets/world4-background.png');
        //game.load.image('world2-fore', 'assets/world2-fore.png');
        game.load.tilemap('world-4', 'assets/world-4.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('world5-ground', 'assets/world5-background.png');
        game.load.image('world5-fore', 'assets/world5-fore.png');
        game.load.tilemap('world-5', 'assets/world-5.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('hospital-ground', 'assets/hospital-background.png');
        game.load.image('hospital-fore', 'assets/hospital-fore.png');
        game.load.tilemap('hospital', 'assets/hospital.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('fightingback', 'assets/fightingback.png');
        game.load.spritesheet('monster', 'assets/monsters.png', 32, 32);
        game.load.spritesheet('fire', 'assets/fire.png', 80, 40);
        game.load.spritesheet('fire2', 'assets/fire2.png', 58, 100);
    }
    this.create = function () {
        this.showposition();
        game.state.start('gamemenu');
    };
    this.showposition = function () {
        console.log('(' + playerData[1] + ',' + playerData[2] + ')');
    };

}
function GameMenu(game) {
    this.create = function () {
        this.LoadPlayerData();
        game.add.sprite(0, 0, 'menuback');
        var box = game.add.sprite(0, 200, game.make.bitmapData(game.width, game.height));
        box.addChild(game.add.text(100, 0, "出生於關都地區真新鎮的小皮卡丘...", { fontSize: '30px', fill: '#000000' }));
        box.addChild(game.add.text(230, 30, "踏上旅途吧", { fontSize: '30px', fill: '#000000' }));
        box.alpha = 0;
        game.add.tween(box).to({ alpha: 1, y: 20 }, 3000, "Linear", true);
        console.log(last_player_x + ',' + last_player_y);
        var buttonClose = game.add.button(285, 300, 'button-start', null, this, 0, 1, 0, 1);
        buttonClose.events.onInputDown.add(function () {
            if (last_player_locaction == 'gamemain') {
                game.state.start('gamemain');
            }
            else if (last_player_locaction == 'world2') {
                game.state.start('world2');
            }
            else if (last_player_locaction == 'world3') {
                game.state.start('world3');
            }
            else if (last_player_locaction == 'world4') {
                game.state.start('world4');
            }
            else if (last_player_locaction == 'world5') {
                game.state.start('world5');
            }
            else if (last_player_locaction == 'hospital') {
                game.state.start('hospital');
            }

        });
        console.log(last_player_x + ',' + last_player_y);
        game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function () { game.state.start('gamemain'); });
    }
    this.LoadPlayerData = function () {
        console.log(firebase.auth().currentUser);
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/playerdata/').once('value')
            .then(function (snapshot) {
                last_player_x = snapshot.val().player_x;
                last_player_y = snapshot.val().player_y;
                last_player_locaction = snapshot.val().location;
            })
            .catch(e => console.log(e.message));
    };
}
function GameWin(game) {
    this.create = function () {
        var box = game.add.sprite(0, 200, game.make.bitmapData(game.width, game.height));
        box.addChild(game.add.text(180, 0, "传说中的倚天剑重现江湖！", { fontSize: '20px', fill: '#fff' }));
        box.addChild(game.add.text(180, 30, "张有忌从此踏上了一条不归路……", { fontSize: '20px', fill: '#fff' }));
        box.addChild(game.add.text(180, 60, "英雄，保重！", { fontSize: '20px', fill: '#fff' }));
        box.alpha = 0;
        game.add.tween(box).to({ alpha: 1, y: 120 }, 3000, "Linear", true);

        var buttonClose = game.add.button(285, 300, 'button-x', null, this, 0, 1, 0, 1);
        buttonClose.events.onInputDown.add(function () {
            //game.state.start('gamemenu');
            location.reload();
        });
    }
}
function GameOver(game) {
    this.create = function () {
        var box = game.add.sprite(0, 200, game.make.bitmapData(game.width, game.height));
        box.addChild(game.add.text(180, 0, "就這樣眼前一片黑暗", { fontSize: '20px', fill: '#fff' }));
        box.addChild(game.add.text(180, 30, "讓我們重新開始吧……", { fontSize: '20px', fill: '#fff' }));
        box.alpha = 0;
        game.add.tween(box).to({ alpha: 1, y: 150 }, 3000, "Linear", true);
        var buttonClose = game.add.button(285, 300, 'button-x', null, this, 0, 1, 0, 1);
        buttonClose.events.onInputDown.add(function () {
            //game.state.start('gamemenu');
            location.reload();
        });
    }
}

window.onload = function () {
    var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'gamebox');
    game.state.add("boot", Boot);
    game.state.add("loading", Loading);
    game.state.add("gamemain", GameMain);
    game.state.add("world2", World2);
    game.state.add("world3", World3);
    game.state.add("world4", World4);
    game.state.add("world5", World5);
    game.state.add("hospital", Hospital);
    game.state.add("bigmap", Bigmap);
    game.state.add("viewinfo", ViewInfo);
    game.state.add("fighting", Fighting);
    game.state.add("gamemenu", GameMenu);
    game.state.add("gamewin", GameWin);
    game.state.add("gameover", GameOver);
    game.state.start('boot');
};