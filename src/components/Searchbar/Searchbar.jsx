import { Component } from 'react';
import { toast } from 'react-toastify';
import styles from './Searchbar.module.css';

export default class Searchbar extends Component {
  state = {
    searchQuery: '',
  };

  handleInputChange = ({ target: { value } }) => {
    this.setState({ searchQuery: value.toLowerCase() });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!e || this.state.searchQuery === '') {
      toast.warn('Please, enter your search query');
      return;
    }

    this.props.onSubmit(this.state.searchQuery);
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <header className={styles.searchbar}>
        <form className={styles.searchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={styles.searchFormButton}>
            <span className={styles.searchFormButtonLabel}>Search</span>
          </button>

          <input
            className={styles.searchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={searchQuery}
            onChange={this.handleInputChange}
          />
        </form>
      </header>
    );
  }
}
