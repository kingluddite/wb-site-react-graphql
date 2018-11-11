import React, { Component } from 'react';
// GraphQL
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// styles
import Form from './styles/Form';

// custom components
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const initialState = {
  email: '',
  success: '',
};

class RequestReset extends Component {
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

  handleSubmit = async (event, requestReset) => {
    event.preventDefault();
    const res = await requestReset();
    this.clearForm();
  };

  render() {
    const { email } = this.state;

    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email }}>
        {(requestReset, { data, loading, error, called }) => {
          if (loading) return <div>Loading...</div>;
          // console.log(data);

          return (
            <Form method="post" onSubmit={event => this.handleSubmit(event, requestReset)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request Password Reset</h2>
                <Error error={error} />
                {!loading && !error && called && <p>Success! Check your email for a reset link</p>}
                <label htmlFor="email">
                  email
                  <input type="email" name="email" placeholder="email" value={email} onChange={this.saveToState} />
                </label>
                <button type="submit">Reset Password</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
