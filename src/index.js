import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import ImgApiService from './img-api-service';
import LoadMoreBtn from './components/loadMoreBtn';

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
  newGallery.refresh();
  const markup = renderPictures(data.hits);
  refs.galleryBox.insertAdjacentHTML('beforeend', markup);
  newGallery.refresh();
  scrollSmooth();

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

function renderPictures(pictures) {
  return pictures
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
        return `<div class="photo-card">
  <a class "gallery-link" href="${largeImageURL}">
  <img class "gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="240"/>
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>
`;
      }
    )
    .join('');
}

// function appendPictures(data) {
//   refs.galleryBox.insertAdjacentHTML('beforeend', renderPictures(data));
// }

function clearGallery() {
  refs.galleryBox.innerHTML = '';
}

let newGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  animationSlide: true,
});

function scrollSmooth() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
