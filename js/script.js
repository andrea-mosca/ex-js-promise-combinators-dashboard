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
  const [destinations, wheathers, airports] = await Promise.all(promises);

  const destination = destinations[0];
  const wheather = wheathers[0];
  const airport = airports[0];
  return {
    city: destination ? destination.name : null,
    country: destination ? destination.country : null,
    temperature: wheather ? wheather.temperature : null,
    weather: wheather ? wheather.weather_description : null,
    airport: airport ? airport.name : null,
  };
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
