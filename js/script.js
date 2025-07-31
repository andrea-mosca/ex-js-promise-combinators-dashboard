async function fetchJson(url) {
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}

async function getDashboardData(query) {
  try {
    const destinationPromise = fetchJson(
      `http://localhost:3333/destinations?search=${query}`
    );

    const weathersPromise = fetchJson(
      `http://localhost:3333/weathers?search=${query}`
    );

    const airportPromise = fetchJson(
      `http://localhost:3333/airports?search=${query}`
    );

    const promises = [destinationPromise, weathersPromise, airportPromise];
    const [destinationsResult, weathersResult, airportsResult] =
      await Promise.allSettled(promises);
    console.log(destinationsResult, weathersResult, airportsResult);

    const data = {};
    if (destinationsResult.status === `rejected`) {
      console.error(`problema in destinations: `, destinationsResult.reason);
      data.city = null;
      data.country = null;
    } else {
      const destination = destinationsResult.value[0];
      data.city = destination ? destination.name : null;
      data.country = destination ? destination.country : null;
    }

    if (weathersResult.status === `rejected`) {
      console.error(`problema in weather: `, weathersResult.reason);
      data.temperature = null;
      data.weather = null;
    } else {
      const weather = weathersResult.value[0];
      data.temperature = weather ? weather.temperature : null;
      data.weather = weather ? weather.weather_description : null;
    }
    if (airportsResult.status === `rejected`) {
      console.error(`problema in airport: `, airportsResult.reason);
      data.airport = null;
    } else {
      const airport = airportsResult.value[0];
      data.airport = airport ? airport.name : null;
    }

    return data;
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  try {
    const res = await getDashboardData("vienna");
    console.log("Dasboard data:", res);
    let frase = ``;
    if (res.city !== null && res.country !== null) {
      frase += `${res.city} is in ${res.country}.\n`;
    }
    if (res.temperature !== null && res.weather !== null) {
      frase += `Today there are ${res.temperature} degrees and the weather is ${res.weather}.\n`;
    }
    if (res.airport !== null) {
      frase += `The main airport is ${res.airport}.\n`;
    }
    console.log(frase);
  } catch (err) {
    console.error(err);
  }
})();
