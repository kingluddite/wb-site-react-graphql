import React, { Component } from 'react';

// custom components
// import PleaseSignIn from '../components/PleaseSignIn';
import CreateItem from '../components/CreateItem';

class Sell extends Component {
  render() {
    return (
      <div>
        {/* <PleaseSignIn> */}
        <CreateItem />
        {/* </PleaseSignIn> */}
      </div>
    );
  }
}

export default Sell;
