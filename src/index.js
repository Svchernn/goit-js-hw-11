import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import ImgApiService from './js/img-api-service';
import LoadMoreBtn from './components/loadMoreBtn';
import { renderPictures } from './js/render-pictures';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imgApiService = new ImgApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  imgApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imgApiService.query === '') {
    return;
  }

  imgApiService.resetPage();
  clearGallery();

  await searchPictures();
}

async function onLoadMore(e) {
  const data = await imgApiService.fetchPictures();
  const markup = renderPictures(data.hits);
  refs.galleryBox.insertAdjacentHTML('beforeend', markup);
  newGallery.refresh();
  await scrollSmooth();

  const lastPage = data.totalHits / 40;
  if (imgApiService.page >= lastPage) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreBtn.hide();
  }
}

async function searchPictures() {
  const data = await imgApiService.fetchPictures();

  if (!data.totalHits) {
    Notiflix.Notify.failure(
      `❌ Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    const markup = renderPictures(data.hits);
    refs.galleryBox.innerHTML = markup;
    newGallery.refresh();
    loadMoreBtn.show();
  }
}

function clearGallery() {
  refs.galleryBox.innerHTML = '';
}

let newGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  animationSlide: true,
});

async function scrollSmooth() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
