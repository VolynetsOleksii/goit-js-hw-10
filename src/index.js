
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';
import {fetchCountries} from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
let formData;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputData, DEBOUNCE_DELAY));

function onInputData(e) {
  formData = e.target.value.trim();
  if (refs.input.value === '') {
    clearData();
  } else {
    fetchCountries(formData)
      .then(data => {
        if (data.length > 10) {
          clearData();
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if ((data.length >= 2) & (data.length <= 10)) {
          const markup = data
            .map(({ name, flags }) => {
              return `
        <li class="country-list__item">
        <img
              class="country-list__image"
              src="${flags.svg}"
              alt="${name.official}"
              width="50"
              height="40"
            />
        <p class="country-list__official-name">${name.official}</p>
      </li>
          `;
            })
            .join('');

          clearData();
          refs.countryList.insertAdjacentHTML('beforeend', markup);
        } else if ((data.length = 1)) {
          clearData();
          const markup = data
            .map(({ name, flags, capital, population, languages }) => {
              return `
      <div class="country-list__item">
        <img
              class="country-list__image"
              src="${flags.svg}"
              alt="${name.official}"
              width="50"
              height="40"
        />
        <p class="country-list__official-name">${name.official}</p>
      </div>
      <div class="country-info__items">
      <p class="country-info__item">Capital: <span>${capital[0]}</span></p>
      <p class="country-info__item">Population: <span>${population}</span></p>
      <p class="country-info__item">Languages: <span>${Object.values(
        languages
      )}</span></p>
    </div>
        `;
            })
            .join('');

          refs.countryInfo.innerHTML = '';
          refs.countryInfo.insertAdjacentHTML('beforeend', markup);
        }
      })
      .catch(() => {
        clearData();
        Notify.failure('Oops, there is no country with that name')});
  }
}

function clearData() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
