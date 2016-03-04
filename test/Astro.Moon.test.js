// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.moon parallax", function( assert ) {
	
	assert.close(A.Moon.parallax(359861)*180/Math.PI, 1.01, 0.01);
	assert.close(A.Moon.parallax(405948)*180/Math.PI, 0.90, 0.01);
	assert.close(A.Moon.parallax(359861 + (405948-359861)/2)*180/Math.PI, 0.954, 0.01);
	 
});

QUnit.test( "astro.moon apparentEquatorial vs apparentTopocentric", function( assert ) {

	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 21, 0, 0, 0)));

	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	var jdo = new A.JulianDay(jd);
	var ae = A.Moon.apparentEquatorial(jdo);
	var aet = A.Moon.apparentTopocentric(jdo, eclCoord);
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 2016-Feb-21 00:00 2457439.500000000     08 52 08.11 +14 02 40.2   .n.a.     .n.a.
	// 2016-Feb-21 00:00 2457439.500000000  m  08 50 59.19 +13 30 52.1 221.5661  49.7236 10 35 41.5918
	

	assert.close(ae.eq.ra*180/Math.PI, (A.Coord.calcRA(8, 52, 8.11))*180/Math.PI, 0.01, "exp:" + (A.Coord.calcRA(8, 52, 8.11))*180/Math.PI); 
	assert.close(ae.eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 14, 2, 40.2)*180/Math.PI, 0.01, "exp:" + A.Coord.calcAngle(false, 14, 2, 40.2)*180/Math.PI);  

	assert.close(aet.eq.ra*180/Math.PI, (A.Coord.calcRA(8, 50, 59.19))*180/Math.PI, 0.02, "exp:" + (A.Coord.calcRA(8, 50, 59.19))*180/Math.PI); 
	assert.close(aet.eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 13, 30, 52.1)*180/Math.PI, 0.01, "exp:" + A.Coord.calcAngle(false, 13, 30, 52.1)*180/Math.PI);  
		
	
})

QUnit.test( "astro.moon geocentricPosition", function( assert ) {
	// Example 47.a
	var jde = A.JulianDay.calendarGregorianToJD(1992, 4, 12);
	var jd = A.DeltaT.jdeToJd(jde);
	var jdo = new A.JulianDay(jd);
	
	assert.close(jde, 2448724.500000, 0.000001);
	var T = jdo.jdJ2000Century();
	assert.close(T, -0.077221, 0.000001);
	
	
	var moon = A.Moon.geocentricPosition(jdo);
	
	assert.close(moon.lng * 180/Math.PI, 133.162655, 0.000001);
	assert.close(moon.lat * 180/Math.PI, -3.229126, 0.000001);
	assert.close(moon.delta, 368409.7, 0.1); // 50km
	
	var nut = A.Nutation.nutation(jdo);
	assert.close(nut.deltalng*180/Math.PI, 0.004610, 0.000002);
	
	var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
	var obliquity = obliquity0 + nut.deltaobliquity; // true obliquity
	
	var apparentlng = moon.lng + nut.deltalng; // apparent longitude
	assert.close(apparentlng * 180/Math.PI, 133.167265, 0.000001);
	
	
	assert.close(obliquity*180/Math.PI, 23.440636, 0.000002);
	// get the moon's apparent right ascension and declination (see page 343)
	var eq = A.Coord.eclToEq(new A.EclCoord(apparentlng, moon.lat), obliquity);
	// values from meeus
	assert.close(eq.ra*180/Math.PI, 134.688470, 0.00001);
	assert.close(eq.dec*180/Math.PI, 13.768368, 0.00001);
	
	
	//assert.close((A.Coord.calcAngle(false, 0, 0, 10))*180/Math.PI, 134.688470, 0.005);
	//assert.close((A.Coord.calcRA(8, 56, 6.70))*180/Math.PI, 134.688470, 0.005);
	//assert.close(A.Coord.calcAngle(false, 13, 5, 53.5)*180/Math.PI, 13.768368, 0.005);
	
	// values from ssd.jpl.nasa.gov
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 1992-Apr-12 00:00 2448724.500000000  m  08 56 06.70 +13 05 53.5 268.0399  19.7350 13 56 02.2291
	// 1992-Apr-12 00:00 2448724.500000000     08 58 47.33 +13 45 54.5   .n.a.     .n.a.

	assert.close(eq.ra*180/Math.PI, (A.Coord.calcRA(8, 58, 47.33))*180/Math.PI, 0.01);  
	assert.close(eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 13, 45, 54.5)*180/Math.PI, 0.01); 
	
	// values from calsky
	assert.close(eq.ra*180/Math.PI, (A.Coord.calcRA(8, 58, 47.3))*180/Math.PI, 0.01);
	assert.close(eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 13, 45, 54.3)*180/Math.PI, 0.01);
	
});

