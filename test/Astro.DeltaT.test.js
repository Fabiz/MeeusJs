// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.deltat estimate", function( assert ) {
	

	assert.close(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD(1977, 2, 18)), 47.6, 0.1);
	
	// check if all ranges return a result
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD(-2000, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD(    0, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1000, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1650, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1750, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1820, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1830, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1910, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1930, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1950, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1970, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 1990, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 2010, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 2100, 1, 1)) != null);
	assert.ok(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD( 2200, 1, 1)) != null);
	
});

QUnit.test( "astro.deltat estimate historical", function( assert ) {
	
	function test(year, deltaT) {
		assert.close(A.DeltaT.estimate(A.JulianDay.calendarGregorianToJD(year, 1, 1)), deltaT, 100);
	
	}
	// data from here https://de.wikipedia.org/wiki/Delta_T
	test(-1000, 25400);
	test( -800, 22000);
	test( -600, 18800);
	test( -400, 15530);
	test( -200, 12790);
	test(    0, 10580);
	test(  200, 8640);
	test(  400, 6700);
	test(  600, 4740);
	test(  800, 2960);
	test( 1000, 1570);
	
});

