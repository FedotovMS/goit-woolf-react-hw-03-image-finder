import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import css from './App.module.css';
import FetchImages from './Api/Api.js';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    totalImages: 0,
    images: [],
    status: 'idle',
  };

  componentDidUpdate(_, prevState) {
    const { searchQuery, page, notification } = this.state;

    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.getImages();
    }

    if (prevState.error !== notification && notification) {
      this.handleNotification();
    }
  }

  getImages = async () => {
    const { searchQuery, page } = this.state;

    this.setState({ status: 'pending' });

    try {
      const { images, totalImages } = await FetchImages(searchQuery, page);

      if (images.length === 0) {
        toast.error('Nothing found. Please, change your request.');
      }
      if (images.length !== 0 && page === 1) {
        toast.success(`We have found ${totalImages} images on your request.`);
      }

      if (
        totalImages > 0 &&
        page !== 1 &&
        totalImages <= this.state.images.length + 12
      ) {
        toast.info('There are no more images.');
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...images],
        status: 'resolved',
        totalImages,
      }));
    } catch (error) {
      toast.error('There are some problems! Try again later.');
    }
  };

  formSubmitHandler = searchQuery => {
    if (searchQuery === this.state.searchQuery) {
      toast.info('Images on your request is already shown.');
      return;
    }
    this.setState({
      searchQuery: searchQuery,
      page: 1,
      images: [],
      totalImages: 0,
    });
  };

  onLoadMore = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  render() {
    const { images, status, page, totalImages } = this.state;
    return (
      <section className={css.App}>
        <Searchbar onSubmit={this.formSubmitHandler} />
        {status === 'pending' && <Loader />}
        {(status === 'resolved' || (status === 'pending' && page !== 1)) && (
          <ImageGallery images={images} />
        )}
        {((totalImages !== images.length && status === 'resolved') ||
          (status === 'pending' && page > 1)) && (
          <Button onClick={this.onLoadMore} />
        )}
        <ToastContainer autoClose={3000} />
      </section>
    );
  }
}
