
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
    var walkSound;
    var attackedSound;
    var attackMissSound;
    var shootSound;
    var explodeSound;
    var music;
    var cOverlap = true;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/FloorOnly.png');
            game.load.image('clound', 'assets/CloudOnly.png');
            game.load.spritesheet('tower', 'assets/Tower.png', 200, 400);
            game.load.spritesheet('player', 'assets/Captain.png', 50, 75);
            game.load.spritesheet('enemy', 'assets/Bomber.png', 50, 75);
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
            game.load.image('bgGameOver', 'assets/GameOver.png');
            game.load.audio('gameOverSound','assets/sound/gameOver.mp3');
            game.load.audio('gameSound','assets/sound/mainGame.mp3');
            game.load.audio('mainSound','assets/sound/mainMenu.mp3');
            game.load.audio('walkSound','assets/sound/walk.mp3');
            game.load.audio('attackedSound','assets/sound/attacked.mp3');
            game.load.audio('attackMissSound','assets/sound/attackMiss.mp3');
            game.load.audio('shootSound','assets/sound/shot.aiff');
            game.load.audio('explodeSound','assets/sound/explode.mp3');
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function create() {

            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            //game.stage.backgroundColor = '#6666FF';
            game.add.tileSprite(0, 0, 800, 600, 'gameBg');

            music = game.add.audio('gameSound',0.4);
            music.loopFull();
            walkSound = game.add.audio('walkSound',0.3);
            attackedSound = game.add.audio('attackedSound',0.3);
            attackMissSound = game.add.audio('attackMissSound',0.3);
            shootSound = game.add.audio('shootSound',0.3);
            explodeSound = game.add.audio('explodeSound',0.1);

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
                    walkSound.play();
                    walkSound.loopFull();
                    player.animations.play('idleLeft');
                    //player.animations.play('attackLeft');
                }else {
                    walkSound.play();
                    walkSound.loopFull();
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
                    spawnBullet(player.x);
                    if(buttonX.duration === 0){
                    shootSound.play();
                    for (var i = 0; i < bulletGroup.length; i++) {
                        if(bulletGroup[i].alive){
                            if (cursorL) {
                                bulletGroup[i].body.velocity.x = -500;
                                console.log('shoot L');
                            }else if(cursorR){
                                bulletGroup[i].body.velocity.x = 500;
                                console.log('shoot R');
                            } 
                            for (var j = 0;j<enemyGroup.length;j++){
                                if (enemyGroup[j].alive) {
                                    if(checkOverlap(enemyGroup[j],bulletGroup[i])){
                                        if (cOverlap) {
                                            bulletGroup[i].kill();
                                            enemyGroup[j].kill();
                                            console.log("shoot overlap");
                                            score += 10;
                                            scoreText.text = 'SCORE : ' + score;
                                            cOverlap = !cOverlap;
                                            console.log(cOverlap);
                                        }
                                    
                                    
                                    }
                                } 
                            }
                            cOverlap = !cOverlap;
                            if (game.physics.arcade.collide(bulletGroup[i],myWorld)) {
                                    bulletGroup[i].kill();
                                }
                            

                        }
                    }
                    shootTime = 0; 
                    }

                }
            }

            

            
            


            
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
                        enemyGroup[i].body.velocity.x = 180;
                    }else if (enemyGroup[i].x == 800) {
                        enemyGroup[i].animations.play('left');
                        enemyGroup[i].body.velocity.x = -180;
                    }
                    if (buttonZ.duration === 0) {
                        if(buttonZ.isDown && !checkOverlap(enemyGroup[i],player)){
                            if (buttonZ.duration === 0) {
                                attackMissSound.play();
                            }
                            
                        }
                        if(checkOverlap(enemyGroup[i],player)&&buttonZ.isDown){
                        console.log("punch overlap");
                        attackedSound.play();
                        enemyGroup[i].kill();
                        score += 10;
                        scoreText.text = 'SCORE : ' + score;
                        }
                    } 
                    if(enemyGroup[i].overlap(this.tower)){
                        explodeSound.play();
                        enemyGroup[i].kill();
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
            console.log(positionX);
            bulletGroup.push(new createBullet(game,positionX));
            
        }

        //function createBullet(game,positionX){

        //}

        function createBullet(game,bulletX){
                console.log('Done');
                this.game = game;
                this.bullet = bullets.create(bulletX, 500, 'bullet');
                game.physics.arcade.enable(player);
                this.bullet.scale.setTo(100, 100);
                this.bullet.body.immovable = true;
                this.bullet.body.collideWorldBounds = true;
                this.alive = true;
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
                this.enemy = enemys.create(this.x, 500,'enemy');
                this.enemy.anchor.set(0.5);
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.gravity.y = 980;
                this.enemy.body.collideWorldBound = true;
                this.enemy.name = index;
                //console.log(this.enemy.name);
                this.enemy.body.velocity.x = 150;

                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('left', [0,1,2,3,4,5,6,7,8,9,10,11], 10, true);
                this.enemy.animations.add('right', [12,13,14,15,16,17,18,19,20,21,22,23], 10, true);
                //console.log(this.enemy);
                return this.enemy;
        }


////////////////////////////NewGame///////////////////////////////////////
         function newGame(){
            if (hp == 0){
                walkSound.stop();
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

            music = game.add.audio('mainSound',0.3);
            music.loopFull();

            var bullet = game.add.image(350,500,'bullet');
            console.log(bullet);
            bullet.scale.setTo(1, 1);
            bullet.anchor.set(20);
            

            var button = game.add.button(200, 500, 'buttonS', GoToMainGame, this, 1,0,2);
            //button.scale.setTo(1, 1);
            //console.log(button.x);

            var button2 = game.add.button(500, 500, 'buttonT', GoToHowToPlay, this, 1, 0,2);
            //button2.scale.setTo(0.5, 0.5);
        }

        function mainUpdate(){

        }

        function GoToMainGame () {
            music.stop();
            game.state.start('mainGame');
        }
        function GoToMainMenu () {
            music.stop();
            game.state.start('mainMenu');
        }
        function GoToHowToPlay () {
            music.stop();
            game.state.start('howToPlay');
        } 

////////////////////////////GameOver///////////////////////////////////////        
        function gameOverCreate(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroup
            game.add.tileSprite(0, 0, 800, 600, 'bgGameOver');

            music.stop();
            music = game.add.audio('gameOverSound',0.3);
            music.loopFull();

            var gameOverText = game.add.text(game.world.centerX - 120, 100, 'Game Over', {
                fontSize: '50px',
                fill: '#ed3465'
              });

            var scoreText = game.add.text(game.world.centerX - 50, 150, 'Score : ' + score, {
                fontSize: '30px',
                fill: '#ed3465'
              });
            score = 0;

            var button = game.add.button(150, 500, 'buttonM', GoToMainMenu, this, 1,0,2);
            //button.anchor.setTo(0.5, 0.5);

            var button2 = game.add.button(500, 500, 'buttonS', GoToMainGame, this, 1,0,2);
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

            music = game.add.audio('mainSound',0.3);
            music.loopFull();

            

            var button = game.add.button(game.world.centerX + 100, 500, 'buttonM', GoToMainMenu, this, 1,0,2);
            //button.scale.setTo(0.40, 0.40);

            var button2 = game.add.button(game.world.centerX + 250, 500, 'buttonS', GoToMainGame, this, 1,0,2);
            //button2.scale.setTo(0.40, 0.40);
        }

        function howToPlayUpdate(){

        }

 
