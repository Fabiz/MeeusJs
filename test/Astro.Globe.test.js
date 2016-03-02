// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


QUnit.test( "astro.globe parallaxConstants", function( assert ) {
	var lat = A.Coord.calcAngle(false, 33, 21, 22); // latitude
	
	var pc = A.Globe.parallaxConstants(lat, 1706);
	
	assert.close(pc.rhoslat, 0.546861, 0.000001);
	assert.close(pc.rhoclat, 0.836339, 0.000001);
});


