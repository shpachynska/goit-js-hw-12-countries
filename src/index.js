import './sass/main.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, notice, info, success, error } from '@pnotify/core';
import debounce from 'lodash.debounce';
import API from './fetchCountries';
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
        } else if (countries.length > 10) {
          const myNotice = notice({
            text: 'Too many matches found. Please enter a more specific query!',
            styling: 'brighttheme',
            delay: 3000,
          });
        }
      })
      .catch(onFetchError);
  }
}

function onFetchError(er) {
  const myError = error({
    text: 'There is no such country. Please enter a valid name!',
    styling: 'brighttheme',
    delay: 3000,
  });
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
