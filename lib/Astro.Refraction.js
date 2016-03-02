// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methodes for calculations of the refraction (see Chapter 16).
 * @module A.Refraction
 */
A.Refraction = {
	/**
	 * Bennett returns refraction for obtaining true altitude. <br>
	 * Results are accurate to .07 arc min from horizon to zenith. <br>
	 * Result is refraction to be subtracted from h0 to obtain the true altitude of the body.  
	 *
	 * @function bennett
	 * @static
	 *
	 * @param {number} h0 - must be a measured apparent altitude of a celestial body in radians.
	 * @return {number} result in radians
	 */
	bennett: function (h0)  {
		if (h0 < 0) // the following formula works for positive altitudes only.
			h0 = 0; // if h = -0.07679 a div/0 would occur.
		   
		// (16.3) p. 106
		var cRad = Math.PI / 180;
		var c1 = cRad / 60;
		var c731 = 7.31 * cRad * cRad;
		var c44 = 4.4 * cRad;
		return c1 / Math.tan(h0 + c731 / (h0 + c44));
	},

	/**
	 * Bennett2 returns refraction for obtaining true altitude. <br>
     * Similar to Bennett, but a correction is applied to give a more accurate result. <br>
	 * Results are accurate to .015 arc min.  Result unit is radians.
	 * 
	 * @function bennett2
	 * @static
	 *
	 * @param {number} h0 - must be a measured apparent altitude of a celestial body in radians.
	 * @return {number} result in radians
	 */
	bennett2: function(h0) {
		var cRad = Math.PI / 180;
		var cMin = 60 / cRad;
		var c06 = 0.06 / cMin;
		var c147 = 14.7 * cMin * cRad;
		var  c13 = 13 * cRad;
		var R = A.Refraction.bennett(h0);
		return R - c06 * Math.sin(c147 * R + c13);
	},
	
	/**
	 * Saemundsson returns refraction for obtaining apparent altitude.
	 * Result is refraction to be added to h to obtain the apparent altitude of the body.
	 * Results are consistent with Bennett to within 4 arc sec.
	 * 
	 * @function saemundsson
	 * @static
	 *
	 * @param {number} h - must be a computed true "airless" altitude of a celestial body in radians.
	 * @return {number} result in radians
	 */
	saemundsson: function(h) {
		// (16.4) p. 106
		var cRad = Math.PI / 180;
		var c102 = 1.02 * cRad / 60;
		var c103 = 10.3 * cRad * cRad;
		var c511 = 5.11 * cRad;
		return c102 / Math.tan(h + c103 / (h + c511));
	}		
};