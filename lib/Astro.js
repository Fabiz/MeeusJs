/**
 * @preserve Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
 * License MIT: http://www.opensource.org/licenses/MIT
 */


/**
 * Defines some constants.
 *
 * Julian and Besselian years described in chapter 21, Precession.
 * T, Julian centuries since J2000 described in chapter 22, Nutation.
 */
A = {

	/**
	 * JMod is the Julian date of the modified Julian date epoch.
	 * @const {number} JMod
	 */
	JMod: 2400000.5,

	/**
	 * J2000 is the Julian date corresponding to January 1.5, year 2000.
	 * @const {number} J2000
	 */
	J2000: 2451545.0,

	/**
	 * Julian days of 1900.  
	 * @const {number} J1900
	 */
	J1900: 2415020.0,
	/** 
	 * Julian days of B1900 (see p. 133)
	 * @const {number} B1900
	 */
	B1900: 2415020.3135,
	
	/** 
	 * Julian days of B1950 (see p. 133)
	 * @const {number} B1950
	 */
	B1950: 2433282.4235,

	/**
	 * JulianYear in days.
	 * @const {number} JulianYear
	 */
	JulianYear: 365.25,      // days
	
	/**
	 * JulianCentury in days.
	 * @const {number} JulianCentury
	 */
	JulianCentury: 36525,       // days
	
	/**
	 * BesselianYear in days.
	 * @const {number} BesselianYear
	 */
	BesselianYear: 365.2421988, // days
		
	/**
	 * AU is one astronomical unit in km.
	 * This is roughly the distance from Earth to the Sun.
	 * @const {number} AU
	 */
	AU: 149597870
};