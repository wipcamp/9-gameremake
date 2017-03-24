
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    var mainGame = {preload : preload,create: create, update:update};
    var mainMenu = {preload : preload,create: mainCreate,update: mainUpdate}
    var gameOver = {preload : preload,create: gameOverCreate, update:gameOverUpdate};   
    var howToPlay = {preload : preload,create: howToPlayCreate, update:howToPlayUpdate}; 
    game.state.add('mainGame', mainGame);
    game.state.add('mainMenu', mainMenu);
    game.state.add('gameOver', gameOver);   
    game.state.add('howToPlay', howToPlay);  

    game.state.start('mainMenu');
    
    var indexEnemy = 0;
    var cursorL;
    var cursorR;
    var player;
    var myTower;
    var myWorld;
    var hp;
    var score = 0;
    var scoreText;
    var hpText;
    var cursors;
    var spacebar;
    var enemys;
    var boundsA;
    var boundsB;
    var timer;
    var timer2;
    var x;
    var newGame;
    var alive;
    var createEnemy;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/FloorOnly.png');
            game.load.spritesheet('player', 'assets/warrior_m.png', 32, 36);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
            game.load.spritesheet('buttonS', 'assets/start.png', 32, 36);
            game.load.spritesheet('buttonH', 'assets/howto.png', 32, 36);
            game.load.image('button', 'assets/button.png');
            game.load.image('mainBg', 'assets/MainMenuBackGround.png');
            game.load.image('gameBg', 'assets/BackgroundWithNoCloud.png');
            game.load.image('howTo', 'assets/How-to-play-v10.png');
            game.load.image('logo', 'assets/LogoGame.png');


        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function create() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            //game.stage.backgroundColor = '#6666FF';
            game.add.tileSprite(0, 0, 800, 600, 'gameBg');


            //ground
            myWorld = game.add.group();
            myWorld.enableBody = true;
            var ground = myWorld.create(0, game.world.height - 64, 'ground');
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;

            //tower
            myTower = game.add.group();
            myTower.enableBody = true;
            var tower = myTower.create(360,game.world.height -100,'ground');
            tower.scale.setTo(0.2, 1);
            tower.body.immovable = true;
            hp = 10;
            hpText;

            //HP
            hpText = game.add.text(16, 16, 'HP : ' + hp, {
                fontSize: '20px',
                fill: '#ed3465'
              });

            //cursors
            cursors = game.input.keyboard.createCursorKeys();
            spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            enemyGroup = [];
            enemys = game.add.group();
            enemys.enableBody = true;

            createPlayer(game);

            
            //console.log("mainGame");



    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update() {
            spawnEnemy();
            console.log(enemyGroup[0].name);
            //console.log(player);

            //spawnEnemy();
            game.physics.arcade.collide(player,myWorld);
            player.body.velocity.x = 0;
            if (cursors.right.isDown) {
              player.body.velocity.x = 200;
              player.animations.play('right');
              cursorR = true;
              cursorL = false;
            } else if (cursors.left.isDown) {
              player.body.velocity.x = -200;
              player.animations.play('left');
              cursorR = false;
              cursorL = true;
            } else {
              if(cursorL){
                player.animations.play('idleLeft');
              }else{
                player.animations.play('idleRight');
              }
            }

            if (cursors.up.isDown) {
                hp -= 1;
                hpText.text = 'HP : ' + hp;
            }

            /*
            for( var i =0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    game.physics.arcade.collide(enemyGroup[i].enemy,this.myWorld);
                } 
            }
            for( var i = 1; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    enemyGroup[i].update(i);
                }
            }
            */
            

            newGame();
            

        }
////////////////////////////Player///////////////////////////////////////

        function createPlayer(game){
            player = game.add.sprite(385,500,'player');
            game.physics.arcade.enable(player);
            player.body.bounce.y = 0.25;
            player.body.gravity.y=980;
            player.body.collideWorldBounds = true;

            //animation
            player.animations.add('right', [4, 5, 6,7], 10, true);
            player.animations.add('left', [8, 9, 10,11], 10, true);
            player.animations.add('idleLeft', [0, 1], 10, true);
            player.animations.add('idleRight', [2,3], 10, true);
            
        }


