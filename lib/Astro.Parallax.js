// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Methods for calculations of the parallax (Chapter 40).
 * @module A.Parallax
 */
A.Parallax = {
	
	/**
	 * Parallax of earth-sun. Delta for earth sun is about 1, result is parallax in radians.
	 *
	 * @const {Number} earthsunParallax
	 * @static
	 */
	earthsunParallax: 8.794 / 60 / 60 * Math.PI / 180, // 
	
	/**
	 * Horizontal returns equatorial horizontal parallax of a body.
	 * 
	 * @function horizontal
	 * @static
	 *
	 * @param {number} delta - is distance in AU
	 * @return {number} result in radians
	 */
	horizontal: function (delta) {
		return 8.794 / 60 / 60 * Math.PI / 180 / delta; // (40.1) p. 279
	},
	

	/**
	 * Topocentric returns topocentric positions including parallax. <br>
	 * Use this function for the moon calculations.
	 * 
	 * @function topocentric
	 * @static
	 *
	 * @param {A.EqCoord} eqcoord - equatorial coordinates with right ascension and declination
	 * @param {number} parallax - the parallax in radians
	 * @param {number} latsphi - parallax constants in radians (see package globe). 
	 * @param {number} latcphi - parallax constants in radians (see package globe).
	 * @param {number} lng - longitude of the observer in radians
	 * @param {number} apparent0 - sidereal apparent in radians
	 * @return {A.EqCoord} corrected observed topocentric ra and dec in radians.
	 */
	topocentric: function (eqcoord, parallax, latsphi, latcphi, lng, apparent0){
		var H = A.Math.pMod(apparent0-lng-eqcoord.ra, 2*Math.PI);
		var sparallax = Math.sin(parallax);
		var sH = Math.sin(H);
		var cH = Math.cos(H);
		var sdec = Math.sin(eqcoord.dec);
		var cdec = Math.cos(eqcoord.dec);
		var deltara = Math.atan2(-latcphi*sparallax*sH, cdec-latcphi*sparallax*cH); // (40.2) p. 279
		return new A.EqCoord(
			eqcoord.ra + deltara,
			Math.atan2((sdec-latsphi*sparallax)*Math.cos(deltara), cdec-latcphi*sparallax*cH) // (40.3) p. 279
		);
	},

	/**
	 * Topocentric2 returns topocentric positions including parallax. <br>
	 * Use this function for the solar calculations.
	 * 
	 * @function topocentric2
	 * @static
	 *
	 * @param {A.EqCoord} eqcoord - equatorial coordinates with right ascension and declination
	 * @param {number} parallax - the parallax in radians
	 * @param {number} latsphi - parallax constants in radians (see package globe). 
	 * @param {number} latcphi - parallax constants in radians (see package globe).
	 * @param {number} lng - longitude of the observer in radians
	 * @param {number} apparent0 - sidereal apparent in radians
	 * @return {A.EqCoord} corrected observed topocentric ra and dec in radians.
	 */
	topocentric2: function (eqcoord, parallax, latsphi, latcphi, lng, apparent0) {
		var H = A.Math.pMod(apparent0-lng-eqcoord.ra, 2*Math.PI);
		var sH = Math.sin(H);
		var cH = Math.cos(H);
		var sdec = Math.sin(eqcoord.dec);
		var cdec = Math.cos(eqcoord.dec);
		return new A.EqCoord(
			eqcoord.ra + -parallax * latcphi * sH / cdec,         // (40.4) p. 280
			eqcoord.dec + -parallax * (latsphi*cdec - latcphi*cH*sdec) // (40.5) p. 280
		);
	}
};