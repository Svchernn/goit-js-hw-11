import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    console.log(this);
    const response = await axios.get(
      `https://pixabay.com/api/?key=32171401-514b83b6102b11560a1fef5f9&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    const data = await response.data;
    // if (response.status !== 200) {
    //   throw new Error(response.status);
    // }

    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
