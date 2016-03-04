// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods for calculations of the sideread (see Chapter 12).
 * @module A.Sidereal
 */
A.Sidereal = {

	/**
	 * Coefficients are those adopted in 1982 by the International Astronomical
	 * Union and are given in (12.2) p. 87.
	 *
	 * @const {Array} iau82
	 * @static
	 */
	iau82: [24110.54841, 8640184.812866, 0.093104, 0.0000062],

	/**
	 * jdToCFrac returns values for use in computing sidereal time at Greenwich. <br>
	 * Cen is centuries from J2000 of the JD at 0h UT of argument jd.  This is
	 * the value to use for evaluating the IAU sidereal time polynomial.
	 * DayFrac is the fraction of jd after 0h UT.  It is used to compute the
	 * final value of sidereal time.
	 * 
	 * @function jdToCFrac
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} fraction
	 */
	jdToCFrac: function (jdo)  {
		var mod = A.Math.modF(jdo.jd + 0.5);
		return [(new A.JulianDay(mod[0] - 0.5)).jdJ2000Century(), mod[1]];
	},

	/**
	 * Mean returns mean sidereal time at Greenwich for a given JD. <br>
	 * Computation is by IAU 1982 coefficients.
	 * 
	 * @function mean
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} seconds of time and is in the range [0,86400)
	 */
	mean: function (jdo) {
		return A.Math.pMod(A.Sidereal._mean(jdo), 86400);
	},

	_mean: function (jdo) {
		var m = A.Sidereal._mean0UT(jdo);
		return m.s + m.f * 1.00273790935*86400;
	},
	
	_meanInRA: function (jdo) {
		var m = A.Sidereal._mean0UT(jdo);
		return (m.s * Math.PI / 43200) + (m.f * 1.00273790935 * 2 * Math.PI);
	},

	/**
	 * Mean0UT returns mean sidereal time at Greenwich at 0h UT on the given JD.
	 * 
	 * @function mean0UT
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} seconds of time and is in the range [0,86400)
	 */
	mean0UT: function (jdo) {
		var m = A.Sidereal._mean0UT(jdo);
		return A.Math.pMod(m.s, 86400);
	},

	_mean0UT: function (jdo) {
		var cf = A.Sidereal.jdToCFrac(jdo);
		// (12.2) p. 87
		return {
			s: A.Math.horner(cf[0], A.Sidereal.iau82),
			f: cf[1]
		};
	},
	
	/**
	 * Apparent returns apparent sidereal time at Greenwich for the given JD in radians.
	 * Apparent is mean plus the nutation in right ascension.
	 * 
	 * @function apparent
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} time in radians in the range [0,2*PI)
	 */
	apparentInRa: function (jdo) {
		var s = A.Sidereal._meanInRA(jdo);               // radians of time
		var n = A.Nutation.nutationInRA(jdo);      // angle (radians) of RA
		return A.Math.pMod(s + n, 2*Math.PI);
	},

	/**
	 * Apparent returns apparent sidereal time at Greenwich for the given JD.
	 * Apparent is mean plus the nutation in right ascension.
	 * 
	 * @function apparent
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} seconds of time and is in the range [0,86400)
	 */
	apparent: function (jdo) {
		var s = A.Sidereal._mean(jdo);                       // seconds of time
		
		var n = A.Nutation.nutationInRA(jdo);      // angle (radians) of RA
		var ns = n * 3600 * 180 / Math.PI / 15; // convert RA to time in seconds
		return A.Math.pMod(s + ns, 86400);
	},
	
	/**
	 * Apparent returns apparent sidereal time at local for the given JD.
	 * Apparent is mean plus the nutation in right ascension.
	 * 
	 * @function apparentLocal
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @param {number} lng - longitude of observer on Earth (geographic longitudes are measured positively westwards!)
	 * @return {number} seconds of time and is in the range [0,86400)
	 */
	apparentLocal: function (jdo, lng) {
		var a = A.Sidereal.apparent(jdo);
		var lngs = lng * 43200 / Math.PI;
		return A.Math.pMod(a - lngs, 86400); 
	},
	
	/**
	 * Apparent0UT returns apparent sidereal time at Greenwich at 0h UT on the given JD.
	 * 
	 * @function apparent0UT
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} seconds of time and is in the range [0,86400)
	 */
	apparent0UT: function (jdo) {
		
		var mod = A.Math.modF(jdo.jd + 0.5);
		var modjde = A.Math.modF(jdo.jde + 0.5);
		
		var cen = (mod[0] - 0.5 - A.J2000) / 36525;
		var s = A.Math.horner(cen, A.Sidereal.iau82) + mod[1]*1.00273790935*86400;
		var n = A.Nutation.nutationInRA(new A.JulianDay(modjde[0]));      // angle (radians) of RA
		var ns = n * 3600 * 180 / Math.PI / 15; // convert RA to time in seconds
		return A.Math.pMod(s + ns, 86400);
	}
};
	