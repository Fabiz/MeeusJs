// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT


/**
 * Julian day.
 * @constructor
 * @param {number|Date} jd - The julian day or a javascript date object
 * @param {?number} deltaT - If deltaT is already known it can be provided for performance reasons.
 */
A.JulianDay = function (jd, deltaT) {
	if (jd instanceof Date) {
		jd = A.JulianDay.dateToJD(jd);
	}
	this.jd = jd;	
	if (deltaT)  // if deltaT is not provided do the calculation now
		this.deltaT = deltaT;
	else
		this.deltaT = A.DeltaT.estimate(this.jd);
	this.jde = A.DeltaT.jdToJde(this.jd, this.deltaT);
};

A.JulianDay.prototype = {
	
	/**
	 * toCalendar returns the calendar date .
	 * @return {Array} y,m,d
	 */
	toCalendar: function () {
		return A.JulianDay.jdToCalendar(this.jd);
	},
	
	/**
	 * toDate returns the javascript date.
	 * @return {Date} date
	 */
	toDate: function () {
		return A.JulianDay.jdToDate(this.jd);
	},
	
	/**
	 * jdeJ2000Century returns the number of Julian centuries since J2000 from julian day.
	 * @return {number} The quantity appears as T in a number of time series.
	 */
	jdJ2000Century: function () {
		// The formula is given in a number of places in the book, for example
		// (12.1) p. 87. (22.1) p. 143. (25.1) p. 163.
		return (this.jd - A.J2000) / A.JulianCentury;
	},
	
	/**
	 * jdeJ2000Century returns the number of Julian centuries since J2000 from julian day ephemeris.
	 * @return {number} The quantity appears as T in a number of time series.
	 */
	jdeJ2000Century: function () {
		// The formula is given in a number of places in the book, for example
		// (12.1) p. 87. (22.1) p. 143. (25.1) p. 163.
		return (this.jde - A.J2000) / A.JulianCentury;
	},
	
	/**
	 * Returns a new instance 
	 * @return {A.JulianDay}
	 */
	startOfDay: function() {
		var startofday = Math.floor(this.jde - 0.5) + 0.5;
		return new A.JulianDay(startofday, this.deltaT);
	}
};

A.JulianDay.gregorianTimeStart = Date.UTC(1582, 10 - 1, 4);

/**
 * jdFromGregorian converts a Gregorian year, month, and day of month to a new Julian day object.
 * Negative years are valid, back to JD 0.  The result is not valid for dates before JD 0.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @return {A.JulianDay} julian day object
 */
A.JulianDay.jdFromGregorian = function (y, m, d) {
	return new A.JulianDay(A.JulianDay.jdFromGregorian(y, m, d));
};

/**
 * jdFromJulian converts a Julian year, month, and day of month to a new Julian day object.
 * Negative years are valid, back to JD 0.  The result is not valid for dates before JD 0.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @return {A.JulianDay} julian day object
 */
A.JulianDay.jdFromJulian = function (y, m, d) {
	return new A.JulianDay(A.JulianDay.calendarJulianToJD(y, m, d));
};

/**
 * jdFromJDE converts a julian day ephemeris to a new Julian day object.
 *
 * @param {number} jde - julian day ephemeris
 * @param {number} m - month
 * @param {number} d - day
 * @return {A.JulianDay} julian day object
 */
A.JulianDay.jdFromJDE = function (jde) {
	var deltaT = A.DeltaT.estimate(jde);
	var jd = A.DeltaT.jdeToJd(jde, deltaT);
	return new A.JulianDay(jd, deltaT);
};


/**
 * DateToJD takes a javascript data and converts it to a julian day number.
 * Any time zone offset in the time. Time is ignored and the time is treated as UTC.
 * 
 * @param {Date} date - the date
 * @return {number} julian day number
 */
A.JulianDay.dateToJD = function (date) {
	var day = date.getUTCDate() + A.JulianDay.secondsFromHMS(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()) / (24*3600);
	
	if (date.getTime() < A.JulianDay.gregorianTimeStart)
		return A.JulianDay.calendarJulianToJD(date.getUTCFullYear(), date.getUTCMonth() + 1, day);
	else
		return A.JulianDay.calendarGregorianToJD(date.getUTCFullYear(), date.getUTCMonth() + 1, day);
};

