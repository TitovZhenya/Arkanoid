"use strict"

class Player
{
	constructor()
	{		
		this.posX = null;
		this.posY = null;
		this.width = null;
		this.height = 13; 
		this.velocityX = 5;
		this.dx = 0;
		this.life = 3;
		this.score = 0;
		this.level = 1;
	}

	playerMove(controller)
	{		
		if ( controller.keys.left && this.posX > 0)
			this.posX -= this.velocityX;

		if ( controller.keys.right && this.posX + this.width < canv.width)
			this.posX += this.velocityX;
	}

	resetPlayer()
	{
		this.posX = canv.width / 2 - 0.2*canv.width/2;
		this.posY = canv.height - 25;
		this.width = 0.2*canv.width;
		this.score = 0;
		this.level = 1;
		this.life = 3;
		score.innerHTML = this.score;
		level.innerHTML = this.level;
		health.innerHTML = this.life;
	}

	resizePlayer()
	{
		this.posX = canv.width / 2 - 0.2*canv.width/2;
		this.posY = canv.height - 25;
		this.width = 0.2*canv.width;
	}
}

class Ball
{
	constructor()
	{
		this.posX = null;
		this.posY = null;
		this.radius = 10;
		this.a1 = 0;
		this.a2 = Math.PI * 2;
		this.speed = 5;
		this.velocityX = 4 * (Math.random() * 2 - 1);
		this.velocityY = -4;
		this.ballOnPlatform = true;
	}

	ballMove(player, controller)
	{
		if ( !this.ballOnPlatform  )
		{
			this.posX += this.velocityX;
			this.posY += this.velocityY;
		} else {
			this.posX = player.posX + player.width / 2;
			this.posY = player.posY - this.radius;
		}
	}

	releaseBall()
	{
		this.ballOnPlatform = false;
	}

	resetBall(player)
	{
		this.posX = player.posX + player.width / 2;
		this.posY = player.posY - this.radius;
		this.velocityX = 4 * (Math.random() * 2 - 1);
		this.velocityY = -4;
		this.speed = 5; 
		this.ballOnPlatform = true;
	}
}

class Level
{
	constructor()
	{
		this.blocksArr = [];
		this.firstLevel = {
			width : 0.15, 
			height : 25,
			colors : ['#ea3a2a', '#f3f30f', '#2db009'],
			spaceBtwBlocks : 3,
			paddingTop : 25,
			level : [
			[0, 0, 1, 1, 0, 0],
			[0, 1, 1, 1, 1, 0],
			[1, 1, 0, 0, 1, 1],
			[0, 1, 1, 1, 1, 0],
			[0, 0, 1, 1, 0, 0]
			]
		}

		this.secondLevel = {
			width : 0.15, 
			height : 25,
			colors : ['#eb2501','#f67d0a','#e5e427'],
			spaceBtwBlocks : 3,
			paddingTop : 35,
			level : [
			[1, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1],
			[1, 1, 0, 0, 1, 1],
			[0, 1, 1, 1, 1, 0],
			[0, 0, 1, 1, 0, 0]
			]
		}

		this.thirdLevel = {
			width : 0.15, 
			height : 25,
			colors : ['#3e9ef8', '#aa15ea', '#f84ab6'],
			spaceBtwBlocks : 3,
			paddingTop : 45,
			level : [
			[0, 1, 1, 1, 1, 0],
			[1, 0, 1, 1, 0, 1],
			[1, 1, 0, 0, 1, 1],
			[1, 0, 1, 1, 0, 1],
			[0, 1, 1, 1, 1, 0]
			]
		}
	}

	clear()
	{
		this.blocksArr = [];
	}

	createLevel(currMap)
	{
		switch ( currMap )
		{
			case 1:
				currMap = this.firstLevel;
				break;
			case 2:
				currMap = this.secondLevel;
				break;
			case 3:
				currMap = this.thirdLevel;
				break;
		}

		let elemWidth 	= canv.width * currMap.width,
			elemPadding = canv.width - (currMap.level[0].length * (elemWidth + currMap.spaceBtwBlocks));
			elemPadding = elemPadding / 2;

		if ( this.blocksArr.length === 0){
			for ( let row in currMap.level)
			{
				for ( let col in currMap.level[row] )
				{
					let elem = currMap.level[row][col],
						blockX = elemPadding + col * (elemWidth + currMap.spaceBtwBlocks),
						blockY = row * (currMap.height + currMap.spaceBtwBlocks) + currMap.paddingTop,
						elemColor;

					switch ( row )
					{
						case '0':
							elemColor = currMap.colors[0];
							break;
						case '1':
							elemColor = currMap.colors[1];
							break;
						case '2':
							elemColor = currMap.colors[2];
							break;
						case '3':
							elemColor = currMap.colors[1];
							break;
						case '4':
							elemColor = currMap.colors[0];
							break;
					}
					if ( elem === 1 )
					{
						this.addBlock(blockX, blockY, elemWidth, currMap.height, elemColor, true, col)
					}
				}
			}
		}
		else{
			for ( let brick in this.blocksArr ){
				let currentBrick = this.blocksArr[brick];
				if ( currentBrick.isALive )
				{
					let blockX = elemPadding + currentBrick.elemNum * (currentBrick.width + this.firstLevel.spaceBtwBlocks);

					currentBrick.posX = blockX;
					currentBrick.width = 0.15 * canv.width;
				}
			}
		}


	}

	addBlock(x, y, width, height, color, isALive, elemNum)
	{
		let newBlock = new EnemyBlock(x, y, width, height, color, isALive, elemNum);
		this.blocksArr.push(newBlock);
	}
}

class EnemyBlock
{
	constructor(x, y, width, height, color, isALive, elemNum)
	{
		this.posX = x;
		this.posY = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.isALive = isALive
		this.elemNum = elemNum
	}
}