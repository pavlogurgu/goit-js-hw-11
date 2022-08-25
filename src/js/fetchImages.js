import axios from 'axios'
export {fetchImages}

axios.defaults.baseURL = 'https://pixabay.com/api/'
const MY_ACCESS_KEY = '29499906-22b38502364cbc24023c0b9e4'

async function fetchImages(query, page, perPage) {
    const response = await axios.get(
      `?key=${MY_ACCESS_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    )
    return response
  }