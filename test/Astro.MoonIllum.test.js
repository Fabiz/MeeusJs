// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.moonillum phaseangle", function( assert ) {
	
	var p = Math.PI / 180;
	var i = A.MoonIllum.phaseAngleEq(new A.EqCoord(134.6885*p, 13.7684*p), 368410, new A.EqCoord(20.6579*p, 8.6964*p), 149971520);
	assert.close(i/p,  69.0756, 0.0001);
	 
});

QUnit.test( "astro.moonillum illumination", function( assert ) {
	
	var p = Math.PI / 180;
	var i = A.MoonIllum.phaseAngleEq2(new A.EqCoord(134.6885*p, 13.7684*p), new A.EqCoord(20.6579*p, 8.6964*p));
	assert.close(i/p,  69.0756, 0.2);
	
	var k = A.MoonIllum.illuminated(i);
	assert.close(k, 0.6775, 0.0001);
	 
});

QUnit.test( "astro.moonillum positionAngle", function( assert ) {
	var p = Math.PI / 180;
	var χ = A.MoonIllum.positionAngle(new A.EqCoord(134.6885*p, 13.7684*p), new A.EqCoord(20.6579*p, 8.6964*p));
	assert.close(A.Math.pMod(χ, Math.PI*2)/p,  285.0, 0.2);
	
});
