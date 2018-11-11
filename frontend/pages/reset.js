import React, { Component } from 'react';
import PropTypes from 'prop-types';

// custom components
import ResetPassword from '../components/ResetPassword';

class ResetPage extends Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
  };

  render() {
    const { query } = this.props;

    return (
      <div>
        <ResetPassword resetToken={query.resetToken} />
      </div>
    );
  }
}

export default ResetPage;
