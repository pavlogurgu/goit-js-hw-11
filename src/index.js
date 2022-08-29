import './css/styles.css';
import {fetchImages} from './js/fetchImages'
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more')

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

let query = ''
let page = 1
const perPage = 40
let simpleLightBox

function onLoadMoreBtn(){
    page += 1
    fetchImages(query, page, perPage)
    .then(({ data }) => {
        renderImgCard(data.hits)
        smoothScroll()
        simpleLightBox = new SimpleLightbox('.gallery a').refresh()
      if (page * perPage > data.totalHits) {
        loadMoreBtn.classList.add('is-hidden')
        Notiflix.Notify.failure('Sorry, but there`s no other search results for now.')
      }
    })
    .catch(error => console.log(error))
}


function onSearchForm(e){
    e.preventDefault()
    page = 1
    query = e.currentTarget.searchQuery.value.trim()
    gallery.innerHTML = ''
    if (query === '') {
        return Notiflix.Notify.failure('Please, enter something')
      }
    fetchImages(query, page, perPage)
    .then(({ data }) => {
        if (data.totalHits === 0){
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again')
            loadMoreBtn.classList.add('is-hidden')
        } else{
        renderImgCard(data.hits)
        simpleLightBox = new SimpleLightbox('.gallery a').refresh()
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        if (data.totalHits > perPage){
            loadMoreBtn.classList.remove('is-hidden')
        }
        }
    })
    .catch(error => console.log(error))
}

function smoothScroll(){
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


function renderImgCard(images) {
    const markup = images
    .map(( {id, likes, views, comments, downloads, tags, webformatURL, largeImageURL} ) => {
        return `
        <a class="gallery-link" href="${largeImageURL}">
        <div class="gallery-item" id="${id}">
        <img class="gallery-item-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
      })
      .join('');
      gallery.insertAdjacentHTML('beforeend', markup)
  }

