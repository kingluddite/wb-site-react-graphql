import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Mutation, Query } from 'react-apollo';
import PropTypes from 'prop-types';

// GraphQL
import { CURRENT_USER_QUERY } from './User';

// styles
const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // This gets called as soon as we get a response back from the server after a mutation has been performed
  update = (cache, payload) => {
    console.log('Running remove from cart update fn');
    // 1. first read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // console.log(payload);
    // 2. remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.currentUser.cart = data.currentUser.cart.filter(cartItem => cartItem.id !== cartItemId);
    // const cartItemId = payload.data.currentUser.cart.idgcc
    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id,
          },
        }}
      >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            type="button"
            disabled={loading}
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