/**
 * calendarGregorianToJD converts a Gregorian year, month, and day of month to Julian day number.
 * Negative years are valid, back to JD 0.  The result is not valid for dates before JD 0.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @return {number} julian day number
 */
A.JulianDay.calendarGregorianToJD = function (y, m, d) {
	if (m == 1 || m == 2) {
		y--;
		m += 12;
	}
	var a = Math.floor(y / 100);
	var b = 2 - a + Math.floor(a / 4);
	// (7.1) p. 61
	return Math.floor(36525 * ( y + 4716) / 100) +
		Math.floor(306 * (m + 1) / 10) + b + d - 1524.5;
};

/**
 * calendarJulianToJD converts a Julian year, month, and day of month to a Julian day number.
 * Negative years are valid, back to JD 0.  The result is not valid for dates before JD 0.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @return {number} julian day number
 */
A.JulianDay.calendarJulianToJD = function (y, m, d) {
	if (m == 1 || m == 2) {
		y--;
		m += 12;
	}
	return Math.floor(36525 * (y + 4716) / 100) +
		Math.floor(306 * (m + 1) / 10) + d - 1524.5;
};

/**
 *  Get the seconds from hours minutes and seconds
 * 
 * @param {number} h - hour
 * @param {number} m - minutes
 * @param {number} s - seconds
 * @return {number} result in seconds
 */
A.JulianDay.secondsFromHMS = function (h, m, s) {
	return h * 3600 + m * 60 + s;
};

/**
 * toDate returns the given julian day number for the given jd as a JavaScript date object including h,m,s.
 * Note that this function returns a date in either the Julian or Gregorian Calendar, as appropriate.
 *
 * @param {number} jd - julian day number
 * @return {Array} y,m,d
 */
A.JulianDay.jdToDate = function (jd) {
	var cal = A.JulianDay.jdToCalendar(jd);
	
	var mod = A.Math.modF(jd + 0.5); // zf, f
	var dayfract = mod[1];
	var sec = Math.round(dayfract * 86400);
	
	var hours = Math.floor(sec/3600) % 24;
	var minutes = Math.floor(sec/60) % 60;
	var seconds = Math.floor(sec % 60);
	
	return new Date(Date.UTC(cal.y, cal.m-1, Math.floor(cal.d), hours, minutes, seconds));
};

/**
 * toCalendar returns the given julian day number for the given jd.
 * Note that this function returns a date in either the Julian or Gregorian Calendar, as appropriate.
 *
 * @param {number} jd - julian day number
 * @return {Array} y,m,d
 */
A.JulianDay.jdToCalendar = function (jd) {
	var mod = A.Math.modF(jd + 0.5); // zf, f

	var z = mod[0];
	var a = z;
	if (z >= 2299151) {
		var alpha = Math.floor((z * 100 - 186721625) / 3652425);
		a = z + 1 + alpha - Math.floor(alpha / 4);
	}
	var b = a + 1524;
	var c = Math.floor((b * 100 - 12210) / 36525);
	var d = Math.floor(36525 * c / 100);
	var e = Math.floor((b - d) * 1e4 / 306001);

	// compute return values
	var day = ((b-d)-Math.floor(306001 * e / 1e4)) + mod[1];
	var month, year;
	if (e == 14 || e == 15) 
		month = e - 13;
	else
		month = e - 1;

	if (month == 1 || month == 2)
		year = Math.floor(c) - 4715;
	else
		year = Math.floor(c) - 4716;
	return {
		y: year,
		m: month,
		d: day
	};
};

/**
 * leapYearGregorian returns true if year y in the Gregorian calendar is a leap year.
 *
 * @param {number} y - year
 * @return {boolean} true if leap year.
 */
A.JulianDay.leapYearGregorian = function (y) {
	return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
};

/**
 * dayOfYear computes the day number within the year. <br>
 * This form of the function is not specific to the Julian or Gregorian
 * calendar, but you must tell it whether the year is a leap year.
 *
 * @param {number} y - year
 * @param {number} m - month
 * @param {number} d - day
 * @param {boolean} leap - true if it's a leap year
 * @return {number} day number
 */
A.JulianDay.dayOfYear = function (y, m, d, leap) {
	var k = 2;
	if (leap) {
		k--;
	}
	return A.JulianDay._wholeMonths(m, k) + d;
};

A.JulianDay._wholeMonths = function (m, k) {
	return Math.round(275 * m / 9 - k * ((m + 9) / 12) - 30);
};

