# MeeusJs

MeeusJs is an implementation of some algorithms of the Book 'Astronomical Algorithms of Jean Meeus' in Javascript.
It follows the second edition, copyright 1998, with corrections as of August 10, 2009.
 
The library can be used to calculate sun and moon positions and their phases (rise, transmit, set) on a high accuracy.

The library is about 20kb (minimized) and licensed under MIT. It includes various unit tests against the data of http://ssd.jpl.nasa.gov/horizons.cgi.

The sourcecode is written by [Fabio Soldati](http://www.peakfinder.org/about) ([@fabiz](https://github.com/fabiz)) from http://www.peakfinder.org.


## Package contents

Currently the following chapters are implemented:

| Chapter                                              | Module        |
| ---------------------------------------------------- |:-------------:| 
|3.  Interpolation                                     | A.Interp      |
|7.  Julian Day                                        | A.JulianDay   |
|10. Dynamical Time and Universal Time                 | A.DeltaT      |
|11. The Earth's Globe                                 | A.Globe       |
|12. Sidereal Time at Greenwich                        | A.Sidereal    |
|13. Transformation of Coordinates                     | A.Coord       |
|14. The Parallactic Angle, and three other Topics     | A.Moon        |
|15. Rising, Transit, and Setting                      | A.Rise        |
|16. Atmospheric Refraction                            | A.Refraction  |
|22. Nutation and the Obliquity of the Ecliptic        | A.Nutation    |
|23. Apparent Place of a Star                          | A.Nutation    |
|25. Solar Coordinates                                 | A.Solar       |
|27. Equinoxes and Solstices                           | A.Solstice    |
|40. Correction for Parallax                           | A.Parallax    |
|47. Position of the Moon                              | A.Moon        |
|48. Illuminated Fraction of the Moon's Disk           | A.MoonIllum   |
|49. Phases of the Moon                                | A.MoonPhase   |


## Usage example

### Sun

```javascript

// gets sun position and times for zurich
var jdo = new A.JulianDay(new Date()); // now
var coord = A.EclCoord.fromWgs84(47.3957, 8.4867, 440); // zurich

// gets the position of the sun		
var tp = A.Solar.topocentricPosition(jdo, coord, true);
// print azi and alt
console.log(tp.hz.toString()); 

// gets the rise, transit and set time of the sun for today
var times = A.Solar.times(jdo, coord);
	
// print rise, transit and set in universal time	
console.log("rise:" + A.Coord.secondsToHMSStr(times.rise) + 
          ", transit:" + A.Coord.secondsToHMSStr(times.transit) + 
          ", set:" +  A.Coord.secondsToHMSStr(times.set));
```


### Moon

```javascript

// gets the moon position and times for zurich
var jdo = new A.JulianDay(new Date()); // now
var coord = A.EclCoord.fromWgs84(47.3957, 8.4867, 440); // zurich

// gets the position of the moon		
var tp = A.Moon.topocentricPosition(jdo, coord, true);
// print azi and alt
console.log(tp.hz.toString() + ", dist:" + tp.delta); 

// gets the rise, transit and set time of the moon for today
var times = A.Moon.times(jdo, coord);
	
// print rise, transit and set in universal time	
console.log("rise:" + A.Coord.secondsToHMSStr(times.rise) + 
          ", transit:" + A.Coord.secondsToHMSStr(times.transit) + 
          ", set:" +  A.Coord.secondsToHMSStr(times.set));
		  

// print moon phase and illuminated
var suneq = A.Solar.apparentTopocentric(jdo, coord);
var i = A.MoonIllum.phaseAngleEq2(tp.eq, suneq);
var k = A.MoonIllum.illuminated(i);
var chi =  A.MoonIllum.positionAngle(moontp.eq, suneq);

console.log("phase:" + i + ", illuminated:" + k + ", angle:" + chi);		
```



## Changelog

#### 1.0.3 &mdash; Jan 18, 2017

- Fixed bug on A.JulianDay.jdToDate


#### 1.0.2 &mdash; Mar 18, 2016

- Added solistice

#### 1.0.1 &mdash; Mar 04, 2016

- Fixed bug of MoonIllum
- Added approxTransit to Moon and Solar
- Added toDate method the JulianDay


#### 1.0.0 &mdash; Mar 02, 2016

- First commit.



