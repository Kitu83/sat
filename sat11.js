
// -------------- Algo à tester -------------- :

function sort(eq_tab, rec) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab)
	}
	
	let comb_tab = {} // Objet qui contient les jeux de variables et leurs empreintes binaires, avec les clauses indexées.
	let simple = {}   // Objet qui contient uniquement les jeux de variables et leurs empreintes binaires.
	
	//console.log(eq_tab)
	
	// Réduire à une variable les doublons dans une clause qui ne contient que des doublons
	eq_tab.forEach(function(clause, index) {
		
		if (clause.length > 1) {
			
			let prev = false, check = false
			
			clause.forEach(function(v) {
				
				if (prev !== false && prev !== v) {
					
					check = true
				}
				
				prev = v
			})
			
			if (check === false) {
				
				eq_tab[ index ] = [prev]
			}
		}
	})
	
	eq_tab.forEach(function(clause, index) {
		
		clause = sortArrayByAbsValues(clause)
		
		for (let i = 0; i < 2 ** clause.length; i++) {
			
			if (i >= clause.length) {
				
				let bin = i.toString(2)
				
				bin = '0'.repeat(clause.length - bin.length) + bin
				
				let comb = [], bin_comb = ''
				
				for (let j = 0; j < bin.length; j++) {
					
					let c = Math.abs(clause[j]).toString(10)
					
					if (bin[j] === '1' && comb.indexOf(c) === -1) {
						
						comb.push( c )
						
						if (clause[j] > 0) {
							
							bin_comb += '1'
						}
						else {
							
							bin_comb += '0'
						}
					}
				}
				
				if (comb.length > 1) {
					
					comb = absoluteValueArray(comb)
					
					comb = comb.join('/')
					
					if (comb_tab[ comb ] === undefined) {
						
						comb_tab[ comb ] = []
						
						simple[ comb ] = []
					}
						
					comb_tab[ comb ].push( [ bin_comb, index ] )
					
					simple[ comb ].push( bin_comb )
				}
			}
			else {
				
				let name = Math.abs(clause[i]).toString(10)
				
				if (comb_tab[ name ] === undefined) {
					
					comb_tab[ name ] = []
					
					simple[ name ] = []
				}
				
				comb_tab[ name ].push( [ clause[i] > 0 ? '1' : '0', index ] )
				
				simple[ name ].push( clause[i] > 0 ? '1' : '0' )
			}
		}
	})
	
	//console.log(simple, comb_tab)
	
	let u = unsat(simple, comb_tab, eq_tab, rec)
	
	if (u === false) {
		
		return false
	}
	else if (u === true) {
		
		if (rec === false) {
			
			reslog(simple, comb_tab, rec)
		}
		if (rec === 'last') {
			
			console.log('SAT LIT !')
			
			document.getElementById('lit_sat').innerHTML++
			
			return true
			
			//throw new Error() // Arrêt du prog
		}
	}
}

function unsat(simple, obj, eq_tab, rec) {
	
	for (const property in simple) {
		
		let prop = property.split('/'), len = prop.length
		
		if (simple[property].length === 2 ** len && len === simple[property].length && len !== 1 && unsat_core_sum(simple[property]) === 2 ** (len - 1) * (2 ** len - 1)) { // Toutes les combinaisons binaires non tronquées
			
			console.log('UNSAT by combinations !', property)
			
			document.getElementById('lit_unsat').innerHTML++
			
			return false
			
			//throw new Error() // Arrêt du prog
		}
		
		else if (len === 1 && rec === false) {
			
			let mem = undefined
			
			for (let i = 0; i < obj[property].length; i++) {
				
				if (mem === undefined && eq_tab[ obj[property][i][1] ].length === 1) {
					
					mem = obj[property][i][0]
				}
				
				if (mem !== undefined && eq_tab[ obj[property][i][1] ].length === 1 && mem !== obj[property][i][0]) { // Clause unitaire négativée
					
					console.log('UNSAT by opposites !', eq_tab)
					
					document.getElementById('lit_unsat').innerHTML++
					
					return false
					
					//throw new Error() // Arrêt du prog
				}
			}
		}
	}
	
	return true
}

