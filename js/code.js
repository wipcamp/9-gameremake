
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    var main = {preload : preload,create: create,update:update};
    game.state.add('main', main);
    game.state.start('main');
    
    var indexEnemy = 0;
    var player;
    var myTower;
    var myWorld;
    var hp;
    var hpText;
    var cursors;
    var spacebar;
    var enemy;
    var enemys;
    var boundsA;
    var boundsB;
    var timer;
    var timer2;
    var x;
    var newGame;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/ground.png');
            game.load.spritesheet('player', 'assets/warrior_m.png', 32, 36);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function create() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //backgroupColor
            game.stage.backgroundColor = '#6666FF';

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
            this.cursors = input.keyboard.createCursorKeys(); 
            this.spacebar = input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            enemyGroup = [];
            enemys = game.add.group();
            enemys.enableBody = true;


    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update() {
            game.physics.arcade.collide(this.player,this.myWorld);
            player.update();

            for( var i =0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    game.physics.arcade.collide(enemyGroup[i].enemy,this.myWorld);
                }
            }
            for( var i =0; i < enemyGroup.length ; i++){
                if(enemyGroup[i].alive){
                    enemyGroup[i].update();
                }
            }

            newGame.update();

            

        }
////////////////////////////Player///////////////////////////////////////
        createPlayer.prototype.update = function(){

            //checkCursor
            player.body.velocity.x = 0;
            if (cursors.right.isDown) {
              player.body.velocity.x = 200;
              player.animations.play('right');
            } else if (cursors.left.isDown) {
              player.body.velocity.x = -200;
              player.animations.play('left');
            } else {
              player.frame = 6;
            }

        }

        function createPlayer(game){
            player = game.add.sprite(385,500,'player');
            game.physics.arcade.enable(player);
            player.body.bounce.y = 0.25;
            player.body.gravity.y=980;
            player.body.collideWorldBounds = true;

            //animation
            player.animations.add('right', [3, 4, 5], 10, true);
            player.animations.add('left', [9, 10, 11], 10, true);
            player.frame = 6;
        }


////////////////////////////Enemy///////////////////////////////////////
        createEnemy.prototype.update = function(){
            if(this.enemy.overlap(this.player)&&spacebar.isDown){
              console.log("overlap");
              this.enemy.kill();
            }else if(this.enemy.overlap(myTower)){
                enemy.kill();
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
        }


        function createEnemy(index,game){
                var num = Math.Integer((Math.random() * 1) + 1);
                var x;
                if (num == 1){
                    x = 0;
                }else {
                    x = 800
                } 

                //crate enemy
                this.game = game;
                this.alive = true;
                this.enemy = enemys.create(x, 450, 'enemy');
                this.enemy.anchor.set(0.5);
                this.enemy.scale.setTo(385, 500);
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.gravity.y = 980;
                this.enemy.body.collideWorldBound = true;
                this.enemy.name = indexEnemy.toString();


                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
        }


////////////////////////////NewGame///////////////////////////////////////
        newGame.prototype.update = function(){
            if (hp == 0){
                game.state.start('main');
            }
        }


            
