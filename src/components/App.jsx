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
    notification: { type: '', message: '' },
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
        this.setState({
          notification: {
            type: 'error',
            message: 'Nothing found. Please, change your request.',
          },
        });
      }
      if (images.length !== 0 && page === 1) {
        this.setState({
          notification: {
            type: 'success',
            message: `We have found ${totalImages} images on your request.`,
          },
        });
      }

      if (
        totalImages > 0 &&
        page !== 1 &&
        totalImages <= this.state.images.length + 12
      ) {
        this.setState({
          notification: {
            type: 'info',
            message: 'There are no more images.',
          },
        });
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...images],
        status: 'resolved',
        totalImages,
      }));
    } catch (error) {
      console.log(error.message);
      this.setState({
        notification: {
          type: 'error',
          message: 'There are some problems! Try again later.',
        },
        status: 'rejected',
      });
    }
  };
  handleNotification = () => {
    const notificationType = this.state.notification.type;
    const notificationMessage = this.state.notification.message;

    if (notificationType === 'info') {
      toast.info(notificationMessage);
      this.setState({
        notification: { type: '', message: '' },
      });
    }
    if (notificationType === 'error') {
      toast.error(notificationMessage);
      this.setState({
        notification: { type: '', message: '' },
      });
    }
    if (notificationType === 'success') {
      toast.success(notificationMessage);
      this.setState({
        notification: { type: '', message: '' },
      });
    }
  };

  formSubmitHandler = searchQuery => {
    if (searchQuery === this.state.searchQuery) {
      this.setState({
        notification: {
          type: 'info',
          message: 'Images on your request is already shown.',
        },
      });
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
