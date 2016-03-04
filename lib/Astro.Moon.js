// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods for calculations of the position and times of the moon.
 * @module A.Moon
 */
A.Moon = {
		
	/**
	 * parallax returns equatorial horizontal parallax pi of the Moon.
	 * 
	 * @function parallax
	 * @static
	 *
	 * @param {number} delta - is distance between centers of the Earth and Moon, in km.
	 * @return {number} result in radians
	 */
	parallax: function(delta) {
		// p. 337
		return Math.asin(6378.14 / delta);
	},

	/**
	 * apparentEquatorial returns the apparent position of the moon as equatorial coordinates.
	 * 
	 * @function apparentEquatorial
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {Map} eq: the apparent position of the moon as equatorial coordinates <br>
	 *               delta: Distance between centers of the Earth and Moon, in km. 
	 */
	apparentEquatorial: function (jdo) {
		var moon = A.Moon.geocentricPosition(jdo);
		
		var nut = A.Nutation.nutation(jdo);
		var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
	
		var obliquity = obliquity0 + nut.deltaobliquity; // true obliquity
		var apparentlng = moon.lng + nut.deltalng; // apparent longitude
		
		var eq = A.Coord.eclToEq(new A.EclCoord(apparentlng, moon.lat), obliquity);
		
		return {
			eq: eq,
			delta: moon.delta
		};
	},

	/**
	 * apparentTopocentric returns the apparent position of the moon as topocentric coordinates.
	 * 
	 * @function apparentTopocentric
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of observer
	 * @param {?Number} apparent0 - apparent sidereal time at Greenwich for the given JD in radians.
	 * @return {Map} eq: the corrected apparent position of the moon as equatorial coordinates <br> 
	 *               delta: Distance between centers of the Earth and Moon, in km. 
	 */
	apparentTopocentric: function (jdo, eclCoord, apparent0) {
		var ae = A.Moon.apparentEquatorial(jdo);
		
		// get the corrected right ascension and declination
		var pc = A.Globe.parallaxConstants(eclCoord.lat, eclCoord.h);
		var parallax = A.Moon.parallax(ae.delta);
		
		if (!apparent0) // if apparent0 is not provided do the calcuation now
			apparent0 = A.Sidereal.apparentInRa(jdo);
		
		var tc = A.Parallax.topocentric(ae.eq, parallax, pc.rhoslat, pc.rhoclat, eclCoord.lng, apparent0);
		return {
			eq: tc,
			delta: ae.delta
		};
	},
	
	/**
	 * topocentricPosition calculates topocentric position of the moon for a given viewpoint and a given julian day.
	 * 
	 * @function topocentricPosition
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of the observer
	 * @param {boolean} refraction - if true the atmospheric refraction is added to the altitude 
	 * @return {Map} hz: position of the Moon as horizontal coordinates with azimuth and altitude.<br>
	 *               eq: position of the Moon as equatorial coordinates<br>
	 *               delta: Distance between centers of the Earth and Moon, in km.<br>
	 *               q: parallactic angle in radians 
	 */
	topocentricPosition: function (jdo, eclCoord, refraction) {	
		var st0 = A.Sidereal.apparentInRa(jdo);
		var aet = A.Moon.apparentTopocentric(jdo, eclCoord, st0);
		
		var hz = A.Coord.eqToHz(aet.eq, eclCoord, st0);
	
		if (refraction === true)
			hz.alt += A.Refraction.bennett2(hz.alt);
		
		var H = st0 - (eclCoord.lng + aet.eq.ra);
        var q = A.Moon.parallacticAngle(eclCoord.lat, H, aet.eq.dec);
		return {
			hz: hz,
			eq: aet.eq,
			delta: aet.delta,
			q: q
		};
	},
	
	/**
	 * approxTransit times computes UT transit time for the lunar object on a day of interest.
	 * 
	 * @function approxTransit
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of the observer
	 * @return {NumberMap} transit value in seconds. If value is negative transit was the day before.
	 */
	approxTransit: function (jdo, eclCoord) {
		var jdo0 = jdo.startOfDay(); // make sure jd is at midnight (ends with .5)
 	
		return A.Rise.approxTransit(eclCoord,  
			A.Sidereal.apparent0UT(jdo0), 
			A.Moon.apparentTopocentric(jdo0, eclCoord).eq);
	},

	/**
	 * approxTimes computes UT rise, transit and set times for the lunar object on a day of interest. <br>
	 * The function argurments do not actually include the day, but do include
	 * values computed from the day.
	 * 
	 * @function approxTimes
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of the observer
	 * @return {Map} transit, rise, set in seconds and in in the range [0,86400)
	 */
	approxTimes: function (jdo, eclCoord) {
		jdo = jdo.startOfDay(); // make sure jd is at midnight (ends with .5)
		var aet = A.Moon.apparentTopocentric(jdo, eclCoord);
		
		var parallax = A.Moon.parallax(aet.delta);
		
		var h0 = A.Rise.stdh0Lunar(parallax); 
		var Th0 = A.Sidereal.apparent0UT(jdo);
		  	
		return A.Rise.approxTimes(eclCoord, h0, Th0, aet.eq);
	},
	
	/**
	 * times computes UT rise, transit and set times for the lunar object on a day of interest.
	 * This method has a higher accuarcy than approxTimes but needs more cpu power.	<br>
	 * The function argurments do not actually include the day, but do include
	 * values computed from the day.
	 *
	 * @function times
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of the observer
	 * @return {Map} transit, rise, set in seconds and in in the range [0,86400)
	 */
	times: function (jdo, eclCoord) {
		jdo = jdo.startOfDay(); // make sure jd is at midnight (ends with .5)
		var aet1 = A.Moon.apparentTopocentric(new A.JulianDay(jdo.jd-1, jdo.deltaT), eclCoord);
		var aet2 = A.Moon.apparentTopocentric(jdo, eclCoord);
		var aet3 = A.Moon.apparentTopocentric(new A.JulianDay(jdo.jd+1, jdo.deltaT), eclCoord);
		
		var parallax = A.Moon.parallax(aet2.delta);
		var h0 = A.Rise.stdh0Lunar(parallax); 
	
		var Th0 = A.Sidereal.apparent0UT(jdo);
		
		return A.Rise.times(eclCoord, jdo.deltaT, h0, Th0, [aet1.eq, aet2.eq, aet3.eq]);
	},
	
	/**
	 * parallacticAngle q calculates the parallactic angle of the moon formula 14.1
	 * 
	 * @function parallacticAngle
	 * @static
	 *
	 * @param {number} lat - atitude of observer on Earth
	 * @param {number} H - is hour angle of observed object. st0 - ra
	 * @param {number} dec - declination of observed object.
	 * @return {number} q, result in radians
	 */
	parallacticAngle: function (lat, H, dec) {
		return Math.atan2(Math.sin(H), Math.tan(lat) * Math.cos(dec) - Math.sin(dec) * Math.cos(H));
	},

	/**
	 * geocentricPosition returns geocentric location of the Moon. <br>
	 * Results are referenced to mean equinox of date and do not include the effect of nutation.
	 * 
	 * @function geocentricPosition
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	geocentricPosition: function (jdo) {
		var p = Math.PI / 180;

		var T = jdo.jdeJ2000Century();
		var L_ = A.Math.pMod(A.Math.horner(T, [218.3164477*p, 481267.88123421*p,
			-0.0015786*p, p/538841, -p/65194000]), 2*Math.PI);
		
		var D = A.Math.pMod(A.Math.horner(T, [297.8501921*p, 445267.1114034*p,
			-0.0018819*p, p/545868, -p/113065000]), 2*Math.PI);
		var M = A.Math.pMod(A.Math.horner(T, [357.5291092*p, 35999.0502909*p,
			-0.0001535*p, p/24490000]), 2*Math.PI);
		var M_ = A.Math.pMod(A.Math.horner(T, [134.9633964*p, 477198.8675055*p,
			0.0087414*p, p/69699, -p/14712000]), 2*Math.PI);
		var F = A.Math.pMod(A.Math.horner(T, [93.272095*p, 483202.0175233*p,
			-0.0036539*p, -p/3526000, p/863310000]), 2*Math.PI);

		var A1 = 119.75*p + 131.849*p*T;
		var A2 = 53.09*p + 479264.29*p*T;
		var A3 = 313.45*p + 481266.484*p*T;
		var E = A.Math.horner(T, [1, -0.002516, -0.0000074]);
		var E2 = E * E;
		var suml = 3958*Math.sin(A1) + 1962*Math.sin(L_-F) + 318*Math.sin(A2);
		var sumr = 0;
		var sumb = -2235*Math.sin(L_) + 382*Math.sin(A3) + 175*Math.sin(A1-F) +
			175*Math.sin(A1+F) + 127*Math.sin(L_-M_) - 115*Math.sin(L_+M_);

		var i, r;
		for (i = 0; i < A.Moon.ta.length; i++) {
			// 0:D, 1:M, 2:M_, 3:F, 4:suml, 5:sumr
			r = A.Moon.ta[i];
			
			var a = D*r[0] + M*r[1] + M_*r[2] + F*r[3];
			var sa = Math.sin(a);
			var ca = Math.cos(a);
			switch (r[1]) { // M
				case 0:
					suml += r[4] * sa;
					sumr += r[5] * ca;
					break;
				case  1:
				case -1:
					suml += r[4] * sa * E;
					sumr += r[5] * ca * E;
					break;
				case  2: 
				case -2:
					suml += r[4] * sa * E2;
					sumr += r[5] * ca * E2;
					break;
				default: 
					throw "error";
			}		
		}
		
		
		for (i = 0; i < A.Moon.tb.length; i++) {
			// 0:D, 1:M, 2:M_, 3:F, 4:sumb	
			r = A.Moon.tb[i];
			
			var b = D*r[0] + M*r[1] + M_*r[2] + F*r[3];
			var sb = Math.sin(b);
			
			switch (r[1]) { // M
				case 0:
					sumb += r[4] * sb;
					break;
				case  1:
				case -1:
					sumb += r[4] * sb * E;
					break;
				case  2:
				case -2:
					sumb += r[4] * sb * E2;
					break;
				default: 
					throw "error";
			}
		}

		return {
			lng: A.Math.pMod(L_, 2*Math.PI) + suml*1e-6*p,
			lat: sumb * 1e-6 * p,
			delta: 385000.56 + sumr*1e-3
		};
	},
	
	
	/**
	 * 0:D, 1:M, 2:Mʹ, 3:F, 4:suml, 5:sumr
	 *
	 * @const {Array} ta
	 * @static
	 */
	ta: [
		[0, 0, 1, 0, 6288774, -20905355],
		[2, 0, -1, 0, 1274027, -3699111],
		[2, 0, 0, 0, 658314, -2955968],
		[0, 0, 2, 0, 213618, -569925],

		[0, 1, 0, 0, -185116, 48888],
		[0, 0, 0, 2, -114332, -3149],
		[2, 0, -2, 0, 58793, 246158],
		[2, -1, -1, 0, 57066, -152138],

		[2, 0, 1, 0, 53322, -170733],
		[2, -1, 0, 0, 45758, -204586],
		[0, 1, -1, 0, -40923, -129620],
		[1, 0, 0, 0, -34720, 108743],

		[0, 1, 1, 0, -30383, 104755],
		[2, 0, 0, -2, 15327, 10321],
		[0, 0, 1, 2, -12528, 0],
		[0, 0, 1, -2, 10980, 79661],

		[4, 0, -1, 0, 10675, -34782],
		[0, 0, 3, 0, 10034, -23210],
		[4, 0, -2, 0, 8548, -21636],
		[2, 1, -1, 0, -7888, 24208],

		[2, 1, 0, 0, -6766, 30824],
		[1, 0, -1, 0, -5163, -8379],
		[1, 1, 0, 0, 4987, -16675],
		[2, -1, 1, 0, 4036, -12831],

		[2, 0, 2, 0, 3994, -10445],
		[4, 0, 0, 0, 3861, -11650],
		[2, 0, -3, 0, 3665, 14403],
		[0, 1, -2, 0, -2689, -7003],

		[2, 0, -1, 2, -2602, 0],
		[2, -1, -2, 0, 2390, 10056],
		[1, 0, 1, 0, -2348, 6322],
		[2, -2, 0, 0, 2236, -9884],

		[0, 1, 2, 0, -2120, 5751],
		[0, 2, 0, 0, -2069, 0],
		[2, -2, -1, 0, 2048, -4950],
		[2, 0, 1, -2, -1773, 4130],

		[2, 0, 0, 2, -1595, 0],
		[4, -1, -1, 0, 1215, -3958],
		[0, 0, 2, 2, -1110, 0],
		[3, 0, -1, 0, -892, 3258],

		[2, 1, 1, 0, -810, 2616],
		[4, -1, -2, 0, 759, -1897],
		[0, 2, -1, 0, -713, -2117],
		[2, 2, -1, 0, -700, 2354],

		[2, 1, -2, 0, 691, 0],
		[2, -1, 0, -2, 596, 0],
		[4, 0, 1, 0, 549, -1423],
		[0, 0, 4, 0, 537, -1117],

		[4, -1, 0, 0, 520, -1571],
		[1, 0, -2, 0, -487, -1739],
		[2, 1, 0, -2, -399, 0],
		[0, 0, 2, -2, -381, -4421],

		[1, 1, 1, 0, 351, 0],
		[3, 0, -2, 0, -340, 0],
		[4, 0, -3, 0, 330, 0],
		[2, -1, 2, 0, 327, 0],

		[0, 2, 1, 0, -323, 1165],
		[1, 1, -1, 0, 299, 0],
		[2, 0, 3, 0, 294, 0],
		[2, 0, -1, -2, 0, 8752]
	],

	// 0:D, 1:M, 2:Mʹ, 3:F, 4:sumb	
	tb: [
		[0, 0, 0, 1, 5128122],
		[0, 0, 1, 1, 280602],
		[0, 0, 1, -1, 277693],
		[2, 0, 0, -1, 173237],

		[2, 0, -1, 1, 55413],
		[2, 0, -1, -1, 46271],
		[2, 0, 0, 1, 32573],
		[0, 0, 2, 1, 17198],

		[2, 0, 1, -1, 9266],
		[0, 0, 2, -1, 8822],
		[2, -1, 0, -1, 8216],
		[2, 0, -2, -1, 4324],

		[2, 0, 1, 1, 4200],
		[2, 1, 0, -1, -3359],
		[2, -1, -1, 1, 2463],
		[2, -1, 0, 1, 2211],

		[2, -1, -1, -1, 2065],
		[0, 1, -1, -1, -1870],
		[4, 0, -1, -1, 1828],
		[0, 1, 0, 1, -1794],

		[0, 0, 0, 3, -1749],
		[0, 1, -1, 1, -1565],
		[1, 0, 0, 1, -1491],
		[0, 1, 1, 1, -1475],

		[0, 1, 1, -1, -1410],
		[0, 1, 0, -1, -1344],
		[1, 0, 0, -1, -1335],
		[0, 0, 3, 1, 1107],

		[4, 0, 0, -1, 1021],
		[4, 0, -1, 1, 833],

		[0, 0, 1, -3, 777],
		[4, 0, -2, 1, 671],
		[2, 0, 0, -3, 607],
		[2, 0, 2, -1, 596],

		[2, -1, 1, -1, 491],
		[2, 0, -2, 1, -451],
		[0, 0, 3, -1, 439],
		[2, 0, 2, 1, 422],

		[2, 0, -3, -1, 421],
		[2, 1, -1, 1, -366],
		[2, 1, 0, 1, -351],
		[4, 0, 0, 1, 331],

		[2, -1, 1, 1, 315],
		[2, -2, 0, -1, 302],
		[0, 0, 1, 3, -283],
		[2, 1, 1, -1, -229],

		[1, 1, 0, -1, 223],
		[1, 1, 0, 1, 223],
		[0, 1, -2, -1, -220],
		[2, 1, -1, -1, -220],

		[1, 0, 1, 1, -185],
		[2, -1, -2, -1, 181],
		[0, 1, 2, 1, -177],
		[4, 0, -2, -1, 176],

		[4, -1, -1, -1, 166],
		[1, 0, 1, -1, -164],
		[4, 0, 1, -1, 132],
		[1, 0, -1, -1, -119],

		[4, -1, 0, -1, 115],
		[2, -2, 0, 1, 107]
	]	
};