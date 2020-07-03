"use strict"

class Arkanoid
{
	constructor(canv)
	{

		this.canv = canv;
		this.ctx = canv.getContext('2d');

		this.gameDevice = {
			stars : new Array(200).fill().map(() => { return {radius: Math.random()*(this.canv.width*2), speed: Math.random()*(0.01), angle: Math.random()*(Math.PI*2) };}),
			sounds : {
				blockDestroy : new Audio('sounds/block_destroy.mp3'),
				playerCol : new Audio('sounds/player_col.mp3'),
				nextLevel : new Audio('sounds/next_level.mp3'),
				losingHealth : new Audio('sounds/losing_health.mp3'),
				win : new Audio('sounds/win.mp3'),
				gameOver : new Audio('sounds/game-over.mp3')
			}
		}
		
		this.player = new Player;
		this.ball = new Ball;
		this.levelMap = new Level;
		this.controller = new Controller(this.player, this.ball, this.gameFinish);

		this.loop = () =>{
			if ( !this.controller.gameFinish )
			{
				this.update();
			}
			RAF(this.loop);
		}
	}

	startGame()
	{
		this.levelMap.clear();
		this.player.resetPlayer();
		this.ball.resetBall(this.player);
		this.levelMap.createLevel(this.player.level)
		this.draw();
		startBtn.style.display = 'block';
		loseDiv.style.display = 'none';
		pauseNotice.style.display = 'none';
		winDiv.style.display = 'none';
		restartGameDiv.style.display = 'none';
	}

	gameOver()
	{
		if ( this.player.life === 0 )
		{
			this.controller.gameFinish = true;
			this.playSound(this.gameDevice.sounds.gameOver);
			this.vibro('lose')
			loseDiv.style.display = 'block';
			restartGameDiv.style.display = 'block';
			checkCurrentRecords();
		}
	}

	drawField()
	{
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
	}

	drawStars()
	{
		this.gameDevice.stars.forEach( v =>{
			v.angle += v.speed
			this.ctx.beginPath();
			this.ctx.arc(Math.sin(v.angle) * v.radius + this.canv.width / 2, Math.cos(v.angle) * v.radius + this.canv.height / 2, 1, 0, Math.PI*2)
			this.ctx.closePath();
			this.ctx.fillStyle = "#FFF";
			this.ctx.fill();
		})
	}

	drawPlayer()
	{
		this.ctx.fillStyle = '#d6d8d5';
		this.ctx.fillRect(this.player.posX, this.player.posY, this.player.width, this.player.height);
	}

	drawBall()
	{
		this.ctx.fillStyle = '#0e4bef';
		this.ctx.beginPath();
		this.ctx.arc(this.ball.posX, this.ball.posY, this.ball.radius, this.ball.a1, this.ball.a2);
		this.ctx.fill();
	}

	drawEnemyBlock()
	{	
		for ( let enemy in this.levelMap.blocksArr ){
			let currentEnemy = this.levelMap.blocksArr[enemy];
			if ( currentEnemy.isALive )
			{
				this.ctx.fillStyle = currentEnemy.color;
				this.ctx.fillRect(currentEnemy.posX, currentEnemy.posY, currentEnemy.width, currentEnemy.height);
			}
		}
	}

	draw()
	{
		this.drawField();
		this.drawStars();
		this.drawPlayer();
		this.drawBall();
		this.drawEnemyBlock();	
	}

	playSound(sound)
	{
		sound.currentTime = 0;
		sound.play();
	}

	vibro(vibroTime) {
        if ( navigator.vibrate ) {
        	switch ( vibroTime )
        	{
        		case 'collision':
					window.navigator.vibrate(100);
        			break;
        		case 'win':
        			window.navigator.vibrate([250,100,250,100,100]);
        			break;
        		case 'lose':
        			window.navigator.vibrate([100,50,100,50,100]);
        	}
        }
    }

	collision(x1, y1, width1, height1, x2, y2, width2, height2)
	{
		return ( x1 < x2 + width2 && x1 + width1 > x2 && 
				 y1 < y2 + height2 && height1 + y1 > y2 )
	}

