import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

// GraphQL
const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    currentUser {
      id
      email
      name
      permissions
    }
  }
`;

const User = props => <Query query={CURRENT_USER_QUERY}>{({ data }) => <p>data.user.name</p>}</Query>;

export default User;
export { CURRENT_USER_QUERY };
