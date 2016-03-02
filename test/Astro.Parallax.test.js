// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.parallax horizontal", function( assert ) {

	// Example 40.a, p. 280
	var parallax = A.Parallax.horizontal(.37276);
	
	assert.close(parallax*180/Math.PI*60*60, 23.592, 0.001);
})


QUnit.test( "astro.parallax topocentric", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(2003, 8, 28+(3+17./60)/24);
	var jdo = new A.JulianDay(jd);
	
	var eqcoord = new A.EqCoord(339.530208*Math.PI/180, -15.771083*Math.PI/180);
	
	var φ = A.Coord.calcAngle(false, 33, 21, 22); // latitude
	var ψ = A.Coord.calcRA(7, 47, 27); // Longitude

	
	var parallax = A.Parallax.horizontal(.37276);
	assert.close(parallax*180/Math.PI, A.Coord.calcAngle(false, 0, 0, 23.592)*180/Math.PI, 0.001);
	var apparent0 = A.Sidereal.apparent(jdo) * Math.PI / 43200;
	assert.close(apparent0*180/Math.PI, A.Coord.calcRA(1, 40, 45)*180/Math.PI, 0.002);
	var H = A.Math.pMod(apparent0-ψ-eqcoord.ra, 2*Math.PI);
	assert.close(H*180/Math.PI, 288.7958, 0.0002);
	
	var pc = A.Globe.parallaxConstants(φ, 1706);
	assert.close(pc.rhoslat, .546861, 0.00001);
	assert.close(pc.rhoclat, .836339, 0.00001);
	
	var apparent0 = A.Sidereal.apparent(jdo) * Math.PI / 43200;
	
	// Example 40.a, p. 280
	var tc = A.Parallax.topocentric(
			eqcoord,
			parallax, .546861, .836339,
			ψ,
			apparent0);
	
	assert.close(tc.ra, A.Coord.calcRA(22, 38, 8.54), 0.0002);
	assert.close(tc.dec, A.Coord.calcAngle(true, 15, 46, 30), 0.00001);
	
	// Output:
	// ra' = 22ʰ38ᵐ8ˢ.54
	// dec' = -15°46′30″.0
})


QUnit.test( "astro.parallax topocentric2", function( assert ) {

	var eqcoord = new A.EqCoord(339.530208*Math.PI/180, -15.771083*Math.PI/180);
	
	var parallax = A.Parallax.horizontal(.37276);
	var ψ = A.Coord.calcRA(7, 47, 27); // Longitude

	var jdo = new A.JulianDay(A.JulianDay.calendarGregorianToJD(2003, 8, 28+(3+17./60)/24));
	var apparent0 = A.Sidereal.apparent(jdo) * Math.PI / 43200;
	
	// Example 40.a, p. 280
	var tc = A.Parallax.topocentric2(
			eqcoord,
			parallax, .546861, .836339,
			ψ,
			apparent0);
	
	assert.close(tc.ra, eqcoord.ra + A.Coord.calcRA(0, 0, 1.29), 0.0002);
	assert.close(tc.dec, eqcoord.dec + A.Coord.calcAngle(true, 0, 0, 14.1), 0.00001);
	
	// Output:
	// ra' = 22ʰ38ᵐ8ˢ.54
	// dec' = -15°46′30″.0
})

QUnit.test( "astro.parallax topocentric moon", function( assert ) {

	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 21, 0, 0, 0)));
	
	var φ = 47.3667 * Math.PI / 180; //A.Coord.calcAngle(false, 47, 22, 0.12); //  latitude of observer on Earth
	var ψ = - 8.5655 * Math.PI / 180; // A.Coord.calcAngle(false, 8, 33, 51.84); //  longitude of observer on Earth

	var eqcoord = new A.EqCoord(
		A.Coord.calcRA(8, 52, 8.11),
		A.Coord.calcAngle(false, 14, 2, 40.2));
	
	// Example 40.a, p. 280 
	var gc = A.Globe.parallaxConstants(φ, 0);
	
	var parallax = A.Moon.parallax(387697.9);
	assert.close(parallax, A.Coord.calcAngle(false, 0, 55, 51.32), 0.001);
	
	var apparent0 = A.Sidereal.apparent(new A.JulianDay(jd)) * Math.PI / 43200;
	
	// Example 40.a, p. 280 ra, dec, Δ, ρsφ, ρcφ, φ, jde
	var tc = A.Parallax.topocentric(eqcoord, parallax, gc.rhoslat, gc.rhoclat, ψ, apparent0);
	
	assert.close(tc.ra*180/Math.PI, (A.Coord.calcRA(8, 50, 59.19))*180/Math.PI, 0.01, "exp:" + (A.Coord.calcRA(8, 50, 59.19))*180/Math.PI); 
	assert.close(tc.dec*180/Math.PI,  A.Coord.calcAngle(false, 13, 30, 52.1)*180/Math.PI, 0.01, "exp:" + A.Coord.calcAngle(false, 13, 30, 52.1)*180/Math.PI);  

})

	