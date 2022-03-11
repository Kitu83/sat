(function() {
	
	document.getElementById('send2').onclick = function() {
		
		let loader = document.createElement('img');
		
		loader.src = '/img/loader.gif';
		
		loader.alt = 'Loader ...';
		
		loader.id = 'loader';
		
		document.getElementById('result').append( loader );
		
		document.getElementById('eq_tab').innerHTML = '';
		document.getElementById('eq').innerHTML = '';
		document.getElementById('vars').innerHTML = '';
		document.getElementById('eqWithVars').innerHTML = '';
		document.getElementById('res').innerHTML = '';
		
		bruteforce( document.getElementById('eqtab').value );
	}
	
	document.getElementById('send').onclick = function() {
		
		document.getElementById('eq_tab').innerHTML = '';
		document.getElementById('eq').innerHTML = '';
		document.getElementById('vars').innerHTML = '';
		document.getElementById('eqWithVars').innerHTML = '';
		document.getElementById('res').innerHTML = '';
		
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
		
		document.getElementById('result').append( loader );
		
		let eq = a;
		
		bruteforce(eq);
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

function bruteforce(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab);
	}
	
	let v = [];
	
	let dup = [];
	
	let temp = [];
	
	let eq = [];
	
	let start = Date.now();
	
	eq_tab.forEach(function(item, index) {
		
		eq.push([]);
		
		item.forEach(function(value) {
			
			if (Math.sign(value) === -1) {
				
				value = Math.abs(value);
				
				if (v[value] === undefined) {
					
					v[value] = false;
				}
				
				eq[index].push('!v['+value+']');
				
				if (temp.indexOf(value) !== -1 && dup.indexOf(value) === -1) {
					
					dup.push(value);
				}
				
				temp.push(value * -1);
			}
			else if (Math.sign(value) === 1) {
				
				if (v[value] === undefined) {
					
					v[value] = true;
				}
				
				eq[index].push('v['+value+']');
				
				if (temp.indexOf(value * -1) !== -1 && dup.indexOf(value) === -1) {
					
					dup.push(value);
				}
				
				temp.push(value);
			}
		});
		
		eq[index] = '(' + eq[index].join('|') + ')';
	});
	
	eq = eq.join('&');
	
	console.log(eq, v, dup);
	
	let check = false;
	
	if ( eval(eq) ) {
		
		console.log('Success !');
		
		check = true;
	}
	else {
		
		loop:
		for (let i = 0; i < dup.length; i++) {
			
			for (let j = 0; j < 2; j++) {
				
				if ( eval(eq) ) {
					
					console.log('Success after permutation !');
					
					check = true;
					
					break loop;
				}
				
				if (v[dup[i]] === true) {
					
					v[dup[i]] = false;
				}
				else {
					
					v[dup[i]] = true;
				}
			}
		}
		
		if (check === false) {
		
			console.log('Fail !');
		}
	}
	
	let millis = Date.now() - start;

	console.log(`seconds elapsed = ${millis / 1000}`);
	
	document.getElementById('eq_tab').innerHTML = JSON.stringify(eq_tab);
	
	document.getElementById('eq').innerHTML = eq;
	
	let vars = document.getElementById('vars');
	
	let eqvars = document.getElementById('eqWithVars');
	
	eqvars.innerHTML = eq;
	
	v.forEach(function(item, index) {
		
		vars.innerHTML += 'v['+index+'] = ' + item + '<br /><br />';
		
		eqvars.innerHTML = eqvars.innerHTML.replaceAll('v['+index+']', item);
	});
	
	if (check === true) {
		
		eqvars.innerHTML += ' = true';
		
		document.getElementById('res').innerHTML = '<span style="color:green;">Succès !</span>';
	}
	else {
		
		eqvars.innerHTML += ' = false';
		
		document.getElementById('res').innerHTML = '<span style="color:red;">Echec !</span>';
	}
	
	document.getElementById('result').style.display = 'block';
	
	document.getElementById('loader').remove();
}
