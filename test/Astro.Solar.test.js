// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.solar meanAnomaly", function( assert ) {

	var T = (new A.JulianDay(A.JulianDay.calendarGregorianToJD(1992, 10, 13))).jdJ2000Century();
	var M = A.Solar.meanAnomaly(T)*180/Math.PI;
	
	assert.close(M, -2241.00603, 0.00001);
});

QUnit.test( "astro.solar trueLongitude", function( assert ) {

	var T = (new A.JulianDay(A.JulianDay.calendarGregorianToJD(1992, 10, 13))).jdJ2000Century();
	
	var l = A.Solar.trueLongitude(T);
	var lng = l.s;
	
	assert.close(lng*180/Math.PI, 199.90987, 0.00001);
	
});

QUnit.test( "astro.solar apparentLongitude", function( assert ) {

	var T = (new A.JulianDay(A.JulianDay.calendarGregorianToJD(1992, 10, 13))).jdJ2000Century();
	
	var λ = A.Solar.apparentLongitude(T);
	
	assert.close(λ*180/Math.PI, 199.90895, 0.00001);
	
});


//QUnit.test( "astro.solar trueEquatorial", function( assert ) {
//
//	var jd = A.JulianDay.calendarGregorianToJD(1992, 10, 13);
//	
//	var ae = A.Solar.trueEquatorial(jd);
//	
//	assert.close(ae.ra*180/Math.PI, -161.61833, 0.00001);
//	assert.close(ae.dec*180/Math.PI, -7.78549, 0.00001);
//});



QUnit.test( "astro.solar apparentEquatorial", function( assert ) {

	var jd = A.JulianDay.calendarGregorianToJD(1992, 10, 13);
	var jdo = new A.JulianDay(jd);
	
	var ae = A.Solar.apparentEquatorial(jdo);
	
	assert.close(ae.ra*180/Math.PI, -161.61917, 0.00001);
	assert.close(ae.dec*180/Math.PI, -7.78507, 0.00001);
});

QUnit.test( "astro.solar position zurich", function( assert ) {
	// http://ssd.jpl.nasa.gov/horizons.cgi#results
	//
	// Ephemeris Type [change] : 	OBSERVER
	// Target Body [change] : 	Sun [Sol] [10]
	// Observer Location [change] : 	user defined ( 8°33'51.8''E, 47°22'00.1''N )
	// Time Span [change] : 	Start=2016AD-02-18, Stop=2016AD-02-19, Step=1 h
	// Table Settings [change] : 	QUANTITIES=2,4,7
	// Display/Output [change] : 	default (formatted HTML)
	//
	// Date__(UT)__HR:MN     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// ******************************************************************************
	// 2016-Feb-18 14:00 *m  22 05 50.99 -11 42 04.6 217.7459  23.1758 00 26 09.9180
	 
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 18, 15-1, 0, 0))); // 18. Feb 2016, 15h 00m 00s UTC+1
	assert.equal(jd, 2457437.0833333335);
	
	var jdo = new A.JulianDay(jd);
	var ae = A.Solar.apparentEquatorial(jdo);
	
	// 2016-Feb-18 14:00 2457437.083333333     22 05 51.22 -11 41 57.2   .n.a.     .n.a.
	assert.close((ae.ra+2*Math.PI)*180/Math.PI, (A.Coord.calcRA(22, 5, 51.22))*180/Math.PI, 0.01);  
	assert.close(ae.dec*180/Math.PI,  A.Coord.calcAngle(true, 11, 41, 57.2)*180/Math.PI, 0.01); 
	
	var eclCoord =  A.EclCoord.fromWgs84(47.3667, 8.5655);
	

	var st0 = A.Sidereal.apparent(jdo);
	var st = A.Sidereal.apparentLocal(jdo, eclCoord.lng);
	
	assert.close(st0, A.JulianDay.secondsFromHMS(23, 51, 54.445), 0.01); // Greenwich values from calsky.com
	assert.close(st, A.JulianDay.secondsFromHMS(0, 26, 9.9180), 0.3); // local
	
	var hz = A.Coord.eqToHz(ae, eclCoord, st0 * Math.PI / 43200); 
	
	assert.close(hz.az*180/Math.PI + 180.0, 217.7459, 0.005);
	assert.close(hz.alt*180/Math.PI, 23.1758, 0.001);
	
	// shortcut
	var hz2 = A.Solar.topocentricPosition(jdo, eclCoord);
	assert.close(hz2.hz.az*180/Math.PI + 180.0, 217.7459, 0.005);
	assert.close(hz2.hz.alt*180/Math.PI, 23.1758, 0.005);
});

