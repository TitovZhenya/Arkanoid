"use strict"

function Controller(player, ball, status)
{
	var self = this;
	self.keys = {
		left : false,
		right : false,
	};
	self.gameFinish = false;
	self.moveStart = null;
	self.moveEnd = null;

	self.addListner = function()
	{
		document.addEventListener('keydown', self.keyPressed);
		document.addEventListener('keyup', self.removeKey);
		startBtn.addEventListener('click', self.throwBall);
		document.addEventListener('touchstart', self.touchMobileMove);
		document.addEventListener('touchend', self.touchMobileStopMove);
		restartGameDiv.addEventListener('click', self.restartGame);
		pauseBtn.addEventListener('click', self.gamePause);
		canv.addEventListener('touchstart', self.startSwipe);
		canv.addEventListener('touchend', self.endSwipe);
	}

	self.removeListner = function()
	{
		document.removeEventListener('keydown', self.keyPressed);
		document.removeEventListener('keyup', self.removeKey);
		startBtn.removeEventListener('click', self.throwBall);
		document.removeEventListener('touchstart', self.touchMobileMove);
		document.removeEventListener('touchend', self.touchMobileStopMove);
		restartGameDiv.removeEventListener('click', self.restartGame);
		pauseBtn.removeEventListener('click', self.gamePause);
		canv.removeEventListener('touchstart', self.startSwipe);
		canv.removeEventListener('touchend', self.endSwipe);
	}

	self.keyPressed = function(e)
	{
		e = e || window.event;
		if ( e.keyCode == 37 )
			self.keys.left = true;
		else if ( e.keyCode == 39 )
			self.keys.right = true;
		else if( e.keyCode == 32 )
			self.keys.space = true;		
	}

	self.removeKey = function(e)
	{
		e = e || window.event;
		if ( e.keyCode == 37 )
			self.keys.left = false;
		else if ( e.keyCode == 39 )
			self.keys.right = false;
		else if( e.keyCode == 32 ){
			if ( player.life === 0 || player.level > 3)
				return;
			ball.releaseBall();
			startBtn.style.display = 'none';
			pauseNotice.style.display = 'none';
			self.gameFinish = false;
		}
	}

	self.throwBall = function(e)
	{
		startBtn.style.display = 'none';
		self.gameFinish = false;
		pauseNotice.style.display = 'none';
		ball.releaseBall();
	}

	self.touchMobileMove = function(e)
	{
		e = e || window.event;
		let touchTarget = e.target;
		
		if( touchTarget === leftArrow )
			self.keys.left = true;
		else if ( touchTarget === rightArrow )
			self.keys.right = true;
		else if ( touchTarget === mobileStart ){
			if ( player.life === 0 || player.level > 3)
				return;
			startBtn.style.display = 'none';
			pauseNotice.style.display = 'none';
			ball.releaseBall();
			self.gameFinish = false;
		}
	}

	self.touchMobileStopMove = function(e)
	{
		e = e || window.event;
		let touchTarget = e.target;
		
		if ( touchTarget === leftArrow )
			self.keys.left = false;
		else if ( touchTarget === rightArrow )
			self.keys.right = false;
	}

	self.restartGame = function(e)
	{
		location.reload();
	}

	self.gamePause = function(e)
	{
		if ( player.life === 0 || player.level > 3 )
			return;
		if ( self.gameFinish === false )
		{
			self.gameFinish = true;
			pauseNotice.style.display = 'block';
			pauseBtn.blur();
		}
		else
		{
			self.gameFinish = false;
			pauseNotice.style.display = 'none';
			pauseBtn.blur();
		}
	}

	self.startSwipe = function(e)
	{
		e = e || window.event;
		self.moveStart = e.targetTouches[0];
	}

	self.endSwipe = function(e)
	{
		e = e || window.event;
		self.moveEnd = e.changedTouches[0];
		var shiftX = Math.abs(self.moveStart.clientX - self.moveEnd.clientX);
		var shiftY = Math.abs(self.moveStart.clientY - self.moveEnd.clientY)
		if ( self.moveStart.clientX > self.moveEnd.clientX && shiftX >= 100 && shiftX > shiftY )
		{
			self.gameFinish = true;
			pauseNotice.style.display = 'block';
		}
		else if ( self.moveStart.clientX < self.moveEnd.clientX && shiftX >= 100 && shiftX > shiftY )
		{
			self.gameFinish = false;
			pauseNotice.style.display = 'none';
		}
	}
}