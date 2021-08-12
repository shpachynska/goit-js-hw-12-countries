import './sass/main.scss';
import { alert, notice, info, success, error } from '@pnotify/core';
import debounce from 'lodash.debounce';
import API from './fetchCountries.js';
import countryListTpl from './templates/country-list.hbs';
import countryCardTpl from './templates/country.hbs';

const refs = {
  countryCard: document.querySelector('.country-data'),
  cardContainer: document.querySelector('.country-list'),
  searchInput: document.querySelector('#search-field'),
};

const delay = 1000;

refs.searchInput.addEventListener('input', debounce(onInput, delay));

function onInput(e) {
  const query = e.target.value.trim();
  clearMarkup();

  if (query.length > 0) {
    API.fetchCountry(query)
      .then(countries => {
        if (countries.length === 1) {
          renderCountryCard(countries);
        } else if (countries.length > 1 && countries.length <= 10) {
          renderCountryList(countries);
        } else {
          const myNotice = notice({
            text: 'Too many matches found. Please enter a more specific query!',
          });
        }
      })
      .catch(error => {
        alert('Please enter valid country name');
      });
  }
}

function createCountryListMarkup(countries) {
  return countries.map(countryListTpl).join('');
}

function renderCountryList(countries) {
  const markup = createCountryListMarkup(countries);
  refs.cardContainer.innerHTML = markup;
}

function renderCountryCard(countries) {
  const markup = countryCardTpl(countries);
  refs.countryCard.innerHTML = markup;
}

function clearMarkup() {
  refs.cardContainer.innerHTML = '';
  refs.countryCard.innerHTML = '';
}
