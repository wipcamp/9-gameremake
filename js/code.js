
    var player;
    var enemy;

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

            
                /*var num = game.rnd.integerInRange(0, 1);
                if(num == 0){
                    x = 0;
                }else if(num==1){
                    x=800;
                }*/
                this.enemy = game.add.sprite(0,450,'enemy');
                game.physics.arcade.enable(this.enemy);
                this.enemy.body.bounce.y = 0.25;
                this.enemy.body.gravity.y=980;
                //if (this.x == 0) {
                this.enemy.body.velocity.x= 200;
                //}else if(this.x == 800){
                //    this.enemy.body.gravity.x= -100;
                //}
                this.enemy.body.collideWorldBounds = true;
                this.enemy.animations.add('right', [3, 4, 5], 10, true);
                this.enemy.animations.add('left', [9, 10, 11], 10, true);
                this.enemy.frame = 6;
                
            
            

            
        },

        update: function() {
            
            game.physics.arcade.collide(this.player, this.myWorld);
            game.physics.arcade.collide(this.enemy, this.myWorld);
            if (game.physics.arcade.collide(this.enemy, this.myTower)){
                this.enemy.destroy();
                this.hp -= 1;
                this.hpText.text = 'HP : ' + this.hp;
            }
            if (game.physics.arcade.collide(this.enemy, this.player)){
                this.enemy.destroy();
            }

            
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

            if (this.num == 0){
                this.enemy.animations.play('right');      
            }else if (this.num == 1){
                this.enemy.animations.play('left');
            }
        }
    };

    function spawnEnemy(x){
            
    }

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('main', mainState);
    game.state.start('main');
