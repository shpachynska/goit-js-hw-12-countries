function fetchCountry(countryId) {
  const BASE_URL = 'https://restcountries.eu/rest/v2';
  return fetch(`${BASE_URL}/name/${countryId}`).then(response => response.json());
}

export default { fetchCountry };
