"use strict"

const mainPageDiv 		= document.getElementById('main'),
	  gamePageDiv		= document.getElementById('game'),
	  controlsDiv 		= document.getElementById('controls'),
	  recordsDiv 		= document.getElementById('records'),
	  mainNewGameBtn 	= document.getElementById('main-newGameBtn'),
	  mainControlsBtn 	= document.getElementById('main-controlsBtn'),
	  mainRecordsBtn	= document.getElementById('main-recordsBtn'),
	  gameMenuBtn		= document.getElementById('game-menuBtn'),
	  gameControlsBtn 	= document.getElementById('game-controlsBtn'),
	  gameRecordsBtn 	= document.getElementById('game-recordsBtn'),
	  controlsGameBtn 	= document.getElementById('controls-back-game'),
	  controlsMainBtn 	= document.getElementById('controls-back-main'),
	  recordsGameBtn 	= document.getElementById('records-back-game'),
	  recordsMainBtn 	= document.getElementById('records-back-main');

window.onhashchange = switchToStateFromURLHash;
let SPAState = {};
let lastURLHash = undefined;

window.addEventListener('beforeunload', befUnload);

function addMainPageListners()
{
	mainNewGameBtn.addEventListener('click', switchToGamePage);
	mainControlsBtn.addEventListener('click', switchToControlsPage);
	mainRecordsBtn.addEventListener('click', switchToRecordsPage);
}

function addGamePageListners()
{
	gameMenuBtn.addEventListener('click', switchToMainPage);
	gameControlsBtn.addEventListener('click', switchToControlsPage);
	gameRecordsBtn.addEventListener('click', switchToRecordsPage);
}

function addControlsPageListners()
{
	controlsGameBtn.addEventListener('click', switchToGamePage);
	controlsMainBtn.addEventListener('click', switchToMainPage);
}

function addRecordsPageListners()
{
	recordsGameBtn.addEventListener('click', switchToGamePage);
	recordsMainBtn.addEventListener('click', switchToMainPage);
}

function removeMainPageListners()
{
	mainNewGameBtn.removeEventListener('click', switchToGamePage);
	mainControlsBtn.removeEventListener('click', switchToControlsPage);
	mainRecordsBtn.removeEventListener('click', switchToRecordsPage);
}

function removeGamePageListners()
{
	gameMenuBtn.removeEventListener('click', switchToMainPage);
	gameControlsBtn.removeEventListener('click', switchToControlsPage);
	gameRecordsBtn.removeEventListener('click', switchToRecordsPage);
}

function removeControlsPageListners()
{
	controlsGameBtn.removeEventListener('click', switchToGamePage);
	controlsMainBtn.removeEventListener('click', switchToMainPage);
}

function removeRecordsPageListners()
{
	recordsGameBtn.removeEventListener('click', switchToGamePage);
	recordsMainBtn.removeEventListener('click', switchToMainPage);
}

function switchToStateFromURLHash()
{	
	let URLHash  = window.location.hash,
		stateStr = URLHash.substr(1);

	if ( stateStr != "" ) 
		SPAState = { pagename : stateStr }
	else
		SPAState = { pagename : 'Main'}

	switch ( SPAState.pagename )
	{
		case 'Main':
			addMainPageListners();
			removeGamePageListners();
			removeControlsPageListners();
			removeRecordsPageListners();
			arkanoid.controller.removeListner();
			if ( isGameFinish() )
				break;
			mainPageDiv.style.display = 'flex';
			gamePageDiv.style.opacity = '0';
			arkanoid.controller.gameFinish = true;
			checkClassList(controlsDiv);
			checkClassList(recordsDiv);
			break;
		case 'Game':
			addGamePageListners();
			arkanoid.controller.addListner();
			removeMainPageListners();
			removeControlsPageListners();
			removeRecordsPageListners();	
			mainPageDiv.style.display = 'none';
			gamePageDiv.style.opacity = '1';		
			checkClassList(controlsDiv);
			checkClassList(recordsDiv);
			break;
		case 'Controls':
			addControlsPageListners();
			removeMainPageListners();
			removeGamePageListners();
			removeRecordsPageListners();
			arkanoid.controller.removeListner();	
			arkanoid.controller.gameFinish = true;
			if ( !lastURLHash ){
				mainPageDiv.style.display = 'none';
				gamePageDiv.style.opacity = '0';
			}
			controlsDiv.classList.add('drop-center');
			controlsDiv.classList.remove('drop-back');
			pauseNotice.style.display = 'block';
			startBtn.style.display = 'none';
			break;
		case 'Records':
			addRecordsPageListners();
			removeMainPageListners();
			removeGamePageListners();
			removeControlsPageListners();
			arkanoid.controller.removeListner();
			gameRecordsBtn.blur();
			arkanoid.controller.gameFinish = true;
			if ( !lastURLHash ){
				mainPageDiv.style.display = 'none';
				gamePageDiv.style.opacity = '0';
			}
			recordsDiv.classList.add('drop-center');
			recordsDiv.classList.remove('drop-back');
			pauseNotice.style.display = 'block';
			startBtn.style.display = 'none';
			createRecordsList();
			break;
	}
}

function switchToState(newState)
{
	lastURLHash = window.location.hash;
	let stateStr = newState.pagename;
	location.hash = stateStr;
}

function switchToMainPage()
{
	switchToState({ pagename : 'Main' });
}

function switchToGamePage()
{
	switchToState({pagename : 'Game'});
}

function switchToControlsPage()
{
	switchToState({pagename : 'Controls'});
}

function switchToRecordsPage()
{
	switchToState({pagename : 'Records'});
}

function isGameFinish()
{
	if ( arkanoid.player.score != 0 )
	{
		let quitSession = confirm('Do you want quit your game session?')
		if ( !quitSession )
		{
			switchToState({pagename : 'Game'});
			return true;
		}
	}
	arkanoid.startGame();
}

function checkClassList(elem)
{
	let currentStyle = elem.classList[0];

	if ( !currentStyle )
		return
	else{
		elem.classList.remove('drop-center');
		elem.classList.add('drop-back');
	}
}

function befUnload(e)
{
	e = e || window.event;
	if ( arkanoid.player.score != 0 )
		e.returnValue = 'You will lose your points';
}

switchToStateFromURLHash();