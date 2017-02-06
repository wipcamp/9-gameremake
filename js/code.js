
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    var main = {preload : preload,create: create,update:update};
    game.state.add('main', main);
    game.state.start('main');
    

    var player;
    var enemy;
    var enemyRight = [];
    var enemyLeft = [];
    var count;
    var boundsA;
    var boundsB;
    var countGame;
    var count;
    var l =0;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function preload() {
            game.load.image('ground', 'assets/ground.png');
            game.load.spritesheet('player', 'assets/warrior_m.png', 32, 36);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function create() {
            this.enemyRight = [];
            this.enemyLeft = [];
            //backgroupColor
            game.stage.backgroundColor = '#6666FF';

            //ground
            this.myWorld = game.add.group();
            this.myWorld.enableBody = true;
            var ground = this.myWorld.create(0, game.world.height - 64, 'ground');
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;

            //tower
            this.myTower = game.add.group();
            this.myTower.enableBody = true;
            var tower = this.myTower.create(360,game.world.height -100,'ground');
            tower.scale.setTo(0.2, 1);
            tower.body.immovable = true;
            this.hp = 10;
            this.hpText;

            this.hpText = game.add.text(16, 16, 'HP : ' + this.hp, {
                fontSize: '20px',
                fill: '#ed3465'
              });

            //player
            this.player = game.add.sprite(385,500,'player');
            game.physics.arcade.enable(this.player);
            this.player.body.bounce.y = 0.25;
            this.player.body.gravity.y=980;
            this.player.body.collideWorldBounds = true;

            //animation
            this.player.animations.add('right', [3, 4, 5], 10, true);
            this.player.animations.add('left', [9, 10, 11], 10, true);
            this.player.frame = 6;

            //cursors
            this.cursors = this.input.keyboard.createCursorKeys(); 
            this.spacebar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        
        //console.log(this.enemy.getBounds());

    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function update() {
            game.physics.arcade.collide(this.player, this.myWorld);
            game.physics.arcade.collide(this.enemys, this.myWorld);
            console.log(l);
            if(l%60==0){
                summonEnemyRight();
                summonEnemyLeft();  
            }
            l++;
            

            //enemy hit tower
            if (game.physics.arcade.collide(this.enemy, this.myTower)){
                this.enemy.kill();
                this.hp -= 1;
                this.hpText.text = 'HP : ' + this.hp;
            }

            //overlap
            //if (checkOverlap(this.player, this.enemy)&&this.spacebar.isDown){
            //    this.enemy.kill();
            //    this.countEnemy--;
            //}


            //checkCursor
            this.player.body.velocity.x = 0;
            if (this.cursors.right.isDown) {
              this.player.body.velocity.x = 200;
              this.player.animations.play('right');
            } else if (this.cursors.left.isDown) {
              this.player.body.velocity.x = -200;
              this.player.animations.play('left');
            } else {
              this.player.frame = 6;
            }

            if (this.hp == 0){
                game.state.start('main');
            }

        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //spawnEnemy
        function createEnemyRight(index){
                this.countEnemy = 0;
                //crate enemy
                this.enemy = game.add.sprite(800,450,'enemy');
                game.physics.arcade.enable(this.enemy);
                this.enemy.name = index;
                this.enemy.body.bounce.y = 0.25;
                this.enemy.body.gravity.y=980;
                
                //check move
                this.enemy.body.velocity.x= -200;


                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function createEnemyLeft(index){
                this.countEnemy = 0;
                //crate enemy
                this.enemy = game.add.sprite(0,450,'enemy');
                game.physics.arcade.enable(this.enemy);
                this.enemy.name = index;
                this.enemy.body.bounce.y = 0.25;
                this.enemy.body.gravity.y=980;
                
                //check move
                this.enemy.body.velocity.x= 50;


                //animetion and collideWorldBounds
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
        }
            
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function summonEnemyRight() {
            var l = this.enemyRight.length;
            for(var i=0;i<l;i++)
                this.enemyRight.pop();
            this.countEnemy=10;
            for (var i = 0; i < 10; i++){
                this.enemyRight.push(new createEnemyRight(i));
            }
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
         function summonEnemyLeft()  {
            var l = this.enemyLeft.length;
            for(var i=0;i<l;i++)
                this.enemyLeft.pop();
            this.countEnemy=10;
            for (var i = 0; i < 10; i++){
                this.enemyLeft.push(new createEnemyLeft(i));
            }
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function checkOverlap(spriteA, spriteB) {
            boundsA = spriteA.getBounds();
            boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function count(num){
            var i = 0
            if(i == 0){
               this.count = 2000; 
            }
            this.count -= num;
            return this.count;
        }
        


