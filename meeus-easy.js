// gets the moon position and times in UTC
function mooncalcMeeus(myDateJS, lat, lon, height) {
  var jdo = new A.JulianDay(myDateJS); 
  var coord = A.EclCoord.fromWgs84(lat, lon, height);

  // gets the position of the moon
  var tp = A.Moon.topocentricPosition(jdo, coord, true);
  var altRad = tp.hz.alt;
  var altDeg = altRad * 180 / Math.PI;
  var azRad = tp.hz.az
  var azDeg = azRad * 180 / Math.PI;
  var distKm =  tp.delta;

  // gets the rise, transit and set time of the moon
  var times = A.Moon.times(jdo, coord);


  // print moon phase and illuminated
  var suneq = A.Solar.apparentTopocentric(jdo, coord);
  var i = A.MoonIllum.phaseAngleEq2(tp.eq, suneq);
  var k = A.MoonIllum.illuminated(i);
  var chi =  A.MoonIllum.positionAngle(tp.eq, suneq);

   azRad = azRad  +  Math.PI ;
   azDeg = azDeg + 180;

  return {
    moonAzimuthDegrees : azDeg,
    moonAzimuthRad : azRad,
    moonAltitudeDegrees : null,
    moonAltitudeRefractionDegrees : altDeg,
    moonAltitudeRefractionRad : altRad,
    moonIllumFractionDetailPercentage : k,
   moonPhase : i,
    moonDistance : distKm,
    rise : A.Coord.secondsToHMSStr(times.rise) + "Z",
    riseJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) +  "-" +  myDateJS.getUTCDate() + " " +  A.Coord.secondsToHMSStr(times.rise) + "Z"),
    transit : A.Coord.secondsToHMSStr(times.transit) + "Z" ,
    transitJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) + "-" +myDateJS.getUTCDate() + " " +  A.Coord.secondsToHMSStr(times.transit) + "Z"),
    set: A.Coord.secondsToHMSStr(times.set) + "Z",
    setJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) + "-" +myDateJS.getUTCDate() + " " + A.Coord.secondsToHMSStr(times.set) + "Z"),

  }
}

function suncalcMeeus(myDateJS, lat, lon, height) {
// gets sun position and times in UTC
  var jdo = new A.JulianDay(myDateJS); 
  var coord = A.EclCoord.fromWgs84(lat, lon, height);

  // gets the position of the sun
  var tp = A.Solar.topocentricPosition(jdo, coord, true);
  var altRad = tp.hz.alt;
  var altDeg = altRad * 180 / Math.PI;
  var azRad = tp.hz.az;
  var azDeg = azRad * 180 / Math.PI;
  var distKm =  tp.delta; // debug

   azRad = azRad  +  Math.PI ;
   azDeg = azDeg + 180;


  // gets the rise, transit and set time of the sun
  var times = A.Solar.times(jdo, coord);


  return {
    sunAzimuthRad : azRad,
    sunAltitudeRad : altRad,
    sunAzimuthDegrees : azDeg,
    sunAltitudeDegrees : altDeg,
    sunDistance : distKm,
    rise : A.Coord.secondsToHMSStr(times.rise) + "Z",
    riseJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) + "-" + myDateJS.getUTCDate() + " "  + A.Coord.secondsToHMSStr(times.rise) + "Z"),
    transit : A.Coord.secondsToHMSStr(times.transit) + "Z" ,
    transitJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) + "-" + myDateJS.getUTCDate() + " "  + A.Coord.secondsToHMSStr(times.transit) + "Z"),
    set: A.Coord.secondsToHMSStr(times.set) + "Z",
    setJS : new Date(myDateJS.getUTCFullYear() + "-" + (myDateJS.getUTCMonth()+1) + "-" + myDateJS.getUTCDate() + " "  + A.Coord.secondsToHMSStr(times.set) + "Z"),
  }
}

function getSunTimesMeeus(myDateJS, lat, lon, height) {
  var temp = suncalcMeeus(myDateJS, lat, lon, height);
  return {
    rise : temp.rise,
    riseJS : temp.riseJS,
    transit : temp.transit ,
    transitJS : temp.transitJS,
    set: temp.set,
    setJS : temp.setJS,
  }
}

function getMoonTimesMeeus(myDateJS, lat, lon, height) {
  var temp = mooncalcMeeus(myDateJS, lat, lon, height);
  return {
    rise : temp.rise,
    riseJS : temp.riseJS,
    transit : temp.transit ,
    transitJS : temp.transitJS,
    set: temp.set,
    setJS : temp.setJS,
  }
}