QUnit.test( "astro.solar position zurich bc", function( assert ) {
	// http://ssd.jpl.nasa.gov/horizons.cgi#results
	//
	// Ephemeris Type [change] : 	OBSERVER
	// Target Body [change] : 	Sun [Sol] [10]
	// Observer Location [change] : 	user defined ( 8°33'51.8''E, 47°22'00.1''N )
	// Time Span [change] : 	Start=2016BC-02-18, Stop=2016BC-02-19, Step=1 h
	// Table Settings [change] : 	QUANTITIES=2,4,7; date/time format=BOTH
	// Display/Output [change] : 	default (formatted HTML)
	//  Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// b2016-Feb-18 12:00  985128.000000000 *m  21 04 13.94 -17 06 59.1 183.7456  25.4385 21 18 23.2814
	//  Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time       TDB-UT L_Ap_SOL_Time L_Ap_Hour_Ang
	// b2016-Feb-18 06:59  985127.790972222 *r  21 03 25.10 -17 10 33.0 114.8724  -0.8147 16 16 33.8349 46751.828087 07 13 08.7332 -04 46 51.267
	// b2016-Feb-18 11:47  985127.990972222 *t  21 04 11.84 -17 07 08.4 180.3058  25.5138 21 05 21.1459 46751.814727 12 01 09.3104  00 01 09.310
	// b2016-Feb-18 16:34  985128.190277778 Cs  21 04 58.35 -17 03 41.4 245.4410  -0.9289 01 53 08.2926 46751.801414 16 48 09.9396  04 48 09.940

	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(-2015, 2-1, 18, 12, 0, 0)));
	var timezone = 1;
	assert.close(jd, 985128.000000000, 0.00001);
	
	var jdo = new A.JulianDay(jd);
	
	var ae = A.Solar.apparentEquatorial(jdo);
	
	assert.close((ae.ra+2*Math.PI)*180/Math.PI, (A.Coord.calcRA(21, 4, 13.94))*180/Math.PI, 0.6);  
	assert.close(ae.dec*180/Math.PI,  A.Coord.calcAngle(true, 17, 6, 59.1)*180/Math.PI, 0.2); 
	
	var eclCoord =  A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	var st = A.Sidereal.apparentLocal(jdo, eclCoord.lng);
	
	assert.close(st, A.JulianDay.secondsFromHMS(21, 18, 23.2814), 1, st); 

	var st0 = A.Sidereal.apparent(jdo) * Math.PI / 43200;
	
	var hz = A.Coord.eqToHz(ae, eclCoord, st0); 
	
	assert.close(hz.az*180/Math.PI + 180.0, 183.7456, 0.6);
	assert.close(hz.alt*180/Math.PI, 25.4137, 0.2);
	
	// shortcut
	var hz2 = A.Solar.topocentricPosition(jdo, eclCoord);

	assert.close(hz2.hz.az*180/Math.PI + 180.0, 183.7456, 0.6);
	assert.close(hz2.hz.alt*180/Math.PI, 25.4137, 0.2);
	
});