QUnit.test( "astro.moon topocentricPosition", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 2016-Feb-21 00:00 2457439.500000000  m  08 50 59.19 +13 30 52.1 221.5661  49.7236 10 35 41.5918
	// 2016-Feb-21 00:00 2457439.500000000     08 52 08.11 +14 02 40.2   .n.a.     .n.a.
	  
	 
	var jd = A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 21, 0, 0, 0)));
	var jdo = new A.JulianDay(jd);
	
	assert.close(jd, 2457439.500000000, 0.00001);
	
	var moon = A.Moon.geocentricPosition(jdo);
	var nut = A.Nutation.nutation(jdo);

	var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
	var obliquity = obliquity0 + nut.deltaobliquity; // true obliquity
	
	var apparentlng = moon.lng + nut.deltalng; // apparent longitude

	var eq = A.Coord.eclToEq(new A.EclCoord(apparentlng, moon.lat), obliquity);
	
	
	var ae = A.Moon.apparentEquatorial(jdo);
	
	assert.close(eq.ra*180/Math.PI, (A.Coord.calcRA(8, 52, 8.11))*180/Math.PI, 0.01); 
	assert.close(eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 14, 2, 40.2)*180/Math.PI, 0.01);  

	assert.close(ae.eq.ra*180/Math.PI, (A.Coord.calcRA(8, 52, 8.11))*180/Math.PI, 0.01); 
	assert.close(ae.eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 14, 2, 40.2)*180/Math.PI, 0.01);  
	
	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	
	var tp = A.Moon.topocentricPosition(jdo, eclCoord);	
	
	assert.close(tp.hz.az*180/Math.PI + 180.0, 221.5661, 0.1);
	assert.close(tp.hz.alt*180/Math.PI, 49.7236, 0.01); // FIX to better precision
});

QUnit.test( "astro.moon topocentricPosition calsky", function( assert ) { 
	 
	var jd = 2457442.1893519;
	var jdo = new A.JulianDay(jd);
	
	var moon = A.Moon.geocentricPosition(jdo);
	
	var nut = A.Nutation.nutation(jdo);

	var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
	var obliquity = obliquity0 + nut.deltaobliquity; // true obliquity
	
	var apparentlng = moon.lng + nut.deltalng; // apparent longitude

	var eq = A.Coord.eclToEq(new A.EclCoord(apparentlng, moon.lat), obliquity);
	assert.close(eq.ra*180/Math.PI, (A.Coord.calcRA(11, 3, 17.5))*180/Math.PI, 0.01);  
	assert.close(eq.dec*180/Math.PI,  A.Coord.calcAngle(false, 5, 22, 26.0)*180/Math.PI, 0.01); 
	
	
	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);

	var tp = A.Moon.topocentricPosition(jdo, eclCoord);	
	
	assert.close(tp.hz.az*180/Math.PI + 180.0, 66.6786, 0.01);
	assert.close(tp.hz.alt*180/Math.PI, -14.0370, 0.01);
});

