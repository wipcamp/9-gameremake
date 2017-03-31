
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
    var tower;
    var hpbar;
    var buttonZ;
    var buttonX;
    var bulletGroup = [];
    var bulletX;
    var shootTime = 200;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/FloorOnly.png');
            game.load.image('clound', 'assets/CloudOnly.png');
            game.load.spritesheet('tower', 'assets/Tower.png', 200, 400);
            game.load.spritesheet('player', 'assets/Captain.png', 50, 75);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
            game.load.spritesheet('buttonS', 'assets/start.png', 150, 80);
            game.load.spritesheet('buttonT', 'assets/Tutorial.png', 150, 80);
            game.load.spritesheet('buttonM', 'assets/main.png', 150, 80);
            game.load.spritesheet('hpbar', 'assets/HP.png', 200, 40);
            game.load.image('button', 'assets/button.png');
            game.load.image('mainBg', 'assets/MainMenuBackGround.png');
            game.load.image('gameBg', 'assets/Background.png');
            game.load.image('howTo', 'assets/How-to-play-v10.png');
            game.load.image('logo', 'assets/LogoGame.png');
            game.load.image('bullet', 'assets/Bullet.png');

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
            this.tower = game.add.sprite(300,230,'tower');
            this.tower.scale.setTo(1, 1);
            game.physics.arcade.enable(this.tower);
            this.tower.animations.add('idle',[0],10,true);
            this.tower.body.collideWorldBounds = false;
            //console.log(tower);

            hp = 20;
            hpText;

            //HP
            /*
            this.hpbar = game.add.sprite(16,16,'hpbar');
            this.hpbar.scale.setTo(1, 1);
            game.physics.arcade.enable(this.hpbar);
            this.hpbar.body.collideWorldBounds = false;
            this.hpbar.animations.add('5',[0,1,2,3,4,5,6,7,8],10,true);
            this.hpbar.animations.add('4',[9,10,11,12,13,14,15,16,17],10,true);
            this.hpbar.animations.add('3',[18,19,20,21,22,23,24,25,26],10,true);
            this.hpbar.animations.add('2',[27,28,29,30,31,32,33,34,35],10,true);
            this.hpbar.animations.add('1',[36,37,38,39,40,41,42,44],10,true);
            */
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
            buttonZ = this.input.keyboard.addKey(Phaser.Keyboard.Z)
            buttonX = this.input.keyboard.addKey(Phaser.Keyboard.X)

            
            enemys = game.add.group();
            enemys.enableBody = true;
            bullets = game.add.group();
            bullets.enableBody = true;


            createPlayer(game);

            timer = game.time.create(true);
            timer.loop(1000, spawnEnemy, this);
            timer.start();
            //////////////////////////////////////
            spawnEnemy();
            //console.log("mainGame");

            createBullet(game,500);

    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update() {
            //spawnEnemy();
            if (shootTime < 200) {
                shootTime++;
            }
            
            this.tower.animations.play('idle');

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

            if (buttonZ.isDown){
                if(cursorL){
                    player.animations.stop('left');
                    player.animations.play('attackLeft');
                }else{
                    player.animations.stop('right');
                    player.animations.play('attackRight');
                }
            }

            if (shootTime === 200) {
                if (buttonX.isDown) {
                    console.log('player X : '+player.x);
                    spawnBullet(player.x);
                    for (var i = 0; i < bulletGroup.length; i++) {
                        if(bulletGroup[i].alive){
                            if (cursorL) {
                                bulletGroup[i].body.velocity.x = -200;
                            }else{
                                bulletGroup[i].body.velocity.x = 200;
                            } 
                            if(checkOverlap(enemyGroup[i],bulletGroup[i])){
                                enemyGroup[i].kill();
                                bulletGroup[i].kill();
                                console.log("shoot overlap");
                                score += 10;
                                scoreText.text = 'SCORE : ' + score;
                                
                            }
                            if (game.physics.arcade.collide(bulletGroup[i],myWorld)) {
                                bulletGroup[i].kill();
                            }

                        }
                    }
                    shootTime = 0; 
                }
            }

            

            
            


            /*
            if (cursors.up.isDown) {
                hp -= 1;
                hpText.text = 'HP : ' + hp;
            }
            */

            
            for( var i =0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    game.physics.arcade.collide(enemyGroup[i],myWorld);
                } 
            }
            for( var i = 0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    if (enemyGroup[i].x == 0){
                        enemyGroup[i].animations.play('right');
                        enemyGroup[i].body.velocity.x = 200;
                    }else if (enemyGroup[i].x == 800) {
                        enemyGroup[i].animations.play('left');
                        enemyGroup[i].body.velocity.x = -200;
                    }
                    
                    if(checkOverlap(enemyGroup[i],player)&&buttonZ.isDown){
                        console.log("punch overlap");
                        score += 10;
                        scoreText.text = 'SCORE : ' + score;
                        enemyGroup[i].kill();
                    }
                    if(enemyGroup[i].overlap(this.tower)){
                        hp -= 1;
                        hpText.text = 'HP : ' + hp;
                        /*if (hp === 16){
                            this.hpbar.animations.play('5');
                        } else if (hp === 12){
                            this.hpbar.animations.play('4');
                        }else if (hp === 8){
                            this.hpbar.animations.play('3');
                        }else if (hp === 4){
                            this.hpbar.animations.play('2');
                        }else if (hp === 0){
                            this.hpbar.animations.play('1');
                        }*/
                        enemyGroup[i].kill();
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

        function spawnBullet(positionX){
            bulletGroup.push(new createBullet(game,positionX));
            console.log('Bullet X : '+bulletGroup[0].x);
        }

        function createBullet(game,bulletX){
            this.bullet = bullets.create(bulletX, 500, 'bullet');
            this.bullet.scale.setTo(100, 100);
            this.bullet.body.immovable = true;
            return this.bullet;
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
                this.enemy = enemys.create(this.x, 515,'enemy');
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

 
