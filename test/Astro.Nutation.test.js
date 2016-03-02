// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.nutation nutation", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1987, 4, 10);
	
	var nut = A.Nutation.nutation(new A.JulianDay(jd));
	
	assert.close(nut.deltalng*180/Math.PI, A.Coord.dmsToDeg(true, 0,0,3.788), 0.000001);
	assert.close(nut.deltaobliquity*180/Math.PI, A.Coord.dmsToDeg(false, 0,0,9.443), 0.000001);

});

QUnit.test( "astro.nutation meanObliquity", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1987, 4, 10);
	
	var obliquity0 = A.Nutation.meanObliquity(new A.JulianDay(jd));

	assert.close(obliquity0*180/Math.PI, A.Coord.dmsToDeg(false, 23,26,27.407), 0.000001);

});


QUnit.test( "astro.nutation meanObliquityLaskar", function( assert ) {
	
	var jd = A.JulianDay.calendarGregorianToJD(1987, 4, 10);
	
	var obliquity0 = A.Nutation.meanObliquityLaskar(new A.JulianDay(jd));

	assert.close(obliquity0*180/Math.PI, A.Coord.dmsToDeg(false,23,26,27.407), 0.000001);

});


QUnit.test( "astro.nutation meanObliquity vs meanObliquityLaskar", function( assert ) {
	
	function test(year, precision) {
		var jd = A.JulianDay.calendarGregorianToJD(year, 0, 0);
		var jdo = new A.JulianDay(jd);
		var obliquity0 = A.Nutation.meanObliquity(jdo);
		var obliquity0laskar = A.Nutation.meanObliquityLaskar(jdo);

		assert.ok(Math.abs(obliquity0-obliquity0laskar)*(180/Math.PI)*3600 < precision);	
	}
	
	test(0, 10);
	test(1000, 1);
	test(2000, 1);
	test(3000, 1);
	test(4000, 10);
});