function reslog(simple, obj, rec) {
	
	// Parcourir toutes les combinaisons dans "obj" et supprimer les variables étrangères négativées dans deux clauses distinctes, puis unir les clauses
	
	// Equation test : [[1,2,3],[-1,2,3],[1,-2,3],[-1,-2,3],[1,2,-3],[-1,2,-3],[1,-2,-3],[-1,-2,4],[-3,-4]] : UNSAT
	// 2,3 -2,3 2,-3, -2,-3 : UNSAT sur 2/3 et sur 1/2/3 ? Est-ce vrai ? Je ne crois pas ...
	
	let c = 0
	
	for (const property in obj) {
		
		c++
		
		let new_eq = []
		
		let vs = property.split('/')
		
		let len = vs.length
		
		if (vs.length > 1) {
			
			var mem_index = []
			
			eq_tab = JSON.parse( document.getElementById('eq').value )
				
			eq_tab.forEach(function(clause, index) { // [[1,2],[5,2],[1,-4],[-1,3],[-3,-2],[-2,4],[-1,-5,6]] : SAT
													 // [[1,2],[5,2],[1,-4],[-1,3],[-3,-2],[-2,4],[-1,-5]] : UNSAT
				let new_clause = []
				
				clause.forEach(function(v, i) {
					
					let v_abs = Math.abs(v) + ''
					
					if (vs.indexOf(v_abs) !== -1) { // Ajout d'une variable qui fait partie de la combinaison binaire
						
						new_clause.push(v)
					}
					else { // La variable n'est pas dans la combinaison binaire, on reparcourt toute l'équation à la recherche d'une union (+v/-v)
						
						eq_tab.forEach(function(clause2, index2) {
							
							if (index !== index2) {
								
								clause2.forEach(function(v2, i2) {
									
									let v2_abs = Math.abs(v2) + ''
									
									if (v === -v2 && vs.indexOf(v2_abs) === -1 && mem_index.indexOf(index) === -1) {
										
										// Clauses unies
										
										mem_index.push( index, index2 )
										
										clause.splice(i, 1)
										
										clause2.splice(i2, 1)
										
										new_clause = []
										
										new_clause = clause.concat(clause2)
									}
								})
							}
						})
					}
				})
				
				if (new_clause.length === vs.length) {
					
					new_eq.push( new_clause )
				}
			})
		}
		
		if (new_eq.length !== 0) {
			
			if (c === Object.keys(obj).length - 1) {
				
				sort( new_eq, 'last' )
			}
			else {
				
				sort( new_eq, true )
			}
		}
		else {
			
			console.log('SAT LIT !')
			
			document.getElementById('lit_sat').innerHTML++
			
			return true
		}
	}
}

function unsat_core_sum(arr) {
    
    const sum = arr.reduce((partialSum, a) => partialSum + parseInt(a, 2), 0)
    
    return sum
}

const absoluteValueArray = (array) => {
	
	return array.map( Math.abs ).sort( function(a, b) { return a - b } )
}

function sortArrayByAbsValues(sortedArray) {

	var negs = [], pos = [], result = [], nIdx = 0, pIdx = 0

	if (sortedArray.length === 0)
		return result

	//prepare negative/positive number sequences.
	for (var i = 0; i < sortedArray.length; i++) {
		var value = sortedArray[i]
		if (value < 0) {
			negs.push(value)
		} else {
			pos.push(value)
		}
	}
	// sort positive/negative numbers
	pos = pos.sort()
	negs = negs.sort()

	// Merging algorithm implementation which merges `negs` and `pos`
	while (nIdx < negs.length || pIdx < pos.length) {
		if (nIdx < negs.length && pIdx < pos.length) {
			if (Math.abs(negs[nIdx]) <= pos[pIdx])
				result.push(negs[nIdx++])
			else
				result.push(pos[pIdx++])
		}
		else if (nIdx < negs.length)
			result.push(negs[nIdx++])
		else
			result.push(pos[pIdx++])
	}

	return result
}


