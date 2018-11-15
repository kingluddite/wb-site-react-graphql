import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// custom styles
import Table from './styles/Table';
import SickButton from './styles/SickButton';

// custom components
import Error from './ErrorMessage';

// array of all permissions
const possiblePermissions = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE'];

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
            <div>
              <h2>Manage Permissions</h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map(permission => (
                      <th>{permission}</th>
                    ))}
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <User user={user} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Query>
    );
  }
}

class User extends Component {
  render() {
    const { user } = this.props;

    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>UPDATE</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
