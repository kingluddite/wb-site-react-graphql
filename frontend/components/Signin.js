import React, { Component } from 'react';
// GraphQL
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// GraphQL queries
import { CURRENT_USER_QUERY } from './User';

// styles
import Form from './styles/Form';

// custom components
import Error from './ErrorMessage';

const SIGNIN_USER_MUTATION = gql`
  mutation SIGNIN_USER_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const initialState = {
  email: '',
  password: '',
};

class Signin extends Component {
  state = {
    ...initialState,
  };

  clearForm = () => {
    this.setState({
      ...initialState,
    });
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event, signin) => {
    event.preventDefault();
    const res = await signin();
    this.clearForm();
  };

  render() {
    const { email, password } = this.state;

    return (
      <Mutation
        mutation={SIGNIN_USER_MUTATION}
        variables={{ email, password }}
        refetchQueries={[
          {
            query: CURRENT_USER_QUERY,
          },
        ]}
      >
        {(signin, { data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          // if (error) return <div>Error {error.message}</div>;
          // console.log(data);

          return (
            <Form method="post" onSubmit={event => this.handleSubmit(event, signin)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input type="email" name="email" placeholder="email" value={email} onChange={this.saveToState} />
                </label>
                <label htmlFor="password">
                  password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign In</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
