// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods for calculations of the moon illumination.
 * @module A.MoonIllum
 */
A.MoonIllum = {
		
		
	/**
	 * phaseAngleEq computes the phase angle of the Moon given equatorial coordinates.
	 * Angles must be in radians. Distances must be in the same units as each other.
	 *
	 * @function phaseAngleEq
	 * @static
	 * @param {A.EqCoord} eqcoordm - geocentric right ascension and declination of the Moon
	 * @param {number} deltam - distance Earth to the Moon
	 * @param {A.EqCoord} eqcoords - geocentric right ascension and declination of the Sun
	 * @param {number} deltam - distance Earth to the Sun 
	 *
	 * @return {number} i ist the ratio of the illuminated area of the disk to the total area
	 */
	phaseAngleEq: function (eqcoordm, deltam, eqcoords, deltas)  {
		var coselong = A.MoonIllum._coselong(eqcoordm, eqcoords);
		var elong = Math.acos(coselong);
		return Math.atan2(deltas * Math.sin(elong), deltam - deltas*coselong);
	},

	/**
	 * phaseAngleEq computes the phase angle of the Moon given equatorial coordinates.
	 *
	 * Angles must be in radians. Less accurate than PhaseAngleEq.
	 *
	 * @function phaseAngleEq
	 * @static
	 *
	 * @param {A.EqCoord} eqcoordm - geocentric right ascension and declination of the Moon
	 * @param {A.EqCoord} eqcoords - geocentric right ascension and declination of the Sun
	 * @return {number} i ist the ratio of the illuminated area of the disk to the total area
	 */
	phaseAngleEq2: function (eqcoordm, eqcoords) {
		return Math.acos(-A.MoonIllum._coselong(eqcoordm, eqcoords));
	},

	/**
	 * illuminated returns the illuminated fraction of the moon. 
	 * 
	 * @function illuminated
	 * @static
	 *
	 * @param {number} i - phase angle of the moon
	 * @return {number} result k in radians
	 */
	illuminated: function(i) {
		return ((1 + Math.cos(i)) / 2);
	},
	
	/**
	 * positionAngle returns the position angle of the moons bright limb. 
	 * C in Figure on page 345.
	 *
	 * @function positionAngle
	 * @static
	 *
	 * @param {A.EqCoord} eqcoordm - geocentric right ascension and declination of the Moon
	 * @param {A.EqCoord} eqcoords - geocentric right ascension and declination of the Sun
	 * @return {number} position angle chi in radians
	 */
	positionAngle: function (eqcoordm, eqcoords) {
		var sdecm = Math.sin(eqcoordm.dec);
		var cdecm = Math.cos(eqcoordm.dec);
		var sdecs = Math.sin(eqcoords.dec);
		var cdecs = Math.cos(eqcoords.dec);
		return Math.atan2(cdecs*Math.sin(eqcoords.ra-eqcoordm.ra),
				sdecs*cdecm - cdecs*sdecm*Math.cos(eqcoords.ra-eqcoordm.ra));
	},
	
	/**
	 * cos elongation from equatorial coordinates
	 */
	_coselong: function (eqcoordm, eqcoords) {
		var sdecm = Math.sin(eqcoordm.dec);
		var cdecm = Math.cos(eqcoordm.dec);
		var sdecs = Math.sin(eqcoords.dec);
		var cdecs = Math.cos(eqcoords.dec);
		return sdecs*sdecm + cdecs*cdecm*Math.cos(eqcoords.ra-eqcoordm.ra);
	}
};