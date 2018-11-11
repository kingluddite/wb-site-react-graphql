import React, { Component } from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// GraphQL queries
import { CURRENT_USER_QUERY } from './User';

// styles
import Form from './styles/Form';

// custom components
import Error from './ErrorMessage';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

const initialState = {
  password: '',
  confirmPassword: '',
};

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

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

  handleSubmit = async (event, resetPassword) => {
    event.preventDefault();
    const res = await resetPassword();
    this.clearForm();
  };

  render() {
    const { resetToken } = this.props;
    const { password, confirmPassword } = this.state;

    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ resetToken, password, confirmPassword }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { data, loading, error, called }) => {
          if (loading) return <div>Loading...</div>;
          // console.log(data);

          return (
            <Form method="post" onSubmit={event => this.handleSubmit(event, resetPassword)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  New Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  Confirm New Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={this.saveToState}
                  />
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

export default ResetPassword;
