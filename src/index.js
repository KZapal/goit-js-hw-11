import Notiflix from 'notiflix';
import axios from 'axios';
// import simpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api';
const myApiKey = `41236626-85b007b23c35ddfe2334f7f05`;

const input = document.querySelector(`input`);
const submitBtn = document.querySelector(`button[type="submit"]`);
const gallery = document.querySelector(`.gallery`);
const loadMore = document.querySelector(`.load-more`);
const upBtn = document.querySelector(`.scroll-up`);

let page = 1;
let perPage = 40;

loadMore.style.display = `none`;
upBtn.style.display = `none`;

const fetchPictures = async () => {
  const searchParams = new URLSearchParams({
    key: myApiKey,
    q: input.value,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: true,
    page: page,
    perPage: perPage,
  });

  try {
    const response = await axios.get(`/?${searchParams}`);
    return response;
  } catch (err) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }

  console.log(response);

  const pictures = response.data.hits;

  return pictures.map(picture => ({
    webformatURL: picture.webformatURL,
    largeImageURL: picture.largeImageURL,
    tags: picture.tags,
    likes: picture.likes,
    views: picture.views,
    comments: picture.comments,
    downloads: picture.downloads,
  }));
};

function cleanPictures() {
  gallery.innerHTML = '';
}

function showGallery(response) {
  for (let i = 0; i < response.data.totalHits; i++) {
    if (response.data.hits[i]) {
      gallery.insertAdjacentHTML(
        `beforeend`,
        `<div class="photo-card">
  <img src="${response.data.hits[i].webformatURL}" alt="${response.data.hits[i].tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${response.data.hits[i].likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${response.data.hits[i].views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${response.data.hits[i].comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${response.data.hits[i].downloads}
    </p>
  </div>
  </div>`
      );
    }
    if (response.data <= page * perPage) {
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    if (response.data === page * perPage) {
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
}

submitBtn.addEventListener(`click`, event => {
  event.preventDefault();
  cleanPictures();
  loadMore.style.display = `block`;
  upBtn.style.display = `block`;
  fetchPictures(input.value, page, perPage).then(response => {
    showGallery(response);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
  });
});

loadMore.addEventListener(`click`, event => {
  event.preventDefault();
  page += 1;
  fetchPictures(input.value, page, perPage)
    .then(response => {
      showGallery(response);
    })
    .catch(err => {
      Notiflix.Notify.info(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    });
});

upBtn.addEventListener('click', onScrollUp => {
  window.scrollTo({
    top: 0,
    behavior: `smooth`,
  });
});
