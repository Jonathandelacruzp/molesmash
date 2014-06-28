enchant();

//Function to generate random numbers
rand = function (n) {
    return Math.floor(Math.random() * n);
};

//Maximum number of appearances of a single Mole
maxMole = 50;

//Total number of Moles
totalMole = 24;

var Puntos = 0;

//Define a class for holes, extending the Sprite class
Pit = Class.create(Sprite, {
    initialize: function (x, y) {
        //Call the Sprite class (super class) constructor
        enchant.Sprite.call(this, 68, 60);
        this.image = game.assets['mole-dark2.png'];
        this.x = x;
        this.y = y;

        //Defines an event listener to be run every frame
        this.addEventListener('enterframe', this.tick);
        //Defines an event listener for a Mole getting hit
        this.addEventListener('touchstart', this.hit);

        //Set the Mole mode to 2 (waiting) in the beginning
        this.mode = 2;
        this.nextMode = 0;
        this.waitFor = game.frame + rand(100);
        //Flag to keep track of when a Mole has been whacked 
        this.currentlyWhacked = false;
    },

    //Repeat the Mole's "appearing" animation
    tick: function () {
        if (game.frame % 1 != 0) return; //Run every 3 frames
        switch (this.mode) {
        case 0: //Mole is appearing
            this.frame++;
            if (this.frame >= 4) {
                /*Switch to Mode 2 (waiting)
                 *after appearing completely.*/
                this.mode = 2;
                /*The next mode to transition to
                 *is mode 1 (hide).*/
                this.nextMode = 1;
                this.waitFor = game.frame + rand(30);
            }
            break;

        case 1: //Mole hides in the hole
            this.frame--;
            if (this.frame <= 0) {
                /*Switch to Mode 2 (waiting)
                 *after hiding.*/
                this.mode = 2;
                /*The next mode to transition to
                 *is mode 0 (appear).*/
                this.nextMode = 0;
                this.waitFor = game.frame + rand(200);
                /*Reset flag after whacked Mole
                 *disappears.*/
                this.currentlyWhacked = false;

                //Reduce maximum amount of Moles
                maxMole--;

                 if (maxMole <= 0) {
                    
                    var puntosMaximo = localStorage.getItem('PuntosMaximo');

                    if (puntosMaximo) {
                      
                        if (Puntos > puntosMaximo) {
                                localStorage.setItem('PuntosMaximo', Puntos);
                                localStorage.setItem('PuntosActuales', Puntos);
                            }
                        
                        else {
                            localStorage.setItem('PuntosActuales', Puntos);
                        }
                    }
                    else
                        localStorage.setItem('PuntosMaximo', 0);
                    this.mode = 3;                    
                    if (maxMole <= -1 * totalMole + 1) {
                        game.end(scoreLabel.score, scoreLabel.text);                        
                    }
                    
                    document.location.href = 'end.html';                 
                }
            }
            break;

        case 2: //Wait
            if (game.frame > this.waitFor) {
                this.mode = this.nextMode;
            }
            break;

            //Do nothing
        case 3:
            break;
        }
    },
    //Whack Mole
    hit: function () {
        //Do nothing if Mole has been whacked
        if (this.currentlyWhacked) return;

        //When Mole has appeared at least half-way
        if (this.frame >= 2) {
            //Set flag so we know he's been whacked
            this.currentlyWhacked = true;

            //Mole after having been whacked
            this.frame = 5;
            this.mode = 2; //Switch to waiting mode
            this.nextMode = 1;
            this.waitFor = game.frame + 10;
            scoreLabel.add(1);
        }
    }
});


ScoreLabel = Class.create(Label, {
    initialize: function (x, y) {
        enchant.Label.call(this, "PUNTAJE:0");
        this.x = x;
        this.y = y;
        this.score = 0;
    },
    add: function (pts) {
        this.score += pts;
        Puntos += pts;
        this.text = "PUNTAJE:" + this.score;
    }
});

//Initialization
window.onload = function () {
    game = new Game(480, 320);
    game.preload('mole-dark2.png', 'farm.png');
    game.onload = function () {

        var map = new Map(480, 320);
        map.image = game.assets["farm.png"];
        map.loadData([[0]]); /*Cargar Mapa Posicion 0 por ser uno solo */
        game.rootScene.addChild(map);

        scoreLabel = new ScoreLabel(5, 5);
        game.rootScene.addChild(scoreLabel);

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 5; x++) {
                var pit = new Pit(x * 78 + 50, y * 58 + 120);
                game.rootScene.addChild(pit);
            }
        }
    }
    game.start();
}