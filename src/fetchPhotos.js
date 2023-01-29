import axios from 'axios';

export async function fetchPhotos(name, page) {
  const params = new URLSearchParams({
    key: '33208889-eea2369f8807808d012f27d07',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  try {
    const response = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?${params}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
