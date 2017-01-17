// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Represents a geographical point in ecliptic coordinates with latitude and longitude coordinates
 * and an optional height.
 * @constructor
 * @param {number} lat - The latitude of the location in radians.
 * @param {number} lng - The longitude of the location in radians. Remark: geographic longitudes are measured positively westwards!
 * @param {?number} h - The height above the sea level.
 */
A.EclCoord = function (lat, lng, h) {
	
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid EclCoord object: (' + lat + ', ' + lng + ')');
	}

	this.lat = lat;
	this.lng = lng;

	if (h !== undefined) {
		this.h = h;
	}	
};

A.EclCoord.prototype = {
	/**
	 * Returns a pretty printed string in the WGS84 format.
	 * @return {String} Pretty printed string.
	 */
	toWgs84String: function () { // (Number) -> String
		return A.Math.formatNum(this.lat * 180 / Math.PI) + ', ' + A.Math.formatNum(-this.lng * 180 / Math.PI);
	}
};

/**
 * Create a new EclCoord object from the given wgs coordinates.
 *
 * @param {number} lat - The latitude of the location degrees.
 * @param {number} lng - The longitude of the location degrees.
 * @param {?number} h - The height above the sea level.
 */
A.EclCoord.fromWgs84 = function(wgs84lat, wgs84lng, h) {
	return new A.EclCoord(wgs84lat * Math.PI / 180,  -wgs84lng * Math.PI / 180, h);
};


/**
 * Represents a geographical point in equatorial coordinates with right ascension and declination.
 * @constructor
 * @param {number} ra - The right ascension in radians.
 * @param {number} lng - The declination in radians.
 */
A.EqCoord = function (ra, dec) { // (Number, Number, Number)
	
	if (isNaN(ra) || isNaN(dec)) {
		throw new Error('Invalid EqCoord object: (' + ra + ', ' + dec + ')');
	}

	this.ra = ra;
	this.dec = dec;
};

A.EqCoord.prototype = {
	/**
	 * Returns a pretty printed string in degrees.
	 * @return {String} Pretty printed string.
	 */
	toString: function () { // (Number) -> String
		return "ra:" + A.Math.formatNum(this.ra * 180 / Math.PI) + ', dec:' + A.Math.formatNum(this.dec * 180 / Math.PI);
	}
};

/**
 * Represents a geographical point in horizontal coordinates with azimuth and altitude.
 * @constructor
 * @param {number} az - The azimuth in radians.
 * @param {number} alt - The altitude in radians.
 */
A.HzCoord = function (az, alt) { // (Number, Number, Number)
	
	if (isNaN(az) || isNaN(alt)) {
		throw new Error('Invalid HzCoord object: (' + az + ', ' + alt + ')');
	}

	this.az = az;
	this.alt = alt;
};

A.HzCoord.prototype = {
	/**
	 * Returns a pretty printed string in degrees.
	 * @return {String} Pretty printed string.
	 */
	toString: function () { // (Number) -> String
		return "azi:" + A.Math.formatNum(this.az * 180 / Math.PI) + ', alt:' + A.Math.formatNum(this.alt * 180 / Math.PI);
	}
};

/**
 * A.Coord includes some static functions for coordinate transformations
 * @module A.Coord
 */ 
