// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Methods for calculations of the position and times of the sun.
 * @module A.Solar
 */
A.Solar = {
	
	/**
	 * Distance of earth-sun in km.
	 *
	 * @const {Number} earthsunDelta
	 * @static
	 */
	earthsunDelta: 149597870,
	
	/**
	 * apparentEquatorial returns the apparent position of the Sun as equatorial coordinates.
	 * 
	 * @function apparentEquatorial
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {A.EqCoord} the apparent position of the Sun as equatorial coordinates
	 */
	apparentEquatorial: function (jdo) {
		var T = jdo.jdJ2000Century();
		
		var Omega = A.Solar.node(T);
		var lng = A.Solar.apparentLongitude(T, Omega);
		
		// (25.8) p. 165
		var obliquity = A.Nutation.meanObliquityLaskar(jdo) + 0.00256 * Math.PI / 180 * Math.cos(Omega);
		
		var slng = Math.sin(lng);
		var clng = Math.cos(lng);
		var sobliquity = Math.sin(obliquity);
		var cobliquity = Math.cos(obliquity);
		
		return new A.EqCoord(
			Math.atan2(cobliquity*slng, clng),
			Math.asin(sobliquity * slng)
		);
	},
	
	/**
	 * apparentTopocentric returns the apparent position of the Sun as topocentric coordinates.
	 * 
	 * @function apparentTopocentric
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of observer
	 * @param {?Number} apparent0 - apparent sidereal time at Greenwich for the given JD in radians.
	 * @return {A.EqCoord} apparent position of the Sun as topocentric coordinates in ra and dec.
	 */
	apparentTopocentric: function (jdo, eclCoord, apparent0) {
		var ae = A.Solar.apparentEquatorial(jdo);
		
		// get the corrected right ascension and declination
		var pc = A.Globe.parallaxConstants(eclCoord.lat, eclCoord.h);
		
		if (!apparent0) // if apparent0 is not provided do the calcuation now
			apparent0 = A.Sidereal.apparentInRa(jdo);
		
		return A.Parallax.topocentric2(ae, A.Parallax.earthsunParallax, pc.rhoslat, pc.rhoclat, eclCoord.lng, apparent0);
	},
	
	/**
	 * topocentricPosition calculates topocentric position of the sun for a given viewpoint and a given julian day.
	 * 
	 * @function topocentricPosition
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {A.EclCoord} eclCoord - geographic location of the observer
	 * @param {boolean} refraction - if true the atmospheric refraction is added to the altitude 
	 * @return {Map} hz: position of the Sun as horizontal coordinates with azimuth and altitude.<br>
	 *               eq: position of the Sun as equatorial coordinates<br>
	 */
	topocentricPosition: function (jdo, eclCoord, refraction) {	
		var st0 = A.Sidereal.apparentInRa(jdo);
		var aet = A.Solar.apparentTopocentric(jdo, eclCoord, st0);
		
		var hz = A.Coord.eqToHz(aet, eclCoord, st0);
		if (refraction === true)
			hz.alt += A.Refraction.bennett2(hz.alt);
		
		return {
			hz: hz,
			eq: aet
		};
	},

	/**
	 * approxTransit times computes UT transit time for the solar object on a day of interest.
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
					A.Solar.apparentTopocentric(jdo0, eclCoord));
	},
	
	/**
	 * approxTimes times computes UT rise, transit and set times for the solar object on a day of interest. <br>
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
		var jdo0 = jdo.startOfDay(); // make sure jd is at midnight (ends with .5)
		var aet = A.Solar.apparentTopocentric(jdo0, eclCoord);
		
		var h0 = A.Rise.stdh0Solar; 
		var Th0 = A.Sidereal.apparent0UT(jdo0);
		  	
		return A.Rise.approxTimes(eclCoord, h0, Th0, aet);
	},
	
	/**
	 * times computes UT rise, transit and set times for the solar object on a day of interest.
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
		var jdo0 = jdo.startOfDay(); // make sure jd is at midnight (ends with .5)
		var aet1 = A.Solar.apparentTopocentric(new A.JulianDay(jdo0.jd-1, jdo0.deltaT), eclCoord);
		var aet2 = A.Solar.apparentTopocentric(jdo0, eclCoord);
		var aet3 = A.Solar.apparentTopocentric(new A.JulianDay(jdo0.jd+1, jdo0.deltaT), eclCoord);
			
		var h0 = A.Rise.stdh0Solar; // stdh0Stellar
		var Th0 = A.Sidereal.apparent0UT(jdo0);
		
		return A.Rise.times(eclCoord, jdo0.deltaT, h0, Th0, [aet1, aet2, aet3]);
	},
	
	/**
	 * meanAnomaly returns the mean anomaly of Earth at the given T.
	 * 
	 * @function meanAnomaly
	 * @static
	 *
	 * @param {number} T - is the number of Julian centuries since J2000. See base.J2000Century.
	 * @return {number} is in radians and is not normalized to the range 0..2PI
	 */
	meanAnomaly: function (T)  {
		// (25.3) p. 163
		return A.Math.horner(T, [357.52911, 35999.05029, -0.0001537]) * Math.PI / 180;
	},
	
	/**
	 * trueLongitude returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
	 * 
	 * @function trueLongitude
	 * @static
	 *
	 * @param {number} T - is the number of Julian centuries since J2000. See base.J2000Century.
	 * @return {Map} values in radians; s = true geometric longitude, ν = true anomaly
	 */
	trueLongitude: function (T)  {
		// (25.2) p. 163
		var L0 = A.Math.horner(T, [280.46646, 36000.76983, 0.0003032]) *
			Math.PI / 180;
		var M = A.Solar.meanAnomaly(T);
		var C = (A.Math.horner(T, [1.914602, -0.004817, -0.000014])*
				Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
				0.000289 * Math.sin(3 * M)) * Math.PI / 180;

		return {
			s: A.Math.pMod(L0 + C, 2 * Math.PI),
			v: A.Math.pMod(M + C, 2 * Math.PI)
		};
	},
	 
	/**
	 * apparentLongitude returns apparent longitude of the Sun referenced to the true equinox of date.
	 * 
	 * @function apparentLongitude
	 * @static
	 *
	 * @param {number} T - is the number of Julian centuries since J2000. See base.J2000Century.
	 * @return {number} result includes correction for nutation and aberration.  Unit is radians.
	 */
	apparentLongitude: function (T, Omega)  {
		if (!Omega)
			Omega = A.Solar.node(T);
		var t = A.Solar.trueLongitude(T);
		return t.s - 0.00569 * Math.PI / 180 - 0.00478 * Math.PI / 180 * Math.sin(Omega);
	},

	/**
	 * node returns the omega value
	 * 
	 * @function node
	 * @static
	 *
	 * @param {number} T - is the number of Julian centuries since J2000. See base.J2000Century.
	 * @return {number} result in radians
	 */
	node: function(T)  {
		return (125.04 - 1934.136 * T) * Math.PI / 180;
	}
};