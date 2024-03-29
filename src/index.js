import iziToast from 'izitoast';
import SlimSelect from 'slim-select';
import 'slim-select/styles';
import 'izitoast/dist/css/iziToast.min.css';
import { handleFetchedData, hideElement, showElement } from './js/common';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';

export const refs = {
  breedSelect: document.querySelector('select.breed-select'),
  loader: document.querySelector('span.loader'),
  infoBlock: document.querySelector('div.cat-info'),
};

const renderSelectOptions = cats => {
  const options = cats
    .map((cat, idx) => {
      if (idx === 0) {
        return `<option value disabled selected>Select a breed</option>`;
      }
      return `<option value="${cat.id}">${cat.name}</option>`;
    })
    .join('');

  refs.breedSelect.insertAdjacentHTML('beforeend', options);
  new SlimSelect({
    select: 'select.breed-select',
  });
};

export const renderCatMarkup = catInfo => {
  const { url, breeds } = catInfo[0];
  const { name, description, temperament } = breeds[0];

  const markup = `
  <img src=${url} width="400" alt="${name || 'cat'}"/>
  <div class="text-wrap">
    <h1 class="main-title">${name}</h1>
    <p>${description}</p>
    <p><strong>Temperament:</strong> ${temperament}</p>
  </div>
      `;

  refs.infoBlock.innerHTML = markup;
};

const handleChooseBreed = () => {
  const index = refs.breedSelect.selectedIndex;
  const selectedValue = refs.breedSelect.options[index].value;

  hideElement(refs.infoBlock);
  showElement(refs.loader);

  fetchCatByBreed(selectedValue)
    .then(({ data }) => {
      // data = []; // 👈 test for Error
      handleFetchedData(data, refs, renderCatMarkup);
      showElement(refs.infoBlock);
    })
    .catch(error => {
      console.error('error:', error);
      hideElement(refs.loader);
      iziToast.error({ message: `${error.message}`, position: 'topCenter' });
    });
};

refs && showElement(refs.loader);
fetchBreeds()
  .then(({ data }) => {
    // data = []; // 👈 test for Error

    handleFetchedData(data, refs, renderSelectOptions);
    showElement(refs.breedSelect);
  })
  .catch(error => {
    console.log('error:', error);
    hideElement(refs.loader);
    iziToast.error({ message: `${error.message}`, position: 'topCenter' });
  });

refs.breedSelect.addEventListener('change', handleChooseBreed);
