document.addEventListener('DOMContentLoaded', () => {
  const countryCardEl = document.querySelector('.country-card');
  const countryCode = getParameterByName('code');

  fetchData('https://restcountries.eu/rest/v2/alpha/');

  function fetchData(url) {
    fetch(url + countryCode)
      .then(resp => resp.json())
      .then(data => {
        countryCardEl.innerHTML = loadCountryData(data);
        return data;
      })
      .then((data) => {
        const borderCountriesContainer = document.getElementById(
          'border-countries-container'
        );
        getCountryName(data, borderCountriesContainer);
      });
  }

  function getParameterByName(name, target) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(
      window.location.search
    );
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  function getCountryName(data, target) {

    let currentData = data.borders;

    const borderCountries = currentData.forEach((countryCode, i) => {
      fetch(
        'https://restcountries.eu/rest/v2/alpha/' + countryCode + '?fields=name'
      )
        .then(resp => resp.json())
        .then(nameData => {
          let contentHtml = '';
          contentHtml += `
          <a href="/country.html?code=${countryCode}"
            class="border-country country-${i}">
            ${nameData.name}
          </a>
          `;
          target.innerHTML += contentHtml;
        });
    });
  }

  function loadCountryData(data, getCountryName) {
    let population = data.population
      .toString()
      .split('')
      .reverse()
      .map((v, i, a) =>
        i !== 0 && i !== a.length && i % 3 === 0 ? (v += ',') : v
      )
      .reverse()
      .join('');

    return `
      <img
        src="${data.flag}"
        alt="${data.name} Flag"
        class="flag"
      />
      <div class="body-container">
        <h2 class="name">${data.name}</h2>
        <div class="left-meta">
          <p class="meta native-name">
            <span>Native Name: </span>${data.nativeName}
          </p>
          <p class="meta population">
            <span>Population: </span>${population}
          </p>
          <p class="meta region"><span>Region: </span>${data.region}</p>
          <p class="meta capital"><span>Capital: </span>${data.capital}</p>
        </div>
        <div class="right-meta">
          <p class="meta domain"><span>Top Level Domain: </span>
            ${data.topLevelDomain &&
              data.topLevelDomain.map(domain => domain).join(', ')}
          </p>
          <p class="meta currency"><span>Currencies: </span>
            ${data.currencies &&
              data.currencies.map(currency => currency.name).join(', ')}
          </p>
          <p class="meta language"><span>Languages: </span>
            ${data.languages &&
              data.languages.map(language => language.name).join(', ')}
          </p>
        </div>
        <div class="footer-meta">
          <p class="meta border-countries" id="border-countries-container">
            <span>Border Countries: </span>
          </p>
        </div>
      </div>
    `;
  }
});
