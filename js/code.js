
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
    var enemyGroup = [];
    var cursors;
    var spacebar;
    var enemys;
    var enemy;
    var boundsA;
    var boundsB;
    var timer;
    var timer2;
    var x;
    var newGame;
    var alive;
    var createEnemy;
    var timer;
    var attack;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/FloorOnly.png');
            game.load.spritesheet('player', 'assets/Captain.png', 50, 75);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
            game.load.spritesheet('buttonS', 'assets/start.png', 150, 80);
            game.load.spritesheet('buttonT', 'assets/Tutorial.png', 150, 80);
            game.load.spritesheet('buttonM', 'assets/main.png', 150, 80);
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

            scoreText = game.add.text(16, 45, 'SCORE : ' + score, {
                fontSize: '20px',
                fill: '#ed3465'
              });

            //cursors
            cursors = game.input.keyboard.createCursorKeys();
            spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            
            enemys = game.add.group();
            enemys.enableBody = true;

            createPlayer(game);

            timer = game.time.create(true);
            timer.loop(1000, spawnEnemy, this);
            timer.start();
            //////////////////////////////////////
            spawnEnemy();
            //console.log("mainGame");



    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update() {
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
                if (cursorL) {
                    player.animations.play('idleLeft');
                    //player.animations.play('attackLeft');
                }else {
                    player.animations.play('idleRight');
                }
                
            }
            /*if (spacebar.isDown){
                if(cursorL){
                    return player.animations.play('attackLeft');
                }else{
                    return player.animations.play('attackRight');
                }
            }
            */


            
            if (cursors.up.isDown) {
                hp -= 1;
                hpText.text = 'HP : ' + hp;
            }

            
            for( var i =0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    game.physics.arcade.collide(enemyGroup[i],myWorld);
                } 
            }
            for( var i = 0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    if (enemyGroup[i].x == 0){
                        enemyGroup[i].animations.play('right');
                        return enemyGroup[i].body.velocity.x = 200;
                    }else if (enemyGroup[i].x == 800) {
                        enemyGroup[i].animations.play('left');
                        return enemyGroup[i].body.velocity.x = -200;
                    }
                    
                    if(checkOverlap(enemyGroup[i],player)&&spacebar.isDown){
                      console.log("overlap");
                        score += 10;
                        scoreText.text = 'SCORE : ' + score;
                        return enemyGroup[i].kill();
                    }else if(enemyGroup[i].overlap(myTower)){
                        hp -= 1;
                        hpText.text = 'HP : ' + hp;
                        return enemyGroup[i].kill();
                    }
                    
                }
            }

            newGame();
            
            
        }
////////////////////////////Player///////////////////////////////////////

        function createPlayer(game){
            player = game.add.sprite(385,400,'player');
            game.physics.arcade.enable(player);
            player.body.bounce.y = 0.25;
            player.body.gravity.y=980;
            player.body.collideWorldBounds = true;

            //animation
            player.animations.add('right', [31,32,33,34,35,36,37,38,39,40,41], 20, true);
            player.animations.add('left', [20,21,22,23,24,25,26,27,28,29,30], 20, true);
            player.animations.add('idleLeft', [0,1,2,3,4,5,6,7,8,9], 20, true);
            player.animations.add('idleRight', [10,11,12,13,14,15,16,17,18,19], 20, true);
            player.animations.add('attackLeft', [42,43,44,45,46,47,48,49,50,51,52], 20, true);
            player.animations.add('attackRight', [53,54,55,56,57,58,59,60,61,62,63], 11, true);

        }


////////////////////////////Enemy///////////////////////////////////////
        function spawnEnemy(){
            
            enemyGroup.push(new createEnemy(indexEnemy,game));
            indexEnemy++;
            //console.log(enemyGroup[0].enemy);
        }



        function createEnemy(index,game){
                var num = game.rnd.integerInRange(0, 1);
                //console.log(num);
                if (num == 1){
                    this.x = 0;
                }else {
                    this.x = 800
                } 
                //console.log(this.x);
                //crate enemy
                this.game = game;
                this.alive = true;
                this.enemy = enemys.create(this.x, 450,'enemy');
                this.enemy.anchor.set(0.5);
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.gravity.y = 980;
                this.enemy.body.collideWorldBound = true;
                this.enemy.name = index;
                //console.log(this.enemy.name);
                this.enemy.body.velocity.x = 200;

                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
                //console.log(this.enemy);
                return this.enemy;
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

            

            var button = game.add.button(200, 500, 'buttonS', GoToMainGame, this, 1,0,2);
            //button.scale.setTo(1, 1);
            //console.log(button.x);

            var button2 = game.add.button(500, 500, 'buttonT', GoToHowToPlay, this, 1, 0,2);
            //button2.scale.setTo(0.5, 0.5);
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
            score = 0;

            var button = game.add.button(game.world.centerX - 150, 400, 'buttonM', GoToMainMenu, this, 1,0,2);
            //button.anchor.setTo(0.5, 0.5);

            var button2 = game.add.button(450, 400, 'buttonS', GoToMainGame, this, 1,0,2);
            //button2.anchor.setTo(0.5, 0.5);
        }

        function gameOverUpdate(){

        }
////////////////////////////HOW TO PLAY/////////////////////////////////////// 
        function howToPlayCreate(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            //game.stage.backgroundColor = '#6666FF';
            game.add.tileSprite(0, 0, 800, 600, 'howTo');

            

            var button = game.add.button(game.world.centerX + 100, 500, 'buttonM', GoToMainMenu, this, 1,0,2);
            //button.scale.setTo(0.40, 0.40);

            var button2 = game.add.button(game.world.centerX + 250, 500, 'buttonS', GoToMainGame, this, 1,0,2);
            //button2.scale.setTo(0.40, 0.40);
        }

        function howToPlayUpdate(){

        }
        
