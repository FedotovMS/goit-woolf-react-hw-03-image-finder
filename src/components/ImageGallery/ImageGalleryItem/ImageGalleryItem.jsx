import { Component } from 'react';

import css from './ImageGalleryItem.module.css';
import Modal from '../../Modal/Modal';

class ImageGalleryItem extends Component {
  state = {
    showModal: false,
    largeImageURL: this.props.largeImageURL,
  };

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  render() {
    const { showModal, largeImageURL } = this.state;
    return (
      <>
        <li className={css.imageGalleryItem}>
          <img
            className={css.ImageGalleryItemImage}
            src={this.props.webformatURL}
            alt={this.props.tags}
            onClick={this.toggleModal}
          />
        </li>
        {showModal && (
          <Modal
            onClose={this.toggleModal}
            largeImageURL={largeImageURL}
            alt={this.props.tags}
          />
        )}
      </>
    );
  }
}

export default ImageGalleryItem;
