function bruteforce(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab);
	}
	
	let v = [];
	
	let dup = [];
	
	let temp = [];
	
	let eq = [];
	
	let start = Date.now();
	
	eq_tab.forEach(function(clause, index) {
		
		eq.push([]);
		
		clause.forEach(function(variable) {
			
			if (Math.sign(variable) === -1) {
				
				variable = Math.abs(variable);
				
				if (v[variable] === undefined) {
					
					v[variable] = false;
				}
				
				eq[index].push('!v['+variable+']');
				
				if (temp.indexOf(variable) !== -1 && dup.indexOf(variable) === -1) {
					
					dup.push(variable);
				}
				
				temp.push(variable * -1);
			}
			else if (Math.sign(variable) === 1) {
				
				if (v[variable] === undefined) {
					
					v[variable] = true;
				}
				
				eq[index].push('v['+variable+']');
				
				if (temp.indexOf(variable * -1) !== -1 && dup.indexOf(variable) === -1) {
					
					dup.push(variable);
				}
				
				temp.push(variable);
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
		for (let i = 0; i < eq_tab.length; i++) {
			
			for (let j = 0; j < eq_tab[i].length; j++) {
				
				let sign = eq_tab[i][j] < 0 ? false : true;
				
				let variable = Math.abs(eq_tab[i][j]);
					
				if (v[variable] === sign) {
					
					v[variable] = !v[variable];
				}
				
				if ( eval(eq) ) {
					
					console.log('Success after inversion !');
					
					check = true;
					
					break loop;
				}
				else {
					
					v[variable] = !v[variable];
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

function binarInc(value) {
	
	let len = value.length;
		
	let c = 0;
	
	for (let i = (len - 1); i > -1; i--) {
		
		if (value[i] === '1') {
			
			value = value.replaceAt(i, '0');
			
			c++;
		}
		else {
			
			value = value.replaceAt(i, '1');
			
			break;
		}
	}
	
	if (c === len) {
		
		value = '1' + value;
	}
	
	return value;
}

String.prototype.replaceAt = function(index, replacement) {
	
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

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
		
		let variables = document.getElementById('variables').value;
		
		let clauses = document.getElementById('clauses').value;
		
		let vc = document.getElementById('vc').value;
		
		let vmax = document.getElementById('vmax').checked;
		
		let cmax = document.getElementById('cmax').checked;
		
		let vcmax = document.getElementById('vcmax').checked;
		
		if (vmax === true) {
			
			variables = getRandomInt(1, variables);
		}
		
		if (cmax === true) {
			
			clauses = getRandomInt(1, clauses);
		}
		
		let a = [];
		
		for (let i = 0; i < clauses; i++) {
			
			let n = vc;
			
			if (vcmax === true) {
				
				n = getRandomInt(1, vc);
			}
			
			let m = []
			
			for (let j = 0; j < n; j++) {
				
				let nc = getRandomAppro(1, variables);
				
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
