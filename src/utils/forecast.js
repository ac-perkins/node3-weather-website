const request = require('request');

const forecast = (lat, long, callback) => {
  const url = `https://api.darksky.net/forecast/7a31f0bcd149aaa5565341b8982c821e/${lat},${long}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather services!', undefined);
    } else if (body.error) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      const current = body.currently;
      const daily = body.daily.data[0];
      console.log(body.daily.data);
      

      callback(undefined, 
        `${daily.summary} It is currently ${current.temperature} degrees out with a high of ${daily.temperatureHigh} degrees and a low of ${daily.temperatureLow} degrees. There is a ${current.precipProbability}% chance of rain.`  
      );
    }
  });
};

module.exports = forecast;