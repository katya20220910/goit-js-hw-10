import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;


// const input = document.querySelector('#search-box');
// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');
// const body = document.querySelector('body');


// const cleanData = () => {
//   countryInfo.innerHTML = '';
//   countryList.innerHTML = '';
// };

// const countrySearch = e => {
//   const countryFind = e.target.value.trim();
//   if (!countryFind) {
//     cleanData();
//     return;
//   }
//   fetchCountries(countryFind)
//     .then(country => {
//       if (country.length > 10) {
//         Notiflix.Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//         cleanData();
//         return;
//       } else if (country.length > 1 && country.length <= 10) {
//         cleanData(countryInfo.innerHTML);
//         renderCountryList(country);
//       } else if (country.length === 1) {
//         cleanData(countryList.innerHTML);
//         renderCountryInfo(country);
//       }
//     })
//      .catch(error => {
//        Notiflix.Notify.failure('Oops, there is no country with that name');
//        cleanData();
//        return error;
//      });
// };

// const renderCountryList = country => {
//   const markup = country
//     .map(({ name, flags }) => {
//       return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60"><p>${name.official}</p></li>`;
//     })
//     .join('');
//   countryList.innerHTML = markup;
// };

// const renderCountryInfo = country => {
//   const markup = country
//     .map(({ name, capital, population, flags, languages }) => {
//       return `<section><h1><img src="${flags.svg}" alt="Flag of ${
//         name.official
//       }"width="30" hight="20"">&nbsp ${name.official}</h1>
//       <p><span>Capital: </span>&nbsp ${capital}</p>
//       <p><span>Population:</span>&nbsp ${population}</p>
//       <p><span>Languages:</span>&nbsp ${Object.values(languages)}</p><section>`;
//     })
//     .join('');
//   countryInfo.innerHTML = markup;
// };

const refs = {
  searchForm: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// Запит : прийом DEBOUNCE  
refs.searchForm.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);
 //  Поле пошуку - помилки
function onSearchCountry(e) {
  const inputValue = e.target.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(data => {
        createMarkup(data);
      })
      .catch(error => {
        if (error.message === '404') {
          Notify.failure('Oops, there is no country with that name');
          return;
        }
        Notify.failure('Something wrong...');
      });
  }
}
// Функції пошуку
function createMarkup(data) {
  if (data.length >= 2 && data.length <= 10) {
    createList(data);
    return;
  } else if (data.length === 1) {
    createCard(data);
    return;
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function createList(data) {
  const markup = data
    .map(item => {
      return `
      <li class="country-list__item">
      <img class="country-list__img" src="${item.flags.svg}" alt="${item.name.official}">
      <h2 class="country-list__title">${item.name.official}</h2>
        </li>
      `;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createCard(country) {
  const { flags, name, capital, languages, population } = country[0];
  const markup = `
      <div class="card-body">
        <div class="card-name">
            <img class="card-img" src="${flags.svg}" 
            alt="${name.official}">
          <h2 class="card-title">${name.official}</h2>
        </div>
          <p class="card-capital">Capital: ${capital}</p>
          <p class="card-population">Population: ${population}</p>
          <p class="card-languages">Languages: ${Object.values(
            languages
          )}</p>
      </div>
      `;
  refs.countryInfo.innerHTML = markup;
}