QUnit.test( "astro.moon topocentricPosition south west", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 2016-Feb-18 02:51 2457436.618750000 *r  06 17 57.08 +19 11 11.8  22.7975  -0.8156
	// 2016-Feb-18 04:32 2457436.688888889 *t  06 21 17.50 +19 10 57.8 359.7495   0.8171
	// 2016-Feb-18 06:13 2457436.759027778 Cs  06 24 37.73 +19 09 16.7 336.7012  -0.8551
 
	function test(eclCoord, jd, az, alt) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.01);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.01);
	} 
	
	var eclCoord = A.EclCoord.fromWgs84(-70, -120);

	test(eclCoord, 2457436.618750000, 22.7975, -0.8156);
	test(eclCoord, 2457436.688888889, 359.7495, 0.8171);	
	test(eclCoord, 2457436.759027778, 336.7012, -0.8551);
})

QUnit.test( "astro.moon topocentricPosition 1900", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 1900-Feb-18 06:07 2415068.754861111  r  12 27 28.84 -08 46 18.8 114.1762  -0.7586
	// 1900-Feb-18 10:35 2415068.940972222  t  12 34 42.49 -09 36 34.8 178.0022  10.3785
	// 1900-Feb-18 15:00 2415069.125000000 Ns  12 41 50.30 -10 22 07.7 240.9092  -0.8362
	
	function test(eclCoord, jd, az, alt) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.01);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.01);
	} 
	
	var eclCoord = A.EclCoord.fromWgs84(70, -120);

	test(eclCoord, 2415068.754861111, 114.1762, -0.7586);
	test(eclCoord, 2415068.940972222, 178.0022, 10.3785);	
	test(eclCoord, 2415069.125000000, 240.9092, -0.8362);
})

QUnit.test( "astro.moon topocentricPosition AD1", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	//  0001-Feb-18 00:30 1721471.520833333 Ct  02 06 07.23 +16 24 42.4 181.8930  36.4028
	//  0001-Feb-18 11:21 1721471.972916667  s  02 29 59.81 +17 53 09.8 339.8819  -0.8531
	//  0001-Feb-18 14:05 1721472.086805556 Ar  02 37 10.58 +18 16 19.6  17.1903  -0.8036
	
	function test(eclCoord, jd, az, alt) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.1);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.1);
	} 
	
	var eclCoord = A.EclCoord.fromWgs84(70, -120);
	
	test(eclCoord, 1721471.520833333, 181.8930, 36.4028);
	test(eclCoord, 1721471.972916667, 339.8819,  -0.8531);	
	test(eclCoord, 1721472.086805556,  17.1903, -0.8036);
})

QUnit.test( "astro.moon topocentricPosition BC2000", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// b2016-Feb-21 03:59  985130.665972222  s  05 06 29.66 +26 59 07.7 313.3734  -0.8815
	// b2016-Feb-21 11:37  985130.984027778 *r  05 31 31.76 +27 29 11.7  45.8009  -0.8252
	// b2016-Feb-21 20:22  985131.348611111  t  05 52 35.12 +28 20 41.1 180.6815  70.9770
	
	function test(eclCoord, jd, az, alt, ra, dec) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.3);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.1);
		
		var aet = A.Moon.apparentTopocentric(new A.JulianDay(jd), eclCoord);
		assert.close(aet.eq.ra*180/Math.PI, ra*180/Math.PI, 0.1, "exp ra: " + ra*180/Math.PI);  // here seems to be still an error
		assert.close(aet.eq.dec*180/Math.PI, dec*180/Math.PI, 0.1, "exp dec: " + dec*180/Math.PI);  
		
	} 
	
	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	test(eclCoord, 985130.665972222, 313.3734, -0.8815, A.Coord.calcRA(5, 6, 29.66), A.Coord.calcAngle(false, 26, 59, 7.7));
	test(eclCoord, 985130.984027778,  45.8009, -0.8252, A.Coord.calcRA(5, 31, 31.76), A.Coord.calcAngle(false, 27, 29, 11.7));
	test(eclCoord, 985131.348611111, 180.6815, 70.9770, A.Coord.calcRA(5, 52, 35.12), A.Coord.calcAngle(false, 28, 20, 41.1));
})

