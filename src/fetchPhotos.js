import axios from 'axios';
export { fetchPhotos };

axios.defaults.baseURL = 'https://pixabay.com/api/';

const KEY = '33208889-eea2369f8807808d012f27d07';

async function fetchPhotos(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
