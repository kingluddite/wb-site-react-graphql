import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

// GraphQL
import { CURRENT_USER_QUERY } from './User';

// custom components
import Signin from './Signin';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error {error.message}</p>;
      if (!data.currentUser) {
        return (
          <div>
            <p>Please Sign In before Continuing</p>
            <Signin />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

PleaseSignIn.defaultProps = {
  children: {},
};

PleaseSignIn.propTypes = {
  children: PropTypes.object,
};

export default PleaseSignIn;
