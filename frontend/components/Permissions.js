import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// custom components
import Error from './ErrorMessage';

// GraphQL queries
const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

class Permissions extends Component {
  render() {
    return (
      <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
          <div>
            <Error error={error} />
          </div>
        )}
      </Query>
    );
  }
}

export default Permissions;
