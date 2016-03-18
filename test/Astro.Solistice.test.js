// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.solistice june", function( assert ) {

	var jde = A.Solistice.june(1962);
	var jdo = A.JulianDay.jdFromJDE(jde);
	 
	assert.close(jdo.jde, 2437837.39245, 0.00001);
});


QUnit.test( "astro.solistice batch", function( assert ) {

	function test(jde, month, day, hour, min) {
		var jdo = A.JulianDay.jdFromJDE(jde);
		
		var date = jdo.toDate();	
		assert.equal(date.getUTCMonth()+1, month);
		assert.equal(date.getUTCDate(), day);
		assert.equal(date.getUTCHours(), hour);
		assert.close(date.getUTCMinutes(), min, 5);
	}
		 
	test(A.Solistice.march(1996), 3, 20, 8, 4);
	test(A.Solistice.march(2000), 3, 20, 7, 36);
	
	test(A.Solistice.june(1996), 6, 21, 2, 24);
	test(A.Solistice.june(2005), 6, 21, 6, 47);

	test(A.Solistice.september(1996), 9, 22, 18, 1);
	test(A.Solistice.september(2005), 9, 22, 22, 24);
	

	test(A.Solistice.december(1996), 12, 21, 14, 6);
	test(A.Solistice.december(2005), 12, 21, 18, 36);
});

QUnit.test( "astro.solistice batch bc", function( assert ) {

	function test(jde, month, day) {
		var jdo = A.JulianDay.jdFromJDE(jde);
		
		var date = jdo.toDate();	
		assert.equal(date.getUTCMonth()+1, month);
		assert.equal(date.getUTCDate(), day);

	}
		 
	test(A.Solistice.march(-2000), 4, 7);
	
	test(A.Solistice.june(-2000), 7, 10);
	
	test(A.Solistice.september(-2000), 10, 9);

	test(A.Solistice.december(-2000), 1, 5);
	
});
