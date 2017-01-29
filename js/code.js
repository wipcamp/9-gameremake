
    var player;
    var enemy;
    var enemys;
    var count;
    var boundsA;
    var boundsB;
    var count = 60;
    var mainState = {
        preload: function() {
            game.load.image('ground', 'assets/ground.png');
            game.load.spritesheet('player', 'assets/warrior_m.png', 32, 36);
            game.load.spritesheet('enemy', 'assets/ninja_m.png', 32, 36);
        },

        create: function() {
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
            this.player = game.add.sprite(385,450,'player');
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
            

            this.enemys = game.add.group();
            this.enemys.enableBody = true;
            for(var i = 0;i<=10;i++){
                this.num = game.rnd.integerInRange(0, 10);
                if(this.num <=4){
                    x = 0;
                }else{
                    x = 800;
                }
                this.enemy = game.add.sprite(x,450,'enemy');
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.bounce.y = 0.25;
                this.enemy.body.gravity.y=980;
                this.enemy.body.collideWorldBounds = true;
                if (x == 0) {
                    this.enemy.body.velocity.x = 200;
                }else{
                    this.enemy.body.velocity.x = -200;
                }
                //animation
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.frame = 6;
                this.enemys.add(this.enemy);
            }

            //game.time.events.loop(1000,spawnEnemy(), this);

        },

        update: function() {
            game.physics.arcade.collide(this.player, this.myWorld);
            game.physics.arcade.collide(this.enemys, this.myWorld);
            
            if () {
                this.num = game.rnd.integerInRange(0, 10);
                if(this.num <=4){
                    x = 0;
                }else{
                    x = 800;
                }
                this.enemy = game.add.sprite(x,450,'enemy');
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.bounce.y = 0.25;
                this.enemy.body.gravity.y=980;
                this.enemy.body.collideWorldBounds = true;
                if (x == 0) {
                    this.enemy.body.velocity.x = 200;
                }else{
                    this.enemy.body.velocity.x = -200;
                }
                //animation
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.frame = 6;
                this.enemys.add(this.enemy);
            }

            //enemy animetion
            if (this.num <= 4){
                this.enemy.animations.play('right');
                  
            }else if (this.num >= 5){
                this.enemy.animations.play('left');
                
            }

            //enemy hit tower
            if (game.physics.arcade.collide(this.enemys, this.myTower)){
                this.enemy.kill();
                this.hp -= 1;
                this.hpText.text = 'HP : ' + this.hp;
            }

            //overlap
            if (checkOverlap(this.player, this.enemy)&&this.spacebar.isDown){
                this.enemy.kill();
            }

            //checkCursor
            this.player.body.velocity.x = 0;
            if (this.cursors.right.isDown) {
              this.player.body.velocity.x = 200;
              this.player.animations.play('right');
            } else if (this.cursors.left.isDown) {
              this.player.body.velocity.x = -200;
              this.player.animations.play('left');
            } else {
              this.player.animations.stop();
              this.player.frame = 6;
            }

        }
    };

        //spawnEnemy
        function spawnEnemy(){
            //random x
            this.num = game.rnd.integerInRange(0, 10);
            this.x;
            //this.count = count(200);
            //console.log(this.num);
            if(this.num <= 4){
                this.x = 0;
            }else if(this.num >= 5){
                this.x=800;
            } 
            //console.log(this.x);

            //crate enemy
            
            this.enemy = game.add.sprite(this.x,450,'enemy');
            game.physics.arcade.enable(enemy);
            this.enemy.body.bounce.y = 0.25;
            this.enemy.body.gravity.y=980;
            this.enemys.add(enemy);
            

            
            //check move
            if (this.x == 0) {
                this.enemy.body.velocity.x = 200;
            }else if(this.x == 800){
                this.enemy.body.velocity.x= -200;
            }

            //animetion and collideWorldBounds
            this.enemy.body.collideWorldBounds = true;
            this.enemy.animations.add('right', [3, 4, 5], 10, true);
            this.enemy.animations.add('left', [9, 10, 11], 10, true);
            this.enemy.frame = 6;
            this.enemys.add(this.enemy);  
            return this.enemy;
        }

        function checkOverlap(spriteA, spriteB) {
            boundsA = spriteA.getBounds();
            boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }

        function count(num){
            var i = 0
            if(i == 0){
               this.count = 2000; 
            }
            this.count -= num;
            return this.count;
        }

        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        game.state.add('main', mainState);
        game.state.start('main');
