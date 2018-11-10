import { Query } from 'react-apollo';

// GraphQL
import { CURRENT_USER_QUERY } from './User';

// custom components
// import Signin from './Signin';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error {error.message}</p>;
      console.log(data);
    }}
  </Query>
);

export default PleaseSignIn;
