import React, { Component } from 'react';
import Link from 'next/link';

// styles
import NavStyles from './styles/NavStyles';

// custom components
import User from './User';

class Nav extends Component {
  render() {
    return (
      <NavStyles>
        <User>
          {({ data: { currentUser } }) => {
            console.log(currentUser);
            if (currentUser) return <p>{currentUser.name}</p>;
            return null;
          }}
        </User>
        <Link href="/items">
          <a>Shop</a>
        </Link>
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
      </NavStyles>
    );
  }
}

export default Nav;
