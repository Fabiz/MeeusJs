// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods to simplify interpolations of numbers
 * @module A.Interp
 */
A.Interp = {

	/**
	 * Prepares a Len3 object from a table of three rows of x and y values.<br>
	 * Values must be equally spaced, so only the first and last are supplied.
	 *
	 * @function newLen3
	 * @static
	 *
	 * @param {number} x1 - start value
	 * @param {number} x3 - end value
	 * @param {Array} y - must be a slice of three y values.
	 * @return {Len3} Len3 struct
	 */
	newLen3 : function (x1, x3 , y) {
		if (y.length != 3) {
			throw "Error not 3";
		}
		if (x3 == x1) {
			throw "Error no x range";
		}
		
		var a = y[1] - y[0];
		var b = y[2] - y[1];
		
		return {
			x1: x1,
			x3: x3,
			y: y,
			a: a,
			b: b,
			c: b - a,
			abSum: a + b,
			xSum: x3 + x1,
			xDiff: x3 - x1
		};
	},

	/**
	 * interpolates for a given value x. <br>
	 *
	 * @function interpolateX
	 * @static
	 *
	 * @param {Len3} d - Len3 structure
	 * @param {number} x - value x
	 * @return {number} interpolated value
	 */
	interpolateX : function(d, x) {
		var n = (2 * x - d.xSum) / d.xDiff;
		return A.Interp.interpolateN(d, n);
	},


	/**
	 * interpolates for a given interpolating factor n. <br>
	 * This is interpolation formula (3.3) <br>
     * The interpolation factor n is x-x2 in units of the tabular x interval.
	 * (See Meeus p. 24.)
	 *
	 * @function interpolateN
	 * @static
	 *
	 * @param {Len3} d - Len3 structure
	 * @param {number} n - interpolation factor n
	 * @return {number} interpolated value
	 */
	interpolateN : function(d, n) {
		return d.y[1] + n * 0.5 * (d.abSum + n * d.c);
	}
};

