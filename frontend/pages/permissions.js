import React, { Component } from 'react';

// custom components
import PleaseSignIn from '../components/PleaseSignIn';
import Permissions from '../components/Permissions';

class PermissionsPage extends Component {
  render() {
    return (
      <div>
        <PleaseSignIn>
          <Permissions />
        </PleaseSignIn>
      </div>
    );
  }
}

export default PermissionsPage;
