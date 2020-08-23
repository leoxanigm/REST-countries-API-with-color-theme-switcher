document.addEventListener('DOMContentLoaded', () => {
  const countryCardsContainer = document.querySelector('.country-cards');
  const URL = 'https://restcountries.eu/rest/v2/all';
  const countriesPerPage = 16;

  fetch('./all.json')
    .then(resp => resp.json())
    .then(data => (countryCardsContainer.innerHTML = loadCountriesData(data)));

  function loadCountriesData(data) {
    let currentData = [...data];

    try {
      if (Array.isArray(currentData) && currentData.length > 0) {
        let compiledData = currentData
          .map((countryData, index) => {
            if (index >= 16) return;

            let population = countryData.population
              .toString()
              .split('')
              .reverse()
              .map((v, i, a) =>
                i !== 0 && i !== a.length && i % 3 === 0 ? (v += ',') : v
              )
              .reverse()
              .join('');

            return `
            <a
              href="./country.html?code=${countryData.alpha3Code}"
              class="country"
              id="${countryData.alpha3Code}"
              data-name="${countryData.name}"
              data-code="${countryData.alpha3Code}"
              data-region="${countryData.region}"
            >
              <div class="img-container">
                <img
                  src="${countryData.flag}"
                  alt="${countryData.name} Flag"
                  class="flag"
                />
              </div>
              <div class="body-container">
                <h3 class="name">${countryData.name}</h3>
                <p class="meta population"><span>Population: </span>${population}</p>
                <p class="meta region"><span>Region: </span>${countryData.region}</p>
                <p class="meta capital"><span>Capital: </span>${countryData.capital}</p>
              </div>
            </a>
          `;
          })
          .join('');

        return compiledData;
      }
    } catch(err) {
      console.log(err);
      return '<p class="error">Can not load data. Please try again</p>';
    }
  }
});
