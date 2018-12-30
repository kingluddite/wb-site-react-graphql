import React, { Component, Fragment } from 'react';
import Link from 'next/link';

// GraphQL
import { Mutation } from 'react-apollo';
// local GraphQL
import { TOGGLE_CART_MUTATION } from './Cart';

// styles
import NavStyles from './styles/NavStyles';

// custom components
import User from './User';
import Signout from './Signout';

class Nav extends Component {
  render() {
    return (
      <User>
        {({ data: { currentUser } }) => (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>
            {currentUser && (
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                <Link href="/signup">
                  <a>Signup</a>
                </Link>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
                <Link href="/me">
                  <a>Account</a>
                </Link>
                <Signout />
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                  {toggleCart => (
                    <button type="button" onClick={toggleCart}>
                      Cart
                    </button>
                  )}
                </Mutation>
              </>
            )}
            {!currentUser && (
              <Link href="/signup">
                <a>Sign In</a>
              </Link>
            )}
          </NavStyles>
        )}
      </User>
    );
  }
}

export default Nav;
