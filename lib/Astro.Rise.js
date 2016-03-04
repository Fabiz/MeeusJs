// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Methodes for calculations of the rise, transmit, set (see Chapter 16).
 * @module A.Rise
 */
A.Rise = {

	/**
	 * Mean refraction value
	 *
	 * @const {Number} meanRefraction
	 * @static
	 */
	meanRefraction: 0.5667 * Math.PI / 180, // A.Coord.calcAngle(false, 0, 34, 0),

	// 
	//
	// The standard altitude is the geometric altitude of the center of body
	// at the time of apparent rising or setting.
	
	/**
	 * The standard altitude for stellar objects
	 *
	 * @const {Number} stdh0Stellar
	 * @static
	 */
	stdh0Stellar:   -0.5667 * Math.PI / 180, //A.Coord.calcAngle(true, 0, 34, 0),
	/**
	 * The standard altitude for the solar
	 *
	 * @const {Number} stdh0Solar
	 * @static
	 */
	stdh0Solar:     -0.8333 * Math.PI / 180, // A.Coord.calcAngle(true, 0, 50, 0),
	
	/**
	 * The standard altitude for the moon
	 *
	 * @const {Number} stdh0LunarMean
	 * @static
	 */
	stdh0LunarMean:  0.125 * Math.PI / 180, //A.Coord.calcAngle(false, 0, 0, .125),

	/**
	 * Stdh0Lunar is the standard altitude of the Moon considering parallax, the
	 * Moon's horizontal parallax.
	 * 
	 * @function stdh0Lunar
	 * @static
	 *
	 * @param {number} parallax - the paralax
	 * @return {number} result in radians
	 */
	stdh0Lunar: function(parallax)  {
		return 0.7275 * parallax - A.Rise.meanRefraction;
	},

	/**
	 * Approximate times. 
	 * 
	 * @function circumpolar
	 * @static
	 *
	 * @param {number} name - desc
	 * @return {number} result in radians
	 */
	circumpolar: function(lat, h0, dec) {
		// Meeus works in a crazy mix of units.
		// This function and Times work with seconds of time as much as possible.

		// approximate local hour angle
		var slat = Math.sin(lat);
		var clat = Math.cos(lat);
		var sdec1 = Math.sin(dec);
		var cdec1 = Math.cos(dec);
		var cH0 = (Math.sin(h0) - slat * sdec1) / (clat * cdec1); // (15.1) p. 102
		if (cH0 < -1 || cH0 > 1) {
			// ErrorCircumpolar
			return null;
		}
		return cH0;
	},
	
	/**
	 * approxTransit computes approximate UT transit times for
	 * a celestial object on a day of interest. <br>
	 * The function argurments do not actually include the day, but do include
	 * values computed from the day.
	 * 
	 * @function approxTimes
	 * @static
	 *
	 * @param {A.EclCoord} eclcoord - ecliptic coordinates of observer on Earth
	 * @param {Number} Th0 - is apparent sidereal time at 0h UT at Greenwich
	 * @param {A.EqCoord} eqcoord - right ascension and declination of the body at 0h dynamical time for the day of interest.
	 * @return {NumberMap} transit value in seconds. If value is negative transit was the day before.
	 */
	approxTransit: function(eclcoord, Th0, eqcoord) {
		// approximate transit, rise, set times.
		// (15.2) p. 102.
		return (eqcoord.ra + eclcoord.lng) * 43200 / Math.PI - Th0;
	},
	
	/**
	 * ApproxTimes computes approximate UT rise, transit and set times for
	 * a celestial object on a day of interest. <br>
	 * The function argurments do not actually include the day, but do include
	 * values computed from the day.
	 * 
	 * @function approxTimes
	 * @static
	 *
	 * @param {A.EclCoord} eclcoord - ecliptic coordinates of observer on Earth
	 * @param {Number} h0 - is "standard altitude" of the body
	 * @param {Number} Th0 - is apparent sidereal time at 0h UT at Greenwich
	 * @param {A.EqCoord} eqcoord - right ascension and declination of the body at 0h dynamical time for the day of interest.
	 * @return {Map} transit, rise, set in seconds and in in the range [0,86400)
	 */
	approxTimes: function(eclcoord, h0, Th0, eqcoord) {
		
		var cH0 = A.Rise.circumpolar(eclcoord.lat, h0, eqcoord.dec); // (15.1) p. 102
		if (!cH0) 
			return null;
		
		var H0 = Math.acos(cH0) * 43200 / Math.PI;

		// approximate transit, rise, set times.
		// (15.2) p. 102.
		var mt = (eqcoord.ra + eclcoord.lng) * 43200 / Math.PI - Th0;
		return {
			transit: A.Math.pMod(mt, 86400),
			transitd:Math.floor(mt / 86400),
			
			rise: A.Math.pMod(mt - H0, 86400),
			rised: Math.floor((mt - H0) / 86400),
			set: A.Math.pMod(mt + H0, 86400),
			setd: Math.floor((mt + H0) / 86400)
		};
	},
	
	/**
	 * Times computes UT rise, transit and set times for a celestial object on
	 * a day of interest with a higher precision than approxTimes. <br>
	 * The function argurments do not actually include the day, but do include
	 * values computed from the day.
	 * 
	 * @function times
	 * @static
	 *
	 * @param {A.EclCoord} eclcoord - ecliptic coordinates of observer on Earth
	 * @param {Number} deltaT - is delta T.
	 * @param {Number} h0 - is "standard altitude" of the body
	 * @param {Number} Th0 - is apparent sidereal time at 0h UT at Greenwich
	 * @param {Array} eqcoord3 - array with 3 A.EqCoord of the body at 0h dynamical time for the day of interest.
	 * @return {Map} transit, rise, set in seconds and in in the range [0,86400)
	 */
	times: function(eclcoord, deltaT, h0, Th0, eqcoord3) {
		var at = A.Rise.approxTimes(eclcoord, h0, Th0, eqcoord3[1]);
		
		if (!at) {
			return null;
		}
		
		var d3ra = A.Interp.newLen3(-86400, 86400, [eqcoord3[0].ra, eqcoord3[1].ra, eqcoord3[2].ra]);
		var d3dec = A.Interp.newLen3(-86400, 86400, [eqcoord3[0].dec, eqcoord3[1].dec, eqcoord3[2].dec]);
	
		// adjust mTransit
		{
			var th0 = Th0+at.transit * 360.985647 / 360;
			var ra = A.Interp.interpolateX(d3ra, at.transit + deltaT);
			var H = th0 - (eclcoord.lng+ra) * 43200 / Math.PI; // H in seconds
			at.transit = A.Math.pMod(at.transit - H, 86400);
		}
		
		// adjust mRise, mSet
		var slat = Math.sin(eclcoord.lat);
		var clat = Math.cos(eclcoord.lat);
	
		function adjustRS(m) {
			var th0 = A.Math.pMod(Th0 + m * 360.985647 / 360, 86400);
			var ut = m + deltaT;
			var ra = A.Interp.interpolateX(d3ra, ut);
			var dec = A.Interp.interpolateX(d3dec, ut);
			var H = th0 * Math.PI / 43200 - (eclcoord.lng + ra); // H in rad
			var sdec = Math.sin(dec);
			var cdec = Math.cos(dec);
			
			var h = slat*sdec + clat*cdec*Math.cos(H);
			var deltam = (h-h0)/(cdec*clat*Math.sin(H)); // deltam in radians 
			return A.Math.pMod(m + deltam * 43200 / Math.PI, 86400);
		}
		at.rise = adjustRS(at.rise);
		at.set = adjustRS(at.set);
		return at;
	}
};