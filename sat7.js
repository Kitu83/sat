function process(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab)
	}
	
	let unsat_core = [], index1 = []
	
	eq_tab.forEach(function(clause, index) {
		
		unsat_core.push([clause])
		
		let clauseAbs = absoluteValueArray(clause)
		
		eq_tab.forEach(function(clause2, index2) {
			
			let clause2abs = absoluteValueArray(clause2);
			
			if (index !== index2) {
				
				if (JSON.stringify(clause2abs) === JSON.stringify(clauseAbs) && isin(index1, clause2) === false) {
					
					if (unsat_core[index][1] === undefined) {
						
						unsat_core[index].push(clause)
					}
					
					unsat_core[index][1] = unsat_core[index][1].concat(clause2)
					
					index1.push(clause2)
				}
				else {
					
					let check = 0;
					
					for (let i = 0; i < clause2abs.length; i++) {
						
						if (clauseAbs.indexOf(clause2abs[i]) !== -1) {
							
							check++
						}
					}
					
					if (check > 0) {
						
						unsat_core[index].push(clause2)
					}
				}
			}
		});
	});
	
	console.log(unsat_core)
	
	comb(unsat_core)
}

function comb(arr) {
	
	// 00, 01, 10, 11 soit 0, 1, 2, 3 = 6 = 2*3 = 2^1*3
	
	// 000, 001, 010, 011, 100, 101, 110, 111 soit 0, 1, 2, 3, 4, 5, 6, 7 = 28 = 3*7 + 7 = 2^2*7
	
	// 0000, 0001, 0010, 0011, 0100, 0101, 0110, 0111, 1000, 1001, 1010, 1011, 1100, 1101, 1110, 1111 soit 120 = 4*15 + 4*15 = 2^3*15
	
	// Exemple : [[1,2,3],[-1,2,3],[1,-2,3],[-1,-2,3],[1,2,-3],[-1,2,-3],[1,-2,-3],[-1,-2,4],[-3,-4]]
	
	let out = []
	
	let c = arr.length, digits, len
	
	for (let i = 0; i < c; i++) {
		
		let binary = ''
		
		digits = arr[i][0].length
		
		if (digits === 1) {
			
			for (let k = 1; k < arr[i].length; k++) {
				
				if (arr[i][k] === -arr[i][0]) {
					
					console.log('UNSAT !')
					
					return
				}
				else {
					
					let index = arr[i][k].indexOf(-arr[i][0])
					
					if (index !== -1) {
						
						arr[i][k].splice(index, 1)
					}
					if (arr[i][k].length === 0) {
						
						console.log('UNSAT !')
						
						return
					}
				}
			}
		}
		
		for (let j = 0; j < digits; j++) {
			
			if (arr[i][0][j] < 0) {
				
				binary += '0'
			}
			else {
				
				binary += '1'
			}
		}
		
		let not_common = [], clauses = []
		
		for (let k = 1; k < arr[i].length; k++) {
			
			for (let m = 0; m < arr[i][k].length; m++) {
				
				if (isin(absoluteValueArray(arr[0][0]), Math.abs(arr[i][k][m])) === false) {
					
					not_common.push( arr[i][k][m] )
					
					clauses.push( arr[i][k] )
				}
				
				let index = not_common.indexOf(-arr[i][k][m])
				
				if (index !== -1) {
					
					clauses[ index ].splice( clauses[ index ].indexOf(-arr[i][k][m]), 1 )
					
					arr[i][k].splice( m, 1 )
					
					let new_clause = clauses[ index ].concat( arr[i][k] )
					
					console.log( clauses[ index ], arr[i][k], new_clause )
					
					let bin = ''
					
					digits = new_clause.length
					
					for (let j = 0; j < digits; j++) {
						
						if (new_clause[j] < 0) {
							
							bin += '0'
						}
						else {
							
							bin += '1'
						}
					}
					
					console.log(bin)
					
					out.push( parseInt(bin, 2) )
					
					len = bin.length
				}
			}
		}
		
		if (len === digits) {
			
			console.log(binary)
			
			out.push( parseInt(binary, 2) )
		}
	}
	
	digits = Number(out.length-1).toString(2).length
	
	if (out.length === 2**len && unsat_core_sum(out) === 2**(digits-1) * (out.length-1)) {
		
		console.log('UNSAT !')
	}
	else {
		
		console.log('SAT !')
	}
}

const absoluteValueArray = (array) => {
	
	return array.map( Math.abs ).sort( function(a, b) { return a - b } )
}

function unsat_core_sum(arr) {
    
    const sum = arr.reduce((partialSum, a) => partialSum + a, 0)
    
    return sum
}

function isin(arr, arr2) {
	
	arr2 = JSON.stringify(arr2)
	
	let check = false
	
	for (let i = 0; i < arr.length; i++) {
		
		if (JSON.stringify(arr[i]) === arr2) {
			
			check = true
			
			break
		}
	}
	
	return check
}

(function() {
	
	document.getElementById('send').onclick = function() {
		
		process( document.getElementById('eq').value )
	}
})();
