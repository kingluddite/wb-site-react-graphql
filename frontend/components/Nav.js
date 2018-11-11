import React, { Component, Fragment } from 'react';
import Link from 'next/link';

// styles
import NavStyles from './styles/NavStyles';

// custom components
import User from './User';

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
