import styled from 'styled-components';

// custom components
import Signup from '../components/Signup';
import Signin from '../components/Signin';

// styles
const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = props => (
  <Columns>
    <Signup />
    <Signin />
  </Columns>
);

export default SignupPage;
