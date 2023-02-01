import './sass/main.scss';

import { fetchPhotos } from './fetchPhotos';

import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('.search-form__input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchPhotos(query, page, perPage)
    .then(({ data }) => {
      renderPhotos(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-not-visible');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function onSearchForm(event) {
  event.preventDefault();
  page = 1;
  query = input.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-not-visible');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  fetchPhotos(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoPhotosFound();
      } else {
        renderPhotos(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertPhotosFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-not-visible');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      form.reset();
    });
}

function renderPhotos(photos) {
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <div class="gallery__photo-card">
                <a class="gallery-link" href="${largeImageURL}"> <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
             <div class="info">
                <p class="info-item">
                    <b>Likes</b>${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>${downloads}
                </p>
            </div>
        </div>
          `;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function alertPhotosFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoPhotosFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}
