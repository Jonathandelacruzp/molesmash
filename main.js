enchant();

Mole = enchant.Class.create(Sprite, {
    initialize: function () {
        var game = enchant.Game.instance;
        var mole = new Sprite(82, 88);
        mole.image = game.assets["mole.png"];

        this.addEventListener("touchstart", function () {
            this.scene.removeChild(this);
        });
    }
});

Enemy = enchant.Class.create(Mole, {
    initialize: function () {
        Mole.call(this);
        this.frame = [0, 1, 2, 3, 4, 5, 6, 7];
        this.x = Math.random() * 288;
        this.y = Math.random() * 288;
    }
});

SineEnemy = enchant.Class.create(Enemy, {
    initialize: function () {
        Enemy.call(this);
        this.addEventListener('enterframe', function () {
            this.x += Math.sin(this.age / 10);
        });
    }
});

window.onload = function () {
    var game = new Core(480, 320);
    game.fps = 10;
    game.preload("mole.png", "farm.png"); /* Precargar imagenes */

    game.onload = function () {
        var map = new Map(480, 320);
        map.image = game.assets["farm.png"];
        map.loadData([[0]]); /*Cargar Mapa Posicion 0 por ser uno solo */

        game.rootScene.addChild(map);

        game.rootScene.addEventListener('enterframe', function () {

                this.addChild(new (Math.random() > 0.5 ? Enemy : SineEnemy)());

        });

    };
    game.start();
};
