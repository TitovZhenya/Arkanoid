"use strict"

const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php"

async function newStringName()
{
	let sp = new URLSearchParams();
	sp.append('f', 'INSERT');
	sp.append('n', 'Titov_Arkanoid');
	sp.append('v', JSON.stringify([]));
	
	try {
		let responce = await fetch(ajaxHandlerScript, {
			method : 'POST', 
			body : sp
		});
		let data = await responce.text();
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

async function readRecords()
{
	let sp = new URLSearchParams();
	sp.append('f', 'READ');
	sp.append('n', 'Titov_Arkanoid');

	try{
		let responce = await fetch(ajaxHandlerScript, {
			method : 'POST',
			body : sp
		})
	
		let records = await responce.json();
		records = JSON.parse(records.result);
		return records;
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

async function lockRecords(newRecord)
{
	let password = Math.random();
	let sp = new URLSearchParams();
	sp.append('f', 'LOCKGET');
	sp.append('n', 'Titov_Arkanoid');
	sp.append('p', password);

	try{
		let responce = await fetch(ajaxHandlerScript, {
			method : 'POST',
			body : sp
		})

		let records = await responce.json();
		records = JSON.parse(records.result);
		records.push(newRecord);
		records.sort((a, b) => (b[1] - a[1]));
		if ( records.length > 10 )
			records = records.slice(0, 10);
		return await updateRecords(password, records);	
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

async function updateRecords(password, records)
{
	let sp = new URLSearchParams();
	sp.append('f', 'UPDATE');
	sp.append('n', 'Titov_Arkanoid');
	sp.append('p', password);
	sp.append('v', JSON.stringify(records));

	try {
		let responce = await fetch(ajaxHandlerScript, {
			method : 'POST',
			body : sp
		})
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

async function createRecordsList()
{
	try {
		let records = await readRecords();
		let recordsList = document.querySelectorAll('.records-list > li');
		records.forEach((v, i) =>{
			let recordsStr = `${v[0]} - ${v[1]}`;
			recordsList[i].textContent = recordsStr;
		});
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

async function checkCurrentRecords()
{
	try{
		let records = await readRecords();
		if ( records[records.length-1][1] >= arkanoid.player.score && records.length >= 10 )
			return;
		let newRecordsDiv = document.querySelector('.best-result');
		newRecordsDiv.style.display = 'block';
		newRecordsDiv.style.opacity = '1';

		let confirmBtn = document.getElementById('user-nameBtn');
		document.getElementById('user-name').focus();
		confirmBtn.addEventListener('click', saveNewUserRecord);
	}
	catch ( error ){
		alert('error\n' + error);
	}
}

function saveNewUserRecord()
{
	let userNameInput = document.getElementById('user-name');
	let userName = userNameInput.value;
	
	if ( userName === '' )
		userName = 'Unknown';
	else
		userName = userName;

	let newRecord = [userName, arkanoid.player.score];
	let newRecordsDiv = document.querySelector('.best-result');
	newRecordsDiv.style.display = 'none';
	newRecordsDiv.style.opacity = '0';
	lockRecords(newRecord);
}