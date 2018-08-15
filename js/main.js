var config = {
	type: Phaser.AUTO,
	width: 640,
	height: 480,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y:200
			}
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var tank;
var turret;
var flame;
var bullet;
var power = 300;
var powerText;
var background;
var targets;

var cursors;
var fireButton;

var camera;

function preload (argument) {
	this.load.image('tank','assets/images/tank.png');
	this.load.image('turret','assets/images/turret.png');
	this.load.image('bullet','assets/images/bullet.png');
	this.load.image('background','assets/images/background.png');
	this.load.image('flame','assets/images/flame.png');
	this.load.image('target','assets/images/target.png');
}
function create (argument) {
	background = this.add.image(0,0,'background').setOrigin(0,0);

	targets = this.physics.add.group({
		key: 'target',
		repeat: 3,
		setXY: { x:300, y: 390, stepX: 200 }
	})
	targets.children.iterate(function (child) {
		child.body.setAllowGravity(false);
	})

	bullet = this.physics.add.sprite(40,40,'bullet');
	bullet.disableBody(true,true);
	bullet.setActive(false);
	this.physics.add.overlap(bullet,targets,hitTarget,null,this);

	tank = this.add.sprite(24,383,'tank').setOrigin(0,0);

	turret = this.add.sprite(tank.x + 30, tank.y + 14,'turret').setOrigin(0,0);

	flame = this.add.sprite(0,0,'flame');
	flame.setVisible(false); // anchor yapılmadı


	power = 300;
	powerText = this.add.text(8,8,'Power: 300', {font: "18px Arial",fill: "#ffffff"});
	powerText.setShadow(1,1,'rgba(0,0,0,0.8)',1);
	//fixed camera yapılmadı

	cursors = this.input.keyboard.createCursorKeys();






}
function update (argument) {
	
	if(cursors.space.isDown)
	{
		
		if(bullet.active)
		{
			console.log('bullet active : true ');
			return;
		}
		var p = new Phaser.Geom.Point(turret.x, turret.y);
		Phaser.Math.RotateAroundDistance(p, p.x, p.y, turret.rotation,34);
		bullet.enableBody(true,p.x, p.y,true,true);
		bullet.setActive(true);

		
		flame.setPosition(p.x,p.y);
		flame.setAlpha(1);
		flame.setVisible(true);

		this.add.tween({
			targets: flame,
			alpha: { value: 0, duration: 100, ease: 'Linear' }
		});

 
 		 fire = new Phaser.Physics.Arcade.ArcadePhysics(this)
		 fire.velocityFromRotation(turret.rotation, power, bullet.body.velocity);

		 this.cameras.main.startFollow(bullet);


	}

	if(bullet.active)
	{
		if(bullet.y > 420)
			removeBullet();

	}
	else 
	{
		if(cursors.left.isDown && power > 100)
		{
			power -= 1;
		}
		else if(cursors.right.isDown && power < 600)
		{
			power += 1;
		}

		if(cursors.up.isDown && turret.angle > -90)
		{
			turret.angle--;
		}
		else if(cursors.down.isDown && turret.angle < 0)
		{
			turret.angle++;
		}

		powerText.setText('Power: ' + power);
	}

	
}

function removeBullet () {
	bullet.disableBody(true,true);
	bullet.setActive(false);
}
function hitTarget (bullet,target) {
	 target.destroy();
	 removeBullet();
}