import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

// graphql
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

// libs
import formatMoney from '../lib/formatMoney';

// custom components
import ErrorMessage from './ErrorMessage';

// custom styles
import Form from './styles/Form';

// GraphQL queries
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  static propTypes = {
    id: PropTypes.string,
  };

  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val,
    });
  };

  updateItem = async (event, updateItemMutation) => {
    const { id } = this.props;
    event.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id,
        ...this.state,
      },
    });
    console.log('Updated!');
  };

  render() {
    const { title, description, image, largeImage, price } = this.state;
    const { id } = this.props;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (!data.item) return <p>No Item Found for ID {id}</p>;
          // if (error) return <div>Error {error.message}</div>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={{ title, description, image, largeImage, price }}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={event => this.updateItem(event, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                  </fieldset>
                  <button type="submit">
                    Updat
                    {loading ? 'ing' : 'e'}
                  </button>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { SINGLE_ITEM_QUERY, UPDATE_ITEM_MUTATION };
