import React, { Component } from 'react';

// GraphQL
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// custom styles
import Form from './styles/Form';

// custom components
import Error from './ErrorMessage';

// GraphQL mutations
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const initialState = {
  name: '',
  password: '',
  email: '',
};

class Signup extends Component {
  state = {
    ...initialState,
  };

  clearState = () => {
    this.setState({
      ...initialState,
    });
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (event, signup) => {
    event.preventDefault();
    const res = await signup();
    this.clearState();
  };

  render() {
    const { email, name, password } = this.state;
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={{ email, name, password }}>
        {(signup, { data, error, loading }) => {
          if (loading) return <div>Loading...</div>;
          console.log(data);

          return (
            <Form method="post" onSubmit={event => this.handleSubmit(event, signup)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for An Account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input type="email" name="email" placeholder="email" value={email} onChange={this.saveToState} />
                </label>
                <label htmlFor="name">
                  Name
                  <input type="text" name="name" placeholder="name" value={name} onChange={this.saveToState} />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Sign Up!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