A.Coord = {

	/**
	 * DMSToDeg converts from parsed sexagesimal angle components to decimal degrees.
	 *
	 * @function dmsToDeg
	 * @static
	 *
	 * @param {boolean} neg - set to true if negative
	 * @param {number} d - degrees
	 * @param {number} m - minutes
	 * @param {number} s - seconds
	 * @return {number} decimal degrees
	 */
	dmsToDeg: function(neg, d, m, s) {
		s = (((d*60+m)*60) + s) / 3600;	
		if (neg) {
			return -s;
		}
		return s;
	},
	
	/**
	 * Returns radian value from an angle.
	 *
	 * @function calcAngle
	 * @static
	 *
	 * @param {boolean} neg - set to true if negative
	 * @param {number} d - degrees
	 * @param {number} m - minutes
	 * @param {number} s - seconds
	 * @return {number} degrees in radians
	 */
	calcAngle: function(neg, d, m, s) {
		return A.Coord.dmsToDeg(neg, d, m, s) * Math.PI / 180;
	},
	
	/**
	 * Returns a radian value from hour, minute, and second components. <br>
	 *
	 * Negative values are not supported, and NewRA wraps values larger than 24
	 * to the range [0,24) hours.
	 *
	 * @function calcRA
	 * @static
	 *
	 * @param {number} h - hours
	 * @param {number} m - minutes
	 * @param {number} s - seconds
	 * @return {number} degrees in radians
	 */
	calcRA: function(h, m, s) {
		var r = A.Coord.dmsToDeg(false, h, m, s) % 24;
		return r * 15 * Math.PI / 180;
	},

	/**
	 * Returns a pretty formatted HMS string from the given seconds
	 *
	 * @function secondsToHMSStr
	 * @static
	 * @param {number} sec - seconds
	 * @return {string} formatted string
	 */
	secondsToHMSStr: function(sec) {
		var days = Math.floor(sec / 86400);
		sec = A.Math.pMod(sec, 86400);
		
		var hours = Math.floor(sec/3600) % 24;
		var minutes = Math.floor(sec/60) % 60;
		var seconds = Math.floor(sec % 60);

		return (days !== 0 ? days + "d " : "") + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds  < 10 ? "0" : "") + seconds;	
	},
	
	/**
	 * Returns a pretty formatted HM string from the given seconds
	 *
	 * @function secondsToHMStr
	 * @static
	 * @param {number} sec - seconds
	 * @return {string} formatted string
	 */
	secondsToHMStr: function(sec) {
		var days = Math.floor(sec / 86400);
		sec = A.Math.pMod(sec, 86400);
		
		var hours = Math.floor(sec/3600) % 24;
		var minutes = Math.floor(sec/60) % 60;
		
		return (days !== 0 ? days + "d " : "") + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;	
	},
	
	/**
	 * EqToEcl converts equatorial coordinates to ecliptic coordinates.
	 * @function eqToEcl
	 * @static
	 *
	 * @param {EqCoord} eqcoord - equatorial coordinates, in radians
	 * @param {number}	epsilon - obliquity of the ecliptic
	 *
	 * @return {EclCoord} ecliptic coordinates of observer on Earth
	 */
	eqToEcl: function(eqcoord, epsilon)  {
		var sra = Math.sin(eqcoord.ra);
		var cra = Math.cos(eqcoord.ra);
		var sdec = Math.sin(eqcoord.dec);
		var cdec = Math.cos(eqcoord.dec);
		var sepsilon = Math.sin(epsilon);
		var cepsilon = Math.cos(epsilon);
	
		return new A.EclCoord(
			Math.atan2(sra * cepsilon + (sdec / cdec) * sepsilon, cra), // (13.1) p. 93
			Math.asin(sdec * cepsilon - cdec * sepsilon * sra)      // (13.2) p. 93
		);
	},
	
	/**
	 * EclToEq converts ecliptic coordinates to equatorial coordinates.
	 * @function eclToEq
	 * @static
	 *
	 * @param {EclCoord} latlng - ecliptic coordinates of observer on Earth
	 * @param {number}	epsilon - obliquity of the ecliptic
	 *
	 * @return {EqCoord} equatorial coordinates, in radians
	 */
	eclToEq: function(eclCoord, epsilon) {
		var slat = Math.sin(eclCoord.lat);
		var clat = Math.cos(eclCoord.lat);
		var slng = Math.sin(eclCoord.lng);
		var clng = Math.cos(eclCoord.lng);
		var sepsilon = Math.sin(epsilon);
		var cepsilon = Math.cos(epsilon);
		var ra = Math.atan2(slat * cepsilon - (slng / clng) * sepsilon, clat); // (13.3) p. 93
		if (ra < 0) {
			ra += 2 * Math.PI;
		}
		
		return new A.EqCoord(
			ra,
			Math.asin(slng * cepsilon + clng * sepsilon * slat) // (13.4) p. 93
		);
	},
	
	/**
	 * EqToHz computes Horizontal coordinates from equatorial coordinates. <br>
	 * Sidereal time must be consistent with the equatorial coordinates.
	 * If coordinates are apparent, sidereal time must be apparent as well.
	 *	 
	 * @function eqToHz
	 * @static
	 *
	 * @param {EqCoord} eqcoord - equatorial coordinates, in radians
	 * @param {EclCoord} latlng - ecliptic coordinates of observer on Earth
	 * @param {number} st - sidereal time at Greenwich at time of observation in radians.
	 * @return {HzCoord} horizontal coordinates, in radians
	 */
	eqToHz: function(eqcoord, eclCoord, strad)  {
		var H = strad - eclCoord.lng - eqcoord.ra;
		
		var sH = Math.sin(H);
		var cH = Math.cos(H);
		var slat = Math.sin(eclCoord.lat);
		var clat = Math.cos(eclCoord.lat);
		var sdec = Math.sin(eqcoord.dec);
		var cdec = Math.cos(eqcoord.dec);
		
	
		return new A.HzCoord(
			Math.atan2(sH, cH * slat - (sdec / cdec) * clat),  // (13.5) p. 93
			Math.asin(slat * sdec + clat * cdec * cH)         // (13.6) p. 93
		);
	}
};
