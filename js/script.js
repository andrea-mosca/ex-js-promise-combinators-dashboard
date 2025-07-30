async function fetchJson(url) {
  const response = await fetch(url);
  const obj = await response.json();
  return obj;
}

async function getDashboardData(query) {
  let destinationPromise;
  try {
    destinationPromise = await fetchJson(
      `http://localhost:3333/destinations?search=${query}`
    );
  } catch (err) {
    throw new Error(`impossibile trovare destinazione: ${query}`);
  }
  if (destinationPromise.message) {
    throw new Error(destinationPromise.message);
  }
  let weathersPromise;
  try {
    weathersPromise = await fetchJson(
      `http://localhost:3333/weathers?search=${query}`
    );
  } catch (err) {
    throw new Error(`impossibile trovare il meteo di: ${query}`);
  }
  if (weathersPromise.message) {
    throw new Error(weathersPromise.message);
  }
  let airportPromise;
  try {
    airportPromise = await fetchJson(
      `http://localhost:3333/airports?search=${query}`
    );
  } catch (err) {
    throw new Error(`impossibile trovare l'aereoporto di: ${query}`);
  }
  if (airportPromise.message) {
    throw new Error(airportPromise.message);
  }

  const promises = [destinationPromise, weathersPromise, airportPromise];
  const [destination, wheathers, airport] = await Promise.all(promises);
  return {
    city: destination[0].name,
    country: destination[0].country,
    temperature: wheathers[0].temperature,
    weather: wheathers[0].weather_description,
    airport: airport[0].name,
  };
}

(async () => {
  try {
    const res = await getDashboardData("london");
    console.log("Dasboard data:", res);
    console.log(
      `${res.city} is in ${res.country}.\n` +
        `Today there are ${res.temperature} degrees and the weather is ${res.weather}.\n` +
        `The main airport is ${res.airport}.\n`
    );
  } catch (err) {
    console.error(err);
  }
})();
