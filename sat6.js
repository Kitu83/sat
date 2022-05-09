function bruteforce3(eq_tab) {
	
	if (typeof eq_tab === 'string' || eq_tab instanceof String) {
		
		eq_tab = JSON.parse(eq_tab);
	}
	
	let unsat_core = [];
	
	eq_tab.forEach(function(clause, index) {
		  
		unsat_core.push([clause]);
		
		eq_tab.forEach(function(clause2, index2) {
			
			if (index !== index2) {
				
				if (absoluteSum(unsat_core[index][0]) === absoluteSum(clause2)) {
					
					if (unsat_core[index][1] === undefined) {
						
						unsat_core[index].push(clause);
					}
					
					unsat_core[index][1] = unsat_core[index][1].concat(clause2);
				}
				else {
					
					for (let i = 0; i < clause2.length; i++) {
						
						if (unsat_core[index][0].indexOf(clause2[i]) !== -1 || unsat_core[index][0].indexOf(Math.abs(clause2[i])) !== -1) {
							
							unsat_core[index].push(clause2);
							
							break;
						}
					}
				}
			}
		});
	});
	
	console.log(unsat_core);
	
	let mem, pass = 1, check = true;
	
	for (let i = 0; i < unsat_core.length; i++) {
		
		if (unsat_core_sum(unsat_core[i][1]) === 0) {
			
			check = false;
			
			break;
		}
		
		for (let j = 0; j < unsat_core[i].length; j++) {
			
			if (j > 1) {
				
				mem = unsat_core[i][1];
				
				for (let k = 0; k < pass; k++) {
					
					mem = mem.concat(unsat_core[i][j+k]);
				}
				
				if (unsat_core_sum( mem ) === 0) {
					
					check = false;
					
					break;
				}
				
				if (j === unsat_core[i].length-1) {
					
					pass++;
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

function unsat_core_sum(arr) {
    
    const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
    
    return sum;
}

const absoluteSum = arr => {

	let res = 0;
	
	for (let i = 0; i < arr.length; i++) {
		
		if (arr[i] < 0) {
			
			res += (arr[i] * -1);
			continue;
		};
		
		res += arr[i];
	};
	
	return res;
};

// (a|b|c) & (!a|b|c) & (a|!b|c) & (!a|!b|c) & (a|b|!c) & (!a|b|!c) & (a|!b|!c) & (!a|!b|d) & (!c|!d)

let eq_tab = [[1,2,3],[-1,2,3],[1,-2,3],[-1,-2,3],[1,2,-3],[-1,2,-3],[1,-2,-3],[-1,-2,4],[-3,-4]]

console.log('(a|b|c) & (!a|b|c) & (a|!b|c) & (!a|!b|c) & (a|b|!c) & (!a|b|!c) & (a|!b|!c) & (!a|!b|d) & (!c|!d)');

console.log( JSON.stringify(eq_tab) );

bruteforce3(eq_tab);
