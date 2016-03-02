// Copyright (c) 2016 Fabio Soldati, www.peakfinder.org
// License MIT: http://www.opensource.org/licenses/MIT

/**
 * Compare numbers taking in account an error
 *
 * @param  {Float} number
 * @param  {Float} expected
 * @param  {Float} error    Optional
 * @param  {String} message  Optional
 */
QUnit.assert.close = function(number, expected, error, message) {
  if (error === void 0 || error === null) {
    error = 0.00001 // default error
  }

  var result = number == expected || (number < expected + error && number > expected - error) || false

  QUnit.push(result, number, expected, message);
}