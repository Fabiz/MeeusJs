// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Methods for calculations of the equinixes and solistice of the sun accroding to chapter 27.
 * Accuracy is within one minute of time for the years 1951-2050.
 * Results are valid for the years -1000 to +3000. But also quite good for before -1000
 * @module A.Solistice
 */
A.Solistice = {
	
	/**
	 * March returns the JDE of the March equinox for the given year.
	 *
	 * @function march
	 * @static
	 *
	 * @param {number} y - year
	 * @return {number} julian day ephemeris
	 */
	march: function(y) {
		if (y < 1000) {
			return A.Solistice._eq(y, A.Solistice.mc0);
		}
		return A.Solistice._eq(y-2000, A.Solistice.mc2);
	},

	/**
	 * june returns the JDE of the March equinox for the given year.
	 *
	 * @function june
	 * @static
	 *
	 * @param {number} y - year
	 * @return {number} julian day ephemeris
	 */
	june: function(y) {
		if (y < 1000) {
			return A.Solistice._eq(y, A.Solistice.jc0);
		}
		return A.Solistice._eq(y-2000, A.Solistice.jc2);
	},

	/**
	 * september returns the JDE of the March equinox for the given year.
	 *
	 * @function september
	 * @static
	 *
	 * @param {number} y - year
	 * @return {number} julian day ephemeris
	 */
	september: function(y) {
		if (y < 1000) {
			return A.Solistice._eq(y, A.Solistice.sc0);
		}
		return A.Solistice._eq(y-2000, A.Solistice.sc2);
	},

	/**
	 * december returns the JDE of the March equinox for the given year.
	 *
	 * @function december
	 * @static
	 *
	 * @param {number} y - year
	 * @return {number} julian day ephemeris
	 */
	december: function(y) {
		if (y < 1000) {
			return A.Solistice._eq(y, A.Solistice.dc0);
		}
		return A.Solistice._eq(y-2000, A.Solistice.dc2);
	},

	_eq: function(y, c) {
		var J0 = A.Math.horner(y*0.001, c);
		
		var T = (J0 - A.J2000) / A.JulianCentury; // calc J2000 century;
		
		var W = 35999.373 * Math.PI/180 * T - 2.47 * Math.PI/180;
		var deltatheta = 1 + 0.0334*Math.cos(W) + 0.0007*Math.cos(2*W);
		var S = 0;
		for (var i = this.terms.length - 1; i >= 0; i--) {
			var t = this.terms[i];
			S += t[0] * Math.cos((t[1]+t[2]*T)*Math.PI/180);
		}
		return J0 + 0.00001*S/deltatheta;
	},
	
	mc0: [1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071],
	jc0: [1721233.25401, 365241.72562, -0.05232, 0.00907, 0.00025],
	sc0: [1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074],
	dc0: [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006],

	mc2: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
	jc2: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
	sc2: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
	dc2: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
	
	/**
	 * 0:a, 1:b, 2:c
	 *
	 * @const {Array} terms
	 * @static
	 */
	terms: [
		[485, 324.96, 1934.136],
		[203, 337.23, 32964.467],
		[199, 342.08, 20.186],
		[182, 27.85, 445267.112],
		[156, 73.14, 45036.886],
		[136, 171.52, 22518.443],
		[77, 222.54, 65928.934],
		[74, 296.72, 3034.906],
		[70, 243.58, 9037.513],
		[58, 119.81, 33718.147],
		[52, 297.17, 150.678],
		[50, 21.02, 2281.226],

		[45, 247.54, 29929.562],
		[44, 325.15, 31555.956],
		[29, 60.93, 4443.417],
		[18, 155.12, 67555.328],
		[17, 288.79, 4562.452],
		[16, 198.04, 62894.029],
		[14, 199.76, 31436.921],
		[12, 95.39, 14577.848],
		[12, 287.11, 31931.756],
		[12, 320.81, 34777.259],
		[9, 227.73, 1222.114],
		[8, 15.45, 16859.074]
	]
};



