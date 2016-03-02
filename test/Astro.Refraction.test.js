// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.refraction bennett", function( assert ) {
	
	var h0 = .5 * Math.PI / 180;
	var R = A.Refraction.bennett(h0);
	
	const cMin = 60 * 180 / Math.PI;
	
	assert.close(R*cMin, 28.7537, 0.001);
	
	var hLower = h0 - R;
	var hUpper = hLower + 32*Math.PI/(180*60);
	
	var Rh = A.Refraction.saemundsson(hUpper);
	assert.close(Rh*cMin, 24.618, 0.001);
});