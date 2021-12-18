(function() {
	
	document.getElementById('send').onclick = function() {
		
		let candidats = document.getElementById('candidats').value;
		
		let membres = document.getElementById('membres').value;
		
		let appros = document.getElementById('appros').value;
		
		let cmax = document.getElementById('cmax').checked;
		
		let mmax = document.getElementById('mmax').checked;
		
		let amax = document.getElementById('amax').checked;
		
		if (cmax === true) {
			
			candidats = getRandomInt(1, candidats);
		}
		
		if (mmax === true) {
			
			membres = getRandomInt(1, membres);
		}
		
		let a = [];
		
		for (let i = 0; i < membres; i++) {
			
			let n = appros;
			
			if (amax === true) {
				
				n = getRandomInt(1, appros);
			}
			
			let m = []
			
			for (let j = 0; j < n; j++) {
				
				let nc = getRandomAppro(1, candidats);
				
				m.push(nc);
			}
			
			a.push(m);
		}
		
		let loader = document.createElement('img');
		
		loader.src = '/img/loader.gif';
		
		loader.alt = 'Loader ...';
		
		loader.id = 'loader';
		
		document.getElementById('candidats').innerHTML = '';
		document.getElementById('array_start').innerHTML = '';
		document.getElementById('array_end').innerHTML = '';
		document.getElementById('iters').innerHTML = '';
		document.getElementById('res').innerHTML = '';
		
		document.getElementById('result').append( loader );
		
		let array_start = document.getElementById('array_start');
		
		array_start.innerHTML = '<h2>Entrée :</h2><br />';
		
		a.forEach(function(item, index) {
			
			let new_member = document.createElement('p');
			
			new_member.innerText = 'Membre ' + (index+1) + ' : ';
			
			item.forEach(function(item2, index2) {
				
				let sign = document.createElement('span');
				
				if (item2 < 0) {
					sign.style.color = 'red';
					sign.style.textDecoration = 'line-through';
				}
				else {
					sign.style.color = 'green';
				}
				
				sign.innerText = Math.abs(item2);
				
				new_member.append( sign );
				
				if (index2 !== item.length-1) {
					
					new_member.innerHTML += ' ';
				}
			});
			
			array_start.append( new_member );
		});
		
		process(a);
	}
})();

function getRandomInt(min, max) {
	
	min = Math.ceil(min);
	
	max = Math.ceil(max);
	
	return Math.ceil(Math.random() * (max - min)) + min;
}

function getRandomAppro(min, max) {
	
	min = Math.ceil(min);
	
	max = Math.ceil(max);
	
	let sign;
	
	if (Math.random() >= 0.5) {
		
		sign = 1;
	}
	else {
		
		sign = -1;
	}
	
	return Math.ceil((Math.random() * (max - min) + min) * sign);
}

function process(m) {
	
	let c = [];
	
	let start = Date.now();

	let iters1 = 0, iters2 = 0, iters3 = 0;
	
	m.forEach(function(item, index) {
		
		item.forEach(function(item2, index2) {
			
			c.push( [ item2, index, index2 ] );
			
			iters1++;
		});
	});
	
	let n = c.length;

	for (let i = 0; i < n; i++) {
		
		for (let j = 0; j < n; j++) {
			
			if (Math.abs(c[i][0]) === Math.abs(c[j][0]) && c[i][0] !== c[j][0]) {
				
				m[ c[i][1] ][ c[i][2] ] = 'deleted';
				
				m[ c[j][1] ][ c[j][2] ] = 'deleted';
			}
			
			iters2++;
		}
	}

	let check;

	for (let i = 0; i < m.length; i++) {
		
		check = false;
		
		for (let j = 0; j < m[i].length; j++) {
			
			if (m[i][j] !== 'deleted') {
				
				check = true;
				
				break;
			}
			
			iters3++;
		}
		
		if (check === false) {
			
			break;
		}
	}

	if (check === true) {
		
		document.getElementById('res').innerHTML = '<span style="color:green;">Succès, il existe une solution avec ce tirage !</span>';
	}
	else {
		
		document.getElementById('res').innerHTML = '<span style="color:red;">&Eacute;chec, il n\'existe pas de solution avec ce tirage !</span>';
	}
	
	document.getElementById('iters').innerText = 'Nombre d\'itérations de boucles : ' + iters2 + ' + ' + iters1 + ' + ' + iters3 + ' = ' + (iters1 + iters2 + iters3) + ' - Donc O(N) <= N² + 2N'; 
	
	let array_end = document.getElementById('array_end');
	
	array_end.innerHTML = '<h2>Sortie :</h2><br />';
	
	m.forEach(function(item, index) {
		
		let member = document.createElement('p');
		
		member.innerText = 'Membre ' + (index+1) + ' : ';
		
		item.forEach(function(item2, index2) {
			
			if (item2 !== 'deleted') {
				
				let sign = document.createElement('span');
				
				if (item2 < 0) {
					sign.style.color = 'red';
					sign.style.textDecoration = 'line-through';
				}
				else {
					sign.style.color = 'green';
				}
				
				sign.innerText = Math.abs(item2);
				
				member.append( sign );
				
				if (index2 !== item.length-1) {
					
					member.innerHTML += ' ';
				}
			}
		});
		
		array_end.append( member );
	});
	
	document.getElementById('loader').remove();

	let millis = Date.now() - start;

	console.log(`seconds elapsed = ${millis / 1000}`);
}