QUnit.test( "astro.solar position different tests", function( assert ) {
	
	function test(jd, eclCoord, az, alt, prec) {
	
		var tp = A.Solar.topocentricPosition(new A.JulianDay(jd), eclCoord);
		
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, prec, "az:" + jd + " " + eclCoord.toWgs84String());
		assert.close(tp.hz.alt*180/Math.PI, alt, prec, "alt:" + jd + " " + eclCoord.toWgs84String());
	}
	
	// test dates from ssd.jpl.nasa.gov
	test(A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 18, 14, 0, 0))), A.EclCoord.fromWgs84(47.3667, 8.5655), 217.7459, 23.1758, 0.01);
	test(A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 18, 14, 0, 0))), A.EclCoord.fromWgs84(-47.3667, -8.5655), 331.1607, 51.2715, 0.01);
	// b2016-Feb-18 14:00  985128.083333333 *m  21 04 33.35 -17 05 32.8 213.9246  18.8665 23 18 42.9943
	test(A.JulianDay.dateToJD(new Date(Date.UTC(-2015, 2-1, 18, 15-1, 0, 0))), A.EclCoord.fromWgs84(47.3667, 8.5655), 213.9246, 18.8665, 0.5);
	// b2016-Feb-18 14:00  985128.083333333 *m  21 04 33.47 -17 05 20.8 330.4089  56.8475 22 10 12.0440
	test(A.JulianDay.dateToJD(new Date(Date.UTC(-2015, 2-1, 18, 15-1, 0, 0))), A.EclCoord.fromWgs84(-47.3667, -8.5655), 330.4089, 56.8475, 1);

});

QUnit.test( "astro.solar position refraction", function( assert ) {
	
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 18, 14, 0, 0)));
	
	var eclCoord =  A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	var hz2 = A.Solar.topocentricPosition(new A.JulianDay(jd), eclCoord, true);

	assert.close(hz2.hz.az*180/Math.PI + 180.0,  217.7459, 0.005);
	assert.close(hz2.hz.alt*180/Math.PI, 23.21, 0.005);
	
});

QUnit.test( "astro.solar approxtimes", function( assert ) {
	
	function test(jd, eclCoord, rise, transit, set, prec) {
		
		var at = A.Solar.approxTimes(new A.JulianDay(jd), eclCoord);
		
		assert.close(at.rise, rise, prec, A.Coord.secondsToHMSStr(at.rise) + "- exp:" + A.Coord.secondsToHMSStr(rise));
		assert.close(at.transit, transit, prec, A.Coord.secondsToHMSStr(at.transit) + "- exp:" + A.Coord.secondsToHMSStr(transit));
		assert.close(at.set, set, prec, A.Coord.secondsToHMSStr(at.set) + "- exp:" + A.Coord.secondsToHMSStr(set));
	}
	
	
	var timezone = 1;
	// test dates from calsky
	test(A.JulianDay.calendarGregorianToJD(2016, 2, 18), A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(7-timezone, 27, 6), 
			A.JulianDay.secondsFromHMS(12-timezone, 39, 41.5),
			A.JulianDay.secondsFromHMS(17-timezone, 53, 0),
			70); // not very precise
	
	timezone = 0;
	
	/*
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(-2015, 2-1, 18, 12, 0, 0)));
	assert.close(jd, 985127.9999996, 0.00001);
	test(jd, -47.3667, -8.5655, 
			A.JulianDay.secondsFromHMS(5-timezone, 30, 24), 
			A.JulianDay.secondsFromHMS(12-timezone, 54, 26.9),
			A.JulianDay.secondsFromHMS(20-timezone, 17, 36),
			5); // 5 seconds
	*/
});



