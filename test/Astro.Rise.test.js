// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.rise approxtimes venus", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1988, 3, 20);
	var jdo = new A.JulianDay(jd);
	
	var eclcoord = new A.EclCoord(
		A.Coord.calcAngle(false,  42, 20, 0), //  latitude of observer on Earth
		A.Coord.calcAngle(false, 71, 5, 0)); //  longitude of observer on Earth
	
	var h0 = A.Rise.stdh0Stellar;
	
	// Meeus gives us the value of 11h 50m 58.1s but we have a package
	// function for this:
	var Th0 = A.Sidereal.apparent0UT(jdo);
	assert.close(Th0, A.JulianDay.secondsFromHMS(11,50,58.0930), 0.0001);
	
	var eqcoord = new A.EqCoord(
		A.Coord.calcRA(2, 46, 55.51), // right ascension
		A.Coord.calcAngle(false, 18, 26, 27.3)); // declination
		
	

	var at = A.Rise.approxTimes(eclcoord, h0, Th0, eqcoord);


	assert.close(A.Math.pMod(at.rise, 86400), A.JulianDay.secondsFromHMS(12, 26, 9)/*0.51816*/, 1);
	assert.close(A.Math.pMod(at.transit, 86400), A.JulianDay.secondsFromHMS(19, 40, 17)/*0.81965*/, 1);
	assert.close(A.Math.pMod(at.set, 86400), A.JulianDay.secondsFromHMS(2, 54, 25)/*0.12113*/, 1);
	
});

QUnit.test( "astro.rise times venus", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1988, 3, 20);
	var jdo = new A.JulianDay(jd);
	
	var eclcoord = new A.EclCoord(
		A.Coord.calcAngle(false,  42, 20, 0), //  latitude of observer on Earth
		A.Coord.calcAngle(false, 71, 5, 0)); //  longitude of observer on Earth
	
	var h0 = A.Rise.stdh0Stellar;
	
	// Meeus gives us the value of 11h 50m 58.1s but we have a package
	// function for this:
	var Th0 = A.Sidereal.apparent0UT(jdo);
	assert.close(Th0, A.JulianDay.secondsFromHMS(11, 50, 58.0930), 0.0001);
	
	
	// Venus
	var eqcoord3 = [
		new A.EqCoord(A.Coord.calcRA(2, 42, 43.25), A.Coord.calcAngle(false, 18, 02, 51.4)),
		new A.EqCoord(A.Coord.calcRA(2, 46, 55.51), A.Coord.calcAngle(false, 18, 26, 27.3)),
		new A.EqCoord(A.Coord.calcRA(2, 51, 7.69), A.Coord.calcAngle(false, 18, 49, 38.7))
	];

	var at = A.Rise.times(eclcoord, jdo.deltaT, h0, Th0, eqcoord3);

	assert.close(A.Math.pMod(at.rise, 86400), A.JulianDay.secondsFromHMS(12, 25, 25)/*0.51816*/, 1);
	assert.close(A.Math.pMod(at.transit, 86400), A.JulianDay.secondsFromHMS(19, 40, 30)/*0.81965*/, 1);
	assert.close(A.Math.pMod(at.set, 86400), A.JulianDay.secondsFromHMS(2, 54, 39)/*0.12113*/, 1);
	
});

QUnit.test( "astro.rise stdh0", function( assert ) {
	assert.close(A.Rise.stdh0Stellar*180/Math.PI, -0.5667, 0.0001);
	assert.close(A.Rise.stdh0LunarMean*180/Math.PI, 0.125, 0.001);
	
	function testmoon(delta, stdh0) {
		var pi = Math.asin(6378.14 / delta);
		assert.close(A.Rise.stdh0Lunar(pi)*180/Math.PI, stdh0, 0.001);
	}
	
	testmoon(359861, 0.172); // min from https://www.fourmilab.ch/earthview/moon_ap_per.html
	testmoon(405948, 0.088); // max
	testmoon(359861 + (405948-359861)/2, 0.127); // mean 
	
});