// -------------- Algo correct par simple bruteforce -------------- :

let equation

function bruteforce(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab)
	}
	
	let v = []
	
	let dup = []
	
	let temp = []
	
	let eq = []
	
	let start = Date.now()
	
	eq_tab.forEach(function(clause, index) {
		
		eq.push([])
		
		clause.forEach(function(variable) {
			
			if (Math.sign(variable) === -1) {
				
				variable = Math.abs(variable)
				
				if (v[variable] === undefined) {
					
					v[variable] = false
				}
				
				eq[index].push('!v['+variable+']');
				
				if (temp.indexOf(variable) !== -1 && dup.indexOf(variable) === -1) {
					
					dup.push(variable)
				}
				
				temp.push(variable * -1)
			}
			else if (Math.sign(variable) === 1) {
				
				if (v[variable] === undefined) {
					
					v[variable] = true
				}
				
				eq[index].push('v['+variable+']')
				
				if (temp.indexOf(variable * -1) !== -1 && dup.indexOf(variable) === -1) {
					
					dup.push(variable)
				}
				
				temp.push(variable)
			}
		});
		
		eq[index] = '(' + eq[index].join('|') + ')'
	});
	
	eq = eq.join('&')
	
	console.log(eq_tab)
	
	let check = false
	
	if ( eval(eq) ) {
		
		console.log('SAT BF !')
		
		check = true;
	}
	else {
		
		let baseCombi = '';
		
		dup.forEach(function(item) {
			
			if (item === true) {
				
				baseCombi += '1'
			}
			else {
				
				baseCombi += '0'
			}
		});
		
		let value = '0'
		
		while (1) {
			
			let len = value.length <= dup.length ? dup.length - value.length : 0
			
			let combi = '0'.repeat(len) + value
			
			//console.log(combi)
			
			for (let j = 0; j < combi.length; j++) {
				
				if (combi[j] === '0') {
					
					v[ dup[j] ] = false
				}
				else {
					
					v[ dup[j] ] = true
				}
			}
			
			if ( eval(eq) ) {
				
				//console.log('Success after inversion !')
				
				check = true
				
				break
			}
			
			if (combi.indexOf('0') === -1) {
				
				break
			}
				
			value = binarInc(value)
		}
		
		if (check === false) {
		
			console.log('UNSAT BF !')
		}
	}
	
	if (check === true) {
		
		document.getElementById('bf_sat').innerHTML++
	}
	else {
		
		document.getElementById('bf_unsat').innerHTML++
	}
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
	
	document.getElementById('send').onclick = function() {
		
		document.getElementById('bf_unsat').innerHTML = 0
		
		document.getElementById('bf_sat').innerHTML = 0
		
		document.getElementById('lit_unsat').innerHTML = 0
		
		document.getElementById('lit_sat').innerHTML = 0
		
		let nb_eq = document.getElementById('nb_eq').value
		
		for (let i = 0; i < nb_eq; i++) {
			
			let variables = document.getElementById('variables').value
			
			let clauses = document.getElementById('clauses').value
			
			let vc = document.getElementById('vc').value
			
			let vmax = document.getElementById('vmax').checked
			
			let cmax = document.getElementById('cmax').checked
			
			let vcmax = document.getElementById('vcmax').checked
			
			if (vmax === true) {
				
				variables = getRandomInt(1, variables)
			}
			
			if (cmax === true) {
				
				clauses = getRandomInt(1, clauses)
			}
			
			let a = []
			
			for (let i = 0; i < clauses; i++) {
				
				let n = vc
				
				if (vcmax === true) {
					
					n = getRandomInt(1, vc)
				}
				
				let m = []
				
				for (let j = 0; j < n; j++) {
					
					let nc = getRandomAppro(1, variables)
					
					m.push(nc)
				}
				
				a.push(m)
			}
			
			equation = a
			
			document.getElementById('eq').value = JSON.stringify( equation )
			
			sort( equation, false )
			
			bruteforce( equation )
		}
	}
})();

