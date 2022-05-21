function bruteforce(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab);
	}
	
	let unsat_core = [], index1 = [];
	
	eq_tab.forEach(function(clause, index) {
		
		unsat_core.push([clause]);
		
		let clauseAbs = absoluteValueArray(clause);
		
		eq_tab.forEach(function(clause2, index2) {
			
			let clause2abs = absoluteValueArray(clause2);
			
			if (index !== index2) {
				
				if (JSON.stringify(clause2abs) === JSON.stringify(clauseAbs) && isin(index1, clause2)) {
					
					if (unsat_core[index][1] === undefined) {
						
						unsat_core[index].push(clause);
					}
					
					unsat_core[index][1] = unsat_core[index][1].concat(clause2);
					
					index1.push(clause2);
				}
				else {
					
					let check = 0;
					
					for (let i = 0; i < clause2.length; i++) {
						
						if (clauseAbs.indexOf(Math.abs(clause2[i])) !== -1) {
							
							check++;
						}
					}
					
					if (check > 0) {
						
						unsat_core[index].push(clause2);
					}
				}
			}
		});
	});
	
	console.log(unsat_core);
	
	let mem, check = true;
	
	for (let i = 0; i < unsat_core.length; i++) {
		
		let pass = 1;
		
		mem = unsat_core[i][1];
		
		if (unsat_core_sum(unsat_core[i][1]) === 0) {
			
			check = false;
			
			break;
		}
		
		for (let j = 0; j < unsat_core[i].length; j++) {
			
			if (j > 1) {
				
				for (let k = 0; k < pass; k++) {
					
					mem = mem.concat(unsat_core[i][j+k]);
				}
				
				if (unsat_core_sum( mem ) === 0) {
					
					check = false;
					
					break;
				}
				
				if (j === unsat_core[i].length - 1) {
					
					pass++;
					
					mem = unsat_core[i][1];
				}
			}
		}
		
		if (check === false) {
			
			break;
		}
	}
	
	if (check === false) {
		
		console.log('UNSAT :');
		
		console.log(mem);
	}
	else {
		
		console.log('SAT !');
	}
}

const absoluteValueArray = (array) => {
	
	return array.map( Math.abs ).sort( function(a, b) { return a - b } );
}

function unsat_core_sum(arr) {
    
    const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
    
    return sum;
}

function isin(arr, arr2) {
	
	arr2 = JSON.stringify(arr2);
	
	let check = false;
	
	for (let i = 0; i < arr.length; i++) {
		
		if (JSON.stringify(a) === arr2) {
			
			check = true;
			
			break;
		}
	}
	
	return check;
}

let eq_tab = [[1,2,3],[-1,2,3],[1,-2,3],[-1,-2,3],[1,2,-3],[-1,2,-3],[1,-2,-3],[-1,-2,4],[-4,-3]];

console.log( JSON.stringify(eq_tab) );

bruteforce(eq_tab);