QUnit.test( "astro.moon topocentricPosition BC2016 calsky", function( assert ) {
	
	function test(latng, jd, az, alt) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.1);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.5);		
	} 
	
	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	test(eclCoord, 985130.6668394, 313.57, -0.6);

})


QUnit.test( "astro.moon topocentricPosition bulk", function( assert ) {
	// Date__(UT)__HR:MN Date_________JDUT     R.A.__(a-apparent)__DEC Azi_(a-appr)_Elev L_Ap_Sid_Time
	// 2016-Feb-21 00:00 2457439.500000000  m  08 50 59.19 +13 30 52.1 221.5661  49.7236 10 35 41.5918
	 
	function test(eclCoord, jd, az, alt) {
		var tp = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
		
		assert.close(tp.hz.az*180/Math.PI + 180.0, az, 0.02);
		assert.close(tp.hz.alt*180/Math.PI, alt, 0.02);
	} 
	
	var eclCoord =  A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	test(eclCoord, 2457439.500000000, 221.5661, 49.7236);
	test(eclCoord, 2457439.541666667, 238.8223, 41.9835);
	test(eclCoord, 2457439.583333333, 252.6139, 32.8569);
	test(eclCoord, 2457439.625000000, 264.3107, 23.0851);
	test(eclCoord, 2457439.666666667, 274.9525, 13.1410);
	test(eclCoord, 2457439.708333333, 285.2977, 3.3736);
	test(eclCoord, 2457439.750000000, 295.9473, -5.8983); 
	test(eclCoord, 2457439.791666667, 307.4194, -14.3254); 
	test(eclCoord, 2457439.833333333, 320.1480, -21.4861);
	test(eclCoord, 2457439.875000000, 334.3771, -26.8790);
	test(eclCoord, 2457439.916666667, 349.9573, -29.9861);
	test(eclCoord, 2457439.958333333, 6.2066, -30.4311);
	test(eclCoord, 2457440.000000000, 22.1167, -28.1569); 
	test(eclCoord, 2457440.041666667, 36.8608, -23.4580);
	test(eclCoord, 2457440.083333333, 50.1279, -16.8325);
	test(eclCoord, 2457440.125000000, 62.0673, -8.8040);
	test(eclCoord, 2457440.166666667, 73.0784, 0.1718);
	test(eclCoord, 2457440.208333333, 83.6692, 9.7147);
	test(eclCoord, 2457440.250000000, 94.4241, 19.4849); 
	test(eclCoord, 2457440.291666667, 106.0514, 29.1238); 
	test(eclCoord, 2457440.333333333, 119.4713, 38.1708);
	test(eclCoord, 2457440.375000000, 135.8404, 45.9416);
	test(eclCoord, 2457440.416666667, 156.1265, 51.4133);
	test(eclCoord, 2457440.458333333, 179.6605, 53.3880);
	test(eclCoord, 2457440.500000000, 203.1360, 51.2726);
});


QUnit.test( "astro.moon parallactic angle", function( assert ) { 
	var eclCoord = A.EclCoord.fromWgs84(47.3667, 8.5655);
	
	var jd = 2457439.5; // A.JulianDay.dateToJD(new Date(Date.UTC(2016, 2-1, 21, 0, 0, 0)));
	var hz = A.Moon.topocentricPosition(new A.JulianDay(jd), eclCoord);	
	
	assert.close(hz.q*180/Math.PI, 27.5, 0.1);  
});