	enemyCollision()
	{
		for ( let enemy in this.levelMap.blocksArr ){
			let currentEnemy = this.levelMap.blocksArr[enemy];
			if ( currentEnemy.isALive ){
				if ( this.collision(this.ball.posX - this.ball.radius, this.ball.posY - this.ball.radius, this.ball.radius * 2, this.ball.radius * 2,
								 	  currentEnemy.posX, currentEnemy.posY, currentEnemy.width, currentEnemy.height) ) 
				{					
					if ( this.ball.posY + this.ball.radius - this.ball.velocityY <= currentEnemy.posY )
					{
						this.ball.posY = currentEnemy.posY - this.ball.radius;
						this.ball.velocityY = - this.ball.velocityY;
					}
					else if ( this.ball.posY - this.ball.radius - this.ball.velocityY >= currentEnemy.posY + currentEnemy.height )
					{
						this.ball.posY = currentEnemy.posY + currentEnemy.height + this.ball.radius;
						this.ball.velocityY = - this.ball.velocityY;
					}
					else if ( this.ball.posX + this.ball.radius - this.ball.velocityX <= currentEnemy.posX )
					{
						this.ball.posX = currentEnemy.posX - this.ball.radius;
						this.ball.velocityX  = - this.ball.velocityX;
					}
					else if ( this.ball.posX - this.ball.radius - this.ball.velocityX >= currentEnemy.posX + currentEnemy.width )
					{
						this.ball.posX = currentEnemy.posX + currentEnemy.width + this.ball.radius;
						this.ball.velocityX = - this.ball.velocityX;
					}
									
					this.playSound(this.gameDevice.sounds.blockDestroy);
					currentEnemy.isALive = false;
					this.player.score += 5;
					score.innerHTML = this.player.score;
					this.ball.speed += 0.1;	
				}
			}
		}
	}

	playerCollision()
	{
		if ( this.collision(this.ball.posX - this.ball.radius, this.ball.posY - this.ball.radius, this.ball.radius * 2, this.ball.radius * 2,
						 	  this.player.posX, this.player.posY, this.player.width, this.player.height) ) 
		{
			this.ball.posY = this.player.posY - this.ball.radius;
			this.vibro('collision')
			this.playSound(this.gameDevice.sounds.playerCol);
			let clash = this.ball.posX - (this.player.posX + this.player.width / 2);				
			clash = clash / (this.player.width / 2);
			let angle = clash * Math.PI/4;
			this.ball.velocityX = this.ball.speed * Math.sin(angle);
			this.ball.velocityY = -this.ball.speed * Math.cos(angle);
			this.ball.speed += 0.1;
		}
	}

	wallCollision()
	{
		if ( !this.ball.ballOnPlatform )
		{	
			if ( this.ball.posY - this.ball.radius < 0 )
			{
				this.ball.posY = this.ball.radius;
				this.ball.velocityY = - this.ball.velocityY;
			}

			if ( this.ball.posX + this.ball.radius > canv.width )
			{
				this.ball.posX = this.canv.width - this.ball.radius; 
				this.ball.velocityX = - this.ball.velocityX;
			}

			if ( this.ball.posX - this.ball.radius < 0 )
			{
				this.ball.posX = this.ball.radius;
				this.ball.velocityX = - this.ball.velocityX;
			}

			if ( this.ball.posY + this.ball.radius > canv.height )
			{	
				this.ball.posY = this.canv.height - this.ball.radius;
				this.playSound(this.gameDevice.sounds.losingHealth);
				this.player.life--;
				health.innerHTML = this.player.life;
				if ( this.player.life != 0 )
					this.ball.resetBall(this.player);
			}
		}
	}

	levelUp()
	{
		let levelUp = true;

		for ( let enemy in this.levelMap.blocksArr ){
			let currentEnemy = this.levelMap.blocksArr[enemy];
			levelUp = !currentEnemy.isALive && levelUp;
		}

		if ( levelUp )
		{
			if ( this.player.level === 3 )
			{
				this.vibro('win')
				this.player.level++;
				this.playSound(this.gameDevice.sounds.win);
				this.ball.resetBall(this.player);
				this.controller.gameFinish = true;
				winDiv.style.display = 'block';
				restartGameDiv.style.display = 'block';
				checkCurrentRecords();
			}else{
				this.playSound(this.gameDevice.sounds.nextLevel);
				this.player.level++;
				this.levelMap.clear();
				this.levelMap.createLevel(this.player.level);
				this.ball.resetBall(this.player);
				level.innerHTML = this.player.level;
			}		
		}
	}

	update()
	{
		this.player.playerMove(this.controller);
		this.ball.ballMove(this.player, this.controller);
		
		if ( !this.ball.ballOnPlatform )
		{
			this.enemyCollision();
			this.playerCollision();
			this.wallCollision();
		}

		this.levelUp();
		this.gameOver();
		this.draw();	
	}
}
