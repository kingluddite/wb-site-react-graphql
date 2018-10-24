import React, { Component } from 'react';
import PropTypes from 'prop-types';

// custom components
import UpdateItem from '../components/UpdateItem';

class Sell extends Component {
  static propTypes = {
    query: PropTypes.object,
  };

  render() {
    const { query } = this.props;
    return (
      <div>
        <UpdateItem id={query.id} />
      </div>
    );
  }
}

export default Sell;
