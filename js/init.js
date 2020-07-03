"use strict"

var score 			= document.getElementById('score'),
	level 			= document.getElementById('level'),
	health			= document.getElementById('health'),
	leftArrow 		= document.querySelector('.left-arrow'),
	rightArrow 		= document.querySelector('.right-arrow'),
	startBtn 		= document.getElementById('game-start'),
	mobileStart 	= document.querySelector('.mobile-start'),
	pauseBtn 		= document.getElementById('game-pauseBtn'),
	winDiv 			= document.querySelector('.win-wrapper'),
	loseDiv			= document.querySelector('.game-over-wrapper'),
	restartGameDiv	= document.querySelector('.play-again'),
	pauseNotice 	= document.getElementById('game-pause-notice');

var canvWrapper = document.getElementById('game-field-wrapper');
var canv = document.getElementById('canvas');
var arkanoid = new Arkanoid(canv);
resizeCanvas();
arkanoid.startGame();

window.addEventListener('resize', resizeCanvas);

var RAF = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback)
		{ 
			window.setTimeout(callback, 1000 / 60); 
		};

})();

function resizeCanvas()
{
	canv.width = canvWrapper.offsetWidth;
	canv.height = canvWrapper.offsetHeight;
	arkanoid.levelMap.createLevel(arkanoid.player.level);
	arkanoid.player.resizePlayer();
	arkanoid.draw();
}

RAF(arkanoid.loop);