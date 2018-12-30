import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// custom styles
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';

// custom components
import User from './User';
import CartItem from './CartItem';

// lib
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

// GraphQL client side
const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

const Cart = () => (
  <User>
    {({ data: { currentUser } }) => {
      if (!currentUser) return null;
      console.log(currentUser);
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data }) => (
                <CartStyles open={data.cartOpen}>
                  <header>
                    <Supreme>
                      {currentUser.name}
                      's Cart
                    </Supreme>
                    <p>
                      You have {currentUser.cart.length} Item
                      {currentUser.cart.length === 1 ? '' : 's'}
                    </p>
                    <ul>
                      {currentUser.cart.map(cartItem => (
                        <CartItem key={cartItem.id} cartItem={cartItem} />
                      ))}
                    </ul>
                    <CloseButton onClick={toggleCart} title="close">
                      &times;
                    </CloseButton>
                  </header>

                  <footer>
                    <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      );
    }}
  </User>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
