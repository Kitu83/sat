loop:
for (let i = 0; i < dup.length; i++) {
	
	let sign = dup[i] < 0 ? false : true;
	
	let variable = Math.abs( dup[i] );
		
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