QUnit.test( "astro.solar times", function( assert ) {
	
	function test(jd, eclCoord, rise, transit, set, prec) {

		var t = A.Solar.times(new A.JulianDay(jd), eclCoord);

		assert.close(t.rise, rise, prec, A.Coord.secondsToHMSStr(t.rise) + "- exp:" + A.Coord.secondsToHMSStr(rise));
		assert.close(t.transit, transit, prec, A.Coord.secondsToHMSStr(t.transit) + "- exp:" + A.Coord.secondsToHMSStr(transit));
		assert.close(t.set, set, prec, A.Coord.secondsToHMSStr(t.set) + "- exp:" + A.Coord.secondsToHMSStr(set));
	}
	
	var timezone = 1;
	// values from ssd.jpl.nasa.gov
	// 2016-Feb-18 06:28 2457436.769444444 *r  22 04 38.87 -11 48 41.5 106.8126  -0.6855 16 52 55.6653
	// 2016-Feb-18 11:40 2457436.986111111 *t  22 05 28.71 -11 44 08.1 180.0866  30.8977 22 05 46.9194
	// 2016-Feb-18 16:54 2457437.204166667 Cs  22 06 18.81 -11 39 30.5 253.7668  -0.9943 03 20 38.5019
	// more exact test data from calsky
	test(A.JulianDay.calendarGregorianToJD(2016, 2, 18), A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(7-timezone, 27, 6), // rise
			A.JulianDay.secondsFromHMS(12-timezone, 39, 41.5), // transit
			A.JulianDay.secondsFromHMS(17-timezone, 53, 0), // set
			2); // 5 seconds
	timezone = 0;
	test(A.JulianDay.calendarGregorianToJD(2016, 2, 18), A.EclCoord.fromWgs84(-47.3667, -8.5655), 
			A.JulianDay.secondsFromHMS(5-timezone, 50, 30), 
			A.JulianDay.secondsFromHMS(12-timezone, 48, 12.7),
			A.JulianDay.secondsFromHMS(19-timezone, 45, 0),
			5); // 5 seconds
		
	// tests for BC
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(-2015, 2-1, 18)));
	assert.close(jd, 985127.5, 0.00001);
	//  Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time       TDB-UT L_Ap_SOL_Time L_Ap_Hour_Ang
	// b2016-Feb-18 06:59  985127.790972222 *r  21 03 25.10 -17 10 33.0 114.8724  -0.8147 16 16 33.8349 46751.828087 07 13 08.7332 -04 46 51.267
	// b2016-Feb-18 11:47  985127.990972222 *t  21 04 11.84 -17 07 08.4 180.3058  25.5138 21 05 21.1459 46751.814727 12 01 09.3104  00 01 09.310
	// b2016-Feb-18 16:34  985128.190277778 Cs  21 04 58.35 -17 03 41.4 245.4410  -0.9289 01 53 08.2926 46751.801414 16 48 09.9396  04 48 09.940
	test(jd, A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(6, 59, 0), 
			A.JulianDay.secondsFromHMS(11, 47, 0),
			A.JulianDay.secondsFromHMS(16, 34, 0),
			150); //  150 seconds
	
	 //  Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	 // b2016-Feb-18 12:48  985128.033333333 *r  21 04 22.20 -17 06 23.4 114.9172  -0.6866 16 18 00.2413
	 // b2016-Feb-18 17:35  985128.232638889 *t  21 05 08.73 -17 02 58.8 180.1708  25.5835 21 05 47.3881
	 //b2016-Feb-18 22:23  985128.432638889 Cs  21 05 55.36 -16 59 30.3 245.5755  -0.9511 01 54 34.6993
	test(jd, A.EclCoord.fromWgs84(47.3667, -78.5655), 
			A.JulianDay.secondsFromHMS(12, 48, 0), 
			A.JulianDay.secondsFromHMS(17, 35, 0),
			A.JulianDay.secondsFromHMS(22, 23, 0),
			160); //  160 seconds
	
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(-4499, 1-1, 1)));
	assert.close(jd, 77798.5, 0.00001);
	 //  Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	 // b4500-Jan-01 07:11   77798.799305555 *r  16 26 33.17 -22 21 32.2 123.1098  -0.8155 12 06 55.3132
	 // b4500-Jan-01 11:31   77798.979861111 *t  16 27 18.83 -22 23 18.2 180.0788  20.2449 16 27 38.0241
	 // b4500-Jan-01 15:51   77799.160416667 Cs  16 28 04.47 -22 25 00.6 236.9714  -0.9520 20 48 20.7349
	test(jd, A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(7, 11, 0), 
			A.JulianDay.secondsFromHMS(11, 31, 0),
			A.JulianDay.secondsFromHMS(15, 51, 0),
			360); //  6 min
	 
});




