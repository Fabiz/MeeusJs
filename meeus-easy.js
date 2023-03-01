// gets the moon position and times
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

  if (azRad < 0) {
     azRad = Math.PI + azRad;
     azDeg = 180.0 + azDeg;
  }

  return {
    moonAzimuthDegrees : azDeg,
    moonAzimuthRad : azRad,
    moonAltitudeDegrees : null,
    moonAltitudeRefractionDegrees : altDeg,
    moonAltitudeRefractionRad : altRad,
    moonIllumFractionDetailPercentage : k,
    moonPhase : i,
    rise : A.Coord.secondsToHMSStr(times.rise),
    riseJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) +  "-" +  myDateJS.getDate() + " " +  A.Coord.secondsToHMSStr(times.rise)),
    transit : A.Coord.secondsToHMSStr(times.transit) ,
    transitJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) + "-" +myDateJS.getDate() + " " +  A.Coord.secondsToHMSStr(times.transit)),
    set: A.Coord.secondsToHMSStr(times.set),
    setJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) + "-" +myDateJS.getDate() + " " + A.Coord.secondsToHMSStr(times.set)),

  }
}

function suncalcMeeus(myDateJS, lat, lon, height) {
// gets sun position and times 
  var jdo = new A.JulianDay(myDateJS); 
  var coord = A.EclCoord.fromWgs84(lat, lon, height);

  // gets the position of the sun
  var tp = A.Solar.topocentricPosition(jdo, coord, true);
  var altRad = tp.hz.alt;
  var altDeg = altRad * 180 / Math.PI;
  var azRad = tp.hz.az;
  var azDeg = azRad * 180 / Math.PI;
  var distKm =  tp.delta; // debug

  if (azRad < 0) {
     azRad = Math.PI + azRad;
     azDeg = 180.0 + azDeg;
  }
  // gets the rise, transit and set time of the sun
  var times = A.Solar.times(jdo, coord);

  return {
    sunAzimuthRad : azRad,
    sunAltitudeRad : altRad,
    sunAzimuthDegrees : azDeg,
    sunAltitudeDegrees : altDeg,
    rise : A.Coord.secondsToHMSStr(times.rise),
    riseJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) + "-" + myDateJS.getDate() + " "  + A.Coord.secondsToHMSStr(times.rise)),
    transit : A.Coord.secondsToHMSStr(times.transit) ,
    transitJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) + "-" + myDateJS.getDate() + " "  + A.Coord.secondsToHMSStr(times.transit)),
    set: A.Coord.secondsToHMSStr(times.set),
    setJS : new Date(myDateJS.getFullYear() + "-" + (myDateJS.getMonth()+1) + "-" + myDateJS.getDate() + " "  + A.Coord.secondsToHMSStr(times.set)),
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


