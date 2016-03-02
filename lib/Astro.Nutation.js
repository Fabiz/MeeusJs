// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods for calculations of the nutation (see Chapter 22).
 * @module A.Nutation
 */
A.Nutation = {

	/**
	 * Nutation returns nutation in longitude (deltalng) and nutation in obliquity (deltaobliquity)
	 * for a given JDE (Chapter 22, page 143). <br>
	 * Computation is by 1980 IAU theory, with terms < .0003' neglected. <br>
	 * JDE = UT + deltaT, see package deltat.
	 * 
	 * @function nutation
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	nutation: function (jdo) {	
		var T = jdo.jdeJ2000Century();
		var D = A.Math.horner(T,
			[297.85036, 445267.11148, -0.0019142, 1/189474]) * Math.PI / 180;
		var M = A.Math.horner(T,
			[357.52772, 35999.050340, -0.0001603, -1/300000]) * Math.PI / 180;
		var N = A.Math.horner(T,
			[134.96298, 477198.867398, 0.0086972, 1/5620]) * Math.PI / 180;
		var F = A.Math.horner(T,
			[93.27191, 483202.017538, -0.0036825, 1/327270]) * Math.PI / 180;
		var Omega = A.Math.horner(T,
			[125.04452, -1934.136261, 0.0020708, 1/450000]) * Math.PI / 180;
		
		var deltalng = 0, deltaobliquity = 0;
		
		// sum in reverse order to accumulate smaller terms first
		for (var i = A.Nutation.table22A.length - 1; i >= 0; i--) {
			var row = A.Nutation.table22A[i];
			// 0:d, 1:m, 2:n, 3:f, 4:omega, 5:s0, 6:s1, 7:c0, 8:c1
			
			var arg = row[0]*D + row[1]*M + row[2]*N + row[3]*F + row[4]*Omega;
			var s = Math.sin(arg);
			var c = Math.cos(arg); 
			deltalng += s * (row[5] + row[6]*T);
			deltaobliquity += c * (row[7] + row[8]*T);
		}
		
		return {
			deltalng: deltalng *= 0.0001 / 3600 * (Math.PI / 180),
			deltaobliquity: deltaobliquity *= 0.0001 / 3600 * (Math.PI / 180)
		};
	},
	
	/**
	 * NutationInRA returns "nutation in right ascension" or "equation of the equinoxes."
	 *
	 * @function nutationInRA
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	nutationInRA: function (jdo) {
		var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
		var nut = A.Nutation.nutation(jdo);
		return nut.deltalng * Math.cos(obliquity0+nut.deltaobliquity);
	},

	/**
	 * The true obliquity of the ecliptic is obliquity = obliquity0 + deltaobliquity where 
	 * deltaobliquity is the nutation in obliquity
	 *
	 * @function trueObliquity
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	trueObliquity: function (jdo) {
		var obliquity0 = A.Nutation.meanObliquityLaskar(jdo);
		var nut = A.Nutation.nutation(jdo);
		
		return obliquity0 + nut.deltaobliquity;
	},

	/**
	 * MeanObliquity returns mean obliquity following the IAU 1980 polynomial. <br>
	 * Accuracy is 1" over the range 1000 to 3000 years and 10" over the range 0 to 4000 years.
	 *
	 * @function meanObliquity
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	meanObliquity: function (jdo) {	
		// (22.2) p. 147
		return A.Math.horner(jdo.jdeJ2000Century(),
			[84381.448/3600*(Math.PI/180), // = A.Coord.calcAngle(false,23, 26, 21.448),
			-46.815/3600*(Math.PI/180),
			-0.00059/3600*(Math.PI/180),
			0.001813/3600*(Math.PI/180)]);
	},

	/**
	 * MeanObliquityLaskar returns mean obliquity following the Laskar 1986 polynomial. <br>
	 * Accuracy over the range 1000 to 3000 years is .01". <br>
	 * Accuracy over the valid date range of -8000 to +12000 years is "a few seconds."
	 *
	 * @function meanObliquityLaskar
	 * @static
	 *
	 * @param {A.JulianDay} jdo - julian day
	 * @return {number} result in radians
	 */
	meanObliquityLaskar: function (jdo) {
		// (22.3) p. 147
		return A.Math.horner(jdo.jdeJ2000Century()*0.01,
			[84381.448/3600*(Math.PI/180), // = A.Coord.calcAngle(false,23, 26, 21.448),
			-4680.93/3600*(Math.PI/180),
			-1.55/3600*(Math.PI/180),
			1999.25/3600*(Math.PI/180),
			-51.38/3600*(Math.PI/180),
			-249.67/3600*(Math.PI/180),
			-39.05/3600*(Math.PI/180),
			7.12/3600*(Math.PI/180),
			27.87/3600*(Math.PI/180),
			5.79/3600*(Math.PI/180),
			2.45/3600*(Math.PI/180)]);
	},
	
	/**
	 * 0:d, 1:m, 2:n, 3:f, 4:omega, 5:s0, 6:s1, 7:c0, 8:c1
	 *
	 * @const {Array} table22A
	 * @static
	 */
	table22A: [
		[0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
		[-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
		[0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
		[0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
		[0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
		[0, 0, 1, 0, 0, 712, 0.1, -7, 0],
		[-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
		[0, 0, 0, 2, 1, -386, -0.4, 200, 0],
		[0, 0, 1, 2, 2, -301, 0, 129, -0.1],
		[-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
		[-2, 0, 1, 0, 0, -158, 0, 0, 0],
		[-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
		[0, 0, -1, 2, 2, 123, 0, -53, 0],
		[2, 0, 0, 0, 0, 63, 0, 0, 0],
		[0, 0, 1, 0, 1, 63, 0.1, -33, 0],
		[2, 0, -1, 2, 2, -59, 0, 26, 0],
		[0, 0, -1, 0, 1, -58, -0.1, 32, 0],
		[0, 0, 1, 2, 1, -51, 0, 27, 0],
		[-2, 0, 2, 0, 0, 48, 0, 0, 0],
		[0, 0, -2, 2, 1, 46, 0, -24, 0],
		[2, 0, 0, 2, 2, -38, 0, 16, 0],
		[0, 0, 2, 2, 2, -31, 0, 13, 0],
		[0, 0, 2, 0, 0, 29, 0, 0, 0],
		[-2, 0, 1, 2, 2, 29, 0, -12, 0],
		[0, 0, 0, 2, 0, 26, 0, 0, 0],
		[-2, 0, 0, 2, 0, -22, 0, 0, 0],
		[0, 0, -1, 2, 1, 21, 0, -10, 0],
		[0, 2, 0, 0, 0, 17, -0.1, 0, 0],
		[2, 0, -1, 0, 1, 16, 0, -8, 0],
		[-2, 2, 0, 2, 2, -16, 0.1, 7, 0],
		[0, 1, 0, 0, 1, -15, 0, 9, 0],
		[-2, 0, 1, 0, 1, -13, 0, 7, 0],
		[0, -1, 0, 0, 1, -12, 0, 6, 0],
		[0, 0, 2, -2, 0, 11, 0, 0, 0],
		[2, 0, -1, 2, 1, -10, 0, 5, 0],
		[2, 0, 1, 2, 2, -8, 0, 3, 0],
		[0, 1, 0, 2, 2, 7, 0, -3, 0],
		[-2, 1, 1, 0, 0, -7, 0, 0, 0],
		[0, -1, 0, 2, 2, -7, 0, 3, 0],
		[2, 0, 0, 2, 1, -7, 0, 3, 0],
		[2, 0, 1, 0, 0, 6, 0, 0, 0],
		[-2, 0, 2, 2, 2, 6, 0, -3, 0],
		[-2, 0, 1, 2, 1, 6, 0, -3, 0],
		[2, 0, -2, 0, 1, -6, 0, 3, 0],
		[2, 0, 0, 0, 1, -6, 0, 3, 0],
		[0, -1, 1, 0, 0, 5, 0, 0, 0],
		[-2, -1, 0, 2, 1, -5, 0, 3, 0],
		[-2, 0, 0, 0, 1, -5, 0, 3, 0],
		[0, 0, 2, 2, 1, -5, 0, 3, 0],
		[-2, 0, 2, 0, 1, 4, 0, 0, 0],
		[-2, 1, 0, 2, 1, 4, 0, 0, 0],
		[0, 0, 1, -2, 0, 4, 0, 0, 0],
		[-1, 0, 1, 0, 0, -4, 0, 0, 0],
		[-2, 1, 0, 0, 0, -4, 0, 0, 0],
		[1, 0, 0, 0, 0, -4, 0, 0, 0],
		[0, 0, 1, 2, 0, 3, 0, 0, 0],
		[0, 0, -2, 2, 2, -3, 0, 0, 0],
		[-1, -1, 1, 0, 0, -3, 0, 0, 0],
		[0, 1, 1, 0, 0, -3, 0, 0, 0],
		[0, -1, 1, 2, 2, -3, 0, 0, 0],
		[2, -1, -1, 2, 2, -3, 0, 0, 0],
		[0, 0, 3, 2, 2, -3, 0, 0, 0],
		[2, -1, 0, 2, 2, -3, 0, 0, 0]
	]
};



