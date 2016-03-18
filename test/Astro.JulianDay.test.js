// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.julianday J2000Century", function( assert ) {
	var T = (new A.JulianDay(A.JulianDay.calendarGregorianToJD(1992, 10, 13))).jdJ2000Century();
	
	assert.close(T, -0.072183436, 0.000000001);
});




QUnit.test( "astro.julianday calendarGregorianToJD", function( assert ) {
	function test(year, month, day, result) {
		assert.equal(A.JulianDay.calendarGregorianToJD(year, month, day), result);
			
	}
	
	test(1957, 10, 4.81, 2436116.31);
	test(2000, 1, 1.5, 2451545); // more examples, p. 62
	test(1999, 1, 1, 2451179.5);
	test(1987, 1, 27, 2446822.5);
	test(1987, 6, 19.5, 2446966);
	test(1988, 1, 27, 2447187.5);
	test(1988, 6, 19.5, 2447332);
	test(1900, 1, 1, 2415020.5);
	test(1600, 1, 1, 2305447.5);
	test(1600, 12, 31, 2305812.5);
});




QUnit.test( "astro.julianday calendarJulianToJD", function( assert ) {
	function test(year, month, day, result) {
		assert.equal(A.JulianDay.calendarJulianToJD(year, month, day), result);
			
	}
	
	test(333, 1, 27.5, 1842713.0);
	
	test(837, 4, 10.3, 2026871.8); // more examples, p. 62
	test(-123, 12, 31, 1676496.5);
	test(-122, 1, 1, 1676497.5);
	test(-1000, 7, 12.5, 1356001);
	test(-1000, 2, 29, 1355866.5);
	test(-1001, 8, 17.9, 1355671.4);
	test(-4712, 1, 1.5, 0);

});

QUnit.test( "astro.julianday dateToJD", function( assert ) {
	
	function test(date, jd) {
		var jdo = new A.JulianDay(date); // result is  2446896.30625
		assert.close(jdo.jd, jd, 0.00001);
		assert.equal(jdo.toDate().getTime(), date.getTime());
	}
	
	
	test(new Date(Date.UTC(1999, 1-1, 1)), 2451179.5);
	
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 21, 0)), 2446896.30625); // see page 89
	
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 21, 0)), 2446896.30625); // see page 89
	
	test(new Date(Date.UTC(2016, 2-1, 18, 15-1, 50, 3)),  2457437.1180903);
	
	test(new Date(Date.UTC(1957, 10-1, 4, 19, 44, 26)),  2436116.322523);  // Example 7.a
	
	test(new Date(Date.UTC(333, 1-1, 27, 12, 0, 0)),  1842713.0);  // Example 7.a
	test(new Date(Date.UTC(-2015, 2-1, 18, 12, 0, 0)),  985127.9999996);  // From calsky.com

	
});

QUnit.test( "astro.julianday leapYearGregorian", function( assert ) {
	assert.equal(A.JulianDay.leapYearGregorian(1700), false);
	assert.equal(A.JulianDay.leapYearGregorian(1800), false);
	assert.equal(A.JulianDay.leapYearGregorian(1900), false);
	assert.equal(A.JulianDay.leapYearGregorian(2100), false);
	assert.equal(A.JulianDay.leapYearGregorian(1600), true);
	assert.equal(A.JulianDay.leapYearGregorian(2000), true);
	assert.equal(A.JulianDay.leapYearGregorian(2400), true);
});

QUnit.test( "astro.julianday toCalendar", function( assert ) {
	
	function test(jd, y, m, d) {
		var cal = jd.toCalendar();
		assert.equal(cal.y, y);
		assert.equal(cal.m, m);
		assert.close(cal.d, d, 0.1);
		
	}
	
	test(new A.JulianDay(1842713), 333, 1, 27.5);
	test(new A.JulianDay(1507900.13), -584, 5, 28.63);
	
});

QUnit.test( "astro.julianday dayOfYear", function( assert ) {
	assert.equal(A.JulianDay.dayOfYear(1988, 4, 22, true), 113);
});

QUnit.test( "astro.julianday deltaT", function( assert ) {
	var jd = new A.JulianDay(A.JulianDay.calendarGregorianToJD(1977, 2, 18));
	
	assert.close(jd.deltaT, 47.6, 0.1);
});

QUnit.test( "astro.julianday jdFromJDE", function( assert ) {
	
	var jde = 2451179.5; // 1999/1/1
	var jd = A.JulianDay.jdFromJDE(jde);
	
	assert.close(jd.jd, jde, 0.1);
});


QUnit.test( "astro.julianday startOfDay", function( assert ) {

	function test(date, jd) {
		var jdo = new A.JulianDay(date); // result is  2446896.30625
		assert.close(jdo.startOfDay().jd, jd);
	}
	
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 21, 0)), 2446895.5); // result is  2446896.30625
	test(new Date(Date.UTC(1987, 4-1, 10, 0, 0, 0)), 2446895.5); // result is  2446896.30625
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 23, 59, 59)), 2446895.5); // result is  2446896.30625
		
});

QUnit.test( "astro.julianday jdToDate", function( assert ) {

	function test(date, jd) {
		var jdo = new A.JulianDay(date); // result is  2446896.30625
		assert.close(jdo.startOfDay().jd, jd);
	}
	
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 21, 0)), 2446895.5); // result is  2446896.30625
	test(new Date(Date.UTC(1987, 4-1, 10, 0, 0, 0)), 2446895.5); // result is  2446896.30625
	test(new Date(Date.UTC(1987, 4-1, 10, 19, 23, 59, 59)), 2446895.5); // result is  2446896.30625
		
});

