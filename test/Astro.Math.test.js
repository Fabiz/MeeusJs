// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.math pmod", function( assert ) {
	
	assert.equal(1, A.Math.pMod(5, 2));
	assert.equal(1, A.Math.pMod(-5, 2));
	assert.equal(1, A.Math.pMod(5, -2));
});


QUnit.test( "astro.math modF", function( assert ) {
	function test(value, dec, fract) {
		var mod = A.Math.modF(value);
		assert.equal(mod[0], dec);
		assert.close(mod[1], fract);
	}
	test(3.1, 3, 0.1);
	test(-3.1, -3, -0.1);
	
});

QUnit.test( "astro.math honer", function( assert ) {
	var horner = A.Math.horner;
	
	//Meeus gives no test case.
	//The test case here is from Wikipedia's entry on Horner's method.
	var y = horner(3, [-1, 2, -6, 2]);
	
	assert.equal(y, 5);
});

