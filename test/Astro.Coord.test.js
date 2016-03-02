// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.coord eqToEcl", function( assert ) {
	// repeat example above
	var eqCoord = new A.EqCoord(
		A.Coord.calcRA(7, 45, 18.946), // right ascension
	 	A.Coord.calcAngle(false, 28, 1, 34.26)); // declination
	
	var epsilon = 23.4392911 * Math.PI / 180;
	var eclCoord = A.Coord.eqToEcl(eqCoord, epsilon);
	
	assert.close(eclCoord.lat*180/Math.PI, 113.21563, 0.00001);
	assert.close(eclCoord.lng*180/Math.PI, 6.684170, 0.00001);
	
	
	var eq = A.Coord.eclToEq(eclCoord, epsilon);
	
	// reverse test
	assert.close(eqCoord.ra, eq.ra, 0.00001);
	assert.close(eqCoord.dec, eq.dec, 0.00001);
	
})



QUnit.test( "astro.coord eqToHz", function( assert ) {
	// example 13.b
	var eqCoord = new A.EqCoord(
		A.Coord.calcRA(23, 9, 16.641), // right ascension
		A.Coord.calcAngle(true, 6, 43, 11.61)); // declination
	

	var eclCoord = new A.EclCoord(
		A.Coord.calcAngle(false, 38, 55, 17), //  latitude of observer on Earth
		A.Coord.calcAngle(false, 77, 3, 56)); //  longitude of observer on Earth
	
	//	st: sidereal time at Greenwich at time of observation.
	
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(1987, 4-1, 10, 19, 21, 0, 0)));
	
	var st = A.Sidereal.apparent(new A.JulianDay(jd));
	assert.close(st, A.JulianDay.secondsFromHMS(8,34,56.853), 0.0001);
	
	var hz = A.Coord.eqToHz(eqCoord, eclCoord, st * Math.PI / 43200); 
	
	assert.close(hz.az*180/Math.PI, 68.0336, 0.0001);
	assert.close(hz.alt*180/Math.PI, 15.1249, 0.0001);
	
})

QUnit.test( "astro.coord secondsToHMSStr", function( assert ) {

	assert.equal(A.Coord.secondsToHMSStr(86400 * 0.51816), "12:26:09");
	assert.equal(A.Coord.secondsToHMSStr(86400 * 0.81965), "19:40:17");
	assert.equal(A.Coord.secondsToHMSStr(86400 * 0.12113), "02:54:25");

})
