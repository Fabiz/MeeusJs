// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Representation of the planent earth
 * @module A.Globe
 */
A.Globe = {
	
	/**
	 * IAU 1976 values. Earth radius in Km.
	 * @const {number} Er
	 */
	Er: 6378.14,
	
	/**
	 * IAU 1976 values. 
	 * @const {number} Fl
	 */
	Fl: 1 / 298.257,
	
	/**
	 * ParallaxConstants computes parallax constants rho sin lat' and rho cos lat'.
	 *
	 * @function parallaxConstants
	 * @static
	 *
	 * @param {number} lat - geographic latitude in radians
	 * @param {number} h - height in meters above the ellipsoid
	 * @return {Array} rhoslat and rhoclat
	 */
	parallaxConstants : function(lat, h) {
		if (!h)
			h = 0;
		var boa = 1 - A.Globe.Fl;
		var su = Math.sin(Math.atan(boa * Math.tan(lat)));
		var cu = Math.cos(Math.atan(boa * Math.tan(lat)));
		var slat = Math.sin(lat);
		var clat = Math.cos(lat);
		
		var hoa = h * 1e-3 / A.Globe.Er;
		
		return {
			rhoslat: su*boa + hoa*slat, 
			rhoclat: cu + hoa*clat
		};
	}
};