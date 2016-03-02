// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Chapter 10 <br> 
 * deltaT = TD - UT, deltaT = jde - jd <br> 
 * TD: julian day ephemerides (jde) <br> 
 * UT: julian day (jd) <br> 
 * @module A.DeltaT
 */
A.DeltaT = {
		
	/**
	 * Converts jd to jde
	 * @function jdToJde
	 * @static
	 *
	 * @param {number} jd - julian day
	 * @param {?number} deltaT - Estimate Delta T for the given date
	 * @return {number} julian day ephemerides
	 */
	jdToJde: function (jd, deltaT) {
		if (!deltaT)
			deltaT = A.DeltaT.estimate(jd);
		return jd + deltaT / 86400; 
	},
	
	/**
	 * Converts jde to jd
	 * @function jdeToJd
	 * @static
	 *
	 * @param {number} jde - julian day ephemerides
	 * @param {?number} deltaT - Estimate Delta T for the given date
	 * @return {number} julian day
	 */
	jdeToJd: function (jd, deltaT) {
		if (!deltaT)
			deltaT = A.DeltaT.estimate(jd);
		return jd - deltaT / 86400; 
	},
	
	/**
	 * Calculates the decimal year of a given julian day
	 * @function decimalYear
	 * @static
	 *
	 * @param {number} jd - julian day
	 * @return {number} decimal year
	 */
	decimalYear: function (jd) {
		var cal = A.JulianDay.jdToCalendar(jd);
		return  cal.y + (cal.m - 0.5) / 12;
	},


	/**
	 * Estimate Delta T for the given Calendar. This is based on Espenak and Meeus, "Five Millennium Canon of
	 * Solar Eclipses: -1999 to +3000" (NASA/TP-2006-214141).
	 * see http://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
	 * @function estimate
	 * @static
	 *
	 * @param {number} jd - julian day
	 * @return {number} estimated delta T value (seconds) 
	 */
	estimate: function (jd) {
		var year = A.DeltaT.decimalYear(jd);
		var pow = Math.pow;
		var u, t;
		
		if (year < -500) {
			u = (year - 1820) / 100;
			return -20 + 32 * pow(u, 2);
		} 
		if (year < 500) {
			u = year / 100;
			return  10583.6 - 1014.41 * u + 33.78311 * pow(u, 2) - 5.952053 * pow(u, 3) -
					0.1798452 * pow(u, 4) + 0.022174192 * pow(u, 5) + 0.0090316521 * pow(u, 6);
		} 
		if (year < 1600) {
			u = (year - 1000) / 100;
			return  1574.2 - 556.01 * u + 71.23472 * pow(u, 2) + 0.319781 * pow(u, 3) - 
					0.8503463 * pow(u, 4) - 0.005050998 * pow(u, 5) + 0.0083572073 * pow(u, 6);
		} 
		if (year < 1700) {
			t = year - 1600;
			return  120 - 0.9808 * t - 0.01532 * pow(t, 2) + pow(t, 3) / 7129;
		} 
		if (year < 1800) {
			t = year - 1700;
			return  8.83 + 0.1603 * t - 0.0059285 * pow(t, 2) + 0.00013336 * pow(t, 3) - pow(t, 4) / 1174000;
		} 
		if (year < 1860) {
			t = year - 1800;
			return  13.72 - 0.332447 * t + 0.0068612 * pow(t, 2) + 0.0041116 * pow(t, 3) - 0.00037436 * pow(t, 4) +
					0.0000121272 * pow(t, 5) - 0.0000001699 * pow(t, 6) + 0.000000000875 * pow(t, 7);
		} 
		if (year < 1900) {
			t = year - 1860;
			return  7.62 + 0.5737 * t - 0.251754 * pow(t, 2) + 0.01680668 * pow(t, 3) -
					0.0004473624 * pow(t, 4) + pow(t, 5) / 233174;
		} 
		if (year < 1920) {
			t = year - 1900;
			return  -2.79 + 1.494119 * t - 0.0598939 * pow(t, 2) + 0.0061966 * pow(t, 3) - 0.000197 * pow(t, 4);
		} 
		if (year < 1941) {
			t = year - 1920;
			return  21.20 + 0.84493 * t - 0.076100 * pow(t, 2) + 0.0020936 * pow(t, 3);
		} 
		if (year < 1961) {
			t = year - 1950;
			return  29.07 + 0.407 * t - pow(t, 2) / 233 + pow(t, 3) / 2547;
		} 
		if (year < 1986) {
			t = year - 1975;
			return  45.45 + 1.067 * t - pow(t, 2) / 260 - pow(t, 3) / 718;
		} 
		if (year < 2005) {
			t = year - 2000;
			return  63.86 + 0.3345 * t - 0.060374 * pow(t, 2) + 0.0017275 * pow(t, 3) + 0.000651814 * pow(t, 4) +
					0.00002373599 * pow(t, 5);
		} 
		if (year < 2050) {
			t = year - 2000;
			return  62.92 + 0.32217 * t + 0.005589 * pow(t, 2);
		}  
		if (year < 2150) {
			return  -20 + 32 * pow(((year - 1820) / 100), 2) - 0.5628 * (2150 - year);
		} 

		// default
		u = (year - 1820) / 100;
		return  -20 + 32 * pow(u, 2);
	}
};


