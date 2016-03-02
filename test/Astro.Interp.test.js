// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.interp InterpolateN", function( assert ) {
	var d3 = A.Interp.newLen3(7, 9, [
		.884226,
		.877366,
		.870531,
		]);
	var n = 4.35 / 24;
	var y = A.Interp.interpolateN(d3, n);
	
	assert.close(y, 0.876125, 0.000001);
});

QUnit.test( "astro.interp InterpolateX", function( assert ) {
	var d3 = A.Interp.newLen3(7, 9, [
		.884226,
		.877366,
		.870531,
		]);
	var x = 8 + A.JulianDay.secondsFromHMS(4, 21, 0)/(24*3600) // 8th day at 4:21
	var y = A.Interp.interpolateX(d3, x);
	

	assert.close(y, 0.876125, 0.000001);
});