////////////////////////////Enemy///////////////////////////////////////
         createEnemy.prototype.update = function (i){
            if(checkOverlap(this.enemyGroup[i],this.player)&&spacebar.isDown){
              console.log("overlap");
              this.enemyGroup[i].kill();
            }else if(this.enemyGroup[i].overlap(myTower)){
                enemyGroup[i].kill();
                hp -= 1;
                hpText.text = 'HP : ' + hp;
            }
            if (x == 1){
                this.enemy.animations.play('right');
            }else {
                this.enemy.animations.play('left');
            }

        }

        function spawnEnemy(){
            enemyGroup.push(new createEnemy(indexEnemy,game));
            indexEnemy++;
            console.log(enemyGroup[indexEnemy]);
        }


         function createEnemy(index,game){
                var num; //= this.game.rnd.integerInRange(0, 1);
                var x;
                if (num == 1){
                    x = 0;
                }else {
                    x = 800
                } 

                //crate enemy
                this.game = game;
                this.alive = true;
                this.enemy = enemys.create(0, 450,'enemy');
                this.enemy.anchor.set(0.5);
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.gravity.y = 980;
                this.enemy.body.collideWorldBound = true;
                this.enemy.name = index.toString();
                this.enemy.body.velocity.x = 200;

                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
        }


////////////////////////////NewGame///////////////////////////////////////
         function newGame(){
            if (hp == 0){
                game.state.start('gameOver');
            }
        }

        function checkOverlap(spriteA, spriteB) {

            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }


////////////////////////////MainMenu///////////////////////////////////////
        function mainCreate(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            //game.stage.backgroundColor = '#6666FF';
            game.add.tileSprite(0, 0, 800, 600, 'mainBg');

            var logo = game.add.image(game.world.centerX - 150, 0, 'logo');
            logo.scale.setTo(0.40, 0.40);

            

            var button = game.add.button(200, 500, 'button', GoToMainGame, this, 0,1,2);
            button.scale.setTo(0.5, 0.50);
            console.log(button);

            var button2 = game.add.button(500, 500, 'button', GoToHowToPlay, this, 2, 1, 0);
            button2.scale.setTo(0.5, 0.5);
            console.log(button2);
        }

        function mainUpdate(){

        }

        function GoToMainGame () {
            game.state.start('mainGame');
        }
        function GoToMainMenu () {
            game.state.start('mainMenu');
        }
        function GoToHowToPlay () {
            game.state.start('howToPlay');
        } 

////////////////////////////GameOver///////////////////////////////////////        
        function gameOverCreate(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            game.stage.backgroundColor = '#6666FF';

            var gameOverText = game.add.text(game.world.centerX - 120, 100, 'Game Over', {
                fontSize: '50px',
                fill: '#ed3465'
              });

            var scoreText = game.add.text(game.world.centerX - 50, 200, 'Score : ' + score, {
                fontSize: '30px',
                fill: '#ed3465'
              });

            var button = game.add.button(game.world.centerX - 150, 400, 'button', GoToMainMenu, this, 2, 1, 0);
            button.anchor.setTo(0.5, 0.5);

            var button2 = game.add.button(600, 400, 'button', GoToMainGame, this, 2, 1, 0);
            button2.anchor.setTo(0.5, 0.5);
        }

        function gameOverUpdate(){

        }
////////////////////////////HOW TO PLAY/////////////////////////////////////// 
        function howToPlayCreate(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            //game.stage.backgroundColor = '#6666FF';
            game.add.tileSprite(0, 0, 800, 600, 'howTo');

            

            var button = game.add.button(game.world.centerX + 100, 500, 'button', GoToMainMenu, this, 2, 1, 0);
            button.scale.setTo(0.40, 0.40);

            var button2 = game.add.button(game.world.centerX + 250, 500, 'button', GoToMainGame, this, 2, 1, 0);
            button2.scale.setTo(0.40, 0.40);
        }

        function howToPlayUpdate(){

        }
        
