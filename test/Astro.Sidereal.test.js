// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.sidereal apparent", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1987, 4, 10);
	var jdo = new A.JulianDay(jd);
	
	var s = A.Sidereal.mean(jdo);
	var sa = A.Sidereal.apparent(jdo);
	
	assert.close(s, A.JulianDay.secondsFromHMS(13,10,46.3668), 0.0001);
	assert.close(sa, A.JulianDay.secondsFromHMS(13,10,46.1351), 0.0001);

	var sa0UT = A.Sidereal.apparent0UT(jdo);
	assert.close(sa0UT, A.JulianDay.secondsFromHMS(13,10,46.1351), 0.003);
});



QUnit.test( "astro.sidereal apparent2", function( assert ) {

	// example 12b
	
	function secondsFromHMS(h, m, s) {
		return h*3600+m*60+s;
	}
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(1987, 4-1, 10, 19, 21)));
	var jdo = new A.JulianDay(jd);
	
	var s0UT = A.Sidereal.mean0UT(jdo);
	assert.close(s0UT, A.JulianDay.secondsFromHMS(13,10,46.3668), 0.0001);
	
	
	var s = A.Sidereal.mean(jdo);
	var sa = A.Sidereal.apparent(jdo);
	
	assert.close(s, secondsFromHMS(8,34,57.0896), 0.0001);
});


QUnit.test( "astro.sidereal apparent0UT", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1988, 3, 20);
	var jdo = new A.JulianDay(jd);
	
	var sa0UT = A.Sidereal.apparent0UT(jdo);
	
	assert.close(sa0UT, A.JulianDay.secondsFromHMS(11,50,58.0930), 0.0001);
});



