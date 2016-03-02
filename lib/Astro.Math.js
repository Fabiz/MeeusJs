// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Methods for mathematic calculations
 * @module A.Math
 */
A.Math = {

	/**
	 * pMod returns a positive floating-point x mod y.<br>
	 * For a positive argument y, it returns a value in the range [0,y).<br>
	 * The result may not be useful if y is negative.
	 *
	 * @function pMod
	 * @static
	 *
	 * @param {number} x - the dividend 
	 * @param {number} y - the divisor
	 * @return {number} a positive modulo value
	 */
	pMod: function (x, y) {
		var r = x % y;
		if (r < 0) {
			r += y;
		}
		return r;
	},
	
	/**
	 * Modf returns integer and fractional floating-point numbers
	 * that sum to f.  Both values have the same sign as f.
	 *
	 * @function modF
	 * @static
	 *
	 * @param {number} v - number
	 * @return {Array} integer and the fractional floating-point
	 */
	modF: function (v) {
		if (v < 0) { 
			v = -v;
			return [-Math.floor(v), -(v % 1)];
		}
		else
			return [Math.floor(v), v % 1];
	},
	
	/**
	 * Horner evaluates a polynomal with coefficients c at x. The constant
	 * term is c[0]. The function panics with an empty coefficient list.
	 *
	 * @function horner
	 * @static
	 *
	 * @param {number} x - number
	 * @param {Array} c - list of coefficients
	 * @return {number} the result of the polynomal
	 */ 
	horner: function (x, c) {
		var i = c.length - 1;
		if (i <= 0)
			throw "empty array not supported";
		
		var y = c[i];
		while (i > 0) {
			i--;
			y = y*x + c[i];
		}
		return y;
	},
	
	/**
	 * Rounds the number to the given number of digits.
	 *
	 * @function formatNum
	 * @static
	 *
	 * @param {number} num - number
	 * @param {?number} digits - number of digits
	 * @return {number} the rounded number
	 */ 
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits | 4);
		return Math.round(num * pow) / pow;
	}
};