QUnit.test( "astro.moon approxTimes", function( assert ) { 
	 
	function test(jd, eclCoord, rise, transit, set, prec) {
	
		var at = A.Moon.approxTimes(new A.JulianDay(jd), eclCoord);
		
		assert.close(at.rise, rise, prec, at.transitd + " " + A.Coord.secondsToHMSStr(at.rise) + "- exp:" + A.Coord.secondsToHMSStr(rise));
		assert.close(at.transit, transit, prec, at.rised + " " + A.Coord.secondsToHMSStr(at.transit) + "- exp:" + A.Coord.secondsToHMSStr(transit));
		assert.close(at.set, set, prec, at.setd + " " + A.Coord.secondsToHMSStr(at.set) + "- exp:" + A.Coord.secondsToHMSStr(set));
	}
	

	// 2016-Feb-21 05:27 2457439.727083333 Ns  09 01 12.25 +12 44 28.8 290.0207  -0.8804
	// 2016-Feb-21 15:54 2457440.162500000 *r  09 28 06.06 +11 30 28.0  72.0060  -0.7564
	// 2016-Feb-21 22:59 2457440.457638889  t  09 40 16.35 +10 45 26.1 179.2590  53.3886
	
	var timezone = 1;
	test(A.JulianDay.calendarGregorianToJD(2016, 2, 21), A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(15, 54, 0), 
			A.JulianDay.secondsFromHMS(22, 59, 0),
			A.JulianDay.secondsFromHMS(5, 27, 0),
			2700); // not very precise
});



QUnit.test( "astro.moon times", function( assert ) { 
	 
	function test(jd, eclCoord, rise, transit, set, prec) {
		
		var at = A.Moon.times(new A.JulianDay(jd), eclCoord);
		
		assert.close(at.rise, rise, prec, at.transitd + " " + A.Coord.secondsToHMSStr(at.rise) + "- exp:" + A.Coord.secondsToHMSStr(rise));
		assert.close(at.transit, transit, prec, at.rised + " " + A.Coord.secondsToHMSStr(at.transit) + "- exp:" + A.Coord.secondsToHMSStr(transit));
		assert.close(at.set, set, prec, at.setd + " " + A.Coord.secondsToHMSStr(at.set) + "- exp:" + A.Coord.secondsToHMSStr(set));
	}
	
	// 2016-Feb-21 05:27 2457439.727083333 Ns  09 01 12.25 +12 44 28.8 290.0207  -0.8804
	// 2016-Feb-21 15:54 2457440.162500000 *r  09 28 06.06 +11 30 28.0  72.0060  -0.7564
	// 2016-Feb-21 22:59 2457440.457638889  t  09 40 16.35 +10 45 26.1 179.2590  53.3886
	

	var timezone = 1;
	test(A.JulianDay.calendarGregorianToJD(2016, 2, 21), A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(15, 54, 0), 
			A.JulianDay.secondsFromHMS(22, 59, 0),
			A.JulianDay.secondsFromHMS(5, 27, 0),
			5*60);  // the last number 5:22 -> 5:27 is not very precise 
});


QUnit.test( "astro.moon times bc2000", function( assert ) { 
	 
	function test(jd, eclCoord, rise, transit, set, prec) {
	
		var at = A.Moon.times(new A.JulianDay(jd), eclCoord);
		
		assert.close(at.rise, rise, prec, at.transitd + " " + A.Coord.secondsToHMSStr(at.rise) + "- exp:" + A.Coord.secondsToHMSStr(rise));
		assert.close(at.transit, transit, prec, at.rised + " " + A.Coord.secondsToHMSStr(at.transit) + "- exp:" + A.Coord.secondsToHMSStr(transit));
		assert.close(at.set, set, prec, at.setd + " " + A.Coord.secondsToHMSStr(at.set) + "- exp:" + A.Coord.secondsToHMSStr(set));
	}
		
	// b2016-Feb-21 03:59  985130.665972222  s  05 06 29.66 +26 59 07.7 313.3734  -0.8815
	// b2016-Feb-21 11:37  985130.984027778 *r  05 31 31.76 +27 29 11.7  45.8009  -0.8252
	// b2016-Feb-21 20:22  985131.348611111  t  05 52 35.12 +28 20 41.1 180.6815  70.9770
	
	test(985130.5, A.EclCoord.fromWgs84(47.3667, 8.5655), 
			A.JulianDay.secondsFromHMS(11, 37, 0), 
			A.JulianDay.secondsFromHMS(20, 22, 0),
			A.JulianDay.secondsFromHMS(3, 59, 0),
			60*60); 
